import {
  Text,
  TouchableOpacity,
  View,
  Image,
  ImageBackground,
  Animated,
} from 'react-native';
import {px, SCREEN_WIDTH} from '../../constants/constants';
import React, {useEffect} from 'react';
import {navigationRef} from '../../utils/refs';
import {
  payAddAddressClick,
  payEditAddressClick,
  payOrderEditAddressClick,
} from '../../analysis/report';
import {useIsFocused} from '@react-navigation/core';

export default function ({
  address,
  showAdd,
  page,
  path,
  orderId = null,
  way,
  data,
  highlight = false,
}) {
  if (!address || !address.phone_number) {
    return showAdd ? (
      <TouchableOpacity
        onPress={() => {
          if (page === 'order') {
            payOrderEditAddressClick.pathReporter();
          } else {
            payAddAddressClick.pathReporter();
          }
          navigationRef.current?.navigate('AddAddress');
        }}
        style={[
          {
            backgroundColor: 'white',
            flexDirection: 'row',
            alignItems: 'center',
            height: 179 * px,
            marginBottom: 0 * px,
          },
        ]}>
        <Text
          style={{
            marginLeft: 12,
            fontSize: 45 * px,
            flex: 1,
            fontWeight: 'bold',
          }}>
          Add delivery Address
        </Text>
        <Text
          style={{
            color: '#727272',
            marginRight: 12,
            fontSize: 45 * px,
            fontWeight: 'bold',
          }}>
          Add
        </Text>
      </TouchableOpacity>
    ) : null;
  }
  const focus = useIsFocused();
  let scale = new Animated.Value(1);
  useEffect(() => {
    if (!focus) {
      return;
    }
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.98,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [focus, scale]);
  let deliveryContent = (
    <View
      style={{
        alignSelf: 'center',
        alignContent: 'center',
        marginLeft: 8,
        flex: 1,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginLeft: 15 * px,
        }}>
        <Text
          style={{
            color: '#282828',
            fontSize: 40 * px,
            marginRight: 10 * px,
          }}>
          Name:
        </Text>
        <Text
          numberOfLines={1}
          style={{
            color: '#282828',
            fontSize: 32 * px,
          }}>
          {address.full_name || address.nick_name}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginTop: 20 * px,
          marginLeft: 15 * px,
        }}>
        <Text
          style={{
            color: '#282828',
            fontSize: 40 * px,
            marginRight: 10 * px,
          }}>
          Phone NO.:
        </Text>
        <Text
          style={{
            color: '#282828',
            fontSize: 32 * px,
          }}>
          {address.phone_number}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          marginTop: 20 * px,
          marginLeft: 15 * px,
        }}>
        <Text
          style={{
            color: '#282828',
            fontSize: 40 * px,
            marginRight: 10 * px,
            includeFontPadding: false,
          }}>
          Address:
        </Text>
        <Text
          style={{
            flex: 1,
            color: '#282828',
            fontSize: 32 * px,
          }}>
          {(
            address.address_line_one +
            ', ' +
            address.address_line_two +
            ', ' +
            address.city +
            ', ' +
            address.state +
            ', ' +
            address.country
          ).replace(', , ', ', ')}
        </Text>
      </View>
      {address.email ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            alignContent: 'center',
            marginTop: 20 * px,
            marginLeft: 15 * px,
            marginBottom: 10,
          }}>
          <Text
            numberOfLines={3}
            style={{
              color: '#282828',
              fontSize: 40 * px,
              marginRight: 10 * px,
              includeFontPadding: false,
            }}>
            Email:
          </Text>
          <Text
            style={{
              color: '#282828',
              fontSize: 32 * px,
            }}>
            {address.email}
          </Text>
        </View>
      ) : highlight ? (
        <Text
          numberOfLines={2}
          style={{
            color: '#E54444',
            fontSize: 40 * px,
            marginRight: 10 * px,
            marginTop: 20 * px,
            marginLeft: 15 * px,
            includeFontPadding: false,
          }}>
          Please add your email address first.
        </Text>
      ) : null}
      {address.address_id ? (
        <TouchableOpacity
          onPress={() => {
            if (page === 'order') {
              payOrderEditAddressClick.pathReporter();
            } else {
              payEditAddressClick.pathReporter();
            }
            navigationRef.current?.navigate('AddressList', {
              mode: 'select',
              page: page,
              path: path,
            });
          }}
          style={{
            position: 'absolute',
            right: 20 * px,
            top: 10,
          }}>
          <Text
            style={{
              color: '#727272',
              fontSize: 40 * px,
              fontWeight: 'bold',
            }}>
            Manage
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
  return highlight ? (
    <Animated.View
      style={{
        transform: [{scale: scale}],
      }}>
      <ImageBackground
        source={require('../../assets/order_address_view_pink_bg.png')}
        style={{
          alignSelf: 'center',
          width: SCREEN_WIDTH - 20 * px,
          height: 446 * px,
          marginTop: page === 'order' ? 10 * px : -20 * px,
          marginBottom: -20 * px,
          marginHorizontal: -34 * px,
        }}>
        <View
          style={[
            {
              marginTop: highlight ? 20 * px : 0,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              padding: 10,
              backgroundColor: '#fff',
              position: 'relative',
              marginHorizontal: 20 * px,
              height: 400 * px,
            },
          ]}>
          <Image
            source={require('../../assets/pay_address_icon.png')}
            style={{width: 100 * px, height: 100 * px}}
          />
          {deliveryContent}
        </View>
      </ImageBackground>
    </Animated.View>
  ) : (
    <View
      style={[
        {
          marginTop: page === 'order' ? 30 * px : 0,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: 10,
          backgroundColor: '#fff',
          position: 'relative',
          flex: 1,
        },
      ]}>
      <Image
        source={require('../../assets/pay_address_icon.png')}
        style={{width: 100 * px, height: 100 * px}}
      />
      {deliveryContent}
    </View>
  );
}
