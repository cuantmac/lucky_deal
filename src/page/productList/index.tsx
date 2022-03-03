import {View, ScrollViewProps, FlatList} from 'react-native';
import React, {useCallback, useState, useRef, useMemo} from 'react';
import {CommonApi} from '@src/apis';
import {useNavigationParams} from '@src/hooks/useNavigationParams';
import {ProductListRouteParams, SearchRoute, ShopPushRoute} from '@src/routes';
import {createStyleSheet} from '@src/helper/helper';
import {TopAnchor, TopAnchorRef} from '@src/widgets/anchor/topAnchor';
import {
  InfiniteFlatList,
  InfiniteFlatListProps,
} from '@src/widgets/infiniteList/infiniteFlatList';
import {
  ProductCardItem,
  ProductCardItem1_2,
  PRODUCT_CARD_DEFAULT_CONFIG,
} from '@src/widgets/productListItem';
import {ProductSimpleBaseItem} from '@luckydeal/api-common';
import {CustomHeader} from '@src/widgets/navigationHeader/customHeader';
import {HeaderIcon} from '@src/widgets/navigationHeader/widgets';
import {SearchBarStatic} from '@src/widgets/searchBar';
import {ControlBar, DIRECTION_ENUM} from './widgets/controlBar';
import {BACKGROUND_BASE_COLOR} from '@src/constants/colors';

const ProductList = () => {
  const params = useNavigationParams<ProductListRouteParams>();
  const scrollRef = useRef<FlatList>(null);
  const topAnchorRef = useRef<TopAnchorRef>(null);

  const ShopPushRouter = ShopPushRoute.useRouteLink();
  const SearchRouter = SearchRoute.useRouteLink();

  /**
   * 商品排列方式 horizontal 水平排列  vertical 垂直排列
   */
  const [direction, setDirection] = useState<DIRECTION_ENUM>(
    DIRECTION_ENUM.VERTICAL,
  );

  const [sort, setSort] = useState(0);

  const fetchProductData = useCallback(
    (page: number, size: number) => {
      return CommonApi.productSearchUsingPOST({
        key_word: params.keyword || '',
        limit: size,
        one_item_id: +(params.topCategoryId || 0),
        two_item_id: +(params.secondCategoryId || 0),
        three_item_id: +(params.threeCategoryId || 0),
        sort,
        page,
      }).then((res) => {
        return {
          list: res.data.list,
        };
      });
    },
    [
      params.keyword,
      params.secondCategoryId,
      params.threeCategoryId,
      params.topCategoryId,
      sort,
    ],
  );

  const handleScroll = useCallback<NonNullable<ScrollViewProps['onScroll']>>(
    (scrollParams) => {
      topAnchorRef.current?.scroll(scrollParams);
    },
    [],
  );

  const handleShopPress = useCallback(() => {
    ShopPushRouter.navigate({behavior: 'back'});
  }, [ShopPushRouter]);

  const renderItem = useCallback<
    NonNullable<InfiniteFlatListProps<ProductSimpleBaseItem>['renderItem']>
  >(
    ({item}) => {
      if (direction === DIRECTION_ENUM.VERTICAL) {
        return (
          <ProductCardItem1_2
            style={{marginLeft: 0, marginRight: 0}}
            config={{
              ...PRODUCT_CARD_DEFAULT_CONFIG,
              show_shop_bags: 0,
              show_product_sales: 0,
            }}
            data={item}
          />
        );
      }
      return (
        <ProductCardItem
          data={item}
          config={{
            ...PRODUCT_CARD_DEFAULT_CONFIG,
            show_shop_bags: 0,
            show_product_sales: 0,
          }}
        />
      );
    },
    [direction],
  );

  const key = useMemo(() => {
    return JSON.stringify(params) + sort;
  }, [params, sort]);

  rlog(params);

  return (
    <View
      style={[
        productListStyles.container,
        direction === DIRECTION_ENUM.VERTICAL &&
          productListStyles.verticalScroll,
      ]}>
      <CustomHeader
        headerStyle={productListStyles.headerContainer}
        headerBackVisible={params.behavior === 'back'}
        headerLeft={[
          <View style={productListStyles.searchBarContainer}>
            <SearchBarStatic
              placeholder={params.keyword}
              onPress={() => SearchRouter.navigate()}
            />
          </View>,
        ]}
        headerRight={
          <HeaderIcon
            size={20}
            source={require('@src/assets/productList/shopcar.png')}
            onPress={handleShopPress}
          />
        }
      />
      <ControlBar
        direction={direction}
        sort={sort}
        onDirectionChange={setDirection}
        onSortChange={setSort}>
        <InfiniteFlatList
          key={key}
          ref={scrollRef}
          numColumns={direction === DIRECTION_ENUM.VERTICAL ? 2 : 1}
          columnWrapperStyle={
            direction === DIRECTION_ENUM.VERTICAL &&
            productListStyles.verticalContainer
          }
          pullDownRefresh
          onScroll={handleScroll}
          showsVerticalScrollIndicator={false}
          scrollsToTop={true}
          renderItem={renderItem}
          fetch={fetchProductData}
        />
      </ControlBar>
      <TopAnchor ref={topAnchorRef} scrollRef={scrollRef} />
    </View>
  );
};

const productListStyles = createStyleSheet({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  verticalScroll: {
    backgroundColor: BACKGROUND_BASE_COLOR,
  },
  verticalContainer: {
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  verticalColumn: {
    flexDirection: 'column',
  },
  headerContainer: {
    borderBottomWidth: 0,
  },
  searchBarContainer: {
    width: 286,
    paddingLeft: 12,
  },
});

export default ProductList;
