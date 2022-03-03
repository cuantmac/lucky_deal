//暂时没用了
import {
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {px} from '../../constants/constants';
import Utils from '../../utils/Utils';

import Api from '../../Api';
import AppModule from '../../../AppModule';
import {useDispatch} from 'react-redux';
import {PRIMARY} from '../../constants/colors';

export default function ({navigation}) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: 'Sign in',
    });
  }, [navigation]);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logging, setLogging] = useState('');

  const signIn = async () => {
    if (logging) {
      return;
    }
    if (!Utils.emailCheck(email)) {
      Utils.toastFun('please fill in correct email address.');
      return;
    }
    if (password.length <= 6) {
      Utils.toastFun('please fill in password at least 6 characters');
      return;
    }
    setLogging(true);
    let registerResult = await Api.signUp(email, password);
    // console.log('regist', registerResult);
    if (registerResult?.token) {
      dispatch({
        type: 'setToken',
        payload: registerResult,
      });
      AsyncStorage.setItem('token', registerResult.token);
      AsyncStorage.setItem('user_id', registerResult.user_id.toString());
      navigation.goBack(); //login
      navigation.goBack(); //register
      AppModule.reportValue('Login', 'ld_email_login_result', {
        way: 'success',
      });
    }
    setLogging(false);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />
      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
        }}>
        <Text
          style={{
            color: 'black',
            fontSize: 60 * px,
            marginTop: 78 * px,
            textAlign: 'center',
          }}>
          Login to auction the products
        </Text>
        <View
          style={{
            borderColor: '#EEEEEE',
            borderWidth: 3 * px,
            height: 151.8 * px,
            marginLeft: 55 * px,
            marginRight: 55 * px,
            marginTop: 60 * px,
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Image
            style={{
              width: 68 * px,
              height: 68 * px,
              marginLeft: 45 * px,
              marginRight: 45 * px,
            }}
            resizeMode={'contain'}
            source={require('../../assets/email.png')}
          />
          <TextInput
            textContentType={'emailAddress'}
            placeholder={'Email'}
            onChangeText={(value) => {
              setEmail(value);
            }}
          />
        </View>
        <View
          style={{
            borderColor: '#EEEEEE',
            borderWidth: 3 * px,
            height: 151.8 * px,
            marginLeft: 55 * px,
            marginRight: 55 * px,
            marginTop: 60 * px,
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Image
            style={{
              width: 68 * px,
              height: 68 * px,
              marginLeft: 45 * px,
              marginRight: 45 * px,
            }}
            resizeMode={'contain'}
            source={require('../../assets/password.png')}
          />
          <TextInput
            textContentType={'password'}
            placeholder={'Password'}
            onChangeText={(value) => {
              setPassword(value);
            }}
          />
        </View>
        <TouchableOpacity
          onPress={signIn}
          style={{
            borderColor: PRIMARY,
            borderWidth: 6 * px,
            height: 151.8 * px,
            marginLeft: 55 * px,
            marginRight: 55 * px,
            marginTop: 60 * px,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 60 * px,
              color: PRIMARY,
              fontWeight: 'bold',
            }}>
            Sign In
          </Text>
        </TouchableOpacity>
        <Text
          onPress={() => {
            navigation.navigate('ForgetPassword');
          }}
          style={{
            color: '#F34A60',
            fontSize: 50 * px,
            marginTop: 30 * px,
            marginRight: 60 * px,
            textAlign: 'right',
            textDecorationLine: 'underline',
          }}>
          Forget password?
        </Text>
        <View style={{flex: 1}} />
        <Text
          style={{
            color: '#999999',
            fontSize: 40 * px,
            textAlign: 'center',
            marginBottom: 36 * px,
            marginLeft: 72 * px,
            marginRight: 72 * px,
          }}>
          By access out service,you are agree with the Terms of Service and
          Privacy Policy
        </Text>
      </View>
    </>
  );
}
