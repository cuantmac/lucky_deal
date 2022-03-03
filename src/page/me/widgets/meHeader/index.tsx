import {createStyleSheet} from '@src/helper/helper';
import {SettingsRoute} from '@src/routes';
import {GlideImage, GlideImageProps} from '@src/widgets/glideImage';
import React, {FC, useCallback} from 'react';
import {TouchableOpacity, View} from 'react-native';

export const MeHeader: FC = () => {
  const SettingsRouter = SettingsRoute.useRouteLink();

  const handleSettingPress = useCallback(() => {
    SettingsRouter.navigate();
  }, [SettingsRouter]);

  return (
    <View style={MeHeaderStyles.container}>
      <MeHeaderIcon
        onPress={handleSettingPress}
        source={require('@src/assets/setting_icon.png')}
      />
    </View>
  );
};

interface MeHeaderIconProps {
  source: GlideImageProps['source'];
  onPress?: () => void;
}

const MeHeaderIcon: FC<MeHeaderIconProps> = ({source, onPress}) => {
  return (
    <TouchableOpacity
      style={MeHeaderStyles.iconWrap}
      activeOpacity={0.8}
      onPress={onPress}>
      <GlideImage style={MeHeaderStyles.icon} source={source} />
    </TouchableOpacity>
  );
};

const MeHeaderStyles = createStyleSheet({
  container: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  iconWrap: {
    padding: 8,
  },
  icon: {
    width: 20,
    height: 20,
  },
});
