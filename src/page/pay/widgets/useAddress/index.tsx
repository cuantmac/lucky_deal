import {AddressItem} from '@luckydeal/api-common';
import {useFocusEffect} from '@react-navigation/core';
import {CommonApi} from '@src/apis';
import {ReduxRootState} from '@src/redux';
import {useLoading} from '@src/utils/hooks';
import {useCallback, useState} from 'react';
import {useSelector, shallowEqual} from 'react-redux';

export const useAddress = (addressId?: number) => {
  const {
    persistAuth: auth,
    persistSelectedAddress: selectedAddress,
  } = useSelector(
    ({persist: {persistAuth, persistSelectedAddress}}: ReduxRootState) => ({
      persistSelectedAddress,
      persistAuth,
    }),
    shallowEqual,
  );

  const [loading, withLoading] = useLoading();
  const [address, setAddress] = useState<AddressItem>();
  useFocusEffect(
    useCallback(() => {
      if (!auth?.token) {
        return;
      }
      let ad: AddressItem | undefined;
      withLoading(CommonApi.userListAddressUsingPOST())
        .then((res) => {
          [addressId, selectedAddress].forEach((id) => {
            const item = res.data.list.find(
              ({address_id}) => address_id === id,
            );
            if (!ad && item) {
              ad = item;
            }
          });

          if (!ad) {
            ad = res.data.list.find(({preferred}) => preferred === 1);
          }

          if (!ad) {
            [ad] = res.data.list;
          }
          setAddress(ad);
        })
        .catch(() => {
          setAddress(undefined);
        });
    }, [addressId, auth, selectedAddress, setAddress, withLoading]),
  );

  return [loading, address] as const;
};
