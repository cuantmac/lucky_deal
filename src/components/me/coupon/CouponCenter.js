import React, {useEffect, useLayoutEffect, useState} from 'react';
import {px, SCREEN_WIDTH} from '../../../constants/constants';
import {StatusBar, View} from 'react-native';
import {PRIMARY} from '../../../constants/colors';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ListenPayBackPress from '../../common/ListenPayBackPress';
import CouponList from './CouponList';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/core';
import AppModule from '../../../../AppModule';
function CouponCenter({navigation}) {
  const Tab = createMaterialTopTabNavigator();
  const token = useSelector((state) => state.deprecatedPersist).token;
  useLayoutEffect(() => {
    navigation.setOptions(
      {
        headerShown: true,
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: '#fff',
          borderBottomWidth: 0,
          elevation: 0,
        },
        headerTitleAlign: 'center',
        title: 'Coupon Center',
      },
      [navigation],
    );
  });
  useEffect(() => {
    if (!token) {
      navigation.navigate('FBLogin');
    }
  }, [navigation, token]);

  useEffect(() => {
    AppModule.reportShow('10', '213');
  }, []);

  if (!token) {
    return <View />;
  }
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor={'transparent'}
      />
      <ListenPayBackPress
        onGoBack={() => navigation.goBack()}
        interrupt={true}
      />
      <Tab.Navigator
        lazy={true}
        tabBarOptions={{
          activeTintColor: '#EF4A36',
          inactiveTintColor: '#575757',
          upperCaseLabel: false,
          tabStyle: {
            width: SCREEN_WIDTH / 3,
          },
          style: {
            backgroundColor: 'white',
          },
          labelStyle: {textTransform: 'none', fontSize: 40 * px},
          scrollEnabled: true,
          indicatorStyle: {
            width: 98 * px,
            marginLeft: SCREEN_WIDTH / 6 - 48 * px,
            height: 11 * px,
            borderRadius: 5 * px,
            backgroundColor: PRIMARY,
          },
        }}
        initialRouteName={'CouponListAvailable'}>
        <Tab.Screen
          name={'CouponListAvailable'}
          options={{tabBarLabel: 'Available'}}
          initialParams={{
            couponType: 0,
          }}
          component={CouponList}
        />
        <Tab.Screen
          name={'CouponListUsed'}
          options={{tabBarLabel: 'Used'}}
          initialParams={{
            couponType: 1,
          }}
          component={CouponList}
        />
        <Tab.Screen
          name={'CouponListExpire'}
          options={{tabBarLabel: 'Expired'}}
          initialParams={{
            couponType: 2,
          }}
          component={CouponList}
        />
      </Tab.Navigator>
    </View>
  );
}

export default CouponCenter;
