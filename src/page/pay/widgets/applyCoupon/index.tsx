import React, {FC, memo, useRef, useCallback} from 'react';
import {
  ApplyCouponDialog,
  ApplyCouponDialogProps,
  ApplyCouponDialogRef,
} from '@src/widgets/dialogs/applyCouponDialog/ApplyCouponDialog';
import {convertAmountUS, createStyleSheet} from '@src/helper/helper';
import {PayInfoItem} from '../payInfoItem';
import {PayModuleContainer} from '../payModuleContainer';

interface ApplyCouponProps extends ApplyCouponDialogProps {}

export const ApplyCoupon: FC<ApplyCouponProps> = memo((props) => {
  const {coupon} = props;
  const applyCouponDialogRef = useRef<ApplyCouponDialogRef>(null);
  const handleOnPress = useCallback(() => {
    applyCouponDialogRef.current?.show();
  }, []);

  return (
    <>
      <PayModuleContainer>
        <PayInfoItem
          onPress={handleOnPress}
          title={'Apply Coupon'}
          text={coupon ? convertAmountUS(coupon.remission_fee, true) : ''}
          titleStyle={ApplyCouponStyles.titleText}
          textStyle={ApplyCouponStyles.textStyle}
          containerStyle={ApplyCouponStyles.container}
          showPressIcon={true}
        />
      </PayModuleContainer>
      <ApplyCouponDialog ref={applyCouponDialogRef} {...props} />
    </>
  );
});

const ApplyCouponStyles = createStyleSheet({
  container: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },
  textStyle: {
    fontSize: 12,
    color: '#D0011A',
  },
});
