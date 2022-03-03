import React, {useEffect} from 'react';
import {Text, Image, TouchableOpacity, View} from 'react-native';
import {px} from '../../constants/constants';
import {navigationRef} from '../../utils/refs';
import {useShallowEqualSelector} from '../../utils/hooks';
import Utils from '../../utils/Utils';
import AppModule from '../../../AppModule';
export default function HomeCodeCouponCard({codeCoupon}) {
  const {token} = useShallowEqualSelector((state) => ({
    ...state.deprecatedPersist,
  }));
  const applyCodeCoupon = (item) => {
    AppModule.reportClick('2', '277', {
      CouponCode: item.code,
    });
    if (!token) {
      navigationRef.current?.navigate('FBLogin');
      return;
    }
    navigationRef.current?.navigate('ApplyCodeCoupon');
  };
  if (!codeCoupon || !codeCoupon.length) {
    return null;
  }
  return (
    <View style={{flexDirection: 'row'}}>
      {codeCoupon.map((item, index) => {
        return (
          <TouchableOpacity
            key={index.toString()}
            onPress={() => applyCodeCoupon(item)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              // flex: 1,
            }}>
            <Image
              resizeMode={'contain'}
              source={require('../../assets/banner_coupon_free.png')}
              style={{width: 80 * px, height: 66 * px}}
            />
            <View
              style={{
                marginLeft: 10 * px,
                alignItems: 'center',
                // flex: 1,
              }}>
              <Text
                style={{
                  fontSize: 36 * px,
                  color: '#000',
                  fontWeight: 'bold',
                }}>
                ${Utils.priceFilter(item.amount)} OFF
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  selectable={true}
                  style={{
                    fontSize: 34 * px,
                    color: '#000',
                    textDecorationLine: 'underline',
                  }}>
                  {item.code}
                </Text>
                <Text
                  style={{
                    fontSize: 20 * px,
                    color: '#000',
                    borderColor: '#000',
                    borderWidth: 1 * px,
                    borderRadius: 5 * px,
                    paddingHorizontal: 10 * px,
                    alignSelf: 'center',
                    marginLeft: 10 * px,
                  }}>
                  apply
                </Text>
              </View>

              <Text
                numberOfLines={1}
                style={{
                  fontSize: 36 * px,
                  color: '#000',
                }}>
                {item.use_product_desc}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
