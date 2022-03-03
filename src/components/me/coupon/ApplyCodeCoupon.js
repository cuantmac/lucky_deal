import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {px, SCREEN_WIDTH} from '../../../constants/constants';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useIsFocused} from '@react-navigation/core';
import Api from '../../../Api';
import Utils from '../../../utils/Utils';
import {dialogs} from '../../../utils/refs';
import ListenPayBackPress from '../../common/ListenPayBackPress';
import AppModule from '../../../../AppModule';
function ApplyCodeCoupon({navigation, route}) {
  const [coupon, setCoupon] = useState('');
  const applyTextInputRef = useRef();
  const focus = useIsFocused();
  const [success, setSuccess] = useState(false);
  const [submit, setSubmitted] = useState(false);
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
        title: 'Apply Coupon',
      },
      [navigation],
    );
  });
  useEffect(() => {
    if (focus) {
      AppModule.reportShow('22', '278');
      setTimeout(() => {
        applyTextInputRef.current?.focus();
      }, 300);
    }
  }, [focus]);

  const submitCode = () => {
    AppModule.reportClick('22', '279');
    if (coupon?.length === 0) {
      Utils.toastFun('Please input coupon code first.');
      return;
    }
    setSubmitted(true);
    Api.submitCodeCoupon(coupon).then((res) => {
      setSubmitted(false);
      if (res.code !== 0) {
        Utils.toastFun(res.error);
        return;
      }
      let couponList = res.data?.list || [];
      setSuccess(true);
      AppModule.reportShow('22', '280');
      dialogs.congratulationsDialog.current?.show({
        content: 'Coupon applied successfully.',
        couponList: couponList,
        callBack: () => {
          AppModule.reportClick('22', '282');
          DeviceEventEmitter.emit('APPLY_CODE_COUPON_BACK');
          navigation.goBack();
        },
      });
    });
  };
  return (
    <View style={{flex: 1, backgroundColor: '#F2F2F2'}}>
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor={'transparent'}
      />
      <ListenPayBackPress
        onGoBack={() => {
          if (success) {
            DeviceEventEmitter.emit('APPLY_CODE_COUPON_BACK');
          }
          navigation.goBack();
        }}
        interrupt={true}
      />
      <View
        style={{
          height: 520 * px,
          margin: 30 * px,
          backgroundColor: '#fff',
          borderRadius: 20 * px,
        }}>
        <View
          style={{
            borderColor: '#5A5A5A',
            borderWidth: 2 * px,
            height: 100 * px,
            borderRadius: 10 * px,
            marginLeft: 86 * px,
            marginRight: 86 * px,
            marginTop: 90 * px,
          }}>
          <TextInput
            ref={(ref) => {
              applyTextInputRef.current = ref;
            }}
            placeholder={'Apply Coupon'}
            style={{marginLeft: 30 * px, flex: 1}}
            onChangeText={(value) => {
              setCoupon(value);
            }}
            value={coupon}
          />
        </View>
        <TouchableOpacity
          onPress={submitCode}
          style={{
            backgroundColor: '#EC3A30',
            borderRadius: 10 * px,
            width: 400 * px,
            height: 100 * px,
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 90 * px,
            justifyContent: 'center',
          }}>
          {submit ? (
            <ActivityIndicator color={'#fff'} style={{flex: 1}} />
          ) : (
            <Text
              style={{color: '#fff', fontSize: 40 * px, alignSelf: 'center'}}>
              Apply
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ApplyCodeCoupon;
