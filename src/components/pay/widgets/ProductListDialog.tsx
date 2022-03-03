import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import {Modal} from 'react-native';
import {px} from '../../../constants/constants';
import {ModalRef} from '../../../utils/modalQueue';
import Utils from '../../../utils/Utils';
import {
  ActionSheetContainer,
  ActionSheetContent,
  ActionSheetTitle,
  ActionSheetScrollContent,
} from '../../../widgets/dialogs/widgets/Widgets';
import {OrderProduct} from '../Pay';
import {PayInfoHeader} from '../PayComponent';

interface ProductListDialogProps {
  productList: OrderProduct[];
}

export type ProductListDialogRef = ModalRef<void>;

export const ProductListDialog = memo(
  forwardRef<ProductListDialogRef, ProductListDialogProps>(
    ({productList}, ref) => {
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
            <ActionSheetContent>
              <ActionSheetTitle
                title={'Shipping Bag'}
                onPress={handleRequestClose}
              />
              <ActionSheetScrollContent>
                {productList.map((product, pIndex) => {
                  return (
                    <PayInfoHeader
                      containerStyle={{marginBottom: 20 * px}}
                      key={pIndex}
                      isVip={false}
                      img={Utils.getImageUri(product.productImage) as any}
                      title={product.title}
                      sku={product.skuInfo}
                      price={Utils.convertAmount(product.orderPrice)}
                      priceBefore={Utils.convertAmount(product.productPrice)}
                      editCount={false}
                      max={product.maxQty}
                      min={product.minQty}
                      onCountChange={() => {}}
                      count={product.qty}
                      hideBeforePrice
                      showSaved={false}
                    />
                  );
                })}
              </ActionSheetScrollContent>
            </ActionSheetContent>
          </ActionSheetContainer>
        </Modal>
      );
    },
  ),
);
