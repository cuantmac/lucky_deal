import {createStyleSheet} from '@src/helper/helper';
import {GlideImageProps} from '@src/widgets/glideImage';
import {Swiperable, SwiperableAction} from '@src/widgets/swiperable';
import React, {FC} from 'react';
import {useCallback} from 'react';
import {TouchableOpacity, Image} from 'react-native';

export interface ShopItemSwiperableProps {
  onLoveActionPress?: (close: () => void) => void;
  onDeleteActionPress?: (close: () => void) => void;
  disabled?: boolean;
}

export const ShopItemSwiperable: FC<ShopItemSwiperableProps> = ({
  onLoveActionPress,
  onDeleteActionPress,
  children,
  disabled,
}) => {
  const Move2LoveAction = useCallback(() => {
    return (
      <SwiperableAction>
        {(close) => {
          return (
            <ShopItemAction
              source={require('@src/assets/cart_love_icon.png')}
              onPress={() => onLoveActionPress && onLoveActionPress(close)}
            />
          );
        }}
      </SwiperableAction>
    );
  }, [onLoveActionPress]);

  const DeleteAction = useCallback(() => {
    return (
      <SwiperableAction>
        {(close) => {
          return (
            <ShopItemAction
              backgroundColor={'rgba(167,56,23,1)'}
              source={require('@src/assets/cart_delete_icon.png')}
              onPress={() => onDeleteActionPress && onDeleteActionPress(close)}
            />
          );
        }}
      </SwiperableAction>
    );
  }, [onDeleteActionPress]);

  return (
    <Swiperable
      disabled={disabled}
      actions={[<Move2LoveAction key="1" />, <DeleteAction key="2" />]}>
      {children}
    </Swiperable>
  );
};

interface ShopItemActionProps {
  source?: GlideImageProps['source'];
  onPress?: () => void;
  backgroundColor?: string;
}

const ShopItemAction: FC<ShopItemActionProps> = ({
  source = require('@src/assets/cart_love_icon.png'),
  onPress,
  backgroundColor = 'rgba(246,147,88,1)',
}) => {
  return (
    <TouchableOpacity
      style={[ShopItemSwiperableStyles.actionContainer, {backgroundColor}]}
      onPress={onPress}>
      <Image
        resizeMode="contain"
        style={ShopItemSwiperableStyles.actionIcon}
        source={source}
      />
    </TouchableOpacity>
  );
};

const ShopItemSwiperableStyles = createStyleSheet({
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  actionIcon: {
    width: 20,
    height: 20,
  },
});
