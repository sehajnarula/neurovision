
import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Keyboard, Pressable, View, PermissionsAndroid, Alert, TouchableOpacity, ActivityIndicator, FlatList, ScrollView } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useTheme } from 'react-native-paper';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { getAuth } from '@react-native-firebase/auth';
import KeyboardAwareScrollView from 'react-native-keyboard-controller';

import BaseText from 'components/base_components/base_text';
import BaseTextInput from 'components/base_components/base_text_input';
import FullScreenContainer from 'components/hoc/full_screen_container';
import AnimatedLoaderButton from 'components/molecules/animated_loader_button';
import useTumorPrediction from '../../../hooks/analyzeMri';
import { useUploadOnCloudinary } from '../../../hooks/imageUploadHook';
import { AppStackParamList } from 'types/navigation_types';
import { ms, vs } from 'utilities/scale_utils';
import { useUpdateUser } from '../../../hooks/firebaseUserUpdate';
import {
    pick,
    types,
    isErrorWithCode,
    errorCodes,
} from '@react-native-documents/picker';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp,
} from '@react-native-firebase/firestore';

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

interface Patient {
    uid: string;
    name: string;
    email?: string;
    phoneNumber?: string;
}

const CreateReportScreen: React.FC<CreateReportScreenProps> = props => {
    const theme = useTheme();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [fetchingPatients, setFetchingPatients] = useState(false);
    const [savingReport, setSavingReport] = useState(false);

    const [selectedFiles, setSelectedFiles] =
        useState<MRIUploadFiles | null>(null);

    const {
        fetchUserDetails,
        updateUserDetails,
        loading,
        error,
    } = useUpdateUser();

    const {
        uploadImage,
        loading: uploadingImage,
    } = useUploadOnCloudinary();

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

    const fetchPatients = async () => {
        try {
            setFetchingPatients(true);

            const db = getFirestore();

            const patientsQuery = query(
                collection(db, 'users'),
                where('userType', '==', 'patient')
            );

            const snapshot = await getDocs(patientsQuery);

            const patientList: Patient[] = snapshot.docs.map(doc => ({
                uid: doc.id,
                name: doc.data().name ?? 'Unknown Patient',
                email: doc.data().email ?? '',
                phoneNumber: doc.data().phoneNumber ?? '',
            }));
            console.log("patientList", patientList);
            setPatients(patientList);

        } catch (error) {
            console.log('Error fetching patients:', error);
        } finally {
            setFetchingPatients(false);
        }
    };

    const handleApproveReport = async () => {
        const doctorId = getAuth().currentUser?.uid;
        if (!selectedPatientId) {
            Alert.alert('Select Patient', 'Please select a patient.');
            return;
        }

        if (!doctorId) {
            Alert.alert('Authentication Error', 'Doctor ID not found.');
            return;
        }

        if (!predictionData) {
            Alert.alert('Error', 'Please analyze the MRI first.');
            return;
        }

        try {
            setSavingReport(true);

            // Step 1: Upload axial preview to Cloudinary

            const axialImage = predictionData.previews.axial.image;

            const cloudinaryResponse = await uploadImage(axialImage);

            if (!cloudinaryResponse?.secure_url) {
                throw new Error('Unable to upload image to Cloudinary.');
            }

            const imageUrl = cloudinaryResponse.secure_url;

            console.log('Cloudinary Image URL:', imageUrl);

            // Step 2: Prepare Firestore report

            const reportData = {
                patientId: selectedPatientId,
                doctorId: doctorId,

                tumorDetected: predictionData.tumor_detected,

                wholeTumorMl: predictionData.whole_tumor_ml,
                tumorCoreMl: predictionData.tumor_core_ml,

                volumeMl: {
                    necroticCore:
                        predictionData.volume_ml.necrotic_core,

                    edema:
                        predictionData.volume_ml.edema,

                    enhancingTumor:
                        predictionData.volume_ml.enhancing_tumor,
                },

                voxels: {
                    necroticCore:
                        predictionData.voxels.necrotic_core,

                    edema:
                        predictionData.voxels.edema,

                    enhancingTumor:
                        predictionData.voxels.enhancing_tumor,
                },

                voxelVolumeMm3: predictionData.voxel_volume_mm3,

                // Cloudinary URL
                image: imageUrl,

                previewSlices: {
                    axial: predictionData.previews.axial.slice_index,
                    coronal: predictionData.previews.coronal.slice_index,
                    sagittal: predictionData.previews.sagittal.slice_index,
                },

                createdAt: serverTimestamp(),
            };

            const db = getFirestore();

            const reportRef = await addDoc(
                collection(db, 'reports'),
                reportData
            );

            console.log('Report ID:', reportRef.id);

            Alert.alert(
                'Report Approved',
                'Report has been successfully saved.',
                [
                    {
                        text: 'OK',
                        onPress: () => props.navigation.goBack(),
                    },
                ]
            );

        } catch (error) {
            console.log('Report Saving Error:', error);

            Alert.alert(
                'Error',
                error instanceof Error
                    ? error.message
                    : 'Unable to save report.'
            );

        } finally {
            setSavingReport(false);
        }
    };

    const handleSelectPatient = (patient: Patient) => {
        setSelectedPatientId(patient.uid);

        console.log('Selected Patient:', patient.name);
        console.log('Patient ID:', patient.uid);
    };

    useEffect(() => {
        fetchPatients();
    }, []);

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

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <ScrollView
                style={{
                    flex: 1,
                }}
                contentContainerStyle={{
                    flexGrow: 1,
                    padding: ms(16),
                    paddingBottom: vs(20),
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>

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

                        {predictionData && (
                            <View style={{ marginTop: vs(20) }}>

                                <BaseText
                                    style={{
                                        fontSize: ms(18),
                                        fontWeight: 'bold',
                                        marginBottom: vs(10),
                                    }}
                                >
                                    Select Patient
                                </BaseText>

                                {fetchingPatients ? (
                                    <ActivityIndicator color={theme.colors.primary} />
                                ) : (
                                    <FlatList
                                        data={patients}
                                        keyExtractor={item => item.uid}
                                        scrollEnabled={false}
                                        renderItem={({ item }) => {
                                            const isSelected =
                                                selectedPatientId === item.uid;

                                            return (
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    onPress={() => handleSelectPatient(item)}
                                                    style={{
                                                        padding: ms(12),
                                                        marginBottom: vs(8),
                                                        borderWidth: 1,
                                                        borderRadius: 8,
                                                        borderColor: isSelected
                                                            ? theme.colors.primary
                                                            : theme.colors.borderColor.regular,
                                                        backgroundColor: isSelected
                                                            ? theme.colors.surfaceVariant
                                                            : theme.colors.background,
                                                    }}
                                                >
                                                    <BaseText style={{ fontWeight: 'bold' }}>
                                                        {item.name}
                                                    </BaseText>
                                                </TouchableOpacity>
                                            );
                                        }}
                                        ListEmptyComponent={
                                            <BaseText>No patients found.</BaseText>
                                        }
                                    />
                                )}

                            </View>
                        )}

                        {/* {!predictionData && (
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
                        )} */}

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

            </ScrollView>

            {/* Fixed Bottom Action Button */}
            {selectedFiles && (
                <View
                    style={{
                        flexShrink: 0,
                        paddingHorizontal: ms(16),
                        paddingTop: vs(12),
                        paddingBottom: vs(50),
                        backgroundColor: theme.colors.background,
                        borderTopWidth: 1,
                        borderTopColor: theme.colors.borderColor.regular,
                        elevation: 10,
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={
                            predictionData
                                ? handleApproveReport
                                : handleAnalyze
                        }
                        disabled={
                            analyzing ||
                            savingReport ||
                            (!!predictionData && !selectedPatientId)
                        }
                        style={{
                            backgroundColor: theme.colors.primary,
                            borderRadius: 6,
                            paddingVertical: vs(12),
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: analyzing || savingReport ? 0.7 : 1,
                        }}
                    >
                        {analyzing || savingReport ? (
                            <ActivityIndicator
                                color={theme.colors.textColor.white}
                            />
                        ) : (
                            <BaseText
                                style={{
                                    color: theme.colors.textColor.white,
                                    fontWeight: 'bold',
                                }}
                            >
                                {predictionData
                                    ? 'Approve Report'
                                    : 'Analyze'}
                            </BaseText>
                        )}
                    </TouchableOpacity>
                </View>
            )}

        </KeyboardAvoidingView>
    );
};

export default CreateReportScreen;
