import React, {FC} from 'react';
import {View, Text} from 'react-native';
import {PromoCodeInfoItem} from '@luckydeal/api-common/lib/api';
import {convertAmountUS, createStyleSheet} from '@src/helper/helper';

interface ConditonTypeProp {
  use_condition: number;
  use_condition_type: number;
}

const ConditonType: FC<ConditonTypeProp> = ({
  use_condition,
  use_condition_type,
}) => {
  return (
    <>
      {use_condition_type === 1 && (
        <Text style={CouponContentStyles.middle}>orders US $0.00</Text>
      )}
      {use_condition_type === 2 && (
        <Text style={CouponContentStyles.middle}>
          order {convertAmountUS(use_condition)}+
        </Text>
      )}
      {use_condition_type === 3 && (
        <Text style={CouponContentStyles.middle}>
          order at least {use_condition} quantities
        </Text>
      )}
    </>
  );
};

interface couponContentProp {
  data: PromoCodeInfoItem;
}

export const CouponContent: FC<couponContentProp> = ({data}) => {
  const isDiscount = () => {
    return data.coupon_type === 1;
  };
  return (
    <View style={CouponContentStyles.wrap}>
      <Text style={CouponContentStyles.left}>
        {isDiscount() ? data.amount + '%' : convertAmountUS(data.amount)} OFF
      </Text>
      <View style={CouponContentStyles.middle_wrap}>
        <ConditonType
          use_condition={data.use_condition}
          use_condition_type={data.use_condition_type}
        />
        {isDiscount() ? (
          <Text style={CouponContentStyles.middle}>
            (up to {convertAmountUS(data.max_discount)})
          </Text>
        ) : null}
      </View>
      <View style={CouponContentStyles.code_wrap}>
        <Text style={CouponContentStyles.code_left_text}>USE CODE: </Text>
        <Text style={CouponContentStyles.code_right_text}>
          {data.promo_code}
        </Text>
      </View>
    </View>
  );
};

const CouponContentStyles = createStyleSheet({
  wrap: {
    backgroundColor: '#FEB48A',
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  left: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
  },
  middle_wrap: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  middle: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  code_wrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    width: 92,
    height: 16,
  },
  code_left_text: {
    fontSize: 8,
    fontWeight: '400',
    color: '#222222',
  },
  code_right_text: {
    fontSize: 8,
    fontWeight: '400',
    color: '#D0011A',
  },
});
