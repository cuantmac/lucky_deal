import React from 'react';
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useShallowEqualSelector} from '../../utils/hooks';
import {Timer, TimerFormate} from '../common/Timer';
import AlertDialog from '../dialog/AlertDialog';
import {px} from '../../constants/constants';
import AppModule from '../../../AppModule';
import {reportData} from '../../constants/reportData';

export const HeaderLeftBack = ({
  navigation,
}: {
  activeCategoryId: number;
  navigation: any;
}) => {
  return (
    <TouchableOpacity
      style={{
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={() => navigation.goBack()}>
      <Image
        resizeMode={'contain'}
        style={{
          width: 16,
          height: 16,
          tintColor: 'black',
        }}
        source={require('../../assets/back.png')}
      />
    </TouchableOpacity>
  );
};

export const ShowTipDialog = ({navigation}: {navigation: any}) => {
  const {oneDollerCategory, token} = useShallowEqualSelector(
    (state: any) => state.deprecatedPersist,
  );
  const {only_one_category} = oneDollerCategory;
  const {new_user_expire_time} = only_one_category;
  // setShowTip(true);
  // AlertDialog.showLayout(
  return (
    <Timer targetTime={new_user_expire_time}>
      {(time) => {
        return (
          <View
            style={{
              width: 714 * px,
              // height: 716 * px,
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
              borderRadius: 20 * px,
              position: 'relative',
              backgroundColor: '#fff',
              paddingTop: 40 * px,
            }}>
            {!token ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 50 * px,
                    color: '#000',
                    textAlign: 'center',
                  }}>
                  ONLY
                </Text>
                <Text
                  style={{
                    fontSize: 50 * px,
                    color: '#EC3A30',
                    textAlign: 'center',
                    marginHorizontal: 20 * px,
                  }}>
                  24 Hours
                </Text>
                <Text
                  style={{
                    fontSize: 50 * px,
                    color: '#000',
                    textAlign: 'center',
                  }}>
                  LEFT
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 50 * px,
                    color: '#000',
                    lineHeight: 54 * px,
                  }}>
                  ONLY
                </Text>
                <TimerFormate
                  time={time}
                  styles={{
                    width: 60 * px,
                    height: 60 * px,
                    backgroundColor: '#000',
                    borderRadius: 10 * px,
                    fontSize: 42 * px,
                    textAlign: 'center',
                    color: '#fff',
                    // fontWeight: 'bold',
                  }}
                  color={'#000'}
                />
                <Text
                  style={{
                    fontSize: 50 * px,
                    color: '#000',
                    lineHeight: 54 * px,
                  }}>
                  LEFT
                </Text>
              </View>
            )}
            <Text
              style={{
                color: '#000',
                fontSize: 40 * px,
                marginVertical: 20 * px,
                textAlign: 'center',
              }}>
              HURRY UP!!!
            </Text>
            <ImageBackground
              source={require('../../assets/i_coupon_bg_s.png')}
              style={{
                width: 633 * px,
                height: 139 * px,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              resizeMode={'contain'}>
              <Text style={{fontSize: 50 * px, color: '#fff'}}>
                Only $1 Your First Order
              </Text>
            </ImageBackground>

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 50 * px,
              }}>
              <TouchableOpacity
                style={{
                  marginBottom: 20 * px,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 500 * px,
                  height: 80 * px,
                  borderRadius: 10 * px,
                  borderColor: '#000',
                  borderWidth: 2 * px,
                  borderStyle: 'solid',
                }}
                onPress={() => {
                  AppModule.reportClick(reportData.home, '382');
                  AlertDialog.hide();
                  navigation.goBack();
                  // pay(1);
                }}>
                <Text
                  style={{
                    fontSize: 50 * px,

                    alignSelf: 'center',
                    lineHeight: 80 * px,
                  }}>
                  Quit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  marginBottom: 35 * px,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 500 * px,
                  height: 80 * px,
                  borderRadius: 10 * px,
                  backgroundColor: '#3C7DE3',
                }}
                onPress={() => {
                  AppModule.reportClick(reportData.home, '383');
                  AlertDialog.hide();
                  // pay(2);
                }}>
                <Text
                  style={{
                    fontSize: 50 * px,
                    color: '#fff',
                    alignSelf: 'center',
                    lineHeight: 80 * px,
                  }}>
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                padding: 20 * px,
                position: 'absolute',
                right: 10 * px,
                top: 10 * px,
              }}
              onPress={() => {
                AlertDialog.hide();
              }}>
              <Image
                source={require('../../assets/close.png')}
                style={{width: 30 * px, height: 30 * px}}
              />
            </TouchableOpacity>
          </View>
        );
      }}
    </Timer>
  );
  // );
  // eslint-disable-next-line react-hooks/exhaustive-deps
};
