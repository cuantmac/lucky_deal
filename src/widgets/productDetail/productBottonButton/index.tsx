import {useIsFocused} from '@react-navigation/core';
import {createStyleSheet} from '@src/helper/helper';
import {BUTTON_TYPE_ENUM, StandardButton} from '@src/widgets/button';
import React, {FC, useContext} from 'react';
import {View, Text} from 'react-native';
import {
  ProductStatusCtx,
  ProductStatusCtxParams,
} from '../skuSelect/skuSelectModal';

interface ProductBottomButtonProps {
  onAdd2BagPress: () => void;
  onBuyNowPress: () => void;
}

export const ProductBottomButton: FC<ProductBottomButtonProps> = ({
  onAdd2BagPress,
  onBuyNowPress,
}) => {
  const {state} = useContext(ProductStatusCtx);
  const focus = useIsFocused();
  const disabled = state.offShelf || state.stock === 0;
  if (!focus) {
    return null;
  }
  return (
    <>
      <ProductStatue {...state} />
      <View
        style={[
          ProductBottomButtonStyles.container,
          ProductBottomButtonStyles.height,
        ]}>
        <StandardButton
          disabled={disabled}
          wrapStyle={ProductBottomButtonStyles.buttonContainer}
          onPress={onAdd2BagPress}
          title={'Add to Bag'}
        />
        <StandardButton
          disabled={disabled}
          type={BUTTON_TYPE_ENUM.HIGH_LIGHT}
          wrapStyle={ProductBottomButtonStyles.buttonContainer}
          onPress={onBuyNowPress}
          title={'Buy Now'}
        />
      </View>
    </>
  );
};

const ProductStatue: FC<ProductStatusCtxParams> = ({offShelf, stock}) => {
  if (offShelf) {
    return (
      <Text style={ProductBottomButtonStyles.tipText}>
        Sorry, this item is off the shelf.
      </Text>
    );
  }
  if (stock === 0) {
    return (
      <Text style={ProductBottomButtonStyles.tipText}>
        Sorry,the item is sold out.
      </Text>
    );
  }
  return null;
};

const ProductBottomButtonStyles = createStyleSheet({
  height: {
    height: 60,
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: 0,
    left: 0,
  },
  buttonContainer: {
    width: 172,
  },
  tipText: {
    height: 29,
    lineHeight: 29,
    backgroundColor: 'rgba(0, 0, 0, .5)',
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
});
