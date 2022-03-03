import {CartItem, UserCartListResponse} from '@luckydeal/api-common';
import {useFocusEffect} from '@react-navigation/native';
import {CommonApi} from '@src/apis';
import {
  APPLY_COUPON_PAGE_ENUM,
  PRODUCT_CATEGPRY_TYPE,
} from '@src/constants/enum';
import {createStyleSheet, getProductStatus, isWeb} from '@src/helper/helper';
import {Message} from '@src/helper/message';
import {useNavigationParams} from '@src/hooks/useNavigationParams';
import {standardAction, thunkAction} from '@src/redux';
import {
  MysteryRoute,
  PayRoute,
  ProductRoute,
  WishListRoute,
  requireAuth,
  ShopPushRouteParams,
} from '@src/routes';
import {useLoading} from '@src/utils/hooks';
import {BUTTON_TYPE_ENUM} from '@src/widgets/button';
import {
  CheckProductDialog,
  CheckProductDialogRef,
} from '@src/widgets/dialogs/checkProductDialog';
import {MarketCouponModal} from '@src/widgets/dialogs/makertCouponDialog';
import {CustomHeader} from '@src/widgets/navigationHeader/customHeader';
import {HeaderIcon} from '@src/widgets/navigationHeader/widgets';
import {PageStatusControl} from '@src/widgets/pageStatusControl';
import {Space} from '@src/widgets/space';
import {ThemeRefreshControl} from '@src/widgets/themeRefreshControl';
import React, {
  FC,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import {View, ScrollView} from 'react-native';
import {CouponWidgets} from './widgets/couponWidgets';
import {ShopBottomAction} from './widgets/shopBottomAction';
import {ShopEmpty} from './widgets/shopEmpty';
import {ShopItem} from './widgets/shopItem';
import {SynchronizeCartTip} from './widgets/synchronizeCartTip';
import {UnavailbleContainer} from './widgets/unavailbleContainer';

const Shop: FC = () => {
  const [cartData, setCartData] = useState<UserCartListResponse>();
  const [loading, withLoading] = useLoading(true);
  const [refreshing, withRefreshing] = useLoading();
  const checkProductDialogRef = useRef<CheckProductDialogRef>(null);
  const params = useNavigationParams<ShopPushRouteParams>();
  const PayRouter = PayRoute.useRouteLink();
  const ProductRouter = ProductRoute.useRouteLink();
  const MysteryRouter = MysteryRoute.useRouteLink();
  const WishListRouter = WishListRoute.useRouteLink();

  const {avalibleCartData, unavalibleCartData} = useMemo(() => {
    const avalibleCartDataArr: CartItem[] = [];
    const unavalibleCartDataArr: CartItem[] = [];
    cartData?.list?.forEach((data) => {
      if (getProductStatus(data).disabled) {
        unavalibleCartDataArr.push(data);
      } else {
        avalibleCartDataArr.push(data);
      }
    });
    return {
      avalibleCartData: avalibleCartDataArr,
      unavalibleCartData: unavalibleCartDataArr,
    };
  }, [cartData]);

  const cartItemProductIds = useMemo(() => {
    return cartData?.list?.map(({product_id}) => product_id) || [];
  }, [cartData]);

  const fecthCartList = useCallback(() => {
    return thunkAction.cartListDataAsync({page: 1}).then((res) => {
      standardAction.cartNum(res.total_num); // 保存到store
      setCartData(res);
    });
  }, []);

  // 删除商品
  const handleShopItemDelete = useCallback(
    (item: CartItem) => {
      Message.confirm({
        content: 'Are you sure to delete this item?',
        actions: [
          {
            text: 'YES',
            onPress: () => {
              Message.loading();
              thunkAction
                .deleteCartItemAsync({id: item.id})
                .then((res) => {
                  if (res.is_success) {
                    return fecthCartList();
                  }
                  return Promise.resolve();
                })
                .then(() => {
                  Message.hide();
                })
                .catch((e) => {
                  Message.toast(e);
                });
            },
          },
          {
            text: 'NO',
            onPress: () => {},
            type: BUTTON_TYPE_ENUM.HIGH_LIGHT,
          },
        ],
      });
    },
    [fecthCartList],
  );

  // 将商品移至心愿单 并 删除
  const handleShopItemMove2Love = useCallback(
    (item: CartItem) => {
      requireAuth().then(() => {
        Message.confirm({
          content:
            'Are you sure moving the product to wishlist from shopping bag?',
          actions: [
            {
              text: 'YES',
              onPress: () => {
                Message.loading();
                CommonApi.likeProductMoreUsingPOST({
                  list: [
                    {
                      product_id: item.product_id,
                      product_type: item.product_type,
                    },
                  ],
                })
                  .then(() => {
                    return thunkAction.deleteCartItemAsync({id: item.id});
                  })
                  .then((res) => {
                    if (res.is_success) {
                      fecthCartList();
                    }
                    return Promise.resolve();
                  })
                  .then(() => {
                    Message.toast('Items has been moved to "wish list"');
                  })
                  .catch((e) => {
                    Message.toast(e);
                  });
              },
            },
            {
              text: 'NO',
              onPress: () => {},
              type: BUTTON_TYPE_ENUM.HIGH_LIGHT,
            },
          ],
        });
      });
    },
    [fecthCartList],
  );

  // 将所有不允许的商品添加至wish list
  const handleMoveAll2Love = useCallback(() => {
    if (!unavalibleCartData.length) {
      return;
    }

    Message.confirm({
      content: 'Are you sure want to move this item to your Wishlist?',
      actions: [
        {
          text: 'YES',
          onPress: () => {
            Message.loading();
            CommonApi.likeProductMoreUsingPOST({
              list: unavalibleCartData.map(({product_id, product_type}) => ({
                product_id,
                product_type,
              })),
            })
              .then(() => {
                return thunkAction.deleteCartExpireAsync(unavalibleCartData);
              })
              .then(() => {
                return fecthCartList();
              })
              .then(() => {
                Message.toast('Items has been moved to "wish list"');
              })
              .catch((e) => {
                Message.toast(e);
              });
          },
        },
        {
          text: 'NO',
          onPress: () => {},
          type: BUTTON_TYPE_ENUM.HIGH_LIGHT,
        },
      ],
    });
  }, [fecthCartList, unavalibleCartData]);

  // 处理商品点击
  const handleShopItemPress = useCallback(
    (item: CartItem) => {
      if (item.product_type === PRODUCT_CATEGPRY_TYPE.MYSTERY) {
        MysteryRouter.navigate({
          productId: item.product_id,
          sku: item.sku_no,
        });
        return;
      }
      ProductRouter.navigate({
        productId: item.product_id,
        sku: item.sku_no,
      });
    },
    [MysteryRouter, ProductRouter],
  );

  // 修改购物车数量
  const handleShopItemQtyChange = useCallback(
    (qty: number, item: CartItem) => {
      Message.loading();
      thunkAction
        .editCartItemNumAsync({
          id: item.id,
          num: qty,
        })
        .then((res) => {
          if (res.is_success) {
            return fecthCartList();
          }
          return Promise.resolve();
        })
        .then(() => {
          Message.hide();
        })
        .catch((e) => {
          Message.toast(e);
        });
    },
    [fecthCartList],
  );

  const editCartSelect = useCallback(
    (bool: boolean, items: CartItem[]) => {
      Message.loading();
      thunkAction
        .editCartSelectAsync({
          list: items.map((item) => ({id: item.id, type: bool ? 1 : 0})),
        })
        .then(() => {
          return fecthCartList();
        })
        .then(() => {
          Message.hide();
        })
        .catch((e) => {
          Message.toast(e);
        });
    },
    [fecthCartList],
  );

  // 修改商品的选中状态
  const handleShopItemCheckedChange = useCallback(
    (bool: boolean, item: CartItem) => {
      editCartSelect(bool, [item]);
    },
    [editCartSelect],
  );

  // 处理全选
  const handleCheckAllPress = useCallback(
    (bool: boolean) => {
      editCartSelect(bool, cartData?.list || []);
    },
    [cartData, editCartSelect],
  );

  // 点击CHECKOUT
  const handleCheckoutPress = useCallback(() => {
    requireAuth().then(() => {
      const checkedIds = cartData?.list
        .filter(({is_select}) => !!is_select)
        .map(({id}) => id);
      if (!checkedIds || !checkedIds.length) {
        return;
      }
      checkProductDialogRef.current
        ?.checkCarts(checkedIds, cartData?.select_info?.coupon?.coupon_id)
        .then(() => {
          PayRouter.navigate({
            cartIds: checkedIds.join('-'),
          });
        });
    });
  }, [PayRouter, cartData]);

  const handleWishListPress = useCallback(() => {
    requireAuth().then(() => {
      WishListRouter.navigate();
    });
  }, [WishListRouter]);

  const handleRefresh = useCallback(() => {
    withRefreshing(fecthCartList());
  }, [fecthCartList, withRefreshing]);

  const hasDataRef = useRef<boolean>(false);
  hasDataRef.current = !!cartData;
  useFocusEffect(
    useCallback(() => {
      // 当前页面有数据时 走 refresh逻辑
      if (hasDataRef.current) {
        handleRefresh();
      } else {
        withLoading(fecthCartList());
      }
    }, [fecthCartList, handleRefresh, withLoading]),
  );

  useEffect(() => {
    if (isWeb()) {
      refreshing && Message.loading();
      return () => {
        Message.hide();
      };
    }
  }, [refreshing]);

  return (
    <View style={{flex: 1}}>
      <CustomHeader
        headerBackVisible={params?.behavior === 'back'}
        headerTitleStyle={ShopStyles.headerTitle}
        title={'Shopping Bag'}
        headerRight={
          <HeaderIcon
            size={20}
            source={require('@src/assets/header_love_icon.png')}
            onPress={handleWishListPress}
          />
        }
      />
      <PageStatusControl
        showEmpty
        emptyComponent={<ShopEmpty />}
        hasData={!!cartData?.list?.length}
        loading={loading}>
        {!!cartData?.list?.length && (
          <>
            <SynchronizeCartTip />
            <View style={{position: 'relative', flex: 1}}>
              <ScrollView
                refreshControl={
                  <ThemeRefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                  />
                }>
                <Space height={9} />
                <View style={ShopStyles.productContainer}>
                  {avalibleCartData.map((item) => {
                    return (
                      <ShopItem
                        style={ShopStyles.avalibleItem}
                        onDeleteActionPress={handleShopItemDelete}
                        onLoveActionPress={handleShopItemMove2Love}
                        onPress={handleShopItemPress}
                        onQtyChange={handleShopItemQtyChange}
                        onCheckedChange={handleShopItemCheckedChange}
                        cartItem={item}
                        key={item.id}
                      />
                    );
                  })}
                </View>

                <View style={ShopStyles.unavalibleContainer}>
                  {!!unavalibleCartData.length && (
                    <UnavailbleContainer onMoveAllPress={handleMoveAll2Love}>
                      {unavalibleCartData.map((item) => {
                        return (
                          <ShopItem
                            onDeleteActionPress={handleShopItemDelete}
                            onLoveActionPress={handleShopItemMove2Love}
                            onPress={handleShopItemPress}
                            onQtyChange={handleShopItemQtyChange}
                            onCheckedChange={handleShopItemCheckedChange}
                            cartItem={item}
                            key={item.id}
                            spaceHeight={0.5}
                          />
                        );
                      })}
                    </UnavailbleContainer>
                  )}
                </View>
                <Space height={50} backgroundColor={'transparent'} />
              </ScrollView>
              <CouponWidgets
                onRefresh={handleRefresh}
                productIds={cartItemProductIds}
              />
            </View>
            <ShopBottomAction
              onCheckedAllPress={handleCheckAllPress}
              onCheckoutPress={handleCheckoutPress}
              cartData={cartData}
            />
          </>
        )}
      </PageStatusControl>
      {/* 当有商品变动或优惠券失效的时候 刷新当前页面数据  */}
      <CheckProductDialog
        ref={checkProductDialogRef}
        onCouponExpire={handleRefresh}
        onPriceExpire={handleRefresh}
        onCartDeleteSuccess={handleRefresh}
      />
      <MarketCouponModal page={APPLY_COUPON_PAGE_ENUM.SHOPPING_BAG} />
    </View>
  );
};

const ShopStyles = createStyleSheet({
  headerTitle: {
    color: '#222222',
    fontSize: 14,
    fontWeight: '700',
  },
  productContainer: {
    paddingHorizontal: 12,
  },
  avalibleItem: {
    borderRadius: 5,
  },
  unavalibleContainer: {
    marginHorizontal: 12,
    borderRadius: 5,
    overflow: 'hidden',
  },
});

export default Shop;
