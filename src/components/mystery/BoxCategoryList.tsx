import React, {FC, useLayoutEffect, useState} from 'react';
import BadgeCartButton from '../cart/BadgeCartButton';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {RefreshControl, View, ActivityIndicator, FlatList} from 'react-native';
import {PRIMARY} from '../../constants/colors';
import {FROM_MYSTERY, px} from '../../constants/constants';
import {useCallback} from 'react';
import {useEffect} from 'react';
import {BoxCard} from './BoxCard';
import Api from '../../Api';
import {useShallowEqualSelector} from '../../utils/hooks';
import {SearchResult} from '../../types/models/product.model';
import Empty from '../common/Empty';
import {MysteryRoute, ProductRoute} from '@src/routes';

interface BoxCategoryListProps {
  one_category_id: number;
  two_category_id: number;
  three_category_id: number;
  title: string;
}
type NavigationParams = {
  BoxCategory: BoxCategoryListProps;
};

export const BoxCategoryList: FC = () => {
  const navigation = useNavigation<any>();
  const {params} = useRoute<RouteProp<NavigationParams, 'BoxCategory'>>();
  const {one_category_id, two_category_id, three_category_id, title} = params;
  const {token} = useShallowEqualSelector(
    (state: any) => state.deprecatedPersist,
  );
  const [isRefreshing, setRefreshing] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [isLoadComplete, setLoadComplete] = useState(false);
  const [page, setPage] = useState(1);
  const [boxData, setBoxData] = useState<SearchResult.List[]>([]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: '#fff'},
      headerTitleAlign: 'center',
      title: title,
      headerRight: () => {
        return <BadgeCartButton />;
      },
    });
  });

  const fetchSearchProducts = useCallback(() => {
    Api.searchResult(
      page,
      '',
      token,
      0,
      one_category_id,
      two_category_id,
      three_category_id,
    ).then((res) => {
      setLoading(false);
      setRefreshing(false);
      if (!res.data?.list?.length) {
        setLoadComplete(true);
      }
      if (res.data?.list) {
        if (page === 1) {
          setBoxData(res.data?.list);
        } else {
          const boxDatas = boxData.concat(res.data?.list);
          setBoxData(boxDatas);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [one_category_id, page, three_category_id, token, two_category_id]);
  const onRefresh = useCallback(() => {
    fetchSearchProducts();
  }, [fetchSearchProducts]);

  const loadMore = () => {
    if (isLoading || isLoadComplete) {
      return;
    }
    setLoading(true);
    setPage((old) => old + 1);
  };

  const ProductRouter = ProductRoute.useRouteLink();
  const MysteryRouter = MysteryRoute.useRouteLink();

  const onPress = useCallback(
    (item, index) => {
      if (item.product_type === 1) {
        //1 --福袋，2--直购，3--大转盘 4---vip商品 5---专题页 6---特殊页面
        MysteryRouter.navigate({productId: item.product_id});
      } else if (item.product_type === 2 || item.product_type === 4) {
        ProductRouter.navigate({productId: item.product_id});
      }
    },
    [MysteryRouter, ProductRouter],
  );

  const RenderItem = useCallback(
    ({item, index}) => {
      return <BoxCard data={item} onPress={() => onPress(item, index)} />;
    },
    [onPress],
  );

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  return (
    <View style={{backgroundColor: 'white'}}>
      {isLoadComplete && boxData.length === 0 ? (
        <View
          style={{
            alignContent: 'center',
            alignSelf: 'center',
          }}>
          <Empty
            image={require('../../assets/empty.png')}
            title={'Nothing at all'}
          />
        </View>
      ) : (
        <FlatList
          numColumns={2}
          style={{paddingTop: 10 * px}}
          data={boxData}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={() => {
            if (isLoadComplete) {
              return <View style={{height: 20 * px}} />;
            }
            return isRefreshing ? (
              <></>
            ) : (
              <ActivityIndicator color={PRIMARY} style={{padding: 10}} />
            );
          }}
          onEndReachedThreshold={0.4}
          onEndReached={loadMore}
          renderItem={RenderItem}
          keyExtractor={(_item, index) => index.toString()}
        />
      )}
    </View>
  );
};
