import {useNavigation} from '@react-navigation/native';
import {ProductRoute} from '@src/routes';
import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, FlatList, RefreshControl, View} from 'react-native';
import {Route} from 'react-native-tab-view';
import Api from '../../../Api';
import {PRIMARY} from '../../../constants/colors';
import {FROM_FLASH_DEALS} from '../../../constants/constants';
import {
  FlashProductListApi,
  SessionInfoItem,
} from '../../../types/models/activity.model';
import {useFetching} from '../../../utils/hooks';
import Utils from '../../../utils/Utils';
import Empty from '../../common/Empty';
import ItemRender from './ItemRender';
import {TimeItemTabsConfigProps} from './TimeItemTabs';

// interface routeProps {
//   params: SalesCateInfoItem & {session_id: number};
// }
export interface ItemTabListProps {
  route: Route & TimeItemTabsConfigProps;
  timeTabData: SessionInfoItem;
  activeTab: number;
}
const ItemTabList: FC<ItemTabListProps> = ({route, timeTabData, activeTab}) => {
  // console.log('----route', route);
  const {cate_id, session_id, i} = route;
  // console.log('----activeTab', activeTab);
  const navigation = useNavigation();
  const [, productListFetch] = useFetching(Api.flashSalesProductList);
  const [isRefreshing, setRefreshing] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isLoadComplete, setLoadComplete] = useState(true);
  const pageRef = useRef(1);
  const [productList, setProductList] = useState<
    FlashProductListApi.ProductItem[]
  >([] as FlashProductListApi.ProductItem[]);

  const getProductList = useCallback(async () => {
    let res = await productListFetch(cate_id, pageRef.current, session_id);
    if (res.code === 0) {
      let list = res.data.list || [];
      if (list.length < 10) {
        setLoadComplete(true);
      }
      if (pageRef.current > 1) {
        setProductList((old) => old.concat(list));
      } else {
        setProductList(list);
      }
      setRefreshing(false);
      setLoading(false);
    }
  }, [cate_id, productListFetch, session_id]);
  const onRefresh = useCallback(() => {
    setProductList([]);
    setRefreshing(true);
    setLoadComplete(false);
    pageRef.current = 1;
    getProductList();
  }, [getProductList]);

  const ProductRouter = ProductRoute.useRouteLink();

  const goDetail = useCallback(
    (item, index) => {
      if (timeTabData.start > new Date().getTime() / 1000) {
        Utils.toastFun('Coming soon');
        return;
      }
      if (timeTabData.end < new Date().getTime() / 1000) {
        Utils.toastFun('The activity is end');
        return;
      }
      if (item.status) {
        Utils.toastFun('The product is off sale');
        return;
      }
      ProductRouter.navigate({
        productId: item.product_id,
      });
    },
    [ProductRouter, timeTabData.end, timeTabData.start],
  );
  useEffect(() => {
    if (activeTab === i) {
      onRefresh();
    }
  }, [onRefresh, activeTab, i]);
  const loadMore = () => {
    if (isLoading || isLoadComplete) {
      return;
    }
    setLoading(true);
    pageRef.current = pageRef.current + 1;
    getProductList();
    console.log('loadMore...');
  };
  // const onPress = (item, i) => {};
  if (productList.length === 0) {
    return isRefreshing ? (
      <ActivityIndicator color={PRIMARY} style={{flex: 1}} />
    ) : (
      <Empty
        image={require('../../../assets/empty.png')}
        title={'Nothing at all'}
      />
    );
  }

  return (
    <FlatList
      data={productList}
      ListEmptyComponent={<Empty title={'Nothing at all'} />}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
      ListFooterComponent={() => {
        if (isLoadComplete) {
          return <View style={{height: 20}} />;
        }
        return <ActivityIndicator color={PRIMARY} style={{padding: 10}} />;
      }}
      onEndReachedThreshold={0.4}
      onEndReached={loadMore}
      renderItem={({item, index}) => {
        return <ItemRender item={item} i={index} onPress={goDetail} />;
      }}
      style={{flex: 1, backgroundColor: '#fff', paddingHorizontal: 5}}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default ItemTabList;
