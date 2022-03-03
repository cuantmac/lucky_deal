import {createStyleSheet} from '@src/helper/helper';
import React, {FC} from 'react';
import {View} from 'react-native';

export const ProductDetailFixedTop: FC = ({children}) => {
  return <View style={ProductDetailFixedTopStyles.container}>{children}</View>;
};

const ProductDetailFixedTopStyles = createStyleSheet({
  container: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
});
