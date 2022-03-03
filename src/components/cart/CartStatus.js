import React, {useCallback} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {px, SCREEN_WIDTH} from '../../constants/constants';
import {navigationRef} from '../../utils/refs';
import {PRIMARY} from '../../constants/colors';
import AppModule from '../../../AppModule';

/**
 * @param navigation
 * @param status 1-未登录, 2-已登陆购物车为空, 3-不显示
 * @returns {*}
 * @constructor
 * @return {null}
 */
export default function CartStatus({navigation, status}) {
  const login = () => {
    AppModule.reportClick('23', '305');
    navigation?.navigate('FBLogin');
  };
  const shopNow = () => {
    if (status === 1) {
      AppModule.reportClick('23', '306');
    } else {
      AppModule.reportClick('23', '307');
    }
    navigationRef.current.navigate('Home');
  };
  return status === 0 ? (
    <View
      style={{
        width: SCREEN_WIDTH,
        alignItems: 'center',
      }}>
      <ActivityIndicator color={PRIMARY} style={{flex: 1}} />
    </View>
  ) : status === 3 ? null : (
    <View
      style={{
        width: SCREEN_WIDTH,
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Image
          resizeMode={'contain'}
          style={{
            marginTop: 200 * px,
            width: 299 * px,
            height: 288 * px,
          }}
          source={require('../../assets/cart_empty.png')}
        />
        <Text style={{color: '#050505', fontSize: 50 * px}}>
          Your bag is empty
        </Text>
        {status === 1 ? (
          <View style={{alignItems: 'center'}}>
            <Text style={{color: '#767474', fontSize: 50 * px}}>
              Log in to see shopping bag
            </Text>
            <TouchableOpacity
              onPress={login}
              style={{
                marginTop: 70 * px,
                width: SCREEN_WIDTH - 100 * px,
                alignSelf: 'center',
                borderRadius: 10 * px,
                backgroundColor: '#3C7DE3',
                height: 136 * px,
              }}>
              <Text
                style={{
                  fontSize: 60 * px,
                  color: '#fff',
                  lineHeight: 136 * px,
                  textAlign: 'center',
                }}
                numberOfLines={1}>
                SIGN IN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={shopNow}
              style={{
                marginTop: 38 * px,
                width: SCREEN_WIDTH - 100 * px,
                alignSelf: 'center',
                borderRadius: 10 * px,
                borderColor: '#656565',
                borderWidth: 4 * px,
                height: 136 * px,
              }}>
              <Text
                style={{
                  fontSize: 60 * px,
                  color: '#000000',
                  lineHeight: 136 * px,
                  textAlign: 'center',
                }}
                numberOfLines={1}>
                SHOP NOW
              </Text>
            </TouchableOpacity>
          </View>
        ) : status === 2 ? (
          <TouchableOpacity
            onPress={shopNow}
            style={{
              marginTop: 70 * px,
              width: SCREEN_WIDTH - 100 * px,
              alignSelf: 'center',
              borderRadius: 10 * px,
              backgroundColor: '#3C7DE3',
              height: 136 * px,
            }}>
            <Text
              style={{
                fontSize: 60 * px,
                color: '#fff',
                lineHeight: 136 * px,
                textAlign: 'center',
              }}
              numberOfLines={1}>
              SHOP NOW
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
