import {
  BagProductDetailResponse,
  OfferProductDetailResponse,
  ProductSku,
} from '@luckydeal/api-common';
import {createStyleSheet} from '@src/helper/helper';
import {GlideImage} from '@src/widgets/glideImage';
import React, {FC, useCallback, useContext, useMemo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {ProductDetailModule} from '../../widgets';
import {OnSkuChangePrams, ProductStatusCtx} from '../skuSelectModal';
import {skuFunnel, SkuSimpleShowImageItem, SkuStandardItem} from '../widgets';

interface SkuSimpleShowProps {
  data:
    | OfferProductDetailResponse
    | (BagProductDetailResponse & {product_sku?: ProductSku});
  skuParams?: OnSkuChangePrams;
  onPress?: () => void;
}

// 详情页sku选择展示第一条
export const SkuSimpleShow: FC<SkuSimpleShowProps> = ({
  data: {product_sku},
  onPress,
  skuParams,
}) => {
  const {state} = useContext(ProductStatusCtx);
  const {showSku, title} = useMemo(() => {
    const skuFilter = skuFunnel(product_sku);
    const titleArr: string[] = [];
    skuFilter?.sku.forEach(({attr_name, sku_list}) => {
      if (!sku_list) {
        return;
      }
      titleArr.push(`${attr_name} ${sku_list.length}`);
    });

    return {
      title: titleArr.join(','),
      showSku: skuFilter?.sku[0]?.sku_list || [],
    };
  }, [product_sku]);

  const handlePress = useCallback(() => {
    onPress && onPress();
  }, [onPress]);

  if (!title || state.offShelf) {
    return null;
  }

  return (
    <TouchableOpacity activeOpacity={0.5} onPress={handlePress}>
      <ProductDetailModule style={SkuSimpleShowStyles.constiner}>
        <View style={SkuSimpleShowStyles.titleContainer}>
          <Text style={SkuSimpleShowStyles.selectText}>
            Variations:{' '}
            <Text style={SkuSimpleShowStyles.skuText}>
              {skuParams && skuParams.skuSelectIsComplete
                ? skuParams.skuText.join(', ')
                : title}
            </Text>
          </Text>
          <GlideImage
            style={SkuSimpleShowStyles.titlePressImg}
            source={require('@src/assets/me_arrow.png')}
          />
        </View>
        <View style={SkuSimpleShowStyles.skuContainer}>
          {showSku.map(({image_url, name}, index) => {
            if (image_url) {
              return (
                <SkuSimpleShowImageItem key={index} source={{uri: image_url}} />
              );
            }
            return (
              <SkuStandardItem
                disabled
                style={SkuSimpleShowStyles.skuStandardItem}
                key={index}
                value={name || 'test'}
              />
            );
          })}
        </View>
      </ProductDetailModule>
    </TouchableOpacity>
  );
};

const SkuSimpleShowStyles = createStyleSheet({
  constiner: {
    paddingVertical: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 9,
  },
  selectText: {
    fontSize: 14,
    fontWeight: '700',
  },
  skuText: {
    color: '#999',
    fontSize: 12,
    fontWeight: '500',
  },
  titlePressImg: {
    width: 10,
    height: 10,
  },
  skuContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  skuStandardItem: {
    marginRight: 8,
  },
});
