import {useNavigation} from '@react-navigation/native';
import {HeaderBackButton} from '@react-navigation/stack';
import {createStyleSheet, styleAdapter} from '@src/helper/helper';
import {goback} from '@src/routes';
import React, {FC, Fragment, useLayoutEffect} from 'react';
import {ReactNode} from 'react';
import {useCallback} from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {GlideImage} from '../glideImage';
import {HeaderIconWrap} from './widgets';

interface NavigationHeaderProps {
  title?: string;
  headerShown?: boolean;
  headerBackVisible?: boolean;
  headerShadowVisible?: boolean;
  headerTransparent?: boolean;
  headerStyle?: ViewStyle;
  headerTintColor?: string;
  headerTitleStyle?: TextStyle;
  headerTitleAlign?: 'left' | 'center';
  headerRight?: ReactNode;
  headerLeft?: ReactNode;
  backOnPress?: () => void;
  backIcon?: ReactNode;
}

export const useNavigationHeader = ({
  title = '',
  headerShown = true,
  headerBackVisible = true,
  headerTransparent,
  headerStyle,
  headerTintColor,
  headerTitleStyle,
  headerTitleAlign = 'center',
  headerLeft,
  headerRight,
  backOnPress,
  backIcon,
}: NavigationHeaderProps = {}) => {
  const navigation = useNavigation();
  const handleBackOnPress = useCallback(() => {
    backOnPress ? backOnPress() : goback();
  }, [backOnPress]);

  const headerLeftComponent = useCallback(() => {
    return (
      <View style={HeaderStyles.leftContainer}>
        {headerBackVisible && (
          <HeaderBackButton
            backImage={({tintColor}) => {
              return (
                <View style={HeaderStyles.backContainer}>
                  {backIcon || (
                    <GlideImage
                      defaultSource={false}
                      style={styleAdapter({width: 18, height: 18})}
                      tintColor={tintColor}
                      source={require('@src/assets/back_icon.png')}
                    />
                  )}
                </View>
              );
            }}
            onPress={handleBackOnPress}
          />
        )}
        <HeaderIconWrap>
          {React.Children.map(headerLeft, (ele, index) => {
            return <Fragment key={index}>{ele}</Fragment>;
          })}
        </HeaderIconWrap>
      </View>
    );
  }, [backIcon, handleBackOnPress, headerBackVisible, headerLeft]);

  const headerRightComponent = useCallback(() => {
    return (
      <View style={HeaderStyles.leftContainer}>
        <HeaderIconWrap>
          {React.Children.map(headerRight, (ele, index) => {
            return <Fragment key={index}>{ele}</Fragment>;
          })}
        </HeaderIconWrap>
      </View>
    );
  }, [headerRight]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title,
      headerBackTitle: false,
      headerShown,
      headerShadowVisible: false,
      headerTransparent,
      headerStyle: [HeaderStyles.headerContainer, headerStyle],
      headerTintColor,
      headerTitleStyle,
      headerTitleAlign,
      headerLeft: headerLeftComponent,
      headerRight: headerRightComponent,
    });
  }, [
    backOnPress,
    headerLeft,
    headerLeftComponent,
    headerRight,
    headerRightComponent,
    headerShown,
    headerStyle,
    headerTintColor,
    headerTitleAlign,
    headerTitleStyle,
    headerTransparent,
    navigation,
    title,
  ]);
  return null;
};

const HeaderStyles = createStyleSheet({
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContainer: {
    height: 47,
  },
  backContainer: {
    padding: 5,
  },
});
