import React, {FC} from 'react';
import {View} from 'react-native';
import {px} from '../../../constants/constants';

export const CartListModule: FC = ({children}) => {
  return (
    <View
      style={{
        borderRadius: 10 * px,
        backgroundColor: 'white',
        marginHorizontal: 20 * px,
        overflow: 'hidden',
      }}>
      {children}
    </View>
  );
};
