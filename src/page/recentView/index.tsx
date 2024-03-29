import {CommonApi} from '@src/apis';
import {createStyleSheet} from '@src/helper/helper';
import {InfiniteFlatList} from '@src/widgets/infiniteList/infiniteFlatList';
import {useNavigationHeader} from '@src/widgets/navigationHeader';
import {
  ProductCardItem1_2,
  PRODUCT_CARD_DEFAULT_CONFIG,
} from '@src/widgets/productListItem';
import React, {FC, useCallback} from 'react';

const RecentView: FC = () => {
  useNavigationHeader({
    title: ' Recently Viewed',
  });

  const fetchData = useCallback((page: number, size: number) => {
    return CommonApi.userBrowseProductListUsingPOST({
      page,
      page_size: size,
    }).then((res) => {
      return {
        list: res.data.list,
      };
    });
  }, []);

  return (
    <InfiniteFlatList
      style={{flex: 1}}
      fetch={fetchData}
      pullDownRefresh
      numColumns={2}
      columnWrapperStyle={RecentViewStyles.columnContainer}
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

const RecentViewStyles = createStyleSheet({
  columnContainer: {
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
});

export default RecentView;
