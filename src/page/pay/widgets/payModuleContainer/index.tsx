import {createStyleSheet} from '@src/helper/helper';
import React, {FC} from 'react';
import {View, ViewStyle, Text, TextStyle} from 'react-native';

interface PayModuleContainerProps {
  style?: ViewStyle;
}

// 模块容器
export const PayModuleContainer: FC<PayModuleContainerProps> = ({
  children,
  style,
}) => {
  return (
    <View style={[PayModuleContainerStyles.container, style]}>{children}</View>
  );
};

interface PayModuleContainerHeaderProps {
  title: string;
  titleStyle?: TextStyle;
  style?: ViewStyle;
}

// 模块标题
export const PayModuleContainerHeader: FC<PayModuleContainerHeaderProps> = ({
  title,
  children,
  titleStyle,
  style,
}) => {
  return (
    <View style={[PayModuleContainerStyles.headerContainer, style]}>
      <Text style={[PayModuleContainerStyles.headerTitle, titleStyle]}>
        {title}
      </Text>
      {children}
    </View>
  );
};

const PayModuleContainerStyles = createStyleSheet({
  container: {
    paddingHorizontal: 12,
    backgroundColor: 'white',
    marginBottom: 9,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    color: '#222',
    fontWeight: '700',
  },
});
