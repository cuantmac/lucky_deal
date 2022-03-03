import React, {FC, memo} from 'react';
import {
  Dimensions,
  Text,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {px} from '../../constants/constants';
import Utils from '../../utils/Utils';
import GlideImageEl from '@src/widgets/native/GlideImage';
import {
  ProductItem,
  ProductSimpleBaseItem,
  ProductSimpleItem,
} from '@luckydeal/api-common';
import {MartketPriceText, OriginPriceText} from './widgets/PriceText';
import {ProductTag} from './widgets/ProductTag';
import {StyleProp} from 'react-native';
const GlideImage: any = GlideImageEl;

interface ProductListItemProps {
  data: ProductItem | ProductSimpleItem | ProductSimpleBaseItem;
  onPress?: () => void;
  addToBag?: boolean;
  onAddToBag?: (category: number, id: number) => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * @deprecated 旧项目使用
 */
export const ProductListItem: FC<ProductListItemProps> = memo(
  ({data, onPress, addToBag, onAddToBag, style}) => {
    const itemSize = (Dimensions.get('window').width - 20) / 2;
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View
          style={[
            {
              backgroundColor: 'white',
              width: itemSize,
              borderRadius: 10 * px,
              borderColor: '#F4F4F4',
              overflow: 'hidden',
              elevation: 4 * px,
              paddingBottom: 20 * px,
            },
            style,
          ]}>
          <View style={{position: 'relative'}}>
            <GlideImage
              showDefaultImage={true}
              source={Utils.getImageUri(data.image)}
              defaultSource={require('../../assets/lucky_deal_default_big.png')}
              resizeMode={'contain'}
              style={{
                width: itemSize,
                height: itemSize,
              }}
            />
            {data.activity_tag ? (
              <View
                style={{
                  backgroundColor: data.activity_tag_color
                    ? data.activity_tag_color
                    : '#D70000',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: 50 * px,
                  borderBottomRightRadius: 20 * px,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 30 * px,
                    paddingHorizontal: 10,
                  }}>
                  {data.activity_tag}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={{paddingHorizontal: 20 * px}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
              }}>
              <MartketPriceText
                style={{fontSize: 50 * px}}
                value={data.mark_price}
                isActivity={Utils.isActivityProduct(data.act_tag_list)}
              />
              <OriginPriceText
                style={{fontSize: 37 * px, marginLeft: 20 * px}}
                isActivity={Utils.isActivityProduct(data.act_tag_list)}
                value={data.original_price}
              />
            </View>
            <Text
              numberOfLines={1}
              style={{
                color: 'black',
                fontSize: 40 * px,
              }}>
              {data.title ? data.title : 'Unknown'}
            </Text>
            <ProductTag
              containerStyle={{marginBottom: 5 * px}}
              tags={data.act_tag_list}
            />
          </View>
          <View style={{paddingHorizontal: 20 * px, marginTop: 'auto'}}>
            <Text
              numberOfLines={1}
              style={{
                marginTop: 'auto',
                color: '#8A8A8A',
                fontSize: 30 * px,
              }}>
              {data.order_num} Orders
            </Text>
            {addToBag ? (
              <TouchableOpacity
                onPress={() => {
                  onAddToBag &&
                    onAddToBag(
                      data.product_category,
                      data.product_id || (data as ProductSimpleItem).bag_id,
                    );
                }}
                style={{
                  height: 80 * px,
                  marginTop: 20 * px,
                  overflow: 'hidden',
                  borderWidth: 2 * px,
                  borderStyle: 'solid',
                  borderColor: '#000',
                  borderRadius: 40 * px,
                }}>
                <Text
                  style={{
                    fontSize: 42 * px,
                    textAlign: 'center',
                    paddingTop: 5 * px,
                  }}>
                  Add To Bag
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  },
);

// 计算显示Add to Bag 按钮时的高度
export const getAddToBagHeight = (
  data: ProductItem | ProductSimpleItem | ProductSimpleBaseItem,
) => {
  const itemSize = (Dimensions.get('window').width - 58 * px) / 2;
  return (
    itemSize + ((data.act_tag_list?.length || 0) > 0 ? 50 * px : 0) + 340 * px
  );
};

// 计算不显示Add to Bag 按钮时的高度
export const getProductItemHeight = (
  data: ProductItem | ProductSimpleItem | ProductSimpleBaseItem,
) => {
  const itemSize = (Dimensions.get('window').width - 58 * px) / 2;
  return (
    itemSize + ((data.act_tag_list?.length || 0) > 0 ? 50 * px : 0) + 240 * px
  );
};
