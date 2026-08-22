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
import { TValidateLoginDetailResponse } from 'types/api_response_data_models';
import { AuthenticationStackParamList } from 'types/navigation_types';
import { ms, vs } from 'utilities/scale_utils';
import { loginUser } from 'utilities/utils';

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
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const { control, handleSubmit } = useForm<TFormData>({
    values: { email: '', password: '' },
    mode: 'onChange',
  });

  const dispatch = useDispatch();

  const submitClickHandler: SubmitHandler<TFormData> = React.useCallback(
    values => {
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
        const loginResponse: TValidateLoginDetailResponse = {
          success: false,
          message: 'Login Success!',
          responseData: {
            userName: values?.email ?? '',
            token: (values?.email ?? '') + (values?.password ?? ''),
            refreshToken: (values?.email ?? '') + (values?.password ?? ''),
          },
        };
        loginUser(dispatch, loginResponse);
      }, 2500);
    },
    [],
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={'padding'}>
      <Pressable style={{ flex: 1, width: '100%' }} onPress={Keyboard.dismiss}>
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
            name={'email'}
            rules={{ required: 'Email cannot be empty!' }}
            render={({
              field: { onBlur, value, onChange },
              fieldState: { error },
            }) => (
              <BaseTextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                labelValue={'Email'}
                placeholder={'Enter Email...'}
                errorValue={error?.message ?? ''}
              />
            )}
          />

          <Controller
            control={control}
            name={'password'}
            rules={{ required: 'Password cannot be empty!' }}
            render={({
              field: { onBlur, value, onChange },
              fieldState: { error },
            }) => (
              <BaseTextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                outlineColor={theme.colors.borderColor.regular}
                labelValue={'Password'}
                placeholder={'Enter Password...'}
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(prev => !prev)}
                  />
                }
                errorValue={error?.message ?? ''}
              />
            )}
          />
          <BounceView>
            <BaseText
              variant="labelMedium"
              style={{ color: theme.colors.textColor.primary }}
            >
              Forget Password?
            </BaseText>
          </BounceView>
          <AnimatedLoaderButton
            isLoading={isLoading}
            title={'Login'}
            onPress={handleSubmit(submitClickHandler)}
          />
          <BounceView
            style={{
              flexDirection: 'row',
              gap: ms(5),
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => props?.navigation?.navigate('SignUpScreen')}
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
