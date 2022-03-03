import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {px} from '../../../constants/constants';
import BottomSheet from '../../dialog/BottomSheet';
export default function GenderSelectedCompoment({genderList, value, onChange}) {
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {genderList?.map((item, index) => {
        return (
          <TouchableOpacity
            style={{
              height: 120 * px,
            }}
            onPress={() => {
              onChange(item.value);
              BottomSheet.hide();
            }}
            key={index}>
            <Text
              style={{
                color: value === item.value ? '#000' : '#9A9A9A',
                height: 120 * px,
                textAlign: 'center',
                lineHeight: 120 * px,
                borderBottomWidth: 2 * px,
                borderBottomColor: '#9A9A9A',
              }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
