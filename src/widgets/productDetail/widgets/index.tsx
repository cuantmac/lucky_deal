import {createStyleSheet} from '@src/helper/helper';
import {Space} from '@src/widgets/space';
import React, {FC} from 'react';
import {View, ViewStyle, Text} from 'react-native';

interface ProductDetailModuleProps {
  style?: ViewStyle;
  addSpace?: boolean;
}

export const ProductDetailModule: FC<ProductDetailModuleProps> = ({
  style,
  children,
  addSpace = true,
}) => {
  return (
    <>
      {addSpace && <Space height={9} />}
      <View style={[ProductDetailModuleStyles.container, style]}>
        {children}
      </View>
    </>
  );
};

interface ProductDetailModuleTitleProps {
  title: string;
}
export const ProductDetailModuleTitle: FC<ProductDetailModuleTitleProps> = ({
  title,
}) => {
  return <Text style={ProductDetailModuleStyles.title}>{title}</Text>;
};

const ProductDetailModuleStyles = createStyleSheet({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 17,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 17,
    color: '#222',
    paddingVertical: 12,
  },
});
