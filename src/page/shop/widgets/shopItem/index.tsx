import {CartItem} from '@luckydeal/api-common';
import {
  createStyleSheet,
  getProductStatus,
  styleAdapter,
} from '@src/helper/helper';
import {GlideImage, GlideImageProps} from '@src/widgets/glideImage';
import {Space} from '@src/widgets/space';
import React, {FC, useCallback} from 'react';
import {memo} from 'react';
import {useState} from 'react';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import {ShopItemContent, ShopItemContentProps} from '../shopItemContent';
import {ShopItemSelect} from '../shopItemSelect';
import {ShopItemSwiperable} from '../shopItemSwiperable';

interface ShopItemProps {
  style?: StyleProp<ViewStyle>;
  cartItem: CartItem;
  onDeleteActionPress?: (item: CartItem) => void;
  onLoveActionPress?: (item: CartItem) => void;
  onPress?: (item: CartItem) => void;
  onCheckedChange?: (bool: boolean, item: CartItem) => void;
  onQtyChange?: ShopItemContentProps<CartItem>['onQtyChange'];
  spaceHeight?: number;
}

export const ShopItem: FC<ShopItemProps> = memo(
  ({
    cartItem,
    onQtyChange,
    onDeleteActionPress,
    onLoveActionPress,
    onPress,
    onCheckedChange,
    style,
    spaceHeight = 12,
  }) => {
    const [showAction, setShowAction] = useState<boolean>(false);

    const handleDeleteActionPress = useCallback(() => {
      onDeleteActionPress && onDeleteActionPress(cartItem);
    }, [cartItem, onDeleteActionPress]);

    const handleLoveActionPress = useCallback(() => {
      onLoveActionPress && onLoveActionPress(cartItem);
    }, [cartItem, onLoveActionPress]);

    const handleCheckedChange = useCallback(
      (bool: boolean) => {
        onCheckedChange && onCheckedChange(bool, cartItem);
      },
      [cartItem, onCheckedChange],
    );

    const status = getProductStatus(cartItem);

    return (
      <>
        <ShopItemSwiperable
          // 在弹出操作蒙层后取消滑动
          disabled={showAction}
          onDeleteActionPress={handleDeleteActionPress}
          onLoveActionPress={handleLoveActionPress}>
          <View style={[ShopItemStyles.container, style]}>
            <ShopItemSelect
              disabled={status.disabled}
              onChange={handleCheckedChange}
              checked={!!cartItem.is_select}>
              <ShopItemContent
                onQtyChange={onQtyChange}
                onLongPress={() => setShowAction(true)}
                onPress={onPress}
                data={cartItem}
              />
            </ShopItemSelect>
            {showAction && (
              <ShopItemAction
                onClose={() => setShowAction(false)}
                onDeleteActionPress={handleDeleteActionPress}
                onLoveActionPress={handleLoveActionPress}
              />
            )}
          </View>
        </ShopItemSwiperable>
        <Space height={spaceHeight} />
      </>
    );
  },
);

const ShopItemStyles = createStyleSheet({
  container: {
    backgroundColor: 'white',
    position: 'relative',
  },
});

interface ShopItemActionProps {
  onDeleteActionPress?: () => void;
  onLoveActionPress?: () => void;
  onClose?: () => void;
}

const ShopItemAction: FC<ShopItemActionProps> = ({
  onLoveActionPress,
  onDeleteActionPress,
  onClose,
}) => {
  return (
    <TouchableOpacity
      onPress={onClose}
      activeOpacity={1}
      style={ShopItemActionStyle.container}>
      <ShopItemActionItem
        source={require('@src/assets/cart_love_icon.png')}
        backgroundColor="rgba(246,147,88,1)"
        onPress={onLoveActionPress}
      />
      <ShopItemActionItem
        onPress={onDeleteActionPress}
        style={styleAdapter({marginLeft: 40})}
      />
    </TouchableOpacity>
  );
};

interface ShopItemActionItemProps {
  source?: GlideImageProps['source'];
  backgroundColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

const ShopItemActionItem: FC<ShopItemActionItemProps> = ({
  source = require('@src/assets/cart_delete_icon.png'),
  backgroundColor = 'rgba(167,56,23,1)',
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[ShopItemActionStyle.itemContainer, {backgroundColor}, style]}>
      <GlideImage
        style={ShopItemActionStyle.itemIcon}
        defaultSource={false}
        source={source}
      />
    </TouchableOpacity>
  );
};

const ShopItemActionStyle = createStyleSheet({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  itemContainer: {
    width: 66,
    height: 66,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIcon: {
    width: 20,
    height: 20,
  },
});
