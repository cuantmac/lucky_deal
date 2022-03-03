import {UserAvailableCouponsResponse} from '@luckydeal/api-common';
import {CommonApi} from '@src/apis';
import {ReduxRootState} from '@src/redux';
import React, {
  FC,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
  memo,
} from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import {AVILIABLE_COUPON_FROM_ENUM} from '../../../constants/enum';
import {CouponDialog, CouponDialogRef} from './CouponDialog';

interface CouponDialogControlProps {
  onRefresh?: () => void;
  title: string;
  productIds: number[];
  from: AVILIABLE_COUPON_FROM_ENUM;
  children?: (
    data: UserAvailableCouponsResponse | undefined,
    open: () => void,
  ) => ReactNode;
}

export const CouponDialogControl: FC<CouponDialogControlProps> = memo(
  ({title, productIds, from, children, onRefresh}) => {
    const {token} = useSelector(
      (state: ReduxRootState) => ({
        token: state.persist.persistAuth.token,
      }),
      shallowEqual,
    );
    const [data, setData] = useState<UserAvailableCouponsResponse>();
    const couponRef = useRef<CouponDialogRef>(null);

    const handleOpen = useCallback(() => {
      couponRef.current?.show();
    }, []);

    const getAvailableCoupons = useCallback(
      async (bool?: boolean) => {
        if (productIds && productIds.length) {
          const res = await CommonApi.userAvailableCouponsUsingPOST({
            product_id: productIds,
            from,
            token,
          });
          setData(res.data);
        } else {
          setData(undefined);
        }
        bool && onRefresh && onRefresh();
      },
      [from, onRefresh, productIds, token],
    );

    useEffect(() => {
      getAvailableCoupons();
    }, [getAvailableCoupons]);

    const hasValidCoupon = !!(
      data?.coupon_info?.length ||
      (data?.promo_code_info && data.promo_code_info.id !== 0)
    );

    if (!hasValidCoupon) {
      return null;
    }

    return (
      <>
        {children && children(data, handleOpen)}
        <CouponDialog
          data={data}
          ref={couponRef}
          isCart={from === AVILIABLE_COUPON_FROM_ENUM.SHOP_CART}
          title={title}
          onCouponClick={() => getAvailableCoupons(true)}
        />
      </>
    );
  },
);
