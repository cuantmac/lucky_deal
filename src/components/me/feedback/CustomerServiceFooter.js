import {View, Text} from 'react-native';
import React from 'react';
import {px} from '../../../constants/constants';
export default function CustomerServiceFooter({onPress}) {
  return (
    <View>
      <View
        style={{
          height: 30 * px,
          width: '100%',
          backgroundColor: '#eee',
          marginTop: 100 * px,
        }}
      />
      <Text
        style={{
          fontSize: 40 * px,
          color: 'black',
          alignSelf: 'center',
          marginTop: 40 * px,
        }}
        numberOfLines={1}>
        Contact Us
      </Text>

      <View style={{flex: 1}} />
      <Text
        onPress={onPress}
        style={{
          color: '#000',
          fontSize: 32 * px,
          textAlign: 'center',
          marginBottom: 36 * px,
          marginTop: 35 * px,
          marginLeft: 30 * px,
          marginRight: 30 * px,
        }}>
        If you do not find a satisfactory answer from the above FAQs, one of our
        custom service representatives will help you figure it out.{' '}
        <Text
          style={{
            color: '#33A7F0',
            textDecorationLine: 'underline',
            textDecorationStyle: 'solid',
          }}>
          Submit ticket
        </Text>
      </Text>
    </View>
  );
}
