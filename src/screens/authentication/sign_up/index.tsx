import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BaseText from 'components/base_components/base_text';
import BaseTextInput from 'components/base_components/base_text_input';
import FullScreenContainer from 'components/hoc/full_screen_container';
import AnimatedLoaderButton from 'components/molecules/animated_loader_button';
import BounceView from 'components/molecules/bounce_view';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Keyboard, Pressable } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { TextInput, useTheme } from 'react-native-paper';
import { AuthenticationStackParamList } from 'types/navigation_types';
import { ms, vs } from 'utilities/scale_utils';
import { useSignUp } from '../../../hooks/firebaseSignUp';

type SignUpScreenProps = NativeStackScreenProps<
  AuthenticationStackParamList,
  'SignUpScreen'
>;

type TFormData = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  confirmPassword: string;
};

const SignUpScreen: React.FC<SignUpScreenProps> = props => {
  const theme = useTheme();

  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    React.useState<boolean>(false);

  const { signUp, loading, error } = useSignUp();

  const { control, handleSubmit, getValues } = useForm<TFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const submitClickHandler: SubmitHandler<TFormData> = async values => {
    try {
      await signUp(
        values.name.trim(),
        values.email.trim(),
        values.password,
        values.phoneNumber.trim()
      );

      props.navigation.popTo('LoginScreen');
    } catch (err) {
      console.log('Signup failed:', err);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
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
          <Controller
            control={control}
            name="name"
            rules={{
              required: 'Name cannot be empty!',
              validate: value =>
                value.trim().length > 0 || 'Name cannot be empty!',
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

          <Controller
            control={control}
            name="phoneNumber"
            rules={{
              required: 'Phone number cannot be empty!',
              validate: value =>
                /^\d{10}$/.test(value.trim()) || 'Phone number must be exactly 10 digits!',
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
                maxLength={10}
                errorValue={error?.message ?? ''}
              />
            )}
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

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password cannot be empty!',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters!',
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
                outlineColor={theme.colors.borderColor.regular}
                labelValue="Password"
                placeholder="Enter Password..."
                secureTextEntry={!showPassword}
                errorValue={error?.message ?? ''}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() =>
                      setShowPassword(previous => !previous)
                    }
                  />
                }
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: 'Confirm password cannot be empty!',
              validate: value =>
                value === getValues('password') ||
                'Passwords do not match!',
            }}
            render={({
              field: { onBlur, value, onChange },
              fieldState: { error },
            }) => (
              <BaseTextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                outlineColor={theme.colors.borderColor.regular}
                labelValue="Confirm Password"
                placeholder="Enter Confirm Password..."
                autoComplete='off'
                secureTextEntry={!showConfirmPassword}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() =>
                      setShowConfirmPassword(previous => !previous)
                    }
                  />
                }
                errorValue={error?.message ?? ''}
              />
            )}
          />

          {error ? (
            <BaseText style={{ color: theme.colors.error }}>
              {error}
            </BaseText>
          ) : null}

          <BounceView>
            <BaseText
              variant="labelMedium"
              style={{ color: theme.colors.textColor.primary }}
            >
              Forgot Password?
            </BaseText>
          </BounceView>

          <AnimatedLoaderButton
            isLoading={loading}
            title="Sign Up"
            onPress={handleSubmit(submitClickHandler)}
          />

          <BounceView
            style={{
              flexDirection: 'row',
              gap: ms(5),
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => props.navigation.popTo('LoginScreen')}
          >
            <BaseText>Already have an account?</BaseText>
            <BaseText
              variant="labelMedium"
              style={{ color: theme.colors.textColor.primary }}
            >
              Login
            </BaseText>
          </BounceView>
        </FullScreenContainer>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;