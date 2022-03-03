import {View} from 'react-native';
import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/core';
import {Animated, Dimensions} from 'react-native';
import Api from '../../../Api';
import {px} from '../../../constants/constants';
import Empty from '../../common/Empty';
import AuctionListHolder from '../placeholder/AuctionListHolder';
import {WaterfallList} from 'react-native-largelist-v3';
import {WithLastDateHeader} from '../../common/WithLastDateHeader';
import {useFetching} from '../../../utils/hooks';
import {
  HomeBannerListItem,
  MCategoryProductListApi,
} from '../../../types/models/config.model';
import {ResponseError} from '../../../types/models/common.model';
import ActivitySwiper from './ActivitySwiper';
import {
  getProductItemHeight,
  ProductListItem,
} from '../../../widgets/productItem/ProductListItem';
import {ProductSimpleBaseItem} from '@luckydeal/api-common';
import {MysteryRoute, ProductRoute} from '../../../routes';
const ActivitySwiperEl = ActivitySwiper as any;
const {width: screenWidth} = Dimensions.get('window');

interface HomeSubjectViewProps {
  navigation: any;
  route: any;
}
const HomeSubjectView: FC<HomeSubjectViewProps> = ({navigation, route}) => {
  // const navigation = useNavigation();
  // const route = useRoute();
  const data = route?.params;

  const [dataList, setDataList] = useState<ProductSimpleBaseItem[]>([]);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [bannerImage, setBannerImage] = useState<HomeBannerListItem[]>();
  const pageRef = useRef(1);
  const dataListRef = useRef<ProductSimpleBaseItem[]>([]);
  const [isRefreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();
  const waterfallListRef = useRef<WaterfallList<ProductSimpleBaseItem>>(null);
  const focus = useIsFocused();

  const [scrollY] = useState(new Animated.Value(0));

  const contentHeightRef = useRef(0);
  const loadingRef = useRef(false);
  const allLoadedRef = useRef(false);
  const [, ProductListFetch] = useFetching<
    MCategoryProductListApi.RootObject & ResponseError
  >(Api.mCategoryProductList);

  // 获取数据fun
  const getProductList = useCallback(async () => {
    setError(false);
    let res = await ProductListFetch(
      data.item_id,
      data.item_level,
      data.item_type,
      pageRef.current,
    );

    if (res.error) {
      setRefreshing(false);
      waterfallListRef.current?.endRefresh();
      setError(true);
      dataListRef.current = [];
      setDataList(dataListRef.current);
      return;
    }
    // setItemName(res.data.item_name || '');
    let list = res.data.list || [];
    if (pageRef.current === 1) {
      dataListRef.current = list;
      setEmpty(list.length === 0);
    } else if (list.length > 0) {
      list.forEach((item) => {
        dataListRef.current.push(item);
      });
    } else {
      allLoadedRef.current = true;
    }
    console.log('----dataListRef.current', dataListRef.current.length);
    setDataList(dataListRef.current || []);

    setRefreshing(false);
    waterfallListRef.current?.endRefresh();
    loadingRef.current = false;
    pageRef.current += 1;
  }, [ProductListFetch, data.item_id, data.item_level, data.item_type]);
  useEffect(() => {
    pageRef.current = 1;
    setRefreshing(true);
    setBannerImage(data.banner_list || []);
  }, [data]);
  useEffect(() => {
    if (isRefreshing && focus) {
      getProductList();
    }
  }, [getProductList, focus, isRefreshing]);

  useEffect(() => {
    if (focus && dataList.length === 0) {
      pageRef.current = 1;
      setRefreshing(true);
    }
  }, [dataList.length, dispatch, focus]);
  //下拉刷新
  const onRefresh = () => {
    pageRef.current = 1;
    allLoadedRef.current = false;
    setRefreshing(true);
  };

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
  const HeaderView = () => {
    return (
      <View>
        {bannerImage && bannerImage?.length > 0 ? (
          <ActivitySwiperEl
            type={'home'}
            homeStyle={{
              height: 430 * px,
              with: screenWidth,
            }}
            bannerList={bannerImage || []}
            itemWidth={screenWidth}
            itemHeight={430 * px}
            onPress={() => {}}
          />
        ) : null}
      </View>
    );
  };
  const renderItem = (item: ProductSimpleBaseItem, index: number) => (
    <View
      style={{
        margin: 5,
      }}>
      <ProductListItem data={item} onPress={() => goDetail(item, index)} />
    </View>
  );
  const onLoadMore = (y: number) => {
    if (
      contentHeightRef.current > 0 &&
      y >= contentHeightRef.current &&
      !loadingRef.current &&
      !allLoadedRef.current
    ) {
      // showTypeRef.current = 1;
      loadingRef.current = true;
      getProductList();
    }
  };
  if (error && focus) {
    return (
      <Empty
        error={true}
        onRefresh={() => {
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
  return (
    <View style={{flex: 1}}>
      {empty ? (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0 * px,
            bottom: 0,
            zIndex: 9999,
          }}>
          <View style={{height: 5 * px, backgroundColor: '#eee'}} />
          <Empty
            title={'Nothing at all'}
            image={require('../../../assets/empty.png')}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
          }}>
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
            renderHeader={HeaderView}
            data={dataList}
            numColumns={2}
            heightForItem={getProductItemHeight}
            renderItem={renderItem}
          />
        </View>
      )}
    </View>
  );
};

export default HomeSubjectView;
