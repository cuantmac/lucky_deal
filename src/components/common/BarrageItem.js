import React, {useEffect, useState} from 'react';
import {Animated, View, Text, Easing, Dimensions} from 'react-native';
import GlideImage from '../native/GlideImage';
import Utils from '../../utils/Utils';
import {navigationRef} from '../../utils/refs';
import {px} from '../../constants/constants';

export default function BarrageItem({item, index, navigation}) {
  const [positionAnmi] = useState(new Animated.Value(0));
  const {width: screenWidth} = Dimensions.get('window');
  // console.log('navigation', navigationRef);
  useEffect(() => {
    const delay = index * 3000;
    let AnimatFun = Animated.timing(positionAnmi, {
      toValue: 1,
      duration: 8 * 1000,
      easing: Easing.linear,
      delay: delay,
      useNativeDriver: true,
    });
    AnimatFun.start();
    return () => {
      AnimatFun.stop();
    };
  }, [positionAnmi, index]);

  return (
    <Animated.View
      key={index}
      style={{
        position: 'absolute',
        top: Math.floor(Math.random() * 80) * px,
        transform: [
          {
            translateX: positionAnmi.interpolate({
              inputRange: [0, 1], //输入值
              outputRange: [500, -800], //输出值
            }),
          },
        ],
      }}>
      <View
        style={{
          justContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'row',
          borderRadius: 20,
          backgroundColor:
            Math.floor(Math.random() * 2) % 2
              ? 'rgba(0,0,0,0.8)'
              : 'rgba(239, 170, 5, 0.8)',
          paddingHorizontal: 10 * px,
          paddingVertical: 10 * px,
        }}>
        <GlideImage
          source={Utils.getImageUri(item.avatar)}
          defaultSource={require('../../assets/girl.png')}
          resizeMode={'contain'}
          style={{
            width: 77 * px,
            height: 77 * px,
            overflow: 'hidden',
            borderRadius: 38 * px,
            marginRight: 15 * px,
          }}
        />
        <Text
          numberOfLines={2}
          style={{
            color: '#ffffff',
            paddingRight: 20 * px,
            fontSize: 34 * px,
            maxWidth: screenWidth * 0.8,
          }}>
          {item.content}
        </Text>
      </View>
    </Animated.View>
  );
}
