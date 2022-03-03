import {
  ActivityIndicator,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import {px} from '../../constants/constants';
import Utils from '../../utils/Utils';
import {PRIMARY} from '../../constants/colors';

export default function ({navigation}) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: 'Forget Password',
    });
  }, [navigation]);

  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [forgetting, setForgetting] = useState(false);
  const forget = () => {
    if (!Utils.emailCheck(email)) {
      Utils.toastFun('please fill in correct email address.');
      return;
    }
    setForgetting(true);
    Utils.toastFun('Email is not exist!');
    setSent(true);
    setForgetting(false);
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
      }}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />
      <Text
        style={{
          color: '#545454',
          fontSize: 50 * px,
          marginLeft: 42,
          marginRight: 42,
          marginTop: 36,
          textAlign: 'center',
        }}>
        {sent
          ? 'We have send an email to you. Please open your email to reset password.'
          : 'Please enter your email address to get your password back'}
      </Text>
      {sent ? (
        <Image
          source={require('../../assets/ph.png')}
          style={{
            alignSelf: 'center',
            marginTop: 140 * px,
          }}
        />
      ) : (
        <View
          style={{
            borderColor: '#EEEEEE',
            borderWidth: 3 * px,
            height: 151.8 * px,
            marginLeft: 55 * px,
            marginRight: 55 * px,
            marginTop: 180 * px,
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
            placeholder={'Enter email'}
            onChangeText={(value) => {
              setEmail(value);
            }}
          />
        </View>
      )}
      <TouchableOpacity
        onPress={forget}
        style={{
          borderColor: PRIMARY,
          borderWidth: 6 * px,
          height: 151.8 * px,
          marginLeft: 55 * px,
          marginRight: 55 * px,
          marginTop: 100 * px,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        {forgetting ? (
          <ActivityIndicator color={PRIMARY} />
        ) : (
          <Text
            style={{
              fontSize: 60 * px,
              color: PRIMARY,
              fontWeight: 'bold',
            }}>
            OK
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
