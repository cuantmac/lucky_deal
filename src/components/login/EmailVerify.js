import {Button, Text, TextInput, View} from 'react-native';
import React, {useLayoutEffect} from 'react';
import {px} from '../../constants/constants';
import {PRIMARY} from '../../constants/colors';

export default function ({navigation}) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: 'Email Verify',
    });
  }, [navigation]);

  return (
    <View>
      <Text>
        Great! Sign up successfully! Please verify the email by entering the
        code we send to your email.
      </Text>
      <Text>
        Email verify successfully! You can auction the product you like now.
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
        <TextInput placeholder={'Enter verify code'} />
      </View>
      <Button title={'Verify Now'} onPress={() => {}} />
    </View>
  );
}
