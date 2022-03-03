import {
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {px, StatusBarHeight} from '../../constants/constants';
import {navigationRef} from '../../utils/refs';
import {useIsFocused} from '@react-navigation/core';
import BadgeCartButton from '../cart/BadgeCartButton';
const {width} = Dimensions.get('window');
export default function ({title, onFocusCallBack}) {
  const focus = useIsFocused();
  const searchRef = useRef();
  useEffect(() => {
    if (focus) {
      searchRef.current.blur();
    }
  }, [focus]);
  return (
    <View
      style={{
        zIndex: 999,
        width: width,
        marginTop: StatusBarHeight + 20 * px,
        height: 160 * px,
        position: 'absolute',
      }}>
      <View
        style={{
          flexDirection: 'row',
          width: width,
          height: 90 * px,
          position: 'absolute',
          alignItems: 'center',
          left: 31 * px,
          top: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigationRef.current?.goBack();
          }}
          style={{
            width: 80 * px,
            height: 80 * px,
            borderRadius: 40 * px,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('../../assets/fh.png')}
            resizeMode={'contain'}
            style={{
              width: 26 * px,
              height: 46 * px,
            }}
          />
        </TouchableOpacity>
        <TextInput
          ref={(ref) => {
            searchRef.current = ref;
          }}
          selectionColor={'#F04B33'}
          style={{
            paddingHorizontal: 30 * px,
            marginLeft: 30 * px,
            height: 90 * px,
            backgroundColor: '#F2F2F2',
            width: width - 300 * px,
            borderRadius: 45 * px,
            borderColor: '#F2F2F2',
            borderWidth: 1,
          }}
          onFocus={onFocusCallBack}
          defaultValue={title}
        />
        <BadgeCartButton />
      </View>
    </View>
  );
}
