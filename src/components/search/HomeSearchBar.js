import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useShallowEqualSelector} from '../../utils/hooks';
import {px, StatusBarHeight} from '../../constants/constants';
import AppModule from '../../../AppModule';
import {useSearchKeyWord} from '../../hooks/useSearchKeyWord';
export default function ({navigation}) {
  const words = useSearchKeyWord();
  const {token} = useShallowEqualSelector((state) => state.deprecatedPersist);
  const search = (type) => {
    AppModule.reportClick('16', '147', {
      SearchType: type,
    });
    navigation.navigate('SearchInput');
  };
  const goWishList = () => {
    if (token) {
      navigation?.navigate('WishList');
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
          height: StatusBarHeight + 180 * px,
        }}>
        <TouchableOpacity
          onPress={() => {
            search(0);
          }}
          activeOpacity={0.7}
          style={{
            flexDirection: 'row',
            marginTop: StatusBarHeight + 50 * px,
            backgroundColor: '#F4F3F3',
            position: 'absolute',
            height: 90 * px,
            width: '85%',
            left: '3%',
            color: '#747474',
            borderRadius: 45 * px,
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingHorizontal: 30 * px,
            }}>
            <Image
              resizeMode={'contain'}
              style={{width: 38 * px, height: 38 * px, alignSelf: 'center'}}
              source={require('../../assets/icon_search_white_light.png')}
              tintColor={'#747474'}
            />
            <Text
              style={{
                color: '#747474',
                marginLeft: 16 * px,
                fontSize: 36 * px,
                includeFontPadding: false,
              }}>
              {words}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goWishList}
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
            source={require('../../assets/new_like.png')}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
