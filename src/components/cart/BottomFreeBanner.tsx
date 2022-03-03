import React, {FC, useCallback, useEffect, useState} from 'react';
import {DeviceEventEmitter} from 'react-native';
import Api from '../../Api';
import {useShallowEqualSelector} from '../../utils/hooks';
import {
  BottomAction,
  BottomActionText,
} from '../../widgets/shopCart/bottomAction/BottomAction';
import {UserCartListResponse} from '@luckydeal/api-common';
import Utils from '../../utils/Utils';

export enum ButtonAction {
  NONE = '',
  BACKCART = 'BACK TO \nBAG',
  GOCART = 'GO TO \nBAG',
  CHECKOUT = 'CHECKOUT',
  ADDITEM = 'ADD ITEMS',
}
interface BannerProps {
  styles?: any;
  buttonStyle?: any;
  buttonOnPress?: () => void;
}
const BottomFreeBanner: FC<BannerProps> = ({buttonOnPress}) => {
  const {token} = useShallowEqualSelector(
    (state: any) => state.deprecatedPersist,
  );
  const [cartData, setCartData] = useState<UserCartListResponse>();
  const [show, setShown] = useState<Boolean>();
  const fetchCartList = useCallback(() => {
    if (!token) {
      return;
    }
    Api.cartList().then((res) => {
      if (res.code === 0) {
        setShown(true);
        setCartData(res.data);
      }
    });
  }, [token]);

  useEffect(() => {
    fetchCartList();
  }, [fetchCartList]);

  useEffect(() => {
    let sub = DeviceEventEmitter.addListener('updateCartList', () => {
      fetchCartList();
    });
    return () => {
      sub.remove();
    };
  }, [fetchCartList]);

  return show ? (
    <BottomAction
      onPress={buttonOnPress}
      btnText="Go to Bag"
      totalPrice={cartData?.total_price}
      discount={cartData?.product_discount?.discount_price}>
      {cartData?.free_shipping_fee.status === 1 && (
        <BottomActionText>
          {cartData.free_shipping_fee.is_free
            ? 'Free shipping'
            : `${Utils.convertAmountUS(
                cartData.free_shipping_fee.free_need_amt || 0,
              )} MORE to enjoy Free shipping`}
        </BottomActionText>
      )}
    </BottomAction>
  ) : null;
};

export default BottomFreeBanner;
