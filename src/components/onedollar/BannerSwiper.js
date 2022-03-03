import {px} from '../../constants/constants';
import {Dimensions, Linking, TouchableOpacity, View, Image} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {navigationRef} from '../../utils/refs';
import AppModule from '../../../AppModule';
import Carousel from 'react-native-snap-carousel/src/carousel/Carousel';
import {Pagination} from 'react-native-snap-carousel';
import {useSelector, useDispatch} from 'react-redux';
import Utils from '../../utils/Utils';
import GlideImage from '../native/GlideImage';

const SwiperItem = ({item, index}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        height: 340 * px,
      }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          if (item.route) {
            if (item.route.includes('://')) {
              Linking.openURL(item.route).catch(console.log);
            } else {
              navigationRef.current.navigate(item.route, item.params);
            }
          }
        }}>
        <GlideImage
          defaultSource={require('../../assets/ph.png')}
          source={Utils.getImageUri(item)}
          resizeMode={'stretch'}
          style={{
            width: 1021 * px,
            height: 340 * px,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ({banners}) => {
  const [list] = useState(banners);
  const carouselRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const screenWidth = Dimensions.get('window').width - 10;
  const renderItem = ({item, index}) => (
    <SwiperItem key={index} item={item} index={activeSlide} />
  );
  return (
    <View>
      {!list || list.length === 0 ? null : (
        <View
          style={{
            marginTop: 10,
            marginBottom: 5,
            marginRight: 10 * px,
            marginLeft: 10 * px,
          }}>
          <Carousel
            ref={carouselRef}
            autoplay={true}
            autoplayInterval={4000}
            loop={true}
            data={list}
            loopClonesPerSide={list.length}
            renderItem={renderItem}
            sliderWidth={screenWidth}
            sliderHeight={340 * px}
            itemWidth={screenWidth}
            hasParallaxImages={true}
            onSnapToItem={(index) => {
              setActiveSlide(index);
            }}
            useScrollView={true}
          />
          <Pagination
            dotsLength={list.length}
            activeDotIndex={activeSlide}
            containerStyle={{
              width: '100%',
              position: 'absolute',
              bottom: -20,
            }}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
        </View>
      )}
    </View>
  );
};
