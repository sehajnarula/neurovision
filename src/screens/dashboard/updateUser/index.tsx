
import React, { useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Keyboard, Pressable } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useTheme } from 'react-native-paper';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { getAuth } from '@react-native-firebase/auth';

import BaseText from 'components/base_components/base_text';
import BaseTextInput from 'components/base_components/base_text_input';
import FullScreenContainer from 'components/hoc/full_screen_container';
import AnimatedLoaderButton from 'components/molecules/animated_loader_button';

import { AppStackParamList } from 'types/navigation_types';
import { ms, vs } from 'utilities/scale_utils';
import { useUpdateUser } from '../../../hooks/firebaseUserUpdate';

type UpdateUserScreenProps = NativeStackScreenProps<
    AppStackParamList,
    'UpdateUserScreen'
>;

type TFormData = {
    name: string;
    phoneNumber: string;
};

const UpdateUserScreen: React.FC<UpdateUserScreenProps> = props => {
    const theme = useTheme();

    // Get logged-in user's Firebase UID
    const uid = getAuth().currentUser?.uid;

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
            <Pressable
                style={{ flex: 1, width: '100%' }}
                onPress={Keyboard.dismiss}>
                <FullScreenContainer
                    headerColor={theme.colors.background}
                    style={{
                        flex: 1,
                        backgroundColor: theme.colors.background,
                        paddingHorizontal: ms(16),
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: vs(20),
                    }}>

                    {/* Name */}
                    <Controller
                        control={control}
                        name="name"
                        rules={{
                            required: 'Name cannot be empty!',
                            validate: value =>
                                value.trim().length > 0 ||
                                'Name cannot be empty!',
                        }}
                        render={({
                            field: { onBlur, value, onChange },
                            fieldState: { error },
                        }) => (
                            <BaseTextInput
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                labelValue="Name"
                                placeholder="Enter Name..."
                                errorValue={error?.message ?? ''}
                            />
                        )}
                    />

                    {/* Phone Number */}
                    <Controller
                        control={control}
                        name="phoneNumber"
                        rules={{
                            required: 'Phone number cannot be empty!',
                            validate: value =>
                                /^\d{10}$/.test(value.trim()) ||
                                'Phone number must be exactly 10 digits!',
                        }}
                        render={({
                            field: { onBlur, value, onChange },
                            fieldState: { error },
                        }) => (
                            <BaseTextInput
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                labelValue="Phone Number"
                                placeholder="Enter Phone Number..."
                                keyboardType="phone-pad"
                                maxLength={10}
                                errorValue={error?.message ?? ''}
                            />
                        )}
                    />

                    {/* Error message */}
                    {error ? (
                        <BaseText style={{ color: theme.colors.error }}>
                            {error}
                        </BaseText>
                    ) : null}

                    {/* Update Button */}
                    <AnimatedLoaderButton
                        isLoading={loading}
                        title="Update"
                        onPress={handleSubmit(submitClickHandler)}
                    />

                </FullScreenContainer>
            </Pressable>
        </KeyboardAvoidingView>
    );
};

export default UpdateUserScreen;
