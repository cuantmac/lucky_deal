import React, {FC, memo} from 'react';
import {useCallback} from 'react';
import {useRef} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {px} from '../../../constants/constants';
import {globalModalQueue} from '../../../utils/modalQueue';
import Utils from '../../../utils/Utils';
import {
  ApplyCouponDialog,
  ApplyCouponDialogProps,
  ApplyCouponDialogRef,
} from '../../../widgets/dialogs/applyCouponDialog/ApplyCouponDialog';
import {PayInfoListItem} from '../PayComponent';

interface ApplyCouponProps extends ApplyCouponDialogProps {}

export const ApplyCoupon: FC<ApplyCouponProps> = memo((props) => {
  const {coupon} = props;
  const applyCouponDialogRef = useRef<ApplyCouponDialogRef>(null);
  const handleOnPress = useCallback(() => {
    globalModalQueue.add(applyCouponDialogRef);
  }, []);

  return (
    <>
      <View
        style={{
          marginTop: 30 * px,
          backgroundColor: '#fff',
          paddingVertical: 10 * px,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleOnPress}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <PayInfoListItem
            title={'Apply Coupons'}
            text={
              coupon ? Utils.convertAmountUS(coupon.remission_fee, true) : ''
            }
            titleStyle={{
              color: '#000',
              fontSize: 35 * px,
              fontWeight: 'bold',
            }}
            textStyle={{
              color: '#E00404',
            }}
            containerStyle={{
              height: 120 * px,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 0,
            }}
            showPressIcon={true}
          />
        </TouchableOpacity>
      </View>
      <ApplyCouponDialog ref={applyCouponDialogRef} {...props} />
    </>
  );
});
