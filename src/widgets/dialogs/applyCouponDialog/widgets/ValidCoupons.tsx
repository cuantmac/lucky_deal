import {CouponDetail} from '@luckydeal/api-common';
import {
  applyCodeCheck,
  UsePayDataParams,
} from '@src/page/pay/widgets/usePayData';
import React, {FC, Fragment, useCallback, useEffect} from 'react';
import {useState} from 'react';
import {View, Text, Image, TouchableOpacity, TextInput} from 'react-native';
import {px} from '@src/constants/constants';
import {
  StandardCouponCard,
  StandardCouponCardSelectAction,
} from '@src/widgets/coupons/Coupons';
import {ActionSheetScrollContent} from '@src/widgets/modal/modal/widgets';
import {Message} from '@src/helper/message';
import {
  convertAmountUS,
  createStyleSheet,
  styleAdapter,
} from '@src/helper/helper';
import {BUTTON_TYPE_ENUM, StandardButton} from '@src/widgets/button';
import {CouponEmpty} from '@src/widgets/coupons/couponEmpty';

type ApplyCodeCheckParams = UsePayDataParams;

export interface ValidCouponsProps {
  coupon?: CouponDetail;
  onApplyCoupon?: (coupon: CouponDetail) => void;
  onApplyCode?: (code: string) => void;
  onRemoveCoupon?: () => void;
  avalidCouponList?: CouponDetail[];
  params: Omit<ApplyCodeCheckParams, 'couponCode'>;
  onRefresh?: () => void;
}

export const ValidCoupons: FC<ValidCouponsProps> = ({
  onApplyCoupon,
  onApplyCode,
  onRemoveCoupon,
  avalidCouponList = [],
  coupon,
  params,
  onRefresh,
}) => {
  const handleOnApplyClick = useCallback(
    async (val: string | CouponDetail) => {
      if (!val) {
        return;
      }
      if (typeof val === 'object') {
        Message.loading();
        try {
          await applyCodeCheck({...params, coupon: val});
          if (val) {
            onApplyCoupon && onApplyCoupon(val);
          }
          Message.hide();
        } catch (error) {
          await Message.toast(error);
          onRefresh && onRefresh();
        }
        return;
      }
      Message.loading();
      try {
        await applyCodeCheck({...params, couponCode: val});
        if (val) {
          onApplyCode && onApplyCode(val);
        }
        Message.hide();
      } catch (error) {
        await Message.toast(error);
        onRefresh && onRefresh();
      }
    },
    [onApplyCode, onApplyCoupon, onRefresh, params],
  );

  return (
    <>
      <CouponUseTip />
      <CouponApplyAction
        onRemoveClick={onRemoveCoupon}
        onApplyClick={handleOnApplyClick}
        value={coupon?.promo_code}
      />
      <Text style={ValidCouponsStyles.couponText}>My Coupons</Text>
      <ActionSheetScrollContent style={ValidCouponsStyles.scrollContent}>
        {avalidCouponList.length ? (
          avalidCouponList.map((val) => {
            return (
              <Fragment key={val.coupon_id}>
                <StandardCouponCard
                  data={val}
                  onPress={() =>
                    coupon?.coupon_id === val.coupon_id
                      ? onRemoveCoupon && onRemoveCoupon()
                      : handleOnApplyClick && handleOnApplyClick(val)
                  }>
                  <StandardCouponCardSelectAction
                    selected={coupon?.coupon_id === val.coupon_id}
                  />
                </StandardCouponCard>
                <Text style={ValidCouponsStyles.couponDesc}>
                  Coupon requirements met,expect to save{' '}
                  <Text
                    style={{
                      color: '#D0011A',
                    }}>
                    {convertAmountUS(val.remission_fee)}
                  </Text>
                </Text>
              </Fragment>
            );
          })
        ) : (
          <CouponEmpty />
        )}
      </ActionSheetScrollContent>
    </>
  );
};

const ValidCouponsStyles = createStyleSheet({
  couponText: {
    marginTop: 12,
    fontSize: 13,
    paddingHorizontal: 12,
    color: '#757575',
  },
  couponDesc: {
    marginTop: 4,
    fontSize: 12,
    color: '#222',
  },
  scrollContent: {
    paddingHorizontal: 12,
    flex: 1,
  },
});

interface CouponApplyActionProps {
  value?: string;
  onApplyClick?: (val: string) => void;
  onRemoveClick?: () => void;
}

const CouponApplyAction: FC<CouponApplyActionProps> = ({
  value = '',
  onApplyClick,
  onRemoveClick,
}) => {
  const [text, setText] = useState<string>('');
  useEffect(() => {
    setText(value);
  }, [setText, value]);

  return (
    <View style={CouponApplyActionStyles.container}>
      <TextInput
        value={text}
        onChangeText={setText}
        editable={!value}
        style={CouponApplyActionStyles.input}
      />
      {value ? (
        <StandardButton
          wrapStyle={CouponApplyActionStyles.button}
          title={'REMOVE'}
          onPress={onRemoveClick}
        />
      ) : (
        <StandardButton
          type={BUTTON_TYPE_ENUM.HIGH_LIGHT}
          wrapStyle={CouponApplyActionStyles.button}
          title={'APPLY'}
          onPress={() => onApplyClick && onApplyClick(text)}
        />
      )}
    </View>
  );
};

const CouponApplyActionStyles = createStyleSheet({
  container: {
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 12,
  },
  input: {
    width: 270,
    height: 32,
    backgroundColor: '#F6F6F6',
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#757575',
  },
  button: {
    height: 30,
    width: 70,
  },
});

const CouponUseTip: FC = () => {
  const [close, setClose] = useState(false);
  const handleClosePress = useCallback(() => {
    setClose(true);
  }, []);

  if (close) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styleAdapter({
        marginTop: 9,
        height: 32,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        backgroundColor: '#FEB48A',
      })}
      activeOpacity={0.8}
      onPress={handleClosePress}>
      <Image
        style={{
          width: 43 * px,
          height: 37 * px,
        }}
        source={require('../../../../assets/speak_icon.png')}
      />
      <Text
        style={{
          color: 'white',
          fontSize: 30 * px,
          marginLeft: 25 * px,
        }}>
        Only one coupon can be used per order.
      </Text>
      <Image
        style={{
          marginLeft: 'auto',
          width: 22 * px,
          height: 22 * px,
          tintColor: 'white',
        }}
        source={require('../../../../assets/close.png')}
      />
    </TouchableOpacity>
  );
};
