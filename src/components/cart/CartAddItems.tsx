import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {Animated, View} from 'react-native';
import {
  FROM_ADD_ITEMS,
  FROM_MYSTERY,
  FROM_OFFERS,
  FROM_SUPER_BOX,
  px,
  SCREEN_WIDTH,
} from '../../constants/constants';
import {dialogs, navigationRef} from '../../utils/refs';
import BadgeCartButton from './BadgeCartButton';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ListenPayBackPress from '../common/ListenPayBackPress';
import {PRIMARY} from '../../constants/colors';
import {useDispatch} from 'react-redux';
import AppModule from '../../../AppModule';
import Api from '../../Api';
import Empty from '../common/Empty';
import AuctionListHolder from '../home/placeholder/AuctionListHolder';
import {reportData} from '../../constants/reportData';
import GlideImage from '../native/GlideImage';
import Utils from '../../utils/Utils';
import {WaterfallList} from 'react-native-largelist-v3';
import {WithLastDateHeader} from '../common/WithLastDateHeader';
import {useShallowEqualSelector} from '../../utils/hooks';
import BottomSheet from '../dialog/BottomSheet';
import SkuSelector from '../common/SkuSelector';
import QuantityView from '../onedollar/QuantityView';
import BottomFreeBanner from './BottomFreeBanner';
import {
  getAddToBagHeight,
  ProductListItem,
} from '../../widgets/productItem/ProductListItem';
import {
  BagProductDetailResponse,
  OfferProductDetailResponse,
  ProductSimpleBaseItem,
} from '@luckydeal/api-common';
import {MysteryRoute, ProductRoute} from '@src/routes';
const GlideImageEle = GlideImage as any;
const QuantityViewEle = QuantityView as any;
const SkuSelectorEle = SkuSelector as any;
interface TabConfig {
  id: number;
  title: string;
  min_price: number;
  max_price: number;
  type: number;
}

interface CartAddItemsParams {
  tabConfigs: TabConfig[];
  fromPage: string;
  needLowPrice: number;
}

type NavigationParams = {
  CartAddItems: CartAddItemsParams;
};

const CartAddItems: FC = () => {
  const navigation = useNavigation<StackNavigationProp<NavigationParams>>();
  const {params} = useRoute<RouteProp<NavigationParams, 'CartAddItems'>>();
  const {tabConfigs, fromPage, needLowPrice} = params;
  const {token, configV2} = useShallowEqualSelector(
    (state: any) => state.deprecatedPersist,
  );
  const Tab = createMaterialTopTabNavigator();
  const [tabId, setTabId] = useState(() => {
    return tabConfigs?.length > 0 ? tabConfigs[0].id : 0;
  });
  const freeNeedAmt =
    token || needLowPrice > 0 ? needLowPrice : configV2?.free_shipping_fee_amt;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {
        backgroundColor: '#fff',
        borderBottomWidth: 0,
        elevation: 0,
      },
      headerTitleAlign: 'center',
      title: 'Add Items',
      headerRight: () => {
        // @ts-ignore
        return <BadgeCartButton sourceType={3} headerRight={true} />;
      },
    });
  }, [navigation]);

  const findTabPosition = () => {
    if (tabConfigs?.length > 0) {
      const defaultTab = tabConfigs.find((item) => {
        return item.min_price <= freeNeedAmt && freeNeedAmt <= item.max_price;
      }) as TabConfig;
      return defaultTab?.title + defaultTab?.id;
    }

    return '0';
  };
  const buttonOnPress = () => {
    navigation.goBack();
    AppModule.reportClick('26', '393', {
      TabId: tabId,
    });
  };
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ListenPayBackPress
        onGoBack={() => navigation.goBack()}
        interrupt={true}
      />
      {tabConfigs?.length > 0 && (
        <Tab.Navigator
          lazy={false}
          initialRouteName={findTabPosition()}
          tabBarOptions={{
            activeTintColor: '#000000',
            inactiveTintColor: '#8F8E8E',
            tabStyle: {
              width: 'auto',
              maxWidth: SCREEN_WIDTH,
              minWidth: SCREEN_WIDTH / (tabConfigs?.length || 2),
            },

            style: {
              backgroundColor: '#fff',
            },
            labelStyle: {textTransform: 'none', fontSize: 40 * px},
            scrollEnabled: true,
            indicatorStyle: {
              height: 10 * px,
              borderRadius: 5 * px,
              backgroundColor: PRIMARY,
            },
          }}>
          {tabConfigs?.map((item: TabConfig) => {
            return (
              <Tab.Screen
                key={item.id}
                name={item.title + item.id}
                options={{tabBarLabel: item.title}}
                initialParams={{
                  id: item.id,
                  fromPage: fromPage,
                }}
                component={AddItemProductList}
                listeners={{
                  tabPress: () => {
                    setTabId(item.id);
                    AppModule.reportClick('26', '394', {
                      TabId: item.id,
                    });
                  },
                  focus: () => {
                    setTabId(item.id);
                  },
                }}
              />
            );
          })}
        </Tab.Navigator>
      )}
      <BottomFreeBanner buttonOnPress={buttonOnPress} />
    </View>
  );
};

interface ProductListProps {
  route: any;
}

export const AddItemProductList: FC<ProductListProps> = ({route}) => {
  const {id, fromPage} = route?.params;
  const [dataList, setDataList] = useState<ProductSimpleBaseItem[]>([]);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const pageRef = useRef(1);
  const dataListRef = useRef<ProductSimpleBaseItem[]>();
  const {token} = useShallowEqualSelector(
    (state: any) => state.deprecatedPersist,
  );
  const [isRefreshing, setRefreshing] = useState(false);
  const [prevToken] = useState(token);
  const dispatch = useDispatch();
  const bannerImage = useRef();
  const waterfallListRef = useRef<WaterfallList<ProductSimpleBaseItem>>(null);
  const focus = useIsFocused();

  const [scrollY] = useState(new Animated.Value(0));

  const contentHeightRef = useRef(0);
  const loadingRef = useRef(false);
  const allLoadedRef = useRef(false);
  const prodIndexRef = useRef(1);
  const showTypeRef = useRef(0);
  const fetchAddItemsList = useCallback(async () => {
    setError(false);
    const response = await Api.cartAddItemsList(id, token, pageRef.current);
    if (response.code !== 0) {
      setRefreshing(false);
      waterfallListRef.current?.endRefresh();
      setError(true);
      dataListRef.current = [];
      setDataList(dataListRef.current);
      return;
    }
    let list = response.data?.list || [];
    if (pageRef.current === 1) {
      prodIndexRef.current = 1;
      dataListRef.current = list;
      setEmpty(list.length === 0);
    } else if (list.length > 0) {
      list.forEach((item) => {
        if (!item.product_id) {
          dataListRef.current?.push(item);
          return;
        }
        let index = dataListRef.current?.findIndex(
          (i) => i.product_id === item.product_id,
        );
        if (index === -1) {
          dataListRef.current?.push(item);
        } else {
          if (dataListRef.current) {
            dataListRef.current[index as number] = item;
          }
        }
      });
    } else {
      allLoadedRef.current = true;
    }
    setDataList([...(dataListRef.current || [])]);
    setRefreshing(false);
    waterfallListRef.current?.endRefresh();
    loadingRef.current = false;
    pageRef.current += 1;
  }, [id, token]);

  useEffect(() => {
    if (isRefreshing && focus) {
      fetchAddItemsList();
    }
  }, [fetchAddItemsList, focus, isRefreshing]);

  useEffect(() => {
    if (!prevToken && token) {
      setRefreshing(true);
    }
  }, [prevToken, token]);

  useEffect(() => {
    if (focus && dataList.length === 0) {
      pageRef.current = 1;
      setRefreshing(true);
    }
  }, [dataList.length, dispatch, focus]);
  useEffect(() => {
    if (focus) {
      AppModule.reportShow('26', '390', {
        TabId: id,
        Frompage: fromPage,
      });
    }
  }, [focus, fromPage, id]);

  //下拉刷新
  const onRefresh = () => {
    pageRef.current = 1;
    allLoadedRef.current = false;
    showTypeRef.current = 2;
    setRefreshing(true);
  };

  const onLoadMore = (y: number) => {
    if (
      contentHeightRef.current > 0 &&
      y >= contentHeightRef.current &&
      !loadingRef.current &&
      !allLoadedRef.current
    ) {
      showTypeRef.current = 1;
      loadingRef.current = true;
      fetchAddItemsList();
    }
  };

  const addToCart = async (productType: number, productId: number) => {
    if (!token) {
      navigationRef.current?.navigate('FBLogin');
      return;
    }
    dialogs.loadingDialog?.current.show();
    let goodRes:
      | ResponseData<BagProductDetailResponse>
      | ResponseData<OfferProductDetailResponse>;
    if (productType === 2 || productType === 4) {
      goodRes = await Api.onlyOneDetail(productId);
    } else if (productType === 1) {
      goodRes = await Api.luckyBagDetail(productId);
    }
    dialogs.loadingDialog?.current.hide();
    // @ts-ignore
    if (goodRes?.code === 0) {
      const goodsDetail = goodRes?.data;
      AppModule.reportShow('26', '395', {
        ProductId:
          (goodsDetail as BagProductDetailResponse).bag_id ||
          (goodsDetail as OfferProductDetailResponse).product_id,
      });
      if ((goodsDetail as OfferProductDetailResponse)?.product_sku) {
        BottomSheet.showLayout(
          <SkuSelectorEle
            detail={goodsDetail}
            skuList={(goodsDetail as OfferProductDetailResponse).product_sku}
            from={productType === 1 ? 'mystery' : 'offers'}
            path={FROM_ADD_ITEMS}
            nextAction={1}
          />,
        );
      } else {
        BottomSheet.showLayout(
          <QuantityViewEle
            detail={goodsDetail}
            from={productType === 1 ? 'mystery' : 'offers'}
            path={FROM_ADD_ITEMS}
            nextAction={1}
          />,
        );
      }
    }
  };
  if (error && focus) {
    return (
      <Empty
        error={true}
        onRefresh={() => {
          AppModule.reportTap('MysteryList', 'ld_loading_failed_refresh_click');
          setError(false);
          onRefresh();
        }}
      />
    );
  }

  if (isRefreshing && dataList.length === 0) {
    return (
      <>
        <AuctionListHolder headerShown={true} />
      </>
    );
  }

  const ProductRouter = ProductRoute.useRouteLink();
  const MysteryRouter = MysteryRoute.useRouteLink();

  const renderItem = (item: ProductSimpleBaseItem, index: number) => (
    <View
      style={{
        margin: 5,
      }}>
      <ProductListItem
        addToBag
        data={item}
        onAddToBag={(productType: number, productId: number) => {
          AppModule.reportClick('26', '392', {
            ProductId: item.product_id,
            TabId: id,
          });
          addToCart(productType, productId);
        }}
        onPress={() => {
          AppModule.reportClick('26', '391', {
            ProductId: item.product_id,
            TabId: id,
          });
          if (item.product_category === 1) {
            //1 --福袋，2--直购，3--大转盘 4---vip商品 5---专题页 6---特殊页面
            MysteryRouter.navigate({productId: item.product_id});
          } else if (
            item.product_category === 2 ||
            item.product_category === 4
          ) {
            ProductRouter.navigate({productId: item.product_id});
          }
        }}
      />
    </View>
  );

  const _headerView = () => {
    return (
      <View>
        {bannerImage.current ? (
          <GlideImageEle
            source={Utils.getImageUri(bannerImage.current)}
            resizeMode={'stretch'}
            style={{
              width: SCREEN_WIDTH - 20 * px,
              marginTop: 25 * px,
              marginBottom: 15 * px,
              height: 300 * px,
              alignSelf: 'center',
            }}
          />
        ) : null}
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      {empty ? (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}>
          <Empty
            title={'OOPS....There are no products that meet your requirements.'}
            image={require('../../assets/empty.png')}
          />
        </View>
      ) : null}
      <WaterfallList
        ref={waterfallListRef}
        onLayout={({nativeEvent}) => {
          contentHeightRef.current = nativeEvent.layout.height;
        }}
        onScroll={({
          nativeEvent: {
            contentOffset: {y},
          },
        }) => {
          onLoadMore(y);
        }}
        refreshHeader={WithLastDateHeader}
        onRefresh={onRefresh}
        onNativeContentOffsetExtract={{y: scrollY}}
        renderHeader={_headerView}
        data={dataList}
        numColumns={2}
        heightForItem={getAddToBagHeight}
        renderItem={renderItem}
      />
    </View>
  );
};
export default CartAddItems;
