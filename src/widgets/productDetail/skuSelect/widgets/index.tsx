import {ProductSku, ProductSkuInfoItem} from '@luckydeal/api-common';
import {createStyleSheet} from '@src/helper/helper';
import {GlideImage, GlideImageProps} from '@src/widgets/glideImage';
import React, {FC, useMemo} from 'react';
import {Text, ViewStyle, TouchableOpacity, View} from 'react-native';

export enum SKU_ITEM_STATUS_ENUM {
  STANDARD,
  DISABLED,
}

interface SkuSimpleShowImageItemProps {
  source: GlideImageProps['source'];
}

export const SkuSimpleShowImageItem: FC<SkuSimpleShowImageItemProps> = ({
  source,
}) => {
  return (
    <GlideImage
      style={SkuImageItemStyles.skuSimpleShowImageItem}
      source={source}
    />
  );
};

interface SkuImageItemProps {
  status?: SKU_ITEM_STATUS_ENUM;
  onPress?: () => void;
  onScalePress?: () => void;
  style?: ViewStyle;
  value: ProductSkuInfoItem;
  active?: boolean;
}

export const SkuImageItem: FC<SkuImageItemProps> = ({
  value,
  onPress,
  style,
  status,
  active,
}) => {
  const statusStyle = useMemo(() => {
    switch (status) {
      case SKU_ITEM_STATUS_ENUM.STANDARD:
        return SkuImageItemStyles.skuImageItem_STANDARD;
      case SKU_ITEM_STATUS_ENUM.DISABLED:
        return SkuImageItemStyles.skuImageItem_DISABLED;
      default:
        return SkuImageItemStyles.skuImageItem_STANDARD;
    }
  }, [status]);

  return (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
      <View
        style={[
          SkuImageItemStyles.skuImageItemContainer,
          statusStyle,
          active ? SkuImageItemStyles.skuImageItem_SELECTED : undefined,
          style,
        ]}>
        <GlideImage
          resizeMode={'cover'}
          style={SkuImageItemStyles.skuImageItemImage}
          source={{uri: value.image_url}}
        />
        <Text style={SkuImageItemStyles.skuText}>{value.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const SkuImageItemStyles = createStyleSheet({
  skuSimpleShowImageItem: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 2,
    overflow: 'hidden',
  },
  skuImageItemContainer: {
    width: 100,
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden',
  },
  skuImageItemImage: {
    width: 100,
    height: 100,
  },
  skuText: {
    height: 30,
    fontSize: 12,
    color: '#222',
    lineHeight: 30,
    textAlign: 'center',
    backgroundColor: '#f6f6f6',
  },
  skuImageItem_STANDARD: {
    borderColor: 'white',
  },
  skuImageItem_DISABLED: {
    borderColor: '#999',
    borderStyle: 'dashed',
    opacity: 0.5,
  },
  skuImageItem_SELECTED: {
    borderStyle: 'solid',
    borderColor: 'black',
    opacity: 1,
  },
});

interface SkuStandardItemProps {
  value?: string;
  style?: ViewStyle;
  status?: SKU_ITEM_STATUS_ENUM;
  onPress?: () => void;
  disabled?: boolean;
  active?: boolean;
}

export const SkuStandardItem: FC<SkuStandardItemProps> = ({
  value,
  style,
  status = SKU_ITEM_STATUS_ENUM.STANDARD,
  onPress,
  disabled = false,
  active,
}) => {
  const statusStyle = useMemo(() => {
    switch (status) {
      case SKU_ITEM_STATUS_ENUM.STANDARD:
        return SkuItemStyles.skuStandardItem_STANDARD;
      case SKU_ITEM_STATUS_ENUM.DISABLED:
        return SkuItemStyles.skuStandardItem_DISABLED;
      default:
        return SkuItemStyles.skuStandardItem_STANDARD;
    }
  }, [status]);

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={(e) => {
        onPress && onPress();
        e.stopPropagation();
      }}
      disabled={disabled}
      style={[
        SkuItemStyles.skuStandardItemContainer,
        statusStyle,
        active ? SkuItemStyles.skuStandardItem_SELECTED : undefined,
        style,
      ]}>
      <Text style={SkuItemStyles.skuStandardItemText}>{value}</Text>
    </TouchableOpacity>
  );
};

const SkuItemStyles = createStyleSheet({
  skuStandardItemContainer: {
    minWidth: 97,
    height: 30,
    borderColor: '#222222',
    borderWidth: 1,
    backgroundColor: '#f6f6f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    paddingHorizontal: 5,
  },
  skuStandardItemText: {
    fontSize: 14,
    lineHeight: 17,
  },
  skuStandardItem_STANDARD: {
    borderStyle: 'solid',
    borderColor: '#f6f6f6',
  },
  skuStandardItem_DISABLED: {
    borderStyle: 'dashed',
    backgroundColor: 'white',
    borderColor: '#999',
    opacity: 0.5,
  },
  skuStandardItem_SELECTED: {
    borderStyle: 'solid',
    borderColor: 'black',
    opacity: 1,
  },
});

/**
 * 预处理sku数据
 */
export function skuFunnel(sku?: ProductSku) {
  if (!sku || !sku.sku) {
    return;
  }
  const skuCopy: ProductSku = JSON.parse(JSON.stringify(sku));
  // 去除无效sku
  skuCopy?.sku?.forEach(({sku_list}, index) => {
    if (!sku_list || sku_list.length === 0) {
      skuCopy?.sku.splice(index, 1);
    }
  });
  // 将图片sku前置
  skuCopy?.sku?.sort(
    (
      {sku_list: [{image_url}]},
      {sku_list: [{image_url: image_url_compile}]},
    ) => {
      if (image_url && image_url_compile) {
        return 0;
      }
      if (image_url && !image_url_compile) {
        return -1;
      }
      if (!image_url && image_url_compile) {
        return 1;
      }
      return 0;
    },
  );
  return skuCopy;
}
