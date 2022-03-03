import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MysteryRoute, ProductRoute} from '@src/routes';
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatListProps,
  ImageProps,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {WaterfallList, WaterfallListType} from 'react-native-largelist-v3';
import {
  categoryDetailPath,
  categoryDetailProductClick,
  categoryDetailProductShow,
  categoryDetailShow,
  categoryDetailSlide,
  categoryDetailSortClick,
  categoryDetailSortItemClick,
  categoryDetailThiredCategoryClick,
  categoryDetailThiredCategorySlide,
} from '../../analysis/report';
import Api from '../../Api';
import {PRIMARY} from '../../constants/colors';
import {
  FROM_MYSTERY,
  FROM_OFFERS,
  FROM_SUPER_BOX,
  px,
} from '../../constants/constants';
import {reportData} from '../../constants/reportData';
import {CategoryTwoList, SearchResult} from '../../types/models/product.model';
import {useShallowEqualSelector} from '../../utils/hooks';
import {navigationRef} from '../../utils/refs';
import {
  getProductItemHeight,
  ProductListItem,
} from '../../widgets/productItem/ProductListItem';
import Empty from '../common/Empty';
import {Expand, ExpandProps} from '../common/Expand';
import {WithLastDateHeader} from '../common/WithLastDateHeader';
import GlideImageWeak from '../native/GlideImage';

let GlideImage: any = GlideImageWeak;

const FILTER_OPTIONS = [
  {
    name: 'Best Match',
    id: 0,
  },
  {
    name: 'Orders',
    id: 1,
  },
  {
    name: 'Date Added (New to Old)',
    id: 2,
  },
  {
    name: 'Price (High to Low)',
    id: 3,
  },
  {
    name: 'Price (Low to High)',
    id: 4,
  },
];

interface CategoryDetailParams {
  topId: number;
  categoryList: CategoryTwoList.List;
  item?: CategoryTwoList.threeDataProps;
}

type NavigationParams = {
  CategoryDetail: CategoryDetailParams;
  SearchInput: {needShowSearchKeyWords: string};
};

const CategoryDetail: FC = () => {
  const navigation = useNavigation<StackNavigationProp<NavigationParams>>();
  const {params} = useRoute<RouteProp<NavigationParams, 'CategoryDetail'>>();
  const {token} = useShallowEqualSelector(
    (state: any) => state.deprecatedPersist,
  );
  const [filterOptions, setFilterOptions] = useState(FILTER_OPTIONS[0]);
  // console.log('---params', params);
  const [
    {three_item_id: selectThreeItemId, three_item_name},
    setSelectThreeItem,
  ] = useState<Partial<NonNullable<CategoryDetailParams['item']>>>(
    params.item || {three_item_id: 0, three_item_name: ''},
  );
  // console.log('params.item---', params.item);
  const waterfallListRef = useRef<WaterfallList<SearchResult.List>>(null);
  const [waterData, setWaterData] = useState<SearchResult.List[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const hasEnd = useRef(false);
  const reportProductHasSlide = useRef(false);
  const reportThreeCategotyHasSlide = useRef(false);

  const placeholder = useMemo(() => {
    return three_item_name || params.categoryList.two_item_name;
  }, [params.categoryList.two_item_name, three_item_name]);

  // 打点获取三级分类的id
  useMemo(() => {
    categoryDetailPath.mergeData({ProductCat: selectThreeItemId});
  }, [selectThreeItemId]);
  // 打点 商品分类列表页-展示
  useEffect(() => {
    categoryDetailShow.pathReporter();
    categoryDetailPath.mergeData({ShowType: 0});
    return () => {
      categoryDetailPath.clear();
    };
  }, []);
  // 打点 商品分类列表页-滑动
  const handleProductListScroll = useCallback<
    NonNullable<WaterfallListType<SearchResult.List>['onScroll']>
  >(() => {
    if (!reportProductHasSlide.current) {
      categoryDetailSlide.pathReporter();
      reportProductHasSlide.current = true;
    }
  }, []);
  // 打点 商品分类列表页三级分类快速导航-滑动
  const handleThreeCategorySlide = useCallback(() => {
    if (!reportThreeCategotyHasSlide.current) {
      categoryDetailThiredCategorySlide.pathReporter();
      reportThreeCategotyHasSlide.current = true;
    }
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      headerTitle: () => {
        return (
          <HeaderSearch
            value={placeholder}
            onPress={() =>
              navigation.navigate('SearchInput', {
                needShowSearchKeyWords: placeholder,
              })
            }
          />
        );
      },
      headerLeft: () => (
        <TouchableOpacity
          style={{
            width: 48,
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => navigation.goBack()}>
          <Image
            resizeMode={'contain'}
            style={{
              width: 16,
              height: 16,
              tintColor: 'black',
            }}
            source={require('../../assets/back.png')}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, placeholder]);

  const getProduct = useCallback(
    // eslint-disable-next-line no-shadow
    async () => {
      const res = await Api.searchResult(
        page,
        '',
        token,
        filterOptions.id,
        params.topId,
        params.categoryList.two_item_id,
        selectThreeItemId || 0,
      );

      if (res.error) {
        throw new Error(res.error);
      }
      if (res.data?.list) {
        return res.data;
      }
      return {list: []} as SearchResult.Data;
    },
    [
      filterOptions.id,
      page,
      params.categoryList.two_item_id,
      params.topId,
      selectThreeItemId,
      token,
    ],
  );

  // 打点 商品分类列表页排序按钮-点击
  const handleExpandOpen = useCallback<
    NonNullable<ExpandProps<typeof FILTER_OPTIONS[0]>['onShow']>
  >(() => {
    categoryDetailSortClick.pathReporter();
  }, []);

  const handleExpandPress = useCallback<ExpandItemProps['onPress']>(
    (item) => {
      if (item.id === filterOptions.id) {
        return;
      }
      setLoading(true);
      setWaterData([]);
      setPage(1);
      setFilterOptions(item);
      waterfallListRef.current?.scrollTo({x: 0, y: 0}, false);
    },
    [filterOptions.id],
  );

  const handleCategoryItemPress = useCallback<CategoryItemListProps['onPress']>(
    (item) => {
      if (item.three_item_id === selectThreeItemId) {
        return;
      }
      // 打点 商品分类列表页三级分类快速导航-点击
      categoryDetailThiredCategoryClick.pathReporter();
      setLoading(true);
      setWaterData([]);
      setPage(1);
      setSelectThreeItem(item);
      waterfallListRef.current?.scrollTo({x: 0, y: 0}, false);
    },
    [selectThreeItemId],
  );

  const ProductRouter = ProductRoute.useRouteLink();
  const MysteryRouter = MysteryRoute.useRouteLink();

  const handleProductPress = useCallback(
    (item: SearchResult.List, index: number) => {
      if (item.product_category === 1) {
        //1 --福袋，2--直购，3--大转盘
        MysteryRouter.navigate({
          productId: item.bag_id || item.product_id,
        });
      } else if (item.product_category === 2 || item.product_category === 4) {
        ProductRouter.navigate({
          productId: item.product_id || item.bag_id,
        });
      }
    },
    [MysteryRouter, ProductRouter],
  );

  const renderExpandItem = useCallback<
    ExpandProps<typeof FILTER_OPTIONS[0]>['renderItem']
  >(
    ({item, closeExpand, index}) => {
      return (
        <ExpandItem
          item={item}
          onPress={() => {
            // 打点 商品分类列表页排序方式-点击
            categoryDetailSortItemClick.pathReporter();
            closeExpand().then(() => {
              handleExpandPress(item);
            });
          }}
          actived={filterOptions.id === item.id}
          isFirst={index === 0}
        />
      );
    },
    [filterOptions.id, handleExpandPress],
  );

  const onRefresh = useCallback<
    NonNullable<WaterfallListType<SearchResult.List>['onRefresh']>
  >(() => {
    //打点 记录showType

    categoryDetailPath.mergeData({ShowType: 2});
    if (page === 1) {
      getProduct()
        .then((data) => {
          setWaterData(data.list);
        })
        .finally(() => {
          waterfallListRef.current?.endRefresh();
        });
    } else {
      setPage(1);
    }
  }, [getProduct, page]);

  const onLoadMore = useCallback<
    NonNullable<WaterfallListType<SearchResult.List>['onLoading']>
  >(() => {
    //打点 记录showType
    categoryDetailPath.mergeData({ShowType: 1});
    if (hasEnd.current) {
      waterfallListRef.current?.endLoading();
    } else {
      setPage(page + 1);
    }
  }, [page]);

  const renderItem = useCallback<
    NonNullable<WaterfallListType<SearchResult.List>['renderItem']>
  >(
    (item, index) => {
      // 打点 商品分类列表页商品-展示
      const pathData = categoryDetailPath.getData();
      categoryDetailProductShow.setDataAndReport({
        ProductCat: pathData.ProductCat,
        ProductId: item.bag_id || item.product_id,
        PageStation: pathData.PageStation,
        ShowType: pathData.ShowType,
        ProdStation: index + 1,
      });
      return (
        <View
          style={{
            margin: 5,
          }}>
          <ProductListItem
            data={item}
            onPress={() => {
              // 打点 商品分类列表页商品-点击
              categoryDetailProductClick.setDataAndReport({
                ProductCat: pathData.ProductCat,
                ProductId: item.bag_id || item.product_id,
                PageStation: pathData.PageStation,
                ProdStation: index + 1,
              });
              handleProductPress(item, index);
            }}
          />
        </View>
      );
    },
    [handleProductPress],
  );

  const loadProduct = useCallback(async () => {
    // 打点 记录页数
    categoryDetailPath.mergeData({PageStation: page});
    try {
      const data = await getProduct();
      // const data = {list: undefined};
      if (!data.list || data.list.length < 20) {
        hasEnd.current = true;
      }
      if (page === 1) {
        setWaterData(data.list);
      }
      if (data.list && data.list.length >= 0 && page !== 1) {
        // eslint-disable-next-line no-shadow
        setWaterData((waterData) => {
          return [...waterData, ...data.list];
        });
      }
    } catch (error) {}
    setLoading(false);
    waterfallListRef.current?.endLoading();
    waterfallListRef.current?.endRefresh();
  }, [getProduct, page]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 30 * px,
          height: 105 * px,
          backgroundColor: 'white',
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Expand
            onShow={handleExpandOpen}
            title={filterOptions.name}
            textStyle={{
              fontWeight: 'bold',
              fontSize: 40 * px,
            }}
            rotateIconStyle={{
              marginLeft: 4 * px,
            }}
            data={FILTER_OPTIONS}
            renderItem={renderExpandItem}
          />
        </View>
      </View>
      <View>
        <CategoryItemList
          onScroll={handleThreeCategorySlide}
          onPress={handleCategoryItemPress}
          data={params.categoryList}
          selectThreeItemId={selectThreeItemId || 0}
        />
      </View>
      {waterData.length === 0 && !loading && (
        <Empty
          image={require('../../assets/empty.png')}
          title={'Nothing at all'}
        />
      )}
      {waterData.length === 0 && loading && (
        <ActivityIndicator color={PRIMARY} style={{marginTop: 300 * px}} />
      )}
      {waterData.length !== 0 && (
        <WaterfallList
          ref={waterfallListRef}
          onScroll={handleProductListScroll}
          onLoading={onLoadMore}
          refreshHeader={WithLastDateHeader}
          onRefresh={onRefresh}
          data={waterData}
          numColumns={2}
          renderItem={renderItem}
          heightForItem={getProductItemHeight}
        />
      )}
    </SafeAreaView>
  );
};

interface HeaderSearchProps {
  value?: string;
  onPress?: () => void;
}

const HeaderSearch: FC<HeaderSearchProps> = ({value, onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        width: 800 * px,
        height: 90 * px,
        backgroundColor: '#ddd',
        borderRadius: (90 * px) / 2,
        paddingLeft: 25 * px,
        justifyContent: 'center',
      }}>
      <Text>{value}</Text>
    </TouchableOpacity>
  );
};

interface ExpandItemProps {
  onPress: (item: typeof FILTER_OPTIONS[0]) => void;
  item: typeof FILTER_OPTIONS[0];
  actived: boolean;
  isFirst: boolean;
}

const ExpandItem: FC<ExpandItemProps> = ({item, onPress, isFirst, actived}) => {
  return (
    <>
      <View
        style={{
          backgroundColor: '#E9E9E9',
          height: 1,
          marginHorizontal: isFirst ? 0 : 30 * px,
        }}
      />
      <TouchableOpacity
        style={{
          height: 136 * px,
          paddingHorizontal: 30 * px,
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
        onPress={() => onPress && onPress(item)}>
        <Text
          style={{fontSize: 36 * px, color: actived ? '#000000' : '#666666'}}>
          {item.name}
        </Text>
        {actived && (
          <Image
            style={{width: 30 * px, height: 20 * px}}
            source={require('../../assets/category/right.png')}
          />
        )}
      </TouchableOpacity>
    </>
  );
};

interface CategoryItemListProps {
  data: CategoryDetailParams['categoryList'];
  onPress: (item: Partial<CategoryTwoList.threeDataProps>) => void;
  onScroll?: FlatListProps<CategoryTwoList.List['child_item']>['onScroll'];
  selectThreeItemId: number;
}
const CategoryItemList: FC<CategoryItemListProps> = memo(
  ({data, onPress, onScroll, selectThreeItemId}) => {
    return (
      <FlatList
        style={{
          backgroundColor: 'white',
          paddingTop: 20 * px,
          paddingBottom: 20 * px,
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => {
          return index + '';
        }}
        onScroll={onScroll}
        data={data.child_item}
        renderItem={({item}) => {
          return (
            <CategoryItem
              onPress={() => onPress && onPress(item)}
              img={{uri: item.picture}}
              title={item.three_item_name}
              active={item.three_item_id === selectThreeItemId}
            />
          );
        }}
        ListFooterComponent={
          <CategoryItem
            onPress={() => onPress && onPress({})}
            img={require('../../assets/viewAll.png')}
            title={'View All'}
            active={!selectThreeItemId}
          />
        }
      />
    );
  },
);

interface CategoryItemProps {
  img: ImageProps['source'];
  title: string;
  onPress: () => void;
  active: boolean;
}

const CategoryItem: FC<CategoryItemProps> = ({img, title, onPress, active}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        alignItems: 'center',
        width: (44 + 135) * px,
        paddingHorizontal: 5 * px,
      }}>
      <View
        style={{
          width: 135 * px,
          height: 135 * px,
          borderRadius: 10 * px,
          backgroundColor: '#F6F6F6',
          padding: 2,
        }}>
        <GlideImage
          showDefaultImage={true}
          source={img}
          defaultSource={require('../../assets/lucky_deal_default_small.png')}
          resizeMode={'contain'}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </View>
      <Text
        numberOfLines={2}
        style={{
          marginTop: 18 * px,
          fontSize: 30 * px,
          color: active ? '#EC3A30' : '#666666',
          textAlign: 'center',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryDetail;
