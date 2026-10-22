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
import { useDispatch } from 'react-redux';
import { AuthenticationStackParamList } from 'types/navigation_types';
import { ms, vs } from 'utilities/scale_utils';
import { loginUser } from 'utilities/utils';
import { useSignIn } from '../../../hooks/firebaseSignIn';

type LoginScreenProps = NativeStackScreenProps<
  AuthenticationStackParamList,
  'LoginScreen'
>;

type TFormData = {
  email: string;
  password: string;
};

const LoginScreen: React.FC<LoginScreenProps> = props => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const dispatch = useDispatch();
  const { signIn, loading, error } = useSignIn();

  const { control, handleSubmit } = useForm<TFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const submitClickHandler: SubmitHandler<TFormData> = async values => {
    try {
      const userData = await signIn(
        values.email.trim(),
        values.password,
      );

      const loginResponse = {
        success: true,
        message: 'Login successful!',
        responseData: {
          userName: userData.name || userData.email,
          token: userData.id,
          refreshToken: '',
        },
      };

      loginUser(dispatch, loginResponse);
    } catch (err) {
      console.log('Login failed:', err);
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
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() =>
                      setShowPassword(previous => !previous)
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
            title="Login"
            onPress={handleSubmit(submitClickHandler)}
          />

          <BounceView
            style={{
              flexDirection: 'row',
              gap: ms(5),
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() =>
              props.navigation.navigate('SignUpScreen')
            }
          >
            <BaseText>Don't have an account?</BaseText>
            <BaseText
              variant="labelMedium"
              style={{ color: theme.colors.textColor.primary }}
            >
              Sign up
            </BaseText>
          </BounceView>
        </FullScreenContainer>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;