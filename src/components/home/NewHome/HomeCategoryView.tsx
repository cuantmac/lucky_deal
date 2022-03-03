import {ActivityIndicator, View} from 'react-native';
import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {useIsFocused} from '@react-navigation/core';
import {Animated, Dimensions} from 'react-native';
import Api from '../../../Api';
import {
  FROM_MYSTERY,
  FROM_OFFERS,
  FROM_SUPER_BOX,
  px,
} from '../../../constants/constants';
import Empty from '../../common/Empty';
import AuctionListHolder from '../placeholder/AuctionListHolder';
import {WaterfallList} from 'react-native-largelist-v3';
import {WithLastDateHeader} from '../../common/WithLastDateHeader';
import {useFetching} from '../../../utils/hooks';
import {
  CategoryThreeItem,
  CategoryTwoItem,
  HomeBannerListItem,
  MCategoryProductListApi,
} from '../../../types/models/config.model';
import {ResponseError} from '../../../types/models/common.model';
import ActivitySwiper from './ActivitySwiper';
// import NavProductListHeader from './NavProductListHeader';
import {CategoryThreeTabs, CategoryTwoTabs} from './HomeComponent';
import {CategoryTwoList} from '../../../types/models/product.model';
import {PRIMARY} from '../../../constants/colors';
import {
  getProductItemHeight,
  ProductListItem,
} from '../../../widgets/productItem/ProductListItem';
import {ProductSimpleBaseItem} from '@luckydeal/api-common';
import {MysteryRoute, ProductRoute} from '../../../routes';
const ActivitySwiperEl = ActivitySwiper as any;
const {width: screenWidth} = Dimensions.get('window');

interface HomeCategoryViewProps {
  route: any;
  navigation: any;
}

const HomeCategoryView: FC<HomeCategoryViewProps> = ({navigation, route}) => {
  const data = route?.params;
  const [dataList, setDataList] = useState<ProductSimpleBaseItem[]>([]);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [bannerImage, setBannerImage] = useState<HomeBannerListItem[]>();
  const pageRef = useRef(1);
  const dataListRef = useRef<ProductSimpleBaseItem[]>([]);
  const [isRefreshing, setRefreshing] = useState(false);
  // const [activeId, setActiveId] = useState<number>();
  // const dispatch = useDispatch();
  const waterfallListRef = useRef<WaterfallList<ProductSimpleBaseItem>>(null);
  const focus = useIsFocused();

  const [scrollY] = useState(new Animated.Value(0));

  const contentHeightRef = useRef(0);
  const loadingRef = useRef(false);
  const allLoadedRef = useRef(false);
  const [, ProductListFetch] = useFetching<
    MCategoryProductListApi.RootObject & ResponseError
  >(Api.mCategoryProductList);

  const [, categoryTwoFetch] = useFetching<
    CategoryTwoList.RootObject & ResponseError
  >(Api.categoryInfo);
  const [loading, setLoading] = useState(true);
  const [categoryTwoList, setCategoryTwoList] = useState<CategoryTwoItem[]>([]);
  const [categoryThreeList, setCategoryThreeList] = useState<
    CategoryThreeItem[]
  >([]);
  const [categoryTwoActive, setCategoryTwoActive] = useState(-1);
  const [categoryThreeActive, setCategoryThreeActive] = useState(-1);
  const [level, setLevel] = useState(0);
  const [id, setId] = useState(0);

  const getActiveIndex = (
    initId: number,
    list: CategoryTwoItem[] | CategoryThreeItem[],
    type: number,
  ) => {
    let index = 0;
    if (type === 2) {
      index = list.findIndex((item: any) => item.two_item_id === initId);
    } else {
      index = list.findIndex((item: any) => item.three_item_id === initId);
    }
    // let _i = index > 0 ? index : 0;
    return index;
  };
  // 获取二级分类
  const getCategoryData = useCallback(
    async (itemId) => {
      let res = await categoryTwoFetch(itemId);
      if (res.code === 0) {
        let list = res.data?.list || [];
        setCategoryTwoList(list);
        if (list.length === 0) {
          setEmpty(true);
          return;
        }
        let activeTwoIndex = getActiveIndex(data.two_category_id, list, 2);
        if (activeTwoIndex !== -1) {
          setCategoryTwoActive(list[activeTwoIndex].two_item_id);
        }
        let twoIndex = activeTwoIndex > -1 ? activeTwoIndex : 0;
        // setCategoryTwoActive(list[activeTwoIndex].two_item_id);
        let threeList = list[twoIndex].child_item;

        setCategoryThreeList(threeList);
        if (threeList.length === 0) {
          return;
        }
        let activeThreeIndex = getActiveIndex(
          data.three_category_id,
          threeList,
          3,
        );
        if (activeThreeIndex !== -1) {
          setCategoryThreeActive(threeList[activeThreeIndex].three_item_id);
        }
        // setCategoryThreeActive(threeList[activeThreeIndex].three_item_id);

        setLoading(false);
      } else {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categoryTwoFetch],
  );
  // 获取数据fun
  const getProductList = useCallback(
    async (itemId: number) => {
      setError(false);

      let res = await ProductListFetch(
        itemId,
        level,
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
      setDataList(dataListRef.current || []);
      setRefreshing(false);
      waterfallListRef.current?.endRefresh();
      loadingRef.current = false;
      pageRef.current += 1;
    },
    [ProductListFetch, data.item_type, level],
  );
  const selectTab = useCallback(
    (type, itemId, i) => {
      setId(itemId);
      if (type === 2) {
        setLevel(2);
        setCategoryTwoActive(itemId);
        let threeList = categoryTwoList[i].child_item;
        setCategoryThreeList(threeList || []);
      } else {
        setLevel(3);
        setCategoryThreeActive(itemId);
      }
    },
    [categoryTwoList],
  );

  useEffect(() => {
    if (!focus) {
      return;
    }
    getCategoryData(data.one_category_id);
    pageRef.current = 1;
    setLevel(data.item_level);
    // setRefreshing(true);
    setBannerImage(data.banner_list || []);
    setId(
      data.item_level === 1
        ? data.one_category_id
        : data.item_level === 2
        ? data.two_category_id
        : data.three_category_id,
    );
  }, [data, focus, getCategoryData]);
  useEffect(() => {
    if (focus && id) {
      onRefresh();
    }
  }, [id, focus]);
  useEffect(() => {
    if (isRefreshing && focus) {
      getProductList(id);
    }
  }, [getProductList, focus, isRefreshing, id]);

  //下拉刷新
  const onRefresh = () => {
    pageRef.current = 1;
    allLoadedRef.current = false;
    // showTypeRef.current = 2;
    setRefreshing(true);
  };
  const onLoadMore = (y: number) => {
    if (
      contentHeightRef.current > 0 &&
      y >= contentHeightRef.current &&
      !loadingRef.current &&
      !allLoadedRef.current
    ) {
      // showTypeRef.current = 1;
      loadingRef.current = true;
      getProductList(id);
    }
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

  const renderItem = (item: ProductSimpleBaseItem, index: number) => (
    <View
      style={{
        margin: 5,
      }}>
      <ProductListItem data={item} onPress={() => goDetail(item, index)} />
    </View>
  );

  const HeaderView = () => {
    return (
      <View>
        <CategoryTwoTabs
          tabList={categoryTwoList || []}
          activeTab={categoryTwoActive}
          selectTab={selectTab}
        />
        {bannerImage && bannerImage.length > 0 ? (
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
        ) : (
          <View style={{height: 0}} />
        )}
        <CategoryThreeTabs
          tabList={categoryThreeList}
          activeTab={categoryThreeActive}
          selectTab={selectTab}
        />
      </View>
    );
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
  if (loading && dataList.length === 0) {
    return (
      <>
        <AuctionListHolder headerShown={true} />
      </>
    );
  }
  return (
    <View style={{flex: 1}}>
      {isRefreshing ? (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 120 * px,
            bottom: 0,
            zIndex: 9999,
          }}>
          <ActivityIndicator
            color={PRIMARY}
            style={{flex: 1, backgroundColor: '#fff'}}
          />
        </View>
      ) : empty ? (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 260 * px,
            bottom: 0,
            zIndex: 9999,
          }}>
          {/* <View style={{height: 5 * px, backgroundColor: '#eee'}} /> */}
          <Empty
            title={'Nothing at all'}
            image={require('../../../assets/empty.png')}
          />
        </View>
      ) : null}
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
    </View>
  );
};

export default HomeCategoryView;
