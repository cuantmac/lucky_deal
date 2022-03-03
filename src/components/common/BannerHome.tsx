import {Image, Text, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {px} from '../../constants/constants';

import {useShallowEqualSelector} from '../../utils/hooks';
import {FreeShippingBannerSmall} from './FreeShippingBanner';
import {Timer, TimerFormate} from './Timer';
import HomeCodeCouponCard from '../home/HomeCodeCouponCard';
import GlideImage from '../native/GlideImage';
import Utils from '../../utils/Utils';
import {CodeCouponItem} from '../../types/models/config.model';
import AppModule from '../../../AppModule';
import {useNavigation} from '@react-navigation/core';

interface giftItemRender {
  gift_id: number;
  title: string;
  image: string;
}
interface oneDollerRender {
  gift_id: number;
  title: string;
  image: string;
}

interface TimerBannerHomeProps {
  title: string;
  goList: () => void;
  imgList: Array<giftItemRender | oneDollerRender>;
}
export const TimerBannerHome: FC<TimerBannerHomeProps> = ({
  title,

  goList,
  imgList,
}) => {
  const {oneDollerCategory, token} = useShallowEqualSelector(
    (state: any) => state.deprecatedPersist,
  );
  if (!oneDollerCategory) {
    return null;
  }
  const {only_one_category} = oneDollerCategory;
  const GlideImageRn = GlideImage as any;
  return only_one_category.is_new_user || !token ? (
    <TouchableOpacity onPress={goList}>
      <View
        style={{
          // height: 197 * px,
          width: 520 * px,
          borderRadius: 20 * px,
          marginRight: 20 * px,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20 * px,
          }}>
          <Text
            style={{
              fontSize: 40 * px,
              color: '#000',
              textAlign: 'center',
              fontWeight: 'bold',
              // marginBottom: 20 * px,
            }}>
            {/* Get Free Gift */}
            {title}
          </Text>
          <Timer targetTime={only_one_category.new_user_expire_time}>
            {(time, hasEnd) => {
              if (hasEnd) {
                return <View />;
              }
              return !token ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 32 * px,
                      color: '#CC0000',
                      textAlign: 'center',
                      marginHorizontal: 20 * px,
                    }}>
                    24 Hours
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TimerFormate
                    time={time}
                    styles={{
                      width: 54 * px,
                      height: 54 * px,
                      backgroundColor: '#FF3639',
                      borderRadius: 10 * px,
                      fontSize: 36 * px,
                      textAlign: 'center',
                      color: '#fff',
                    }}
                    color={'#FF3639'}
                  />
                </View>
              );
            }}
          </Timer>
        </View>
        <View
          style={{
            flexDirection: 'row',
            // justifyContent: 'center',
            alignItems: 'center',
          }}>
          {imgList?.map((item, i) => {
            return (
              <View
                key={i}
                style={{
                  position: 'relative',
                  marginHorizontal: 3 * px,
                  width: 236 * px,
                  marginRight: 15 * px,
                }}>
                <GlideImageRn
                  defaultSource={require('../../assets/ph.png')}
                  source={Utils.getImageUri(item)}
                  resizeMode={'stretch'}
                  style={{
                    width: 236 * px,
                    height: 300 * px,
                    borderRadius: 20 * px,
                  }}
                />
                {title === 'Get Free Gift' ? (
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 36 * px,
                      backgroundColor: '#FF3B89',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 55 * px,
                      borderBottomLeftRadius: 20 * px,
                      borderBottomRightRadius: 20 * px,
                      textAlign: 'center',
                    }}>
                    FREE
                  </Text>
                ) : null}
              </View>
            );
          })}
        </View>
      </View>
    </TouchableOpacity>
  ) : null;
};
export interface FreeItemBannerProps {
  taxFee: number;
  shippingFee: number;
  couponList: Array<CodeCouponItem>;
}
export const FreeItemBanner: FC<FreeItemBannerProps> = ({
  taxFee,
  shippingFee,
  couponList,
}) => {
  // let couponList = [];
  const navigation = useNavigation();
  const {token} = useShallowEqualSelector((state: any) => ({
    ...state.deprecatedPersist,
  }));
  const applyCodeCoupon = (item: CodeCouponItem) => {
    AppModule.reportClick('2', '277', {
      CouponCode: item.code,
    });
    if (!token) {
      navigation.navigate('FBLogin');
      return;
    }
    navigation.navigate('ApplyCodeCoupon');
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>
      <FreeShippingBannerSmall
        from={'home'}
        taxFee={taxFee}
        shippingFee={shippingFee}
      />
      {couponList && couponList.length > 0 ? (
        <>
          <View
            style={{
              height: 90 * px,
              width: 2 * px,
              backgroundColor: '#C0C0C0',
              marginHorizontal: 20 * px,
            }}
          />
          {/* <HomeCodeCouponCard codeCoupon={couponList} />; */}
          <View style={{flexDirection: 'row', padding: 10 * px, flex: 1}}>
            {couponList.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index.toString()}
                  onPress={() => applyCodeCoupon(item)}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    marginRight: 20 * px,
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
                        fontSize: 32 * px,
                        color: '#000',
                        fontWeight: 'bold',
                      }}>
                      ${Utils.priceFilter(item.amount)} OFF
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        selectable={true}
                        style={{
                          fontSize: 32 * px,
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
                        fontSize: 30 * px,
                        color: '#000',
                      }}>
                      {item.use_product_desc}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      ) : null}
    </View>
  );
};
