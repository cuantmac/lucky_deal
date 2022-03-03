import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {px} from '../../../constants/constants';
import {pure} from 'recompose';
export default pure(function ({index, data, onSelectedCallBack}) {
  return (
    <TouchableOpacity
      activeOpacity={1.0}
      style={{
        flexDirection: 'row',
        marginLeft: 40 * px,
        height: 120 * px,
        alignItems: 'center',
      }}
      onPress={() => {
        onSelectedCallBack();
      }}>
      <Text style={{color: '#000000', fontSize: 40 * px}}>{index}.</Text>
      <Text
        style={{
          color: '#000000',
          fontSize: 40 * px,
          flex: 1,
          marginLeft: 15 * px,
          marginEnd: 100 * px,
        }}>
        {data.reason}
      </Text>
      <View
        style={{
          justifyContent: 'flex-end',
        }}>
        <Image
          style={{
            marginEnd: 40 * px,
            width: 50 * px,
            height: 50 * px,
            alignSelf: 'flex-end',
          }}
          source={
            data.selected
              ? require('../../../assets/select.png')
              : require('../../../assets/unselect.png')
          }
        />
      </View>
    </TouchableOpacity>
  );
});
