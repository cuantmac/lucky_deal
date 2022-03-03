import React from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {px, SCREEN_WIDTH} from '../../constants/constants';
import {PRIMARY} from '../../constants/colors';

export default function CartBottomView({
  navigation,
  checkCartCallBack,
  price,
  checking,
  discountPrice,
}) {
  const checkCartItems = () => {
    checkCartCallBack && checkCartCallBack();
  };
  return (
    <View
      style={{
        width: SCREEN_WIDTH,
        position: 'absolute',
        bottom: 0,
        alignContent: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingTop: 30 * px,
        paddingBottom: 30 * px,
        elevation: 12 * px,
      }}>
      <FinalAmount
        finalPrice={(price / 100).toFixed(2)}
        discountPrice={(discountPrice / 100).toFixed(2)}
        from={'Cart'}
      />
      <TouchableOpacity
        style={{
          backgroundColor: PRIMARY,
          marginHorizontal: 8,
          height: 120 * px,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20 * px,
          marginTop: 10 * px,
        }}
        onPress={checkCartItems}>
        {checking ? (
          <ActivityIndicator color={'white'} />
        ) : (
          <Text
            style={[
              {
                color: 'white',
                fontSize: 50 * px,
              },
            ]}>
            CHECKOUT
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

/**
 * 显示最终金额
 */
export const FinalAmount = ({finalPrice, discountPrice, from}) => {
  return (
    <View
      style={{
        marginHorizontal: 20 * px,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 44 * px,
          }}>
          Total:$
        </Text>
        <Text
          style={{
            color: '#000',
            marginLeft: 2,
            fontSize: finalPrice > 99 ? 50 * px : 60 * px,
          }}>
          {finalPrice}
        </Text>
      </View>
      {from === 'Cart' && discountPrice > 0 ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: '#E00404',
              marginLeft: 2,
              fontSize: 50 * px,
            }}>
            Bundle sale:
          </Text>

          <Text
            style={{
              color: '#E00404',
              marginLeft: 2,
              fontSize: discountPrice > 99 ? 50 * px : 70 * px,
            }}>
            -${discountPrice}
          </Text>
        </View>
      ) : null}
    </View>
  );
};
