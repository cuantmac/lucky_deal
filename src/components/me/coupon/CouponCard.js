import React from 'react';
import {Image, ImageBackground, Text, View} from 'react-native';
import {pure} from 'recompose';
import {px} from '../../../constants/constants';
import Utils from '../../../utils/Utils';

export default pure(function ({data, cardStatus}) {
  const cardBgByCardType = (type) => {
    switch (type) {
      case 1:
        return require('../../../assets/coupon_taxing_bg.png');
      case 2:
        return require('../../../assets/coupon_other_bg.png');
      case 3:
        return require('../../../assets/coupon_order_bg.png');
      case 4:
        return require('../../../assets/coupon_deal_pro_bg.png');
      case 5:
        return require('../../../assets/coupon_shipping_bg.png');
    }
  };
  return (
    <ImageBackground
      style={{
        height: 224 * px,
        marginTop: 20 * px,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
      resizeMode={'contain'}
      source={
        cardStatus === 0
          ? cardBgByCardType(data.group_type)
          : require('../../../assets/coupon_disable_bg.png')
      }>
      {data.discount_type === 1 ? (
        <View style={{flexDirection: 'column', justifyContent: 'center'}}>
          <Text
            style={{
              textAlign: 'center',
              width: 315 * px,
              fontSize: 60 * px,
              color: 'white',
              marginLeft: 50 * px,
              fontWeight: 'bold',
            }}>
            {data.amount + '% OFF'}
          </Text>
          {data.max_discount > 0 && (
            <Text
              style={{
                textAlign: 'center',
                width: 315 * px,
                fontSize: 30 * px,
                color: 'white',
                marginLeft: 50 * px,
              }}>
              (Max ${data.max_discount / 100.0})
            </Text>
          )}
        </View>
      ) : (
        <Text
          style={{
            textAlign: 'center',
            width: 315 * px,
            lineHeight: 224 * px,
            fontSize: 70 * px,
            color: 'white',
            marginLeft: 50 * px,
            fontWeight: 'bold',
          }}
          numberOfLines={1}>
          {`$${data.amount / 100.0}`}
        </Text>
      )}
      <View
        style={{
          width: 640 * px,
          position: 'absolute',
          right: 50 * px,
          height: 224 * px,
          paddingVertical: 20 * px,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 40 * px,
            color: 'white',
            textAlign: 'left',
          }}>
          {data.title}
        </Text>
        <Text
          style={{
            fontSize: 28 * px,
            color: 'white',
            textAlign: 'left',
            width: 550 * px,
          }}>
          {data.use_product && data.use_product}
        </Text>
        <Text style={{fontSize: 26 * px, color: 'white', textAlign: 'left'}}>
          {data.begin_time}-{data.end_time}
        </Text>
      </View>
      {cardStatus === 0 && (
        <Text
          style={{
            alignSelf: 'center',
            position: 'absolute',
            right: 24,
            borderRadius: 28 * px,
            borderWidth: 2 * px,
            borderColor: 'white',
            fontSize: 28 * px,
            color: 'white',
            height: 56 * px,
            width: 188 * px,
            lineHeight: 56 * px,
            textAlign: 'center',
          }}
          numberOfLines={1}>
          Use it
        </Text>
      )}
    </ImageBackground>
  );
});
