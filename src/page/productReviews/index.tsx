import {CommonApi} from '@src/apis';
import {createStyleSheet} from '@src/helper/helper';
import {useNavigationParams} from '@src/hooks/useNavigationParams';
import {ProductReviewsRouteParams} from '@src/routes';
import {InfiniteFlatList} from '@src/widgets/infiniteList/infiniteFlatList';
import {useNavigationHeader} from '@src/widgets/navigationHeader';
import {ReviewItem} from '@src/widgets/productDetail/productReview';
import {Space} from '@src/widgets/space';
import React, {FC, useState} from 'react';
import {View} from 'react-native';

const ProductReviews: FC = () => {
  const [total, setTotal] = useState(0);
  const {productId, productType} = useNavigationParams<
    ProductReviewsRouteParams
  >();
  const fetchData = (page: number) => {
    return CommonApi.commitListUsingPOST({
      page,
      product_type: +productType,
      product_id: +productId,
    }).then((res) => {
      if (res.data.comment_total) {
        setTotal(res.data.comment_total);
      }
      return {list: res.data.list};
    });
  };
  useNavigationHeader({
    title: `Reviews${total ? `(${total})` : ''}`,
  });
  return (
    <View style={ProductReviewsStyles.container}>
      <InfiniteFlatList
        style={{flex: 1}}
        fetch={fetchData}
        ItemSeparatorComponent={() => (
          <Space
            height={1}
            backgroundColor={'#e5e5e5'}
            marginLeft={16}
            marginRight={16}
          />
        )}
        renderItem={({item}) => {
          return (
            <View style={ProductReviewsStyles.content}>
              <ReviewItem data={item} isAllReviews />
            </View>
          );
        }}
      />
    </View>
  );
};

const ProductReviewsStyles = createStyleSheet({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
});

export default ProductReviews;
