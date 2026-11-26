
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BaseText from 'components/base_components/base_text';
import BaseTextInput from 'components/base_components/base_text_input';
import FullScreenContainer from 'components/hoc/full_screen_container';
import AnimatedLoaderButton from 'components/molecules/animated_loader_button';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
    Alert,
    Keyboard,
    Pressable,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useTheme } from 'react-native-paper';
import { AuthenticationStackParamList } from 'types/navigation_types';
import { ms, vs } from 'utilities/scale_utils';
import { useForgotPassword } from '../../../hooks/useForgotPassword';

type ForgotPasswordScreen = NativeStackScreenProps<
    AuthenticationStackParamList,
    'ForgotPasswordScreen'
>;

type TFormData = {
    email: string;
};

const ForgotPasswordScreen: React.FC<ForgotPasswordScreen> = props => {
    const theme = useTheme();

    const {
        sendResetEmail,
        loading,
    } = useForgotPassword();

    const {
        control,
        handleSubmit,
    } = useForm<TFormData>({
        defaultValues: {
            email: '',
        },
        mode: 'onChange',
    });

    const submitClickHandler: SubmitHandler<TFormData> = async values => {
        try {
            await sendResetEmail(values.email);

            Alert.alert(
                'Email Sent',
                'If an account exists with this email address, you will receive a password reset link. Please check your inbox and spam folder.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            props.navigation.popTo('LoginScreen');
                        },
                    },
                ],
            );

        } catch (err) {
            Alert.alert(
                'Password Reset',
                err instanceof Error
                    ? err.message
                    : 'Unable to send password reset email.',
            );
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
        >
            <Pressable
                style={{ flex: 1, width: '100%' }}
                onPress={Keyboard.dismiss}
            >
                <FullScreenContainer
                    headerColor={theme.colors.background}
                    style={{
                        flex: 1,
                        backgroundColor: theme.colors.background,
                        paddingHorizontal: ms(16),
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: vs(20),
                    }}
                >
                    <BaseText
                        style={[
                            theme.fonts.displayLarge,
                            {
                                marginHorizontal: ms(20),
                                textAlign: 'center',
                            },
                        ]}
                        children="Forgot Password?"
                    />

                    <BaseText
                        style={{
                            textAlign: 'center',
                            marginHorizontal: ms(15),
                        }}
                        children="Enter your registered email address. A link will be sent to reset your password."
                    />

                    <Controller
                        control={control}
                        name="email"
                        rules={{
                            required: 'Email cannot be empty!',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Enter a valid email address!',
                            },
                        }}
                        render={({
                            field: { onBlur, value, onChange },
                            fieldState: { error },
                        }) => (
                            <BaseTextInput
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                labelValue="Email"
                                placeholder="Enter Email..."
                                errorValue={error?.message ?? ''}
                            />
                        )}
                    />

                    <AnimatedLoaderButton
                        isLoading={loading}
                        title="Verify"
                        onPress={handleSubmit(submitClickHandler)}
                    />

                </FullScreenContainer>
            </Pressable>
        </KeyboardAvoidingView>
    );
};

export default ForgotPasswordScreen;
