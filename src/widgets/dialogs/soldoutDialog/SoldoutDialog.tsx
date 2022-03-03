import {CartItem as CartItemType} from '@luckydeal/api-common';
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import {Modal, Text} from 'react-native';
import CartItem from '../../../components/cart/CartItem';
import {px} from '../../../constants/constants';
import {ModalRef} from '../../../utils/modalQueue';
import {Button} from '../../button/Button';
import {
  ActionSheetContainer,
  ActionSheetContent,
  ActionSheetScrollContent,
  ActionSheetTitle,
} from '../widgets/Widgets';

export interface SoldoutDialogProps {
  onDelete: () => void;
  data?: CartItemType[];
}
export type SoldoutDialogRef = ModalRef<void>;

/**
 * @deprecated 待删除
 */
export const SoldoutDialog = memo(
  forwardRef<SoldoutDialogRef, SoldoutDialogProps>(({onDelete, data}, ref) => {
    const [show, setShow] = useState(false);
    useImperativeHandle(
      ref,
      () => ({
        show: () => {
          setShow(true);
        },
        hide: () => {
          setShow(false);
        },
        isShowing: () => {
          return show;
        },
      }),
      [show],
    );

    const handleRequestClose = useCallback(() => {
      setShow(false);
    }, []);

    if (!show) {
      return null;
    }

    return (
      <Modal
        transparent
        animationType="fade"
        visible={show}
        onRequestClose={handleRequestClose}>
        <ActionSheetContainer>
          <ActionSheetContent style={{height: 1300 * px, paddingHorizontal: 0}}>
            <ActionSheetTitle
              style={{marginHorizontal: 20 * px}}
              title={'Out of stock tips'}
              onPress={handleRequestClose}
            />
            <Text
              style={{
                paddingHorizontal: 67 * px,
                color: '#888686',
                fontSize: 30 * px,
                textAlign: 'center',
                lineHeight: 40 * px,
                paddingBottom: 30 * px,
              }}>
              The items in your shopping bag are unavailable now, please remove
              them to continue
            </Text>
            <ActionSheetScrollContent>
              {data?.map((item, index) => {
                return (
                  <CartItem
                    soldout
                    data={item}
                    index={index}
                    key={item.sku_no || item.product_id + index}
                  />
                );
              })}
            </ActionSheetScrollContent>
            <Button
              style={{
                marginVertical: 50 * px,
                marginHorizontal: 20 * px,
                width: 'auto',
                borderRadius: 0,
                height: 120 * px,
              }}
              onPress={onDelete}
              title={'DELETE'}
            />
          </ActionSheetContent>
        </ActionSheetContainer>
      </Modal>
    );
  }),
);
