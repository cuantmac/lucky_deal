import {createStyleSheet} from '@src/helper/helper';
import {ReduxRootState} from '@src/redux';
import {HomeRoute, navigate2Login} from '@src/routes';
import {useShallowEqualSelector} from '@src/utils/hooks';
import {BUTTON_TYPE_ENUM, StandardButton} from '@src/widgets/button';
import {GlideImage} from '@src/widgets/glideImage';
import React, {FC, useCallback} from 'react';
import {Text, View} from 'react-native';

export const ShopEmpty: FC = () => {
  const {token} = useShallowEqualSelector((state: ReduxRootState) => ({
    token: state.persist.persistAuth.token,
  }));

  const HomeRouter = HomeRoute.useRouteLink();

  // 点击登陆
  const handleSignPress = useCallback(() => {
    navigate2Login();
  }, []);

  // 点击跳转首页
  const handleShopPress = useCallback(() => {
    HomeRouter.navigate();
  }, [HomeRouter]);

  return (
    <View style={ShopEmptyStyles.container}>
      <GlideImage
        style={ShopEmptyStyles.emptyImg}
        source={require('@src/assets/shop_empty_icon.png')}
      />
      <Text style={ShopEmptyStyles.emptyText}>Your Bag is empty</Text>
      {token ? (
        <StandardButton
          onPress={handleShopPress}
          type={BUTTON_TYPE_ENUM.STANDARD}
          wrapStyle={ShopEmptyStyles.button}
          title={'SHOP NOW'}
        />
      ) : (
        <StandardButton
          onPress={handleSignPress}
          type={BUTTON_TYPE_ENUM.HIGH_LIGHT}
          wrapStyle={ShopEmptyStyles.button}
          title={'SIGN IN / REGISTER'}
        />
      )}
    </View>
  );
};

const ShopEmptyStyles = createStyleSheet({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    alignItems: 'center',
    paddingTop: 35,
  },
  emptyImg: {
    width: 98,
    height: 79,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    color: '#222222',
    lineHeight: 17,
  },
  button: {
    width: '100%',
    marginTop: 40,
  },
});
