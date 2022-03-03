import React, {memo} from 'react';
import {Text, View, Image, Dimensions} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {PRIMARY} from '../../constants/colors';
import {CartDotNum, MeDotNum} from './MainScreen';
import {px} from '../../constants/constants';
import {useNavigation} from '@react-navigation/core';

const Tab = createMaterialTopTabNavigator();

function BottomTabNew({
  tabs,
  tabBarPosition,
  activeTintColor,
  inactiveTintColor,
  scrollEnabled,
  tabStyle,
  indicatorStyle,
  style,
  labelStyle,
  lazyPlaceholder,
}) {
  const navigation = useNavigation();
  return (
    <>
      <Tab.Navigator
        swipeEnabled={false}
        lazy={true}
        initialRouteName={tabs[0].name}
        lazyPlaceholder={lazyPlaceholder}
        initialLayout={{width: Dimensions.get('window').width}}
        tabBarPosition={tabBarPosition}
        tabBarOptions={{
          labelStyle: labelStyle,
          tabStyle: tabStyle,
          activeTintColor: activeTintColor || PRIMARY,
          inactiveTintColor: inactiveTintColor || '#000',
          indicatorStyle: indicatorStyle,
          scrollEnabled: scrollEnabled || false,
          allowFontScaling: false,
        }}
        style={style}>
        {tabs.map((data) => {
          const {component, ...item} = data;
          return (
            <Tab.Screen
              key={item.name}
              name={item.name}
              component={component}
              initialParams={item}
              listeners={{
                tabPress: () => {
                  if (item.item_type === 4) {
                    navigation.navigate('DiscountList', {
                      activity_id: item.item_id,
                      type: 'discount',
                    });
                  }
                },
              }}
              options={{
                tabBarLabel: ({color}) => (
                  <View
                    style={{
                      height: 48,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {item.icon ? (
                      <View>
                        <Image
                          resizeMode={'contain'}
                          style={[
                            {
                              width: 25,
                              height: 25,
                              tintColor: color,
                            },
                          ]}
                          source={item.icon}
                        />
                        {item.name === 'Bag' && <CartDotNum />}
                        {item.name === 'Me' && <MeDotNum />}
                      </View>
                    ) : null}
                    <Text
                      numberOfLines={2}
                      style={[
                        {
                          fontSize: 28 * px,
                          textAlign: 'center',
                        },
                        {color},
                      ]}>
                      {item.name}
                    </Text>
                  </View>
                ),
              }}
            />
          );
        })}
      </Tab.Navigator>
    </>
  );
}

export default memo(BottomTabNew);
