import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useShallowEqualSelector} from '../../../utils/hooks';
import {px, StatusBarHeight} from '../../../constants/constants';
import AppModule from '../../../../AppModule';
import {useNavigation} from '@react-navigation/native';
export default function HomeTitleBar() {
  const navigation = useNavigation();
  const {token} = useShallowEqualSelector(
    (state: any) => state.deprecatedPersist,
  );
  const search = () => {
    AppModule.reportClick('16', '147');
    navigation.navigate('SearchInput');
  };
  const goWishList = () => {
    if (token) {
      navigation?.navigate('WishList');
    } else {
      navigation?.navigate('FBLogin');
    }
  };
  const goCart = () => {
    if (token) {
      navigation?.navigate('Cart');
    } else {
      navigation?.navigate('FBLogin');
    }
  };
  return (
    <SafeAreaView>
      <View
        style={{
          position: 'relative',
          backgroundColor: '#fff',
          paddingTop: StatusBarHeight + 50 * px,
          height: StatusBarHeight + 160 * px,
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          onPress={search}
          style={{
            marginTop: StatusBarHeight + 35 * px,
            left: 20 * px,
            width: 100 * px,
            height: 120 * px,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={{
              width: 53 * px,
              height: 48 * px,
              tintColor: 'black',
            }}
            resizeMode={'contain'}
            source={require('../../../assets/search.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={search}
          style={{
            marginTop: StatusBarHeight + 35 * px,
            left: 300 * px,
            width: 100 * px,
            height: 120 * px,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={{
              width: 53 * px,
              height: 48 * px,
              tintColor: 'black',
            }}
            resizeMode={'contain'}
            source={require('../../../assets/top_ld_icon.png')}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: '#000000',
            marginTop: StatusBarHeight + 55 * px,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 50 * px,
            fontFamily: 'PingFang SC',
            includeFontPadding: true,
          }}>
          Lucky Deal
        </Text>

        <TouchableOpacity
          onPress={goWishList}
          style={{
            marginTop: StatusBarHeight + 35 * px,
            right: 130 * px,
            width: 100 * px,
            height: 120 * px,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={{
              width: 53 * px,
              height: 48 * px,
              tintColor: 'black',
            }}
            resizeMode={'contain'}
            source={require('../../../assets/top_collect.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goCart}
          style={{
            marginTop: StatusBarHeight + 35 * px,
            right: 20 * px,
            width: 100 * px,
            height: 120 * px,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={{
              width: 53 * px,
              height: 48 * px,
              tintColor: 'black',
            }}
            resizeMode={'contain'}
            source={require('../../../assets/top_cart.png')}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
