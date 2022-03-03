import React, {useState, useEffect, useCallback, useRef, useMemo} from 'react';
import {
  View,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  DeviceEventEmitter,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  FROM_ADD_ITEMS,
  FROM_CART,
  FROM_MYSTERY,
  FROM_OFFERS,
  FROM_SUPER_BOX,
  px,
  SCREEN_WIDTH,
  StatusBarHeight,
} from '../../constants/constants';
import AsyncStorage from '@react-native-community/async-storage';
import CartStatus from './CartStatus';
import {useShallowEqualSelector} from '../../utils/hooks';
import CartItem from './CartItem';
import BottomSheet from '../dialog/BottomSheet';
import Api from '../../Api';
import Utils, {fetchOrderAddItemsConfig} from '../../utils/Utils';
import {dialogs, navigationRef} from '../../utils/refs';
import {useDispatch} from 'react-redux';
import AppModule from '../../../AppModule';
import {useIsFocused} from '@react-navigation/core';
import {payPath} from '../../analysis/report';
import {
  REPORT_FROM_PAGE_ENUM,
  REPORT_RECOMMEND_TYPE_ENUM,
} from '../../analysis/reportEnum';
import {reportData} from '../../constants/reportData';
import {ButtonAction} from './BottomFreeBanner';
import {PRIMARY} from '../../constants/colors';
import SkuSelector from '../common/SkuSelector';
import QuantityView from '../onedollar/QuantityView';
import {useMarketCouponCheck} from '../home/CheckCouponDialog';
import {ACTIVITY_ID_ENUM, APPLY_COUPON_PAGE_ENUM} from '../../constants/enum';
import {
  BundleSaleDiscoutItem,
  ShippingDiscoutItem,
} from './widgets/DiscountInfo';
import {ProductListItem} from '../../widgets/productItem/ProductListItem';
import {RecommendListHeader} from '../../widgets/productItem/RecommendListHeader';
import {CartListModule} from './widgets/widgets';
import {Space} from '../common/Space';
import {
  BottomAction,
  BottomActionText,
} from '../../widgets/shopCart/bottomAction/BottomAction';
import {CouponWidgets} from './widgets/CouponWidgets';
import {SoldoutAction} from '../../widgets/shopCart/soldoutAction/SoldoutAction';
import {MysteryRoute, ProductRoute} from '@src/routes';

export default function Cart({navigation, route}) {
  useMarketCouponCheck(APPLY_COUPON_PAGE_ENUM.SHOPPING_BAG);
  const {token, activityInfo} = useShallowEqualSelector(
    (state) => state.deprecatedPersist,
  );
  const [cartStatue, setCartStatus] = useState(!token ? 1 : 0);
  const showLeft = route?.params?.showLeft || false;
  const showRight = route?.params?.showRight || true;
  const [cartData, setCartData] = useState();
  const [loadingCart, setCartLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
  const [checking, setChecking] = useState(false);
  const dispatch = useDispatch();
  const focus = useIsFocused();
  const soldoutActionRef = useRef();

  const buyMore = (product_id) => {
    AppModule.reportClick('27', '442', {product_id: product_id});
    fetchOrderAddItemsConfig(
      token,
      ButtonAction.BACKCART,
      reportData.cartGoAddItems,
      0,
    );
  };
  const checkOutFun = async () => {
    AppModule.reportClick('23', '322');
    if (cartData?.total_price > cartData?.max_price) {
      Utils.toastFun('Sorry, you have exceeded the maximum shopping bag limit');
      return;
    }
    setChecking(true);
    let res = await Api.cartList();
    setChecking(false);
    if (res.code === 0) {
      let list = res.data?.list || [];
      showCartSoldOutList(list);
    }
  };

  const showCartSoldOutList = () => {
    soldoutActionRef?.current
      .check()
      .then((data) => {
        payPath.mergeData({
          FromPage: REPORT_FROM_PAGE_ENUM.SHOPPING_BAG,
          RecommendType: REPORT_RECOMMEND_TYPE_ENUM.OTHER,
          CategoryId: reportData.cartCategoryId,
        });
      })
      .catch(() => {});
  };

  const fetchCartList = useCallback(async () => {
    let res = await Api.cartList();
    setRefreshing(false);
    setCartLoading(false);
    if (res.code === 0) {
      dispatch({type: 'updateCartNum', payload: res.data?.total_num});
      dispatch({
        type: 'setProductDiscountInfo',
        payload: res.data?.product_discount,
      });
      if (res.data?.list?.length > 0) {
        setCartStatus(3);
      } else {
        setCartStatus(2);
      }
      setCartData(res.data);
    } else {
      setCartStatus(2);
    }
    return res.data;
  }, [dispatch]);

  const handleDeleteSuccess = useCallback(() => {
    setRefreshing(true);
    setCartLoading(true);
    fetchCartList();
  }, [fetchCartList]);

  useEffect(() => {
    if (token && focus) {
      setCartLoading(true);
      fetchCartList();
    } else {
      setCartLoading(false);
    }
  }, [token, focus, fetchCartList]);

  useEffect(() => {
    if (focus) {
      AppModule.reportShow('23', '304', {
        Userloginstatus: token ? 1 : 0,
      });
    }
  }, [token, focus]);
  const updateCartListFun = useCallback(
    async ({needToast = false, type = ''}) => {
      let res = await fetchCartList();
      if (!needToast) {
        return;
      }
      if (focus && !type) {
        Utils.toastFun('Added Successfully');
        return;
      }
      if (type === 'discount' && res.product_discount.next_discount > 0) {
        DeviceEventEmitter.emit('showDiscountToast', res.product_discount);
      }
    },
    [fetchCartList, focus],
  );
  useEffect(() => {
    // needToastType:1==>普通toast Added Successfully
    // 2==>活动折扣toast，多件多折
    let sub = DeviceEventEmitter.addListener(
      'updateCartList',
      updateCartListFun,
    );
    return () => {
      sub.remove();
    };
  }, [updateCartListFun]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCartList();
  }, [fetchCartList]);

  const productIds = useMemo(() => {
    return (
      cartData?.list?.map(({product_id}) => {
        return product_id;
      }) || []
    );
  }, [cartData]);

  return (
    <View
      style={{
        flex: 1,
        position: 'relative',
      }}>
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor={'transparent'}
      />
      {/* <SafeAreaView style={{flex: 1}}> */}
      <Header
        navigation={navigation}
        showLeft={showLeft}
        showRight={showRight}
      />
      <CartList
        cartStatus={cartStatue}
        carts={cartData?.list}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
        navigation={navigation}
        cartData={cartData}
        loadingCart={loadingCart}
      />
      {cartStatue === 3 ? (
        <BottomAction
          onPress={checkOutFun}
          totalPrice={cartData?.total_price || 0}
          loading={checking}
          discount={cartData?.product_discount.discount_price}>
          <BottomActionText>
            Tax and shipping fee are not included
          </BottomActionText>
        </BottomAction>
      ) : null}
      <CouponWidgets productIds={productIds} />
      <SoldoutAction
        onDeleteSuccess={handleDeleteSuccess}
        ref={soldoutActionRef}
      />
    </View>
  );
}

export const Header = ({navigation, showLeft, showRight}) => {
  const {token} = useShallowEqualSelector((state) => ({
    ...state.deprecatedPersist,
  }));
  const goBack = () => {
    navigation?.goBack();
  };

  const goWishList = () => {
    if (token) {
      navigation?.navigate('WishList');
    } else {
      navigation?.navigate('FBLogin');
    }
  };

  return (
    <View
      style={{
        paddingTop: StatusBarHeight,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        height: StatusBarHeight + 120 * px,
      }}>
      <Text
        style={{
          height: 120 * px,
          textAlign: 'center',
          width: SCREEN_WIDTH,
          lineHeight: 120 * px,
          alignSelf: 'center',
          color: '#000',
          fontSize: 50 * px,
          fontWeight: 'bold',
        }}>
        Shopping Bag
      </Text>
      {showLeft && (
        <TouchableOpacity
          onPress={goBack}
          style={{
            width: 100 * px,
            height: 120 * px,
            top: StatusBarHeight,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={{
              width: 26 * px,
              height: 48 * px,
              tintColor: 'black',
            }}
            resizeMode={'contain'}
            source={require('../../assets/back.png')}
          />
        </TouchableOpacity>
      )}

      {showRight && (
        <TouchableOpacity
          onPress={goWishList}
          style={{
            top: StatusBarHeight,
            right: 20 * px,
            width: 100 * px,
            height: 120 * px,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={{
              width: 53 * px,
              height: 48 * px,
              tintColor: 'black',
            }}
            resizeMode={'contain'}
            source={require('../../assets/new_like.png')}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
export const CartList = ({
  cartStatus,
  carts,
  onRefresh,
  isRefreshing,
  navigation,
  cartData,
  loadingCart,
}) => {
  const {token} = useShallowEqualSelector((state) => state.deprecatedPersist);
  const pageRef = useRef(1);
  const [complete, setCompleted] = useState(true);
  const [recommendProducts, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const blockClick = () => {
    DeviceEventEmitter.emit('hideMoreAction', -1);
  };

  const cartList = useMemo(() => {
    const bundleSaleList = [];
    const standardList = [];
    cartData?.list?.forEach((cartItem) => {
      if (ACTIVITY_ID_ENUM.BUNDLE_SALE === cartItem.act_id) {
        bundleSaleList.push(cartItem);
      } else {
        standardList.push(cartItem);
      }
    });
    return {
      bundleSaleList,
      standardList,
    };
  }, [cartData]);

  const CartListHeaderView = useMemo(() => {
    return (
      <View>
        {cartData && <ShippingDiscoutItem data={cartData.free_shipping_fee} />}
        <View
          style={{height: 20 * px, width: '100%', backgroundColor: '#eee'}}
        />
        <CartStatus navigation={navigation} status={cartStatus} />
        {!!cartList.bundleSaleList.length && (
          <>
            <CartListModule>
              <BundleSaleDiscoutItem data={cartData.product_discount} />
              {cartList.bundleSaleList?.map((item, index) => {
                return (
                  <CartItem
                    data={item}
                    index={index}
                    key={item.sku_no || item.product_id + index}
                  />
                );
              })}
            </CartListModule>
            <Space height={20} backgroundColor="#eee" />
          </>
        )}
        <CartListModule>
          {cartList.standardList?.map((item, index) => {
            return (
              <CartItem
                data={item}
                index={index}
                key={item.sku_no || item.product_id + index}
              />
            );
          })}
        </CartListModule>
        {recommendProducts?.length > 0 && (
          <RecommendListHeader>Recommended for you</RecommendListHeader>
        )}
      </View>
    );
  }, [
    cartData,
    navigation,
    cartStatus,
    cartList.bundleSaleList,
    cartList.standardList,
    recommendProducts,
  ]);

  const ListFooterView = () => {
    return recommendProducts?.length === 0 ? null : complete ? (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 50 * px,
          flexDirection: 'row',
        }}>
        <View
          style={{
            width: 300 * px,
            height: 2 * px,
            marginRight: 15 * px,
            backgroundColor: '#9C9C9C',
          }}
        />

        <Text style={{fontSize: 40 * px, color: '#4E4E4E'}}>END</Text>
        <View
          style={{
            backgroundColor: '#9C9C9C',
            width: 300 * px,
            height: 2 * px,
            marginLeft: 15 * px,
          }}
        />
      </View>
    ) : loading ? (
      <View
        style={{
          paddingVertical: 50 * px,
          justContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size={'small'} color={'#F04A33'} style={{flex: 1}} />
      </View>
    ) : (
      <TouchableOpacity
        onPress={loadMore}
        style={{
          justContent: 'center',
          alignItems: 'center',
          paddingVertical: 50 * px,
        }}>
        <Text
          style={{
            width: 260 * px,
            height: 70 * px,
            borderRadius: 35 * px,
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: PRIMARY,
            color: PRIMARY,
            fontSize: 30 * px,
            lineHeight: 68 * px,
            textAlign: 'center',
          }}>
          View More
        </Text>
      </TouchableOpacity>
    );
  };

  const focus = useIsFocused();
  useEffect(() => {
    if (!loadingCart && focus) {
      fetchBestSellList();
    }
  }, [loadingCart, focus]);

  const loadMore = () => {
    pageRef.current += 1;
    fetchBestSellList();
  };

  const fetchBestSellList = () => {
    setLoading(true);
    Api.cartPageRecommend(pageRef.current, 20).then((res) => {
      setLoading(false);
      if (res.code === 0) {
        if (res.data?.list?.length > 0) {
          setCompleted(false);
          const products = res.data?.list?.filter((item) => {
            return item.product_category !== 5 && item.product_category !== 6;
          });
          setProducts((pre) => {
            return [...pre, ...products];
          });
        } else {
          setCompleted(true);
        }
      } else {
        setCompleted(true);
      }
    });
  };

  const ProductRouter = ProductRoute.useRouteLink();
  const MysteryRouter = MysteryRoute.useRouteLink();

  const RenderItem = ({item, index}) => {
    return (
      <View
        style={{
          margin: 5,
        }}>
        <ProductListItem
          style={{flex: 1}}
          addToBag
          data={item}
          onAddToBag={(productType, productId) => {
            addToCart(productType, productId);
          }}
          onPress={() => {
            AppModule.reportShow('23', '399', {
              ProductId: item.product_id || item.bag_id,
            });
            if (item.product_category === 1) {
              //1 --福袋，2--直购，3--大转盘 4---vip商品 5---专题页 6---特殊页面
              MysteryRouter.navigate({
                productId: item.bag_id || item.product_id,
              });
            } else if (
              item.product_category === 2 ||
              item.product_category === 4
            ) {
              ProductRouter.navigate({
                productId: item.bag_id || item.product_id,
              });
            }
          }}
        />
      </View>
    );
  };

  const addToCart = async (productType, productId) => {
    AppModule.reportShow('23', '400', {
      ProductId: productId,
    });
    if (!token) {
      navigationRef.current?.navigate('FBLogin');
      return;
    }
    dialogs.loadingDialog?.current.show();
    let goodRes = {};
    if (productType === 2 || productType === 4) {
      goodRes = await Api.onlyOneDetail(productId);
    } else if (productType === 1) {
      goodRes = await Api.luckyBagDetail(productId);
    }
    dialogs.loadingDialog?.current.hide();
    // @ts-ignore
    if (goodRes?.code === 0) {
      const goodsDetail = goodRes?.data;
      AppModule.reportShow('23', '401', {
        ProductId: goodsDetail.bag_id || goodsDetail.product_id,
      });
      if (goodsDetail?.product_sku?.sku) {
        BottomSheet.showLayout(
          <SkuSelector
            detail={goodsDetail}
            skuList={goodsDetail.product_sku}
            from={productType === 1 ? 'mystery' : 'offers'}
            path={FROM_CART}
            nextAction={1}
          />,
        );
      } else {
        BottomSheet.showLayout(
          <QuantityView
            detail={goodsDetail}
            from={productType === 1 ? 'mystery' : 'offers'}
            path={FROM_CART}
            nextAction={1}
          />,
        );
      }
    }
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={blockClick} style={{flex: 1}}>
      <FlatList
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={CartListHeaderView}
        data={recommendProducts}
        renderItem={RenderItem}
        keyExtractor={(item, index) => index + ''}
        ListFooterComponent={<ListFooterView />}
      />
    </TouchableOpacity>
  );
};
