import React from 'react';
import {Dimensions, Image, Text, View} from 'react-native';
import {px} from '../../constants/constants';
const {width: screenWidth} = Dimensions.get('window');
export default function PurchaseReview({des}) {
  return (
    <View
      style={{
        flex: 1,
      }}>
      <View
        style={{
          backgroundColor: '#eee',
          height: 8,
          width: screenWidth,
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          paddingVertical: 25 * px,
          paddingHorizontal: 15 * px,
        }}>
        <Image
          source={require('../../assets/discount.png')}
          style={{width: 108 * px, height: 93 * px}}
        />
        <Text style={{marginLeft: 20 * px, flex: 1, fontSize: 30 * px}}>
          {des}
        </Text>
      </View>
    </View>
  );
}
