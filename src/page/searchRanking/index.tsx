import React, {useCallback} from 'react';
import {View} from 'react-native';
import {createStyleSheet} from '@src/helper/helper';
import {InfiniteFlatList} from '@src/widgets/infiniteList/infiniteFlatList';
import {CommonApi} from '@src/apis';
import {
  ProductCardItem,
  PRODUCT_CARD_DEFAULT_CONFIG,
} from '@src/widgets/productListItem';
import {useNavigationHeader} from '@src/widgets/navigationHeader';
function SearchRanking() {
  useNavigationHeader({
    title: ' Search Ranking',
  });
  const fetchData = useCallback((page: number, size: number) => {
    return CommonApi.searchUsingPOST({
      page,
      page_size: size,
    }).then((res) => {
      return {
        list: res.data.list,
      };
    });
  }, []);
  return (
    <View style={styles.container}>
      <InfiniteFlatList
        style={{flex: 1}}
        fetch={fetchData}
        pullDownRefresh
        renderItem={({item}) => {
          return (
            <ProductCardItem
              data={item}
              config={{
                ...PRODUCT_CARD_DEFAULT_CONFIG,
                show_product_sales: 0,
              }}
            />
          );
        }}
      />
    </View>
  );
}

const styles = createStyleSheet({
  container: {flex: 1},
});
export default SearchRanking;
