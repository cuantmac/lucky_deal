import {View} from 'react-native';
import React, {FC, useCallback} from 'react';
import {SearchBarStatic} from '@src/widgets/searchBar';
import {createStyleSheet} from '@src/helper/helper';

import {requireAuth, WishListRoute} from '@src/routes';

import {SearchRoute} from '@src/routes';
import {CustomHeader} from '@src/widgets/navigationHeader/customHeader';
import {HeaderIcon} from '@src/widgets/navigationHeader/widgets';

const SearchBar: FC = () => {
  const SearchRouter = SearchRoute.useRouteLink();
  const WishListRouter = WishListRoute.useRouteLink();

  const handleWishListPress = useCallback(() => {
    requireAuth().then(() => {
      WishListRouter.navigate();
    });
  }, [WishListRouter]);

  return (
    <CustomHeader
      headerBackVisible={false}
      headerLeft={[
        <View style={SearchBarStyles.searchBarContainer}>
          <SearchBarStatic onPress={() => SearchRouter.navigate()} />
        </View>,
      ]}
      headerRight={
        <HeaderIcon
          size={20}
          source={require('@src/assets/love_icon.png')}
          onPress={handleWishListPress}
        />
      }
    />
  );
};

const SearchBarStyles = createStyleSheet({
  searchBarContainer: {
    width: 315,
  },
});

export default SearchBar;
