import {BACKGROUND_BASE_COLOR} from '@src/constants/colors';
import {createStyleSheet, styleAdapter} from '@src/helper/helper';
import {GlideImage, GlideImageProps} from '@src/widgets/glideImage';
import {Space} from '@src/widgets/space';
import React, {FC} from 'react';
import {TouchableOpacity, View, Text, ViewStyle} from 'react-native';

export enum MODULE_ICON_SIZE_ENUM {
  MIDDLE,
  LARGE,
}

interface MeModuleIconProps {
  showNum?: boolean;
  num?: number;
  icon?: GlideImageProps['source'];
  title?: string;
  onPress?: () => void;
  size?: MODULE_ICON_SIZE_ENUM;
}

export const MeModuleIcon: FC<MeModuleIconProps> = ({
  num = 0,
  showNum,
  title = 'title',
  icon = require('@src/assets/me_unpaid_icon.png'),
  onPress,
  size = MODULE_ICON_SIZE_ENUM.MIDDLE,
}) => {
  return (
    <View style={MeModuleIconStyles.wrap}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={MeModuleIconStyles.container}
        onPress={onPress}>
        <View
          style={[
            styleAdapter({
              height: size === MODULE_ICON_SIZE_ENUM.MIDDLE ? 40 : 47,
            }),
            MeModuleIconStyles.iconWrap,
          ]}>
          {showNum ? (
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={MeModuleIconStyles.numberText}>
              {num}
            </Text>
          ) : (
            <GlideImage
              style={
                size === MODULE_ICON_SIZE_ENUM.MIDDLE
                  ? MeModuleIconStyles.middleIcon
                  : MeModuleIconStyles.largeIcon
              }
              source={icon}
            />
          )}
        </View>
        <Text
          adjustsFontSizeToFit
          style={MeModuleIconStyles.title}
          numberOfLines={1}>
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const MeModuleIconStyles = createStyleSheet({
  wrap: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
  },
  iconWrap: {
    justifyContent: 'center',
  },
  middleIcon: {
    width: 20,
    height: 20,
  },
  largeIcon: {
    width: 25,
    height: 25,
  },
  title: {
    fontSize: 12,
    color: '#222',
  },
  numberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
});

interface MeModuleGroupProps {
  style?: ViewStyle;
}

// 模块分组
export const MeModuleGroup: FC<MeModuleGroupProps> = ({children, style}) => {
  return <View style={[MeModuleGroupStyles.container, style]}>{children}</View>;
};

const MeModuleGroupStyles = createStyleSheet({
  container: {
    flexDirection: 'row',
  },
});

interface MeModuleHeaderProps {
  title?: string;
}

// 模块标题
export const MeModuleHeader: FC<MeModuleHeaderProps> = ({
  title = 'Title',
  children,
}) => {
  return (
    <View style={MeModuleHeaderStyles.container}>
      <Text style={MeModuleHeaderStyles.titleText}>{title}</Text>
      {children}
    </View>
  );
};

const MeModuleHeaderStyles = createStyleSheet({
  container: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  titleText: {
    fontSize: 14,
    color: '#222',
    fontWeight: '700',
  },
});

interface MeModuleProps {
  showBottomSeparator?: boolean;
}

// Me 模块
export const MeModule: FC<MeModuleProps> = ({
  children,
  showBottomSeparator = true,
}) => {
  return (
    <>
      <View style={{backgroundColor: 'white'}}>{children}</View>
      {showBottomSeparator && (
        <Space backgroundColor={BACKGROUND_BASE_COLOR} height={9} />
      )}
    </>
  );
};

interface OrderViewAllProps {
  onPress?: () => void;
}

// 订单view all
export const OrderViewAll: FC<OrderViewAllProps> = ({onPress}) => {
  return (
    <TouchableOpacity
      style={OrderViewAllStyles.container}
      activeOpacity={0.8}
      onPress={onPress}>
      <Text style={OrderViewAllStyles.text}>View All</Text>
      <GlideImage
        defaultSource={false}
        tintColor={'#666'}
        style={OrderViewAllStyles.icon}
        source={require('@src/assets/thiny_black_icon.png')}
      />
    </TouchableOpacity>
  );
};

const OrderViewAllStyles = createStyleSheet({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    color: '#666',
  },
  icon: {
    marginLeft: 8,
    width: 10,
    height: 10,
  },
});

interface SevicesIconProps {
  icon?: GlideImageProps['source'];
}

// sevices icon
export const ServicesIcon: FC<SevicesIconProps> = ({
  icon = require('@src/assets/me_address_icon.png'),
}) => {
  return <GlideImage style={SevicesIconStyles.icon} source={icon} />;
};

const SevicesIconStyles = createStyleSheet({
  icon: {
    width: 18,
    height: 21,
    marginRight: 12,
  },
});
