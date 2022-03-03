import React, {forwardRef, Fragment, memo, useImperativeHandle} from 'react';
import {OrderProduct} from '../usePayData';
import {useActionSheet} from '@src/widgets/modal/modal';
import {ActionSheetScrollContent} from '@src/widgets/modal/modal/widgets';
import {PayProductItem} from '../payProductItem';
import {Space} from '@src/widgets/space';

interface ProductListDialogProps {
  productList: OrderProduct[];
}

export type ProductListDialogRef = {
  show: () => void;
  hide: () => void;
  isShowing: () => boolean;
};

export const ProductListDialog = memo(
  forwardRef<ProductListDialogRef, ProductListDialogProps>(
    ({productList}, ref) => {
      const [
        ActionSheetModal,
        setActionSheetModalVisible,
        visible,
      ] = useActionSheet();

      useImperativeHandle(
        ref,
        () => ({
          show: () => {
            setActionSheetModalVisible(true);
          },
          hide: () => {
            setActionSheetModalVisible(false);
          },
          isShowing: () => {
            return visible;
          },
        }),
        [setActionSheetModalVisible, visible],
      );

      return (
        <ActionSheetModal maskClosable title={'Shopping Bag'}>
          <ActionSheetScrollContent>
            {productList.map((product, pIndex) => {
              return (
                <Fragment key={pIndex}>
                  <PayProductItem disableEdit={true} data={product} />
                  {pIndex !== productList.length - 1 && (
                    <Space
                      marginLeft={-16}
                      marginRight={-16}
                      height={9}
                      backgroundColor="#f6f6f6"
                    />
                  )}
                </Fragment>
              );
            })}
          </ActionSheetScrollContent>
        </ActionSheetModal>
      );
    },
  ),
);
