import {Text, View, Image} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {px} from '../../../constants/constants';
export default function () {
  return (
    <View
      style={{
        // width: '100%',
        flexDirection: 'row',
        marginVertical: 30 * px,
        justContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        // flex: 1,
      }}>
      {/* <LinearGradient
        style={{
          borderTopLeftRadius: 20 * px,
          borderTopRightRadius: 20 * px,
          marginHorizontal: 15 * px,

          justContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20 * px,
          paddingVertical: 30 * px,
        }}
        colors={['#FFC3BA', '#FFF']}> */}
      <Image
        source={require('../../../assets/hot_home.png')}
        style={{width: 45 * px, height: 57 * px, marginRight: 15 * px}}
      />
      <Text
        style={{
          fontSize: 46 * px,
          fontWeight: 'bold',
          // flex: 1,
          color: '#FF3A39',
        }}>
        Best Selling Items
      </Text>
      {/* </LinearGradient> */}
    </View>
  );
}
