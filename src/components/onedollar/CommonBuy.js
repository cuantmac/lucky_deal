import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

import {px, SCREEN_WIDTH} from '../../constants/constants';
import {PRIMARY} from '../../constants/colors';
import Utils from '../../utils/Utils';

import {useShallowEqualSelector} from '../../utils/hooks';
import GoodsBottomButtons from '../productdetail/GoodsBottomButtons';

export default function CommonBuy({paying, onPay, goodsDetail}) {
  const {now} = useShallowEqualSelector((state) => ({
    ...state.deprecatedPersist,
    now: state.memory.now,
  }));

  return (
    <View
      style={{
        paddingVertical: 50 * px,
      }}>
      {goodsDetail?.product_status || goodsDetail?.begin_time > now ? (
        <TouchableOpacity
          onPress={() => onPay(0)}
          style={{
            margin: 50 * px,
            height: 136 * px,
            backgroundColor: goodsDetail?.product_status ? '#A0A0A0' : PRIMARY,
            alignItems: 'center',
            borderRadius: 20 * px,
            justifyContent: 'center',
          }}>
          {paying ? (
            <ActivityIndicator color={'white'} style={{flex: 1}} />
          ) : goodsDetail?.product_status ? (
            <Text
              style={{color: 'white', fontSize: 70 * px, fontWeight: '600'}}>
              Sold out
            </Text>
          ) : goodsDetail?.begin_time > now ? (
            <View
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 70 * px,
                  fontWeight: '600',
                  alignSelf: 'flex-start',
                  lineHeight: 70 * px,
                }}>
                Coming in{' '}
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 50 * px,
                  fontWeight: '600',
                  lineHeight: 70 * px,
                }}>
                {Utils.endTimeShow(goodsDetail?.begin_time - now)} (US $
                {(goodsDetail.mark_price / 100.0).toFixed(2)})
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      ) : (
        <GoodsBottomButtons
          goodsDetail={goodsDetail}
          leftOnPress={
            goodsDetail.product_type === 5 || goodsDetail.product_type === 4
              ? null
              : () => {
                  onPay(0, 'addToBag');
                }
          }
          rightOnPress={() => {
            onPay(0, 'payNow');
          }}
          buttonContent={`Buy Now ($${(goodsDetail.mark_price / 100.0).toFixed(
            2,
          )})`}
        />
      )}
    </View>
  );
}
