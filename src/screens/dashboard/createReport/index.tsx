
import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Keyboard, Pressable, View, PermissionsAndroid, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useTheme } from 'react-native-paper';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { getAuth } from '@react-native-firebase/auth';

import BaseText from 'components/base_components/base_text';
import BaseTextInput from 'components/base_components/base_text_input';
import FullScreenContainer from 'components/hoc/full_screen_container';
import AnimatedLoaderButton from 'components/molecules/animated_loader_button';
import useTumorPrediction from '../../../hooks/analyzeMri';

import { AppStackParamList } from 'types/navigation_types';
import { ms, vs } from 'utilities/scale_utils';
import { useUpdateUser } from '../../../hooks/firebaseUserUpdate';
import {
    pick,
    types,
    isErrorWithCode,
    errorCodes,
} from '@react-native-documents/picker';

import { Image } from 'react-native';


type CreateReportScreenProps = NativeStackScreenProps<
    AppStackParamList,
    'CreateReportScreen'
>;

type TFormData = {
    name: string;
    phoneNumber: string;
};

type MRIField = 'flair' | 't1' | 't1ce' | 't2';

interface MRIFile {
    uri: string;
    name: string;
    type?: string;
}

interface MRIUploadFiles {
    flair: MRIFile;
    t1: MRIFile;
    t1ce: MRIFile;
    t2: MRIFile;
}

const CreateReportScreen: React.FC<CreateReportScreenProps> = props => {
    const theme = useTheme();

    // Get logged-in user's Firebase UID
    const uid = getAuth().currentUser?.uid;
    const [selectedFiles, setSelectedFiles] =
        useState<MRIUploadFiles | null>(null);

    const {
        fetchUserDetails,
        updateUserDetails,
        loading,
        error,
    } = useUpdateUser();

    const {
        control,
        handleSubmit,
        reset,
    } = useForm<TFormData>({
        defaultValues: {
            name: '',
            phoneNumber: '',
        },
        mode: 'onChange',
    });

    const {
        predictTumor,
        loading: analyzing,
        data: predictionData,
        error: predictionError,
    } = useTumorPrediction();

    const handlePickFiles = async () => {
        try {
            const results = await pick({
                type: [types.allFiles],
                allowMultiSelection: true,
            });

            const files: Partial<Record<MRIField, MRIFile>> = {};

            results.forEach(file => {
                const fileName = (file.name ?? '').toLowerCase();

                let modality: MRIField | null = null;

                if (/_flair\.nii(\.gz)?$/.test(fileName)) {
                    modality = 'flair';
                } else if (/_t1ce\.nii(\.gz)?$/.test(fileName)) {
                    modality = 't1ce';
                } else if (/_t1\.nii(\.gz)?$/.test(fileName)) {
                    modality = 't1';
                } else if (/_t2\.nii(\.gz)?$/.test(fileName)) {
                    modality = 't2';
                }

                if (!modality) {
                    return;
                }

                if (files[modality]) {
                    throw new Error(
                        `Multiple ${modality.toUpperCase()} files selected.`,
                    );
                }

                files[modality] = {
                    uri: file.uri,
                    name: file.name ?? `${modality}.nii.gz`,
                    type: file.type ?? 'application/octet-stream',
                };
            });

            const requiredFields: MRIField[] = [
                'flair',
                't1',
                't1ce',
                't2',
            ];

            const missingFiles = requiredFields.filter(
                field => !files[field],
            );

            if (missingFiles.length > 0) {
                Alert.alert(
                    'Missing MRI Files',
                    `Please select all four MRI files.\n\nMissing: ${missingFiles
                        .map(field => field.toUpperCase())
                        .join(', ')}`,
                );
                return;
            }

            setSelectedFiles(files as MRIUploadFiles);

            Alert.alert(
                'Success',
                'All four MRI files have been selected successfully.',
            );

        } catch (error) {
            if (
                isErrorWithCode(error) &&
                error.code === errorCodes.OPERATION_CANCELED
            ) {
                return;
            }

            Alert.alert(
                'File Selection Error',
                error instanceof Error
                    ? error.message
                    : 'Unable to select files.',
            );
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFiles) {
            Alert.alert('Error', 'Please select all four MRI files.');
            return;
        }

        try {
            const response = await predictTumor(selectedFiles);

            console.log('AI Prediction Result:', response);

            Alert.alert(
                'Analysis Complete',
                'MRI analysis completed successfully.',
            );

        } catch (err) {
            console.log('Analysis failed:', err);

            Alert.alert(
                'Analysis Failed',
                predictionError ?? 'Unable to analyze MRI files.',
            );
        }
    };

    // Fetch existing user details when screen opens
    useEffect(() => {
        const loadUserDetails = async () => {
            if (!uid) {
                return;
            }

            try {
                const userData = await fetchUserDetails(uid);

                // Populate form fields
                reset({
                    name: userData.name ?? '',
                    phoneNumber: userData.phoneNumber ?? '',
                });
            } catch (err) {
                console.log('Unable to fetch user details:', err);
            }
        };

        loadUserDetails();
    }, [uid]);

    // Update user details
    const submitClickHandler: SubmitHandler<TFormData> = async values => {
        try {
            await updateUserDetails(
                values.name.trim(),
                values.phoneNumber.trim(),
            );

            console.log('User details updated successfully');

            // Navigate back after successful update
            props.navigation.goBack();
        } catch (err) {
            console.log('Unable to update user details:', err);
        }
    };
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <View
                style={{
                    flex: 1,
                    padding: ms(16),
                }}>

                {selectedFiles ? (
                    // Files selected: display them at the top
                    <View style={{ gap: vs(12), marginTop: 20 }}>
                        <BaseText style={{ color: theme.colors.primary }}>
                            Selected MRI Files
                        </BaseText>

                        <BaseText>{selectedFiles.flair.name}</BaseText>
                        <BaseText>{selectedFiles.t1.name}</BaseText>
                        <BaseText>{selectedFiles.t1ce.name}</BaseText>
                        <BaseText>{selectedFiles.t2.name}</BaseText>

                        {predictionData && (
                            <View style={{ marginTop: vs(10) }}>
                                <BaseText style={{ fontSize: ms(18), fontWeight: 'bold' }}>
                                    Analysis Results
                                </BaseText>

                                <BaseText>
                                    Whole Tumour Volume: {predictionData.whole_tumor_ml} mL
                                </BaseText>

                                <BaseText>
                                    Edema: {predictionData.volume_ml.edema} mL
                                </BaseText>

                                <BaseText>
                                    Enhancing Tumour: {predictionData.volume_ml.enhancing_tumor} mL
                                </BaseText>

                                <BaseText>
                                    Necrotic Core: {predictionData.volume_ml.necrotic_core} mL
                                </BaseText>

                                <BaseText>
                                    Tumour Detected: {predictionData.tumor_detected ? 'Yes' : 'No'}
                                </BaseText>

                                <BaseText style={{ fontWeight: 'bold', marginTop: vs(10) }}>
                                    MRI Segmentation Preview
                                </BaseText>

                                <Image
                                    source={{
                                        uri: predictionData.previews.axial.image,
                                    }}
                                    style={{
                                        width: '100%',
                                        height: vs(280),
                                    }}
                                    resizeMode="contain"
                                />
                            </View>
                        )}

                        {predictionData ? (
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={handleAnalyze}
                                disabled={analyzing}
                                style={{
                                    backgroundColor: theme.colors.primary,
                                    borderColor: theme.colors.borderColor.regular,
                                    borderRadius: 4,
                                    paddingVertical: vs(8),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: vs(16),
                                    opacity: analyzing ? 0.7 : 1,
                                }}
                            >
                                {analyzing ? (
                                    <ActivityIndicator color={theme.colors.textColor.white} />
                                ) : (
                                    <BaseText style={{ color: theme.colors.textColor.white }}>
                                        Approve Report
                                    </BaseText>
                                )}
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={handleAnalyze}
                                disabled={analyzing}
                                style={{
                                    backgroundColor: theme.colors.primary,
                                    borderColor: theme.colors.borderColor.regular,
                                    borderRadius: 4,
                                    paddingVertical: vs(8),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: vs(16),
                                    opacity: analyzing ? 0.7 : 1,
                                }}
                            >
                                {analyzing ? (
                                    <ActivityIndicator color={theme.colors.textColor.white} />
                                ) : (
                                    <BaseText style={{ color: theme.colors.textColor.white }}>
                                        Analyze
                                    </BaseText>
                                )}
                            </TouchableOpacity>
                        )}

                    </View>
                ) : (
                    // No files selected: display Add Files at bottom center
                    <View style={{ flex: 1, justifyContent: 'space-evenly', alignSelf: 'center', marginBottom: 16, marginRight: 16 }}>
                        <BaseText style={{ color: theme.colors.primary }}
                            onPress={() => {
                                handlePickFiles();
                            }}>
                            + Add Files
                        </BaseText>

                    </View>

                )}

            </View>
        </KeyboardAvoidingView>
    );
};

export default CreateReportScreen;
