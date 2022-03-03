import {CartItem, UserCartListResponse} from '@luckydeal/api-common';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Api from '../../../Api';
import {CART_ITEM_ACTION_ENUM} from '../../../constants/enum';
import {globalModalQueue} from '../../../utils/modalQueue';
import {
  SoldoutDialog,
  SoldoutDialogRef,
} from '../../dialogs/soldoutDialog/SoldoutDialog';

export interface SoldoutActionProps {
  onDeleteSuccess: () => void;
}

export interface SoldoutActionRef {
  check: () => Promise<UserCartListResponse>;
}

/**
 * @deprecated 待删除
 */
export const SoldoutAction = forwardRef<SoldoutActionRef, SoldoutActionProps>(
  ({onDeleteSuccess}, ref) => {
    const [soldoutData, setSoldoutData] = useState<CartItem[]>();
    const soldoutDialogRef = useRef<SoldoutDialogRef>(null);

    const handleCheck = useCallback(async () => {
      const {data: cartListData} = await Api.cartList();
      const soldoutList = cartListData.list.filter((item) => {
        return item.status !== 0;
      });
      if (soldoutList.length) {
        setSoldoutData(soldoutList);
        globalModalQueue.add(soldoutDialogRef);
        throw new Error('sold out');
      }
      return cartListData;
    }, [setSoldoutData]);

    const handleDelete = useCallback(() => {
      Api.cartEdit(0, CART_ITEM_ACTION_ENUM.REMOVE_ALL_EXPIRE, 0)
        .then(() => {
          onDeleteSuccess();
        })
        .finally(() => {
          soldoutDialogRef.current?.hide();
        });
    }, [onDeleteSuccess]);

    useImperativeHandle(
      ref,
      () => {
        return {
          check: handleCheck,
        };
      },
      [handleCheck],
    );
    return (
      <SoldoutDialog
        ref={soldoutDialogRef}
        data={soldoutData}
        onDelete={handleDelete}
      />
    );
  },
);
