import {px} from '@src/constants/constants';
import {createStyleSheet, styleAdapter} from '@src/helper/helper';
import {GlideImage} from '@src/widgets/glideImage';
import React, {FC} from 'react';
import {View, Text} from 'react-native';

/**
 * 支付界面底部文案
 */
export const PayInfoFooter: FC = () => {
  return (
    <View style={PayInfoFooterStyles.container}>
      <View style={PayInfoFooterStyles.iconContainer}>
        <GlideImage
          source={require('@src/assets/ic_safe.png')}
          style={styleAdapter({width: 56, height: 68}, true)}
        />
        <Text style={PayInfoFooterStyles.text}>Powered by paypal</Text>
      </View>
      <View style={PayInfoFooterStyles.iconContainer}>
        <GlideImage
          source={require('@src/assets/ic_24hours.png')}
          style={styleAdapter({width: 63, height: 63}, true)}
        />
        <Text style={PayInfoFooterStyles.text}>Free return in 24h</Text>
      </View>
    </View>
  );
};

const PayInfoFooterStyles = createStyleSheet({
  container: {
    height: 57,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    marginLeft: 5,
    fontSize: 12,
    color: '#222',
  },
});
