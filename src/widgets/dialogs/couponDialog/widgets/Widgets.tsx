import {styleAdapter} from '@src/helper/helper';
import React, {FC} from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';

export const DiscountContainer: FC = ({children}) => {
  return <View style={styleAdapter({marginTop: 20}, true)}>{children}</View>;
};

export const DiscountTitle: FC = ({children}) => {
  return (
    <Text
      style={styleAdapter(
        {
          paddingTop: 30,
          paddingBottom: 25,
          fontSize: 38,
        },
        true,
      )}>
      {children}
    </Text>
  );
};

interface DiscountContentProps {
  onPress?: () => void;
  icon?: number;
}

export const DiscountContent: FC<DiscountContentProps> = ({
  onPress,
  children,
  icon = require('../../../../assets/thiny_black_icon.png'),
}) => {
  return (
    <TouchableOpacity
      style={styleAdapter({
        backgroundColor: '#222222',
        height: 67,
        flexDirection: 'row',
        alignItems: 'center',
      })}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styleAdapter({flex: 1, paddingLeft: 24})}>{children}</View>
      <Image
        style={styleAdapter({height: 18, width: 18, marginRight: 24})}
        source={icon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};
