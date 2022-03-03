import {Image, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {px} from '../../constants/constants';

export default function ({
  image = require('../../assets/network_error.png'),
  title = 'Load Product failed, please try it later!',
  error = false,
  imageStyle = null,
  onRefresh = () => {},
}) {
  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
      }}>
      <Image
        resizeMode={'contain'}
        style={[
          {
            width: 765 * px,
            height: 409 * px,
          },
          imageStyle,
        ]}
        source={image}
      />
      <Text
        style={{
          color: '#676767',
          fontSize: 40 * px,
          marginTop: 108 * px,
          marginLeft: 108 * px,
          marginRight: 108 * px,
        }}>
        {title}
      </Text>
      {error ? (
        <TouchableOpacity onPress={onRefresh}>
          <Text
            style={{
              color: '#4D79F8',
              fontSize: 40 * px,
              marginTop: 108 * px,
              marginLeft: 108 * px,
              marginRight: 108 * px,
            }}>
            tap to refresh
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
