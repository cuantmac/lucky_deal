import {ProductSkuInfo} from '@luckydeal/api-common';
import {
  convertAmountUS,
  createStyleSheet,
  flatSku,
  getProductStatus,
  styleAdapter,
} from '@src/helper/helper';
import {GlideImage} from '@src/widgets/glideImage';
import {InputSpinner} from '@src/widgets/inputSpinner';
import React, {FC, useCallback} from 'react';
import {useMemo} from 'react';
import {View, Text, TouchableOpacity, ViewStyle} from 'react-native';

export interface ShopItemContentExtend {
  origin_price?: number;
  price: number;
  image: string;
  skuStr?: string[];
  status?: number;
  title: string;
  min_purchases_num?: number;
  max_purchases_num?: number;
  qty: number;
  product_id: number;
  product_type: number;
  selected_sku_list?: ProductSkuInfo[][];
}

export interface ShopItemContentProps<T extends ShopItemContentExtend> {
  data: T;
  onQtyChange?: (qty: number, item: T) => void;
  onPress?: (item: T) => void;
  onLongPress?: () => void;
  rightContainerStyle?: ViewStyle;
  disableEdit?: boolean;
  style?: ViewStyle;
}

export const ShopItemContent = <T extends ShopItemContentExtend>({
  data,
  onQtyChange,
  onPress,
  onLongPress,
  rightContainerStyle,
  disableEdit = false,
  style,
}: ShopItemContentProps<T>) => {
  const status = getProductStatus(data);

  const handlePress = useCallback(() => {
    onPress && onPress(data);
  }, [data, onPress]);

  const handleQtyChange = useCallback(
    (qty: number) => {
      onQtyChange && onQtyChange(qty, data);
    },
    [data, onQtyChange],
  );

  const skuText = useMemo(() => {
    if (data.skuStr?.length) {
      return data.skuStr
        .map((val) => {
          return val;
        })
        .join(',');
    }

    return (
      flatSku(data?.selected_sku_list)
        .map((val) => {
          return val;
        })
        .join(',') || null
    );
  }, [data]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onLongPress={onLongPress}
      style={[ShopItemContentStyles.container, style]}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={ShopItemContentStyles.productImageContainer}
        onPress={handlePress}>
        <GlideImage
          style={ShopItemContentStyles.productImage}
          source={{uri: data.image}}
          resizeMode="cover"
        />
        <ProductStatus status={status} />
      </TouchableOpacity>
      <View style={[ShopItemContentStyles.rightContainer, rightContainerStyle]}>
        <Text
          style={[
            ShopItemContentStyles.titleText,
            {
              opacity: status.disabled ? 0.5 : 1,
            },
          ]}
          numberOfLines={2}>
          {data.title}
        </Text>
        {skuText && (
          <Text
            style={[
              ShopItemContentStyles.skuText,
              {
                opacity: status.disabled ? 0.5 : 1,
              },
            ]}
            numberOfLines={1}>
            {skuText}
          </Text>
        )}
        <View style={ShopItemContentStyles.bottomContainer}>
          <Text
            style={[
              ShopItemContentStyles.priceText,
              {
                opacity: status.disabled ? 0.5 : 1,
              },
            ]}>
            {convertAmountUS(data.price)}
          </Text>
          {disableEdit || status.soldOut || status.offTheShelf ? (
            <Text
              style={[
                ShopItemContentStyles.qtyText,
                {
                  opacity: status.disabled ? 0.5 : 1,
                },
              ]}>
              x{data.qty}
            </Text>
          ) : (
            <InputSpinner
              disabledAdd={status.stockOut}
              style={styleAdapter({height: 26})}
              actionStyle={ShopItemContentStyles.inputAction}
              valueTextStyle={ShopItemContentStyles.inputValue}
              min={data.min_purchases_num}
              max={data.max_purchases_num}
              onChange={handleQtyChange}
              value={data.qty}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface ProductStatusProps {
  status: ReturnType<typeof getProductStatus>;
}

export const ProductStatus: FC<ProductStatusProps> = ({status}) => {
  if (status.offTheShelf) {
    return (
      <View style={ShopItemContentStyles.soldOutContainer}>
        <Text style={ShopItemContentStyles.soldOutText}>OFF THE SHELF</Text>
      </View>
    );
  }

  if (status.soldOut) {
    return (
      <View style={ShopItemContentStyles.soldOutContainer}>
        <Text style={ShopItemContentStyles.soldOutText}>SOLD OUT</Text>
      </View>
    );
  }

  if (status.stockOut || status.stockLess) {
    return (
      <View style={ShopItemContentStyles.onlyContainer}>
        <Text style={ShopItemContentStyles.onyText}>
          Only {status.stock} Left
        </Text>
      </View>
    );
  }

  return null;
};

const ShopItemContentStyles = createStyleSheet({
  container: {
    flexDirection: 'row',
    paddingVertical: 11,
  },
  productImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  rightContainer: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 16,
  },
  titleText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#222222',
    lineHeight: 18,
  },
  skuText: {
    lineHeight: 24,
    fontSize: 12,
    color: '#222',
    height: 24,
    backgroundColor: '#f6f6f6',
    marginTop: 6,
    paddingHorizontal: 5,
    marginRight: 'auto',
  },
  bottomContainer: {
    marginTop: 'auto',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '700',
    lineHeight: 19,
  },
  qtyText: {
    minWidth: 24,
    height: 26,
    paddingHorizontal: 6,
    backgroundColor: '#f6f6f6',
    lineHeight: 26,
    textAlign: 'center',
    borderRadius: 2,
    color: '#222',
    fontSize: 11,
    fontWeight: '400',
  },
  inputAction: {
    width: 24,
  },
  inputValue: {
    color: '#222',
    fontWeight: '400',
    fontSize: 11,
  },
  soldOutContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.6)',
  },
  soldOutText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 19,
  },
  onlyContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.6)',
  },
  onyText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    lineHeight: 19,
  },
});
