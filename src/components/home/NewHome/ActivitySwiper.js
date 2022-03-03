import {px} from '../../../constants/constants';
import {Text, ImageBackground, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState, memo} from 'react';

import Carousel from 'react-native-snap-carousel/src/carousel/Carousel';
import {Pagination} from 'react-native-snap-carousel';
import Utils from '../../../utils/Utils';
import GlideImage from '../../native/GlideImage';

import {useFetching} from '../../../utils/hooks';
import Api from '../../../Api';

const SwiperItem = memo(({item, index, itemHeight, itemWidth, onPress}) => {
  if (item.type === 'coupon' && item.coupon) {
    return <CouponBannerItem onPress={onPress} item={item} />;
  }

  return (
    <View
      style={{
        alignItems: 'center',
        height: itemHeight,
      }}>
      <TouchableOpacity onPress={onPress}>
        <GlideImage
          defaultSource={require('../../../assets/ph.png')}
          source={Utils.getImageUri(item.image)}
          resizeMode={'stretch'}
          style={{
            width: itemWidth,
            height: itemHeight,
          }}
        />
      </TouchableOpacity>
    </View>
  );
});

const CouponBannerItem = memo(({onPress, item}) => {
  const [, fetchFn, res] = useFetching(Api.couponDetail, {});
  const couponData = res.data || {};
  const couponDetail = (couponData.coupon_list
    ? couponData.coupon_list
    : [{amount: 0}])[0];
  useEffect(() => {
    fetchFn(item.coupon);
  }, [fetchFn, item.coupon]);
  let amount = couponDetail.amount;
  if (couponDetail.discount_type === 1) {
    amount += '%';
  } else {
    amount = '$' + amount / 100;
  }

  return (
    <View
      style={{
        alignItems: 'center',
        height: 200 * px,
      }}>
      <TouchableOpacity onPress={onPress}>
        <ImageBackground
          defaultSource={require('../../../assets/ph.png')}
          source={require('../../../assets/banner_coupon.png')}
          style={{
            flexDirection: 'row',
            width: 500 * px,
            height: 200 * px,
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{fontSize: 50 * px, fontFamily: 'Impact', color: 'white'}}>
              {amount} OFF
            </Text>
            <Text
              style={{color: 'white', fontSize: 36 * px, marginTop: -12 * px}}>
              Get Free Coupon
            </Text>
          </View>
          <View
            style={{
              width: 181 * px,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 68 * px,
                fontFamily: 'Impact',
                color: '#7A5F2F',
              }}>
              GO
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
});

export default ({
  onLayout,
  type,
  homeStyle,
  bannerList,
  itemWidth,
  itemHeight,
  onPress,
}) => {
  const carouselRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  if (!bannerList.length) {
    return null;
  }
  const renderItem = ({item, index}) => (
    <SwiperItem
      key={index}
      item={item}
      index={activeSlide}
      itemHeight={itemHeight}
      itemWidth={itemWidth}
      onPress={() => onPress(item, index)}
    />
  );
  return (
    <View onLayout={onLayout}>
      <View
        style={
          ({
            marginBottom: 5,
            marginLeft: 5,
          },
          homeStyle)
        }>
        <Carousel
          ref={carouselRef}
          autoplay={true}
          autoplayInterval={4000}
          loop={true}
          data={bannerList}
          loopClonesPerSide={bannerList.length}
          renderItem={renderItem}
          sliderWidth={itemWidth}
          sliderHeight={itemHeight}
          itemWidth={itemWidth}
          hasParallaxImages={true}
          onSnapToItem={(index) => {
            setActiveSlide(index);
          }}
          useScrollView={true}
        />
        <Pagination
          dotsLength={bannerList.length}
          activeDotIndex={activeSlide}
          containerStyle={{
            width: '100%',
            position: 'absolute',
            bottom: -20,
          }}
          dotStyle={{
            width: 10 * px,
            height: 10 * px,
            borderRadius: 5,
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      </View>
    </View>
  );
};
