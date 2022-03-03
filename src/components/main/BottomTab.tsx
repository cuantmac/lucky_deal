import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  // DeviceEventEmitter,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {PRIMARY} from '../../constants/colors';
import {useSelector, useDispatch} from 'react-redux';
import {
  TouchableNativeFeedback,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';
import {px} from '../../constants/constants';

export interface BottomTabItem {
  name: String;
  icon: any;
  badge: any | undefined;
  component: JSX.Element;
}

export interface BottomTabProps {
  onTabDoublePress?: (index: number) => void;
  onTabPress: (item: BottomTabItem, index: number) => void | undefined;
  tabs: Array<BottomTabItem>;
}

export default function BottomTab(props: BottomTabProps): JSX.Element {
  const {tabIndex} = useSelector((state: any) => state.memory);
  const dispatch = useDispatch();
  const [activeComponent, setActiveComponent] = useState<JSX.Element>();

  useEffect(() => {
    let _component = props.tabs[tabIndex].component;
    if (_component != null) {
      setActiveComponent(_component);
    }
  }, [activeComponent, props.tabs, tabIndex]);

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <View style={StyleSheet.absoluteFill}>{activeComponent}</View>
      </View>
      <SafeAreaView
        style={{
          backgroundColor: 'white',
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
          justifyContent: 'center',
        }}>
        <View
          style={{
            height: 48,
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
          }}>
          {props.tabs.map((item, index) => (
            <TouchableNativeFeedback
              containerStyle={{flex: 1}}
              key={index}
              onPress={() => {
                if (tabIndex === index) {
                  return;
                }
                dispatch({type: 'setTabIndex', payload: index});
                // settabIndex(index);
                props.onTabPress && props.onTabPress(item, index);
              }}>
              <TapGestureHandler
                onHandlerStateChange={(event) => {
                  if (
                    tabIndex === index &&
                    event.nativeEvent.state === State.ACTIVE
                  ) {
                    props.onTabDoublePress && props.onTabDoublePress(tabIndex);
                  }
                }}
                numberOfTaps={2}>
                <View
                  style={{
                    height: 48,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // flex: 1,
                  }}>
                  <View>
                    <Image
                      resizeMode={'contain'}
                      style={{
                        width: 25,
                        height: 25,
                        tintColor: tabIndex === index ? PRIMARY : '#000',
                      }}
                      source={item.icon}
                    />
                    {React.isValidElement(item.badge) && item.badge}
                    {/* {React.isValidElement(item.tip) && item.tip} */}
                  </View>
                  <Text
                    style={{
                      fontSize: 30 * px,
                      textAlign: 'center',
                      color: tabIndex === index ? PRIMARY : '#9A9A9A',
                    }}>
                    {item.name}
                  </Text>
                </View>
              </TapGestureHandler>
            </TouchableNativeFeedback>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}
