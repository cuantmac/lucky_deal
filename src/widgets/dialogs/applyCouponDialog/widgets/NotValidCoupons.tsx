import {CouponDetail} from '@luckydeal/api-common';
import React, {FC} from 'react';
import {px} from '@src/constants/constants';
import {StandardCouponCard} from '@src/widgets/coupons/Coupons';
import {ActionSheetScrollContent} from '@src/widgets/modal/modal/widgets';
import {CouponEmpty} from '@src/widgets/coupons/couponEmpty';

interface NotValidCouponsProps {
  notAvalidCouponList?: CouponDetail[];
}

export const NotValidCoupons: FC<NotValidCouponsProps> = ({
  notAvalidCouponList = [],
}) => {
  return (
    <ActionSheetScrollContent
      style={{
        flex: 1,
        paddingHorizontal: 28 * px,
      }}>
      {notAvalidCouponList.length ? (
        notAvalidCouponList.map((val, index) => {
          return <StandardCouponCard key={index} disabled data={val} />;
        })
      ) : (
        <CouponEmpty />
      )}
    </ActionSheetScrollContent>
  );
};
