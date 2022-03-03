import {HeaderBackButton} from '@react-navigation/stack';
import {createStyleSheet, styleAdapter} from '@src/helper/helper';
import {goback} from '@src/routes';
import {GlideImage} from '@src/widgets/glideImage';
import React, {FC, Fragment, ReactNode, useCallback} from 'react';
import {useMemo} from 'react';
import {Text, TextStyle, ViewStyle} from 'react-native';
import {View} from 'react-native';
import {HeaderIconWrap} from '../widgets';

export interface CustomHeaderProps {
  backOnPress?: () => void;
  headerBackVisible?: boolean;
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  headerTitleStyle?: TextStyle;
  headerStyle?: ViewStyle;
  title?: ReactNode;
  backIcon?: ReactNode;
}

export const CustomHeader: FC<CustomHeaderProps> = ({
  backOnPress,
  headerBackVisible = true,
  headerLeft,
  headerRight,
  title,
  headerTitleStyle,
  headerStyle,
  backIcon,
}) => {
  const handleBackOnPress = useCallback(() => {
    backOnPress ? backOnPress() : goback();
  }, [backOnPress]);

  const headerLeftComponent = useMemo(() => {
    return (
      <View
        style={[
          HeaderStyles.leftContainer,
          styleAdapter({left: headerBackVisible ? 0 : 16}),
        ]}>
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

  const headerRightComponent = useMemo(() => {
    return (
      <View style={HeaderStyles.rightContainer}>
        <HeaderIconWrap>
          {React.Children.map(headerRight, (ele, index) => {
            return <Fragment key={index}>{ele}</Fragment>;
          })}
        </HeaderIconWrap>
      </View>
    );
  }, [headerRight]);

  return (
    <View style={[HeaderStyles.container, headerStyle]}>
      {headerLeftComponent}
      <View style={HeaderStyles.titleContainer}>
        {typeof title === 'string' ? (
          <Text style={[HeaderStyles.titleText, headerTitleStyle]}>
            {title}
          </Text>
        ) : (
          title
        )}
      </View>
      {headerRightComponent}
    </View>
  );
};

const HeaderStyles = createStyleSheet({
  container: {
    flexDirection: 'row',
    height: 47,
    position: 'relative',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#e5e5e5',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    width: '100%',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
  },
  titleContainer: {
    marginHorizontal: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgb(28,28,30)',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 16,
    bottom: 0,
  },
  backContainer: {
    padding: 5,
  },
});
