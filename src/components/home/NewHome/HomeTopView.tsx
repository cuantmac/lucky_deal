import {useNavigation} from '@react-navigation/core';
import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {SectionListData, ActivityIndicator} from 'react-native';
import Api from '../../../Api';
import {px} from '../../../constants/constants';
import {ResponseError} from '../../../types/models/common.model';
import {
  MBestGoodsListApi,
  MHomeIndexApi,
  MHomeMysteryBoxesApi,
} from '../../../types/models/config.model';
import {useFetching} from '../../../utils/hooks';
import {arrTrans} from '../../../utils/Utils';
import Empty from '../../common/Empty';
import {HomeHeader} from './HomeHeader';
import {HomeViewBackground, ItemRender} from './HomeComponent';
import {HomePlaceHolder} from '../placeholder/HomePlaceHolder';
import {MRecommendProduct, ProductSimpleBaseItem} from '@luckydeal/api-common';
import {RecommendListHeader} from '../../../widgets/productItem/RecommendListHeader';
import {FlatList} from 'react-native-gesture-handler';
import {useMemo} from 'react';
import {MysteryRoute, ProductRoute} from '../../../routes';

const HomeTopView: FC = () => {
  const [, homeIndexFetch] = useFetching<any>(
    () =>
      Promise.all([
        Api.mHomeIndex(),
        Api.mHomemySteryBoxes(),
        Api.mBestGoodsList(1),
      ]),
    undefined,
    true,
  );
  const [, mBestGoodsListFetch] = useFetching<
    MBestGoodsListApi.RootObject & ResponseError
  >(Api.mBestGoodsList);

  const [bestListLoading, setBestListLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageHasEnd, setPageHasEnd] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const page = useRef(1);
  const [goodsList, setGoodsList] = useState<
    Array<SectionListData<ProductSimpleBaseItem[]>>
  >();
  const goodsListRef = useRef<Array<ProductSimpleBaseItem>>([]);
  const [homeIndexData, setHomeIndexData] = useState<
    MHomeIndexApi.MHomeIndexResponse
  >({} as MHomeIndexApi.MHomeIndexResponse);
  const [homeSteryBoxes, setHomeSteryBoxes] = useState<
    MHomeMysteryBoxesApi.MHomeMysteryBoxesResponse
  >({
    module_name: '',
    list: [],
  } as MHomeMysteryBoxesApi.MHomeMysteryBoxesResponse);

  const filterDataList = useCallback((data: MRecommendProduct) => {
    let bestData = data;
    if (page.current === 1) {
      if (!bestData.product_list || bestData.product_list.length === 0) {
        return;
      } else {
        page.current++;
        goodsListRef.current = bestData.product_list;
      }
    } else {
      if (!bestData.product_list) {
        setPageHasEnd(true);
        return;
      } else if (bestData.product_list.length < 2) {
        setPageHasEnd(true);
        goodsListRef.current = [
          ...goodsListRef.current,
          ...bestData.product_list,
        ];
      } else {
        page.current++;
        goodsListRef.current = [
          ...goodsListRef.current,
          ...bestData.product_list,
        ];
      }
    }

    let newList = arrTrans(2, goodsListRef.current);
    setGoodsList([{data: newList, title: bestData.title}]);
  }, []);

  const resetData = useCallback(() => {
    goodsListRef.current = [];
    page.current = 1;
    setPageHasEnd(false);
    setGoodsList([]);
    setIsRefreshing(false);
    setLoading(false);
  }, []);

  const getHomeIndexData = useCallback(async () => {
    resetData();
    setLoading(true);
    let [res, steryBoxesRes, bestListRes] = await homeIndexFetch();
    if (res.code === 0) {
      setHomeIndexData(res?.data);
    }
    if (steryBoxesRes.code === 0) {
      setHomeSteryBoxes(steryBoxesRes?.data);
    }
    if (bestListRes.code === 0) {
      filterDataList(bestListRes.data);
    }
    setLoading(false);
    setIsRefreshing(false);
  }, [filterDataList, homeIndexFetch, resetData]);

  const getBestGoodsList = useCallback(async () => {
    if (pageHasEnd) {
      return;
    }
    setBestListLoading(true);
    let res = await mBestGoodsListFetch(page.current);
    if (res.code === 0) {
      let bestData = res.data;
      filterDataList(bestData);
      setBestListLoading(false);
    } else {
      goodsListRef.current = [];
      setGoodsList([]);
      setBestListLoading(false);
    }
    setIsRefreshing(false);
  }, [filterDataList, mBestGoodsListFetch, pageHasEnd]);

  const {data, title} = useMemo(() => {
    if (!goodsList || !goodsList.length) {
      return {
        data: [],
        title: '',
      };
    }
    return {
      data: goodsList[0].data,
      title: goodsList[0].title,
    };
  }, [goodsList]);

  useEffect(() => {
    getHomeIndexData();
  }, [getHomeIndexData]);

  const onRefresh = useCallback(() => {
    page.current = 1;
    setGoodsList([]);
    getHomeIndexData();
    pageHasEnd && setPageHasEnd(false);
  }, [getHomeIndexData, pageHasEnd]);

  useEffect(() => {
    if (isRefreshing) {
      onRefresh();
    }
  }, [isRefreshing, onRefresh]);

  const ProductRouter = ProductRoute.useRouteLink();
  const MysteryRouter = MysteryRoute.useRouteLink();

  const goDetail = useCallback(
    (item, index) => {
      if (item.product_category === 1) {
        //1 --福袋，2--直购，3--大转盘 4---vip商品 5---专题页 6---特殊页面
        MysteryRouter.navigate({
          productId: item.bag_id || item.product_id,
        });
      } else if (item.product_category === 2 || item.product_category === 4) {
        ProductRouter.navigate({
          productId: item.bag_id || item.product_id,
        });
      }
    },
    [MysteryRouter, ProductRouter],
  );

  if (loading) {
    return (
      <>
        <HomePlaceHolder />
      </>
    );
  }

  return (
    <HomeViewBackground>
      {loading ? (
        <HomePlaceHolder />
      ) : (
        <FlatList
          data={data}
          refreshing={isRefreshing}
          onRefresh={() => {
            setIsRefreshing(true);
          }}
          ListEmptyComponent={
            <Empty
              title={'Nothing at all'}
              onRefresh={() => {
                getHomeIndexData();
              }}
            />
          }
          renderItem={({
            item,
            index,
          }: {
            item: ProductSimpleBaseItem[];
            index: number;
          }) => {
            return (
              <ItemRender
                item={item}
                index={index}
                goDetail={goDetail}
                key={index}
              />
            );
          }}
          style={{
            marginHorizontal: 15 * px,
            marginVertical: 20 * px,
          }}
          onEndReachedThreshold={0.1}
          onEndReached={() => {
            !pageHasEnd && !bestListLoading && getBestGoodsList();
          }}
          ListFooterComponent={
            bestListLoading ? (
              <ActivityIndicator
                color={'red'}
                style={{paddingVertical: 10 * px, marginVertical: 10 * px}}
              />
            ) : null
          }
          ListHeaderComponent={
            <>
              <HomeHeader
                homeIndexData={homeIndexData}
                homeSteryBoxes={homeSteryBoxes}
              />
              <RecommendListHeader>{title}</RecommendListHeader>
            </>
          }
          keyExtractor={(item, index) => index + ''}
        />
      )}
    </HomeViewBackground>
  );
};
export default HomeTopView;
