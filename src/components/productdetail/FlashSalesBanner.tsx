import {FlashSalesInfo} from '@luckydeal/api-common';
import {useNavigation} from '@react-navigation/native';
import React, {FC, useCallback} from 'react';
import {ImageBackground, Text, View, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {px} from '../../constants/constants';
import {Timer, TimerFormate} from '../common/Timer';

interface FlashSalesBannerProps {
  flashSales?: FlashSalesInfo;
  onFlashSaleEnd?: () => void;
}
export const FlashSalesBanner: FC<FlashSalesBannerProps> = ({flashSales}) => {
  const navigation = useNavigation();

  const handleOnPress = useCallback(() => {
    navigation.navigate('FlashDealsView');
  }, [navigation]);

  if (!flashSales?.is_discount) {
    return null;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleOnPress}
      style={{alignItems: 'center'}}>
      <ImageBackground
        style={{
          height: 140 * px,
          width: 1028 * px,
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 20 * px,
        }}
        resizeMode={'cover'}
        source={require('../../assets/icon_flash.png')}>
        <Text style={{fontSize: 40 * px, color: '#fff', marginLeft: 160 * px}}>
          Flash Sale
        </Text>
        <Timer targetTime={flashSales.end_time}>
          {(time) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 'auto',
                }}>
                <Text style={{fontSize: 40 * px, color: '#fff'}}>
                  Ending in:
                </Text>
                <TimerFormate
                  time={time}
                  styles={{
                    minWidth: 54 * px,
                    paddingHorizontal: 10 * px,
                    height: 54 * px,
                    backgroundColor: '#000',
                    borderRadius: 10 * px,
                    fontSize: 36 * px,
                    textAlign: 'center',
                    color: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  color={'#000'}
                />
              </View>
            );
          }}
        </Timer>
        <Image
          resizeMode={'contain'}
          style={{
            marginRight: 20 * px,
            width: 20 * px,
          }}
          source={require('../../assets/i_right.png')}
        />
      </ImageBackground>
    </TouchableOpacity>
  );
};
