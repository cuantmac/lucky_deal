import {
  ProductItem,
  ProductSimpleItem,
  ProductSimpleBaseItem,
  SearchRankProductItem,
} from '@luckydeal/api-common';
import {PRODUCT_CATEGPRY_TYPE} from '@src/constants/enum';
import {convertAmountUS, createStyleSheet} from '@src/helper/helper';
import {MysteryRoute, ProductRoute} from '@src/routes';
import React, {useCallback} from 'react';
import {View, Text, TouchableOpacity, ViewStyle, StyleProp} from 'react-native';
import {GlideImage} from '../glideImage';
import {NewHomePageDataItem} from '@luckydeal/api-common/lib/api';

export type ProductListData =
  | ProductItem
  | ProductSimpleItem
  | ProductSimpleBaseItem
  | SearchRankProductItem;

function useProductDetailRoute<T extends ProductListData>(data: T) {
  const ProductRouter = ProductRoute.useRouteLink();
  const MysteryRouter = MysteryRoute.useRouteLink();
  if (data.product_category === PRODUCT_CATEGPRY_TYPE.MYSTERY) {
    return MysteryRouter;
  }
  return ProductRouter;
}

export interface ProductCardItemProps<T extends ProductListData> {
  config?: NewHomePageDataItem;
  data: T;
  onPress?: (data: T) => void;
  style?: StyleProp<ViewStyle>;
}

interface ProductCardItemFactoryParams {
  styles: {
    [P in keyof typeof ProductCardItemStyles]: any;
  };
  showOrders?: boolean;
  titleNumOfLine?: number;
}

export const PRODUCT_CARD_DEFAULT_CONFIG = {
  show_product_name: 1,
  show_active_tags: 0,
  end_time: '',
  id: '',
  name: '',
  show_line_price: 1,
  show_product_sales: 1,
  show_shop_bags: 1,
  start_time: '',
  type: 7,
};

const productCardItemFactory = ({
  styles,
  titleNumOfLine = 2,
}: ProductCardItemFactoryParams) => {
  return function <T extends ProductListData>({
    config = PRODUCT_CARD_DEFAULT_CONFIG,
    data,
    onPress,
    style,
  }: ProductCardItemProps<T>) {
    const ProductRouter = useProductDetailRoute(data);
    const handleOnPress = useCallback(() => {
      ProductRouter.navigate({
        productId: data.product_id || (data as ProductSimpleItem).bag_id,
      });
      onPress && onPress(data);
    }, [ProductRouter, data, onPress]);
    const showLinePrice = !!(
      config?.show_line_price && (data as any).original_price
    );
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleOnPress}
        style={[styles.container, style ? style : null]}>
        <GlideImage style={styles.productImage} source={{uri: data.image}} />
        <View style={styles.infoContent}>
          {config?.show_product_name ? (
            <Text style={styles.title} numberOfLines={titleNumOfLine}>
              {data.title}
            </Text>
          ) : null}
          {/*{config?.show_active_tags ? (*/}
          {/*  <View style={styles.tag_wrap}>*/}
          {/*    {(data as ProductItem)?.base_tag.map((item, index) => {*/}
          {/*      return (*/}
          {/*        <View style={styles.tag_item_wrap} key={index}>*/}
          {/*          <Text style={styles.tag}>{item}</Text>*/}
          {/*        </View>*/}
          {/*      );*/}
          {/*    })}*/}
          {/*  </View>*/}
          {/*) : null}*/}
          <View style={styles.priceContainerWrap}>
            <View>
              <Text
                style={[styles.markPrice, showLinePrice && {color: '#D0011A'}]}>
                {convertAmountUS(data.mark_price)}
              </Text>
              {showLinePrice ? (
                <Text style={styles.originPrice}>
                  {convertAmountUS((data as any).original_price)}
                </Text>
              ) : null}
            </View>
            <View style={styles.bagImageContainer}>
              {config?.show_shop_bags ? (
                <GlideImage
                  style={styles.bagImage}
                  source={require('../../assets/product_card_bag.png')}
                />
              ) : null}
              {config?.show_product_sales ? (
                <Text style={styles.orderText}>{data.order_num} orders</Text>
              ) : null}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
};

const ProductCardItemStyles = createStyleSheet({
  container: {
    overflow: 'hidden',
    height: 120,
    backgroundColor: 'white',
    flexDirection: 'row',
    marginVertical: 6,
    marginLeft: 12,
    marginRight: 12,
  },
  productImage: {
    width: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  infoContent: {
    flex: 1,
    padding: 10,
  },
  tag_wrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 11,
  },
  tag_item_wrap: {
    backgroundColor: 'rgba(208, 1, 26, 0.1)',
    marginRight: 2,
  },
  tag: {
    color: '#D0011A',
    fontSize: 10,
    marginHorizontal: 4,
    marginVertical: 1,
  },
  title: {
    fontSize: 13,
    marginBottom: 10,
    lineHeight: 18,
    fontWeight: '600',
  },
  bagImage: {
    width: 25,
    height: 25,
  },
  priceContainerWrap: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  bagImageContainer: {
    alignItems: 'flex-end',
  },
  markPrice: {
    fontSize: 14,
    lineHeight: 17,
    color: '#222222',
    fontWeight: '700',
  },
  originPrice: {
    fontSize: 10,
    lineHeight: 12,
    color: '#999999',
    textDecorationLine: 'line-through',
    marginTop: 4,
  },
  orderText: {
    fontSize: 8,
    color: '#999999',
  },
});

const ProductCardItemStyles1_2 = createStyleSheet({
  container: {
    borderRadius: 5,
    overflow: 'hidden',
    width: 170,
    backgroundColor: 'white',
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  productImage: {
    height: 170,
  },
  infoContent: {
    padding: 10,
  },
  tag_wrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 11,
  },
  tag_item_wrap: {
    backgroundColor: 'rgba(208, 1, 26, 0.1)',
    marginRight: 2,
  },
  tag: {
    color: '#D0011A',
    fontSize: 10,
    marginHorizontal: 4,
    marginVertical: 1,
  },
  title: {
    fontSize: 13,
    marginBottom: 10,
    lineHeight: 18,
    fontWeight: '600',
  },
  bagImage: {
    width: 25,
    height: 25,
  },
  priceContainerWrap: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bagImageContainer: {
    alignItems: 'flex-end',
  },
  markPrice: {
    fontSize: 14,
    lineHeight: 17,
    color: '#222222',
    fontWeight: '700',
  },
  originPrice: {
    fontSize: 10,
    lineHeight: 12,
    color: '#999999',
    textDecorationLine: 'line-through',
    marginTop: 4,
  },
  orderText: {
    fontSize: 8,
    color: '#999999',
  },
});

const ProductCardItem1_2_5Styles = createStyleSheet({
  container: {
    overflow: 'hidden',
    width: 120,
    backgroundColor: 'white',
  },
  productImage: {
    height: 120,
  },
  infoContent: {
    paddingVertical: 6,
  },
  tag_wrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 11,
  },
  tag_item_wrap: {
    backgroundColor: 'rgba(208, 1, 26, 0.1)',
    marginRight: 2,
  },
  tag: {
    color: '#D0011A',
    fontSize: 10,
    marginHorizontal: 4,
    marginVertical: 1,
  },
  title: {
    fontSize: 12,
    marginBottom: 6,
    lineHeight: 17,
    fontWeight: '600',
  },
  bagImage: {
    width: 21,
    height: 21,
  },
  priceContainerWrap: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bagImageContainer: {
    alignItems: 'flex-end',
  },
  markPrice: {
    fontSize: 12,
    lineHeight: 17,
    color: '#222222',
    fontWeight: '700',
  },
  originPrice: {
    fontSize: 9,
    lineHeight: 11,
    color: '#999999',
    textDecorationLine: 'line-through',
    marginTop: 3,
  },
  orderText: {
    fontSize: 8,
    color: '#999999',
  },
});

const ProductCardItem1_3Styles = createStyleSheet({
  container: {
    overflow: 'hidden',
    width: 110,
    backgroundColor: 'white',
  },
  productImage: {
    height: 110,
  },
  infoContent: {
    paddingVertical: 6,
  },
  tag_wrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 11,
  },
  tag_item_wrap: {
    backgroundColor: 'rgba(208, 1, 26, 0.1)',
    marginRight: 2,
  },
  tag: {
    color: '#D0011A',
    fontSize: 10,
    marginHorizontal: 4,
    marginVertical: 1,
  },
  title: {
    fontSize: 12,
    marginBottom: 6,
    lineHeight: 17,
    fontWeight: '600',
    paddingHorizontal: 5,
  },
  bagImage: {
    width: 21,
    height: 21,
  },
  priceContainerWrap: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  bagImageContainer: {
    alignItems: 'flex-end',
  },
  markPrice: {
    fontSize: 12,
    lineHeight: 17,
    color: '#222222',
    fontWeight: '700',
  },
  originPrice: {
    fontSize: 9,
    lineHeight: 11,
    color: '#999999',
    textDecorationLine: 'line-through',
    marginTop: 3,
  },
  orderText: {
    fontSize: 8,
    color: '#999999',
  },
});

const ProductCardItem1_3_5Styles = createStyleSheet({
  container: {
    overflow: 'hidden',
    width: 88,
    backgroundColor: 'white',
  },
  productImage: {
    height: 88,
  },
  infoContent: {
    paddingVertical: 4,
  },
  tag_wrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 11,
  },
  tag_item_wrap: {
    backgroundColor: 'rgba(208, 1, 26, 0.1)',
    marginRight: 2,
  },
  tag: {
    color: '#D0011A',
    fontSize: 10,
    marginHorizontal: 4,
    marginVertical: 1,
  },
  title: {
    fontSize: 10,
    marginBottom: 4,
    lineHeight: 14,
    fontWeight: '600',
  },
  bagImage: {
    width: 18,
    height: 18,
  },
  priceContainerWrap: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bagImageContainer: {
    alignItems: 'flex-end',
  },
  markPrice: {
    fontSize: 10,
    lineHeight: 17,
    color: '#222222',
    fontWeight: '700',
  },
  originPrice: {
    fontSize: 8,
    lineHeight: 10,
    color: '#999999',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  orderText: {
    fontSize: 8,
    color: '#999999',
  },
});

// 1行1
export const ProductCardItem = productCardItemFactory({
  styles: ProductCardItemStyles,
});

// 1行2
export const ProductCardItem1_2 = productCardItemFactory({
  styles: ProductCardItemStyles1_2,
});

// 1行2.5
export const ProductCardItem1_2_5 = productCardItemFactory({
  styles: ProductCardItem1_2_5Styles,
  showOrders: false,
  titleNumOfLine: 1,
});

// 1行3
export const ProductCardItem1_3 = productCardItemFactory({
  styles: ProductCardItem1_3Styles,
  showOrders: false,
  titleNumOfLine: 1,
});

// 1行3.5
export const ProductCardItem1_3_5 = productCardItemFactory({
  styles: ProductCardItem1_3_5Styles,
  showOrders: false,
  titleNumOfLine: 1,
});
