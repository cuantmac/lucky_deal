import {
  CartItem,
  LikeProductMoreRequest,
  OfferProductDetailResponse,
} from '@luckydeal/api-common';
import {CommonApi} from '@src/apis';
import {PRODUCT_TYPE_ENUM} from '@src/components/pay/utils';
import {createStyleSheet, isOffers} from '@src/helper/helper';
import {Message} from '@src/helper/message';
import {convertData} from '@src/page/pay/widgets/payProductItem';
import {OrderProduct} from '@src/page/pay/widgets/usePayData';
import {
  ShopItemContent,
  ShopItemContentExtend,
} from '@src/page/shop/widgets/shopItemContent';
import {StandardButton, BUTTON_TYPE_ENUM} from '@src/widgets/button';
import {useActionSheet} from '@src/widgets/modal/modal';
import {
  ActionSheetScrollContent,
  ACTION_SHEET_CONTENT_PADDING_HORIZONTAL,
} from '@src/widgets/modal/modal/widgets';
import {queryStock} from '@src/widgets/productDetail/skuSelect/skuSelectModal';
import {Space} from '@src/widgets/space';
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  FC,
  Fragment,
  useCallback,
  useRef,
} from 'react';
import {Text, View} from 'react-native';

export type CheckProductDialogRef = {
  checkCarts: (cartIds: number[], couponId?: number) => Promise<void>;
  checkProduct: (params?: OrderProduct, couponId?: number) => Promise<void>;
};

export interface CheckProductDialogProps {
  onPriceExpire: () => void;
  onCouponExpire: (couponId: number) => void;
  onCartDeleteSuccess?: (ids: number[]) => void;
  onProductDeleteSuccess?: () => void;
  onRefresh?: () => void;
}

export const CheckProductDialog = forwardRef<
  CheckProductDialogRef,
  CheckProductDialogProps
>(
  (
    {
      onPriceExpire,
      onCouponExpire,
      onCartDeleteSuccess,
      onProductDeleteSuccess,
      onRefresh,
    },
    ref,
  ) => {
    const [ActionModal, setActionModalVisible] = useActionSheet();
    const [expireProduct, setExpireProduct] = useState<
      ShopItemContentExtend[]
    >();
    const cartIdsRef = useRef<number[]>([]);

    const fetchDetailData = useCallback(
      (productId: number, productType: number) => {
        if (!isOffers(productType)) {
          return CommonApi.luckyBagDetailUsingPOST({
            bag_id: productId,
          }).then((res) => {
            return res;
          });
        }
        return CommonApi.luckyOfferDetailUsingPOST({
          product_id: productId,
        }).then((res) => {
          return res;
        });
      },
      [],
    );
    useImperativeHandle(
      ref,
      () => ({
        checkCarts: (cartIds, couponId) => {
          cartIdsRef.current = cartIds;
          if (!cartIds.length) {
            return Promise.reject();
          }
          Message.loading();
          return new Promise<void>(async (resolve) => {
            try {
              const {data} = await CommonApi.checkoutCartInfoUsingPOST({
                cart_id_list: cartIds,
                coupon_id: couponId,
              });
              if (data.code === 0) {
                Message.hide();
                resolve();
                return;
              }
              if (data.code === 1) {
                await CommonApi.userCartListUsingPOST({page: 1});
                Message.toast(
                  'The items price has been changed, please reconfirm.',
                ).then(() => {
                  onPriceExpire && onPriceExpire();
                });
                return;
              }
              if (data.code === 2) {
                await CommonApi.userCartListUsingPOST({page: 1});
                Message.toast('The coupon is expired,please reconfirm.').then(
                  () => {
                    onCouponExpire && onCouponExpire(couponId || 0);
                  },
                );
                return;
              }
              if (data.code === 3) {
                Message.hide();
                if (data.list?.length) {
                  onRefresh && onRefresh();
                  setExpireProduct(data.list);
                  setActionModalVisible(true);
                }
                return;
              }
            } catch (e) {
              Message.toast(e);
            }
          });
        },
        checkProduct: (params, couponId) => {
          if (!params) {
            return Promise.reject();
          }
          Message.loading();
          return new Promise<void>(async (resolve) => {
            const {data} = await CommonApi.checkProductInfoUsingPOST({
              coupon_id: couponId,
              price: params.orderPrice,
              product_id: params.productId,
              product_type: params.productType,
              qty: params.qty,
              sku_no: params.sku,
            });
            if (data.code === 0) {
              Message.hide();
              resolve();
              return;
            }
            if (data.code === 1) {
              Message.toast(
                'The items price has been changed, please reconfirm.',
              ).then(() => {
                onPriceExpire && onPriceExpire();
              });
              return;
            }
            if (data.code === 2) {
              Message.toast('The coupon is expired,please reconfirm.').then(
                () => {
                  onCouponExpire && onCouponExpire(couponId || 0);
                },
              );
              return;
            }
            if (data.code === 3) {
              try {
                const {data: detailData} = await fetchDetailData(
                  params.productId,
                  params.productType,
                );
                let stock = 0;
                // 无sku商品
                if (
                  !(detailData as OfferProductDetailResponse)?.product_sku?.sku
                    ?.length
                ) {
                  stock = detailData?.stock || 0;
                } else {
                  // 查询库存
                  stock = queryStock(
                    (detailData as OfferProductDetailResponse)?.product_sku,
                    params
                      .sku!.replace(/\d+-/, '')
                      .split('-')
                      .map((val) => +val),
                  );
                }

                onRefresh && onRefresh();
                setExpireProduct([
                  convertData({
                    ...params,
                    status: detailData.product_status,
                    stock: stock,
                  }),
                ]);
                setActionModalVisible(true);
              } catch (error) {
              } finally {
                Message.hide();
              }
              return;
            }
          });
        },
      }),
      [
        fetchDetailData,
        onCouponExpire,
        onPriceExpire,
        onRefresh,
        setActionModalVisible,
      ],
    );

    const deleteCart = useCallback((ids: number[]) => {
      return CommonApi.userCartDelUsingPOST({cart_id_list: ids});
    }, []);

    const add2WishList = useCallback((params: LikeProductMoreRequest) => {
      return CommonApi.likeProductMoreUsingPOST(params);
    }, []);

    const removeCardIds = useCallback(
      (removeIds: number[]) => {
        const res = cartIdsRef.current.filter((id) => {
          return removeIds.findIndex((val) => val === id) === -1;
        });
        setActionModalVisible(false);
        onCartDeleteSuccess && onCartDeleteSuccess(res);
      },
      [onCartDeleteSuccess, setActionModalVisible],
    );

    const handleDeletePress = useCallback(async () => {
      try {
        if (cartIdsRef.current.length) {
          Message.loading();
          const ids = (expireProduct as CartItem[]).map(({id}) => id);
          await deleteCart(ids);
          removeCardIds(ids);
          Message.hide();
        } else {
          setActionModalVisible(false);
          onProductDeleteSuccess && onProductDeleteSuccess();
        }
      } catch (error) {
        Message.toast(error);
      }
    }, [
      deleteCart,
      expireProduct,
      onProductDeleteSuccess,
      removeCardIds,
      setActionModalVisible,
    ]);

    const handleMove2WishPress = useCallback(async () => {
      Message.loading();
      try {
        await add2WishList({
          list: (expireProduct as CartItem[]).map(
            ({product_type, product_id}) => ({
              product_type,
              product_id,
            }),
          ),
        });
        if (cartIdsRef.current.length) {
          const ids = (expireProduct as CartItem[]).map(({id}) => id);
          await deleteCart(ids);
          removeCardIds(ids);
        } else {
          setActionModalVisible(false);
          onProductDeleteSuccess && onProductDeleteSuccess();
        }
        Message.hide();
      } catch (error) {
        Message.toast(error);
      }
    }, [
      add2WishList,
      deleteCart,
      expireProduct,
      onProductDeleteSuccess,
      removeCardIds,
      setActionModalVisible,
    ]);

    return (
      <ActionModal maskClosable title={'Unavailble items'}>
        <Text style={CheckProductDialogStyles.title}>
          The items in your shopping bag are unavailable now，please remove them
          to continue.
        </Text>
        <ActionSheetScrollContent
          style={CheckProductDialogStyles.scrollContainer}
          contentContainerStyle={CheckProductDialogStyles.scrollContent}>
          {expireProduct?.map((item, index) => {
            return (
              <Fragment key={index}>
                <ShopItemContent data={item} disableEdit />
                {expireProduct.length !== index + 1 && (
                  <Space
                    backgroundColor={'#f6f6f6'}
                    height={9}
                    marginLeft={-12}
                    marginRight={-12}
                  />
                )}
              </Fragment>
            );
          })}
        </ActionSheetScrollContent>
        <BottomButton
          onDeletePress={handleDeletePress}
          onMove2WishPress={handleMove2WishPress}
        />
      </ActionModal>
    );
  },
);

const CheckProductDialogStyles = createStyleSheet({
  title: {
    color: '#222',
    fontSize: 14,
    marginTop: 10,
  },
  scrollContainer: {
    marginHorizontal: -ACTION_SHEET_CONTENT_PADDING_HORIZONTAL,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
});

interface BottomButtonProps {
  onDeletePress: () => void;
  onMove2WishPress: () => void;
}

export const BottomButton: FC<BottomButtonProps> = ({
  onDeletePress,
  onMove2WishPress,
}) => {
  return (
    <View style={BottomButtonStyles.container}>
      <StandardButton
        wrapStyle={BottomButtonStyles.buttonContainer}
        onPress={onDeletePress}
        title={'DELETE'}
      />
      <StandardButton
        type={BUTTON_TYPE_ENUM.HIGH_LIGHT}
        wrapStyle={BottomButtonStyles.buttonContainer}
        onPress={onMove2WishPress}
        title={'MOVE TO WISHLIST'}
      />
    </View>
  );
};

const BottomButtonStyles = createStyleSheet({
  container: {
    marginHorizontal: -ACTION_SHEET_CONTENT_PADDING_HORIZONTAL,
    paddingHorizontal: 12,
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  buttonContainer: {
    width: 172,
  },
});
