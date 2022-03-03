import {CommonApi} from '@src/apis';
import {createStyleSheet, isWeb} from '@src/helper/helper';
import {Message} from '@src/helper/message';
import {goback} from '@src/routes';
import {BUTTON_TYPE_ENUM, StandardButton} from '@src/widgets/button';
import {GlideImage, GlideImageProps} from '@src/widgets/glideImage';
import React, {FC, useCallback} from 'react';
import {Controller, FieldErrors, useForm} from 'react-hook-form';
import {
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
  Text,
  TextInput,
  TextInputProps,
  Keyboard,
} from 'react-native';
import {LoginAction, LoginActionProps} from '../loginAction';
import {LoginBottomContainer, LoginFooter} from '../widgets';

type FormFileds = {
  email: string;
  pass_word: string;
};

interface EmailLoginProps {
  onSuccess: LoginActionProps['onSuccess'];
}

export const EmailLogin: FC<EmailLoginProps> = ({onSuccess}) => {
  const {control, handleSubmit} = useForm<FormFileds>({
    defaultValues: {
      email: '',
      pass_word: '',
    },
  });

  const onSubmit = useCallback(
    (data: FormFileds) => {
      Message.loading();
      CommonApi.emailLoginUsingPOST(data)
        .then(async (res) => {
          await onSuccess(res);
          Message.hide();
          goback();
        })
        .catch((e) => {
          Message.toast(e);
        });
    },
    [onSuccess],
  );

  const handleOnError = useCallback((e: FieldErrors<FormFileds>) => {
    rlog(e);
    if (e.email) {
      Message.toast(e.email.message);
      return;
    }
    if (e.pass_word) {
      Message.toast(e.pass_word.message);
    }
  }, []);

  const handlePress = useCallback(() => {
    Keyboard.dismiss();
    handleSubmit(onSubmit, handleOnError)();
  }, [handleOnError, handleSubmit, onSubmit]);

  return (
    <View style={EmailLoginStyles.container}>
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <InputItem
            value={value}
            onBlur={onBlur}
            placeholder={'Email Address'}
            onChangeText={onChange}
            autoFocus
          />
        )}
        name={'email'}
        rules={{
          setValueAs: (val: string) => val.trim(),
          validate: (val: string) => {
            const validateVal = val.trim();
            if (!validateVal) {
              return 'Please fill your email';
            }
            if (
              /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i.test(
                validateVal,
              )
            ) {
              return true;
            }
            return 'Please fill the correct email information';
          },
        }}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <InputItem
            value={value}
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Enter Your Password"
            style={EmailLoginStyles.passwordInput}
            onSubmitEditing={handlePress}
          />
        )}
        name={'pass_word'}
        rules={{
          required: 'Please fill in the password',
        }}
      />
      <StandardButton
        onPress={handlePress}
        title={'SIGN IN'}
        type={BUTTON_TYPE_ENUM.HIGH_LIGHT}
      />
      <LoginBottomContainer>
        <Text style={EmailLoginStyles.loginActionTitle}>-Or Join with-</Text>
        <LoginAction
          style={EmailLoginStyles.loginAction}
          onSuccess={onSuccess}
          renderFacebookBtn={({onPress}) => {
            return (
              <LoginIcon
                style={EmailLoginStyles.fbIcon}
                onPress={onPress}
                source={require('@src/assets/email_facebook_icon.png')}
              />
            );
          }}
          renderGoogleBtn={({onPress, disabled}) => {
            return (
              <LoginIcon
                disabled={disabled}
                onPress={onPress}
                source={require('@src/assets/email_google_icon.png')}
              />
            );
          }}
        />
        <LoginFooter />
      </LoginBottomContainer>
    </View>
  );
};

const EmailLoginStyles = createStyleSheet({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 40,
  },
  loginActionTitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#999',
  },
  loginAction: {
    flexDirection: 'row',
    marginBottom: 40,
    justifyContent: 'center',
  },
  fbIcon: {
    marginLeft: 20,
  },
  passwordInput: {
    marginTop: 20,
    marginBottom: 30,
  },
});

interface InputItemProps extends TextInputProps {}

const InputItem: FC<InputItemProps> = ({style, ...props}) => {
  return (
    <View style={[InputItemStyles.container, style]}>
      <TextInput
        placeholderTextColor={'#999'}
        // @ts-ignore
        style={[InputItemStyles.textInput, isWeb() && {outlineWidth: 0}]}
        {...props}
      />
    </View>
  );
};

const InputItemStyles = createStyleSheet({
  container: {
    borderColor: '#e5e5e5',
    borderWidth: 1,
    height: 40,
  },
  textInput: {
    height: '100%',
    fontSize: 14,
    color: '#222',
    paddingTop: 12,
    paddingBottom: 11,
    paddingLeft: 12,
    paddingRight: 14,
  },
});

interface LoginIconProps {
  source: GlideImageProps['source'];
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const LoginIcon: FC<LoginIconProps> = ({source, onPress, disabled, style}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={style}>
      <GlideImage source={source} style={LoginIconStyles.img} />
    </TouchableOpacity>
  );
};

const LoginIconStyles = createStyleSheet({
  img: {
    width: 35,
    height: 35,
  },
});
