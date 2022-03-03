import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {px, SCREEN_WIDTH} from '../../constants/constants';
import {PRIMARY} from '../../constants/colors';
import Utils from '../../utils/Utils';
import {useShallowEqualSelector} from '../../utils/hooks';
import GoodsBottomButtons from '../productdetail/GoodsBottomButtons';

export default function VipProductBuy({paying, onPay, goodsDetail}) {
  const {now, profile} = useShallowEqualSelector((state) => ({
    ...state.deprecatedPersist,
    now: state.memory.now,
  }));

  /***
   * 首单非会员两个按钮。
   */
  const FirstOrderVipBuyButtons = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          flex: 1,
          marginHorizontal: 35 * px,
          marginVertical: 50 * px,
        }}>
        <TouchableOpacity
          onPress={() => onPay(2, 'both')}
          activeOpacity={0.6}
          style={{
            width: (SCREEN_WIDTH - 106 * px) / 2,
            height: 136 * px,
            borderRadius: 20 * px,
            borderColor: '#F04A33',
            borderWidth: 4 * px,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 54 * px, color: '#F04A33'}} numberOfLines={1}>
            Buy Now ${goodsDetail?.original_price / 100}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onPay(1, 'both')}
          activeOpacity={0.6}
          style={{
            width: (SCREEN_WIDTH - 106 * px) / 2,
            height: 136 * px,
            borderRadius: 20 * px,
            backgroundColor: '#2C292A',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 54 * px, color: '#F7D7B2'}} numberOfLines={1}>
            Buy Now ${goodsDetail?.mark_price / 100}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const VipBuyButton = () => {
    return (
      <TouchableOpacity
        onPress={() => onPay(0, 'payNow')}
        activeOpacity={0.6}
        style={{
          width: SCREEN_WIDTH - 100 * px,
          height: 136 * px,
          borderRadius: 20 * px,
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: goodsDetail?.product_status ? '#A0A0A0' : '#2C292A',
        }}>
        <Text style={{fontSize: 60 * px, color: '#F7D7B2'}} numberOfLines={1}>
          Buy Now (${goodsDetail?.mark_price / 100})
        </Text>
      </TouchableOpacity>
    );
  };

  return !profile?.is_vip && goodsDetail?.begin_time <= now ? (
    <FirstOrderVipBuyButtons />
  ) : (
    <View
      style={{
        marginHorizontal: 30 * px,
        marginVertical: 50 * px,
        height: 136 * px,
        backgroundColor: goodsDetail?.product_status ? '#A0A0A0' : PRIMARY,
        alignItems: 'center',
        borderRadius: 20 * px,
        justifyContent: 'center',
      }}>
      {
        paying ? (
          <ActivityIndicator color={'white'} style={{flex: 1}} />
        ) : goodsDetail?.product_status ? (
          <TouchableOpacity onPress={() => onPay(0, 'payNow')}>
            <Text
              style={{color: 'white', fontSize: 70 * px, fontWeight: '600'}}>
              Sold out
            </Text>
          </TouchableOpacity>
        ) : goodsDetail?.begin_time > now ? (
          <TouchableOpacity
            onPress={() => onPay(0, 'payNow')}
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
                // marginBottom: -10 * px,
              }}>
              {Utils.endTimeShow(goodsDetail?.begin_time - now)} (US $
              {goodsDetail?.mark_price / 100})
            </Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              height: 136 * px,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <GoodsBottomButtons
              style={{paddingHorizontal: 0, width: SCREEN_WIDTH}}
              goodsDetail={goodsDetail}
              leftOnPress={() => onPay(0, 'addToBag')}
              rightOnPress={() => onPay(0, 'payNow')}
              rightButtonStyle={{
                backgroundColor: goodsDetail?.product_status
                  ? '#A0A0A0'
                  : '#2C292A',
                textColor: '#F7D7B2',
              }}
              buttonContent={`Buy Now ($${goodsDetail?.mark_price / 100})`}
            />
          </View>
          // <VipBuyButton />
        )
        //会员商品(goodsDetail.product_type === 4)或者一元购商品(product_type === 5)
        // goodsDetail.product_type === 5 || goodsDetail.product_type === 4 ? (
        //   <VipBuyButton />
        // ) : (
        //   <GoodsBottomButtons
        //     leftOnPress={() => onPay(0, 'addToBag')}
        //     rightOnPress={() => onPay(0, 'payNow')}
        //     buttonContent={`Buy Now $(${goodsDetail?.mark_price / 100})`}
        //     rightButtonStyle={{
        //       backgroundColor: goodsDetail?.product_status
        //         ? '#A0A0A0'
        //         : '#2C292A',
        //       textColor: '#F7D7B2',
        //     }}
        //   />
        // )
      }
    </View>
  );
}
