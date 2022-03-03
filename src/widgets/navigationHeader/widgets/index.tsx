import {createStyleSheet, styleAdapter} from '@src/helper/helper';
import {GlideImage, GlideImageProps} from '@src/widgets/glideImage';
import React from 'react';
import {FC} from 'react';
import {TouchableOpacity, View} from 'react-native';

export const HeaderIconWrap: FC = ({children}) => {
  return <View style={HeaderIconWrapStyles.container}>{children}</View>;
};

interface HeaderIconProps {
  source: GlideImageProps['source'];
  disabled?: boolean;
  onPress?: () => void;
  size?: number;
  style?: GlideImageProps['style'];
}

export const HeaderIcon: FC<HeaderIconProps> = ({
  source,
  onPress,
  disabled,
  size = 28,
  style,
}) => {
  return (
    <TouchableOpacity disabled={disabled} activeOpacity={0.8} onPress={onPress}>
      <GlideImage
        defaultSource={false}
        style={[
          HeaderIconWrapStyles.icon,
          styleAdapter({width: size, height: size}),
          style,
        ]}
        source={source}
      />
    </TouchableOpacity>
  );
};

const HeaderIconWrapStyles = createStyleSheet({
  container: {
    marginHorizontal: -5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 5,
  },
});
