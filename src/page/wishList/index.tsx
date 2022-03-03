import {CommonApi} from '@src/apis';
import {createStyleSheet} from '@src/helper/helper';
import {InfiniteFlatList} from '@src/widgets/infiniteList/infiniteFlatList';
import {useNavigationHeader} from '@src/widgets/navigationHeader';
import {
  ProductCardItem1_2,
  PRODUCT_CARD_DEFAULT_CONFIG,
} from '@src/widgets/productListItem';
import React, {FC, useCallback} from 'react';

const WishList: FC = () => {
  useNavigationHeader({
    title: ' Wish List',
  });

  const fetchData = useCallback((page: number, size: number) => {
    return CommonApi.productUserLikeListUsingPOST({
      page,
      page_size: size,
    }).then((res) => {
      return {
        list: res.Data.list,
      };
    });
  }, []);

  return (
    <InfiniteFlatList
      style={{flex: 1}}
      fetch={fetchData}
      pullDownRefresh
      numColumns={2}
      columnWrapperStyle={WishListStyles.columnContainer}
      renderItem={({item}) => {
        return (
          <ProductCardItem1_2
            style={{marginLeft: 0, marginRight: 0}}
            data={item}
            config={{
              ...PRODUCT_CARD_DEFAULT_CONFIG,
              show_product_sales: 0,
            }}
          />
        );
      }}
    />
  );
};

const WishListStyles = createStyleSheet({
  columnContainer: {
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
});

export default WishList;
