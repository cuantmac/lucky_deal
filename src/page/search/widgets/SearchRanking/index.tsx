import {View, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import {createStyleSheet, styleAdapter} from '@src/helper/helper';
import {CommonApi} from '@src/apis';

import {
  ProductCardItem1_2_5,
  ProductListData,
  PRODUCT_CARD_DEFAULT_CONFIG,
} from '@src/widgets/productListItem';

import Title from './Title';
import ViewAllItem from './ViewAllItem';

const SearchRanking = () => {
  const [products, setProducts] = useState<ProductListData[]>([]);

  useEffect(() => {
    CommonApi.searchUsingPOST({page: 1, page_size: 10}).then((res) => {
      const data = res.data.list as any;
      setProducts(data);
    });
  }, []);
  if (!products?.length) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Title />
      <FlatList
        keyboardShouldPersistTaps={'handled'}
        showsHorizontalScrollIndicator={false}
        viewabilityConfig={{itemVisiblePercentThreshold: 100}}
        horizontal={true}
        data={products}
        renderItem={({item}) => {
          return (
            <View key={item.product_id} style={styleAdapter({marginRight: 15})}>
              <ProductCardItem1_2_5
                data={item}
                key={item.product_id}
                config={{
                  ...PRODUCT_CARD_DEFAULT_CONFIG,
                  show_product_sales: 0,
                }}
              />
            </View>
          );
        }}
        keyExtractor={(item, index) => item.product_id.toString() + index}
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    marginTop: 20,
  },
  list: {
    marginTop: 10,
  },
  contentContainer: {
    paddingLeft: 15,
  },
});
export default SearchRanking;
