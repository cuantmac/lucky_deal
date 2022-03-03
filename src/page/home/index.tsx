import React, {FC, useCallback, useLayoutEffect, useState} from 'react';
import {TopTabs} from '@src/page/home/widgets/topTabs';
import {CommonApi} from '@src/apis';
import {
  NewHomePageNavBarItem,
  PromoCodeInfoItem,
} from '@luckydeal/api-common/lib/api';
import {WishListRoute, requireAuth, SearchRoute} from '@src/routes';
import {CustomHeader} from '@src/widgets/navigationHeader/customHeader';
import {HeaderIcon} from '@src/widgets/navigationHeader/widgets';
import {GlideImage} from '@src/widgets/glideImage';
import {View, Text, TouchableOpacity} from 'react-native';
import {createStyleSheet} from '@src/helper/helper';
import {SearchBarStatic} from '@src/widgets/searchBar';
import Empty from '@src/page/home/widgets/empty';
import {useLoading} from '@src/utils/hooks';
import {PageStatusControl} from '@src/widgets/pageStatusControl';
import {MarketCouponModal} from '@src/widgets/dialogs/makertCouponDialog';
import {APPLY_COUPON_PAGE_ENUM} from '@src/constants/enum';

const Home: FC = () => {
  const [tabsData, setTabsData] = useState<NewHomePageNavBarItem[]>([]);
  const [couponData, setCouponData] = useState<PromoCodeInfoItem>();
  const WishListRouter = WishListRoute.useRouteLink();
  const SearchRouter = SearchRoute.useRouteLink();
  const [loading, withLoading] = useLoading();

  const loadAllData = useCallback(() => {
    withLoading(
      CommonApi.newHomeNavBarUsingPOST(),
      CommonApi.userAvailableCouponsUsingPOST({from: 0}),
    ).then(([res1, res2]) => {
      setTabsData(res1.data?.list);
      setCouponData(res2.data.promo_code_info);
    });
  }, [withLoading]);

  useLayoutEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // 添加search跳转
  const handleSearchPress = useCallback(() => {
    SearchRouter.navigate();
  }, [SearchRouter]);

  const handleWishListPress = useCallback(() => {
    requireAuth().then(() => {
      WishListRouter.navigate();
    });
  }, [WishListRouter]);

  return (
    <>
      <CustomHeader
        headerStyle={HomeStyles.headerContainer}
        headerBackVisible={false}
        headerLeft={[
          <HeaderLeft />,
          <HeaderSearch onPress={handleSearchPress} />,
        ]}
      />
      <PageStatusControl
        loading={loading}
        hasData={!!tabsData?.length}
        showEmpty
        emptyComponent={<Empty />}>
        <TopTabs config={tabsData} couponData={couponData} />
      </PageStatusControl>
      <MarketCouponModal page={APPLY_COUPON_PAGE_ENUM.HOME} />
    </>
  );
};

const HeaderLeft: FC = () => {
  return (
    <View style={HomeStyles.headerLeftContainer}>
      <GlideImage
        style={HomeStyles.headerLeftImage}
        source={require('@src/assets/gesleben_text_icon.png')}
      />
    </View>
  );
};

interface HeaderSearchProps {
  onPress?: () => void;
}

const HeaderSearch: FC<HeaderSearchProps> = ({onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={HomeStyles.headerSearchContainer}>
      <Text style={HomeStyles.searchText}>Search</Text>
      <GlideImage
        style={HomeStyles.searchIcon}
        source={require('@src/assets/home_search_icon.png')}
      />
    </TouchableOpacity>
  );
};

const HomeStyles = createStyleSheet({
  headerContainer: {
    borderBottomWidth: 0,
    backgroundColor: '#222',
  },
  headerLeftContainer: {
    flexDirection: 'row',
  },
  headerLeftImage: {
    width: 72,
    height: 10,
  },
  headerLeftText: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  headerSearchContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    width: 260,
    marginLeft: 16,
    flexDirection: 'row',
    height: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  searchText: {
    color: '#666',
    fontSize: 12,
  },
  searchIcon: {
    width: 12,
    height: 12,
  },
});

export default Home;
