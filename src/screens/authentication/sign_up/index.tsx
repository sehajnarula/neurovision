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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthenticationStackParamList } from 'types/navigation_types';
import { ms, vs } from 'utilities/scale_utils';

type SignUpScreenProps = NativeStackScreenProps<
  AuthenticationStackParamList,
  'SignUpScreen'
>;

type TFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUpScreen: React.FC<SignUpScreenProps> = props => {
  const { bottom } = useSafeAreaInsets();
  const theme = useTheme();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const { control, handleSubmit } = useForm<TFormData>({
    values: { email: '', password: '', confirmPassword: '' },
    mode: 'onChange',
  });

  const submitClickHandler: SubmitHandler<TFormData> = React.useCallback(
    values => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        props?.navigation?.popTo('LoginScreen');
      }, 2500);
    },
    [],
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
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
                secureTextEntry={true}
                errorValue={error?.message ?? ''}
              />
            )}
          />
          <Controller
            control={control}
            name={'confirmPassword'}
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
                labelValue={'Confirm Password'}
                placeholder={'Enter Confirm Password...'}
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
            title={'Sign Up'}
            onPress={handleSubmit(submitClickHandler)}
          />
          <BounceView
            style={{
              flexDirection: 'row',
              gap: ms(5),
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => props?.navigation?.popTo('LoginScreen')}
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
