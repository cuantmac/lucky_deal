import {
  OfferProductDetailResponse,
  BagProductDetailResponse,
} from '@luckydeal/api-common';
import {createStyleSheet, isWeb} from '@src/helper/helper';
import {
  goback,
  HomeRoute,
  ProxyHelpRoute,
  WishListRoute,
  requireAuth,
  SearchRoute,
  ShopPushRoute,
  RecentViewRoute,
} from '@src/routes';
import {AnchorConsumerRef} from '@src/widgets/anchor';
import {ShareDialog, ShareDialogRef} from '@src/widgets/dialogs/shareDialog';
import {MenuModal, MenuModalItem} from '@src/widgets/modal/menuModal';
import {CustomHeader} from '@src/widgets/navigationHeader/customHeader';
import {
  HeaderIcon,
  HeaderIconWrap,
} from '@src/widgets/navigationHeader/widgets';
import {SearchBarStatic} from '@src/widgets/searchBar';
import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  memo,
  useState,
  useMemo,
  useCallback,
} from 'react';
import {View, ScrollViewProps} from 'react-native';
import {
  ProductDetailAnchor,
  ProductDetailAnchorProps,
} from '../productDetailAnchor';

export type ProductDetailHeaderRef = {
  handleOnScroll: NonNullable<ScrollViewProps['onScroll']>;
};

export type ProductDetailHeaderProps = ProductDetailAnchorProps & {
  data: OfferProductDetailResponse | BagProductDetailResponse;
};

export const ProductDetailHeader = memo(
  forwardRef<ProductDetailHeaderRef, ProductDetailHeaderProps>(
    ({data, ...props}, ref) => {
      const anchorRef = useRef<AnchorConsumerRef>(null);
      const [show, setShow] = useState<boolean>(false);
      const shareRef = useRef<ShareDialogRef>(null);
      const ShopPushRouter = ShopPushRoute.useRouteLink();
      const HomeRouter = HomeRoute.useRouteLink();
      const ProxyHelpRouter = ProxyHelpRoute.useExtraProxyRouteLink();
      const WishListRouter = WishListRoute.useRouteLink();
      const SearchRouter = SearchRoute.useRouteLink();
      const RecentViewRouter = RecentViewRoute.useRouteLink();

      useImperativeHandle(
        ref,
        () => {
          return {
            handleOnScroll: (params) => {
              anchorRef.current && anchorRef.current.handleOnScroll(params);
              const flag = params.nativeEvent.contentOffset.y / 150;
              setShow(flag > 1);
            },
          };
        },
        [],
      );

      // 添加search跳转
      const handleSearchPress = useCallback(() => {
        SearchRouter.navigate();
      }, [SearchRouter]);

      // NeedHelp跳转
      const handleNeedHelpPress = useCallback(() => {
        requireAuth().then(() => {
          ProxyHelpRouter.navigate();
        });
      }, [ProxyHelpRouter]);

      // wishList跳转
      const handleWishListPress = useCallback(() => {
        requireAuth().then(() => {
          WishListRouter.navigate();
        });
      }, [WishListRouter]);

      const handleHomePress = useCallback(() => {
        HomeRouter.navigate();
      }, [HomeRouter]);

      const handleShopPress = useCallback(() => {
        ShopPushRouter.navigate({behavior: 'back'});
      }, [ShopPushRouter]);

      const handleSharePress = useCallback(() => {
        shareRef.current?.share({url: data.share_url});
      }, [data.share_url]);

      const handleRecentPress = useCallback(() => {
        requireAuth().then(() => {
          RecentViewRouter.navigate();
        });
      }, [RecentViewRouter]);

      const memuItem = useMemo(() => {
        return [
          <MenuModalItem
            onPress={handleHomePress}
            source={require('@src/assets/header_home_icon.png')}
            title={'Home'}
            key="1"
          />,
          <MenuModalItem
            onPress={handleSearchPress}
            source={require('@src/assets/header_search_icon.png')}
            title={'Search'}
            key="2"
          />,
          isWeb() ? null : (
            <MenuModalItem
              onPress={handleSharePress}
              source={require('@src/assets/header_share_icon.png')}
              title={'Share'}
              key="3"
            />
          ),
          <MenuModalItem
            onPress={handleWishListPress}
            source={require('@src/assets/header_love_icon.png')}
            title={'Wish List'}
            key="4"
          />,
          <MenuModalItem
            onPress={handleRecentPress}
            source={require('@src/assets/header_recentview_icon.png')}
            title={'Recently Viewed'}
            key="5"
          />,
          <MenuModalItem
            onPress={handleNeedHelpPress}
            source={require('@src/assets/me_help_icon.png')}
            title={'Need Help?'}
            key="6"
          />,
        ];
      }, [
        handleHomePress,
        handleSearchPress,
        handleSharePress,
        handleWishListPress,
        handleRecentPress,
        handleNeedHelpPress,
      ]);

      return (
        <>
          <View
            style={[
              ProductDetailHeaderStyles.container,
              {display: !show ? 'flex' : 'none'},
            ]}>
            <HeaderIcon
              source={require('@src/assets/product_back.png')}
              onPress={goback}
            />
            <HeaderIconWrap>
              <HeaderIcon
                onPress={handleShopPress}
                source={require('@src/assets/product_bag.png')}
              />
              <MenuModal menu={memuItem}>
                <HeaderIcon
                  disabled
                  source={require('@src/assets/product_more.png')}
                />
              </MenuModal>
            </HeaderIconWrap>
          </View>

          <View
            style={[
              {display: show ? 'flex' : 'none', backgroundColor: 'white'},
            ]}>
            <CustomHeader
              headerStyle={{borderBottomWidth: 0}}
              headerLeft={
                <View style={ProductDetailHeaderStyles.searchBarContainer}>
                  <SearchBarStatic onPress={handleSearchPress} />
                </View>
              }
              headerRight={[
                <HeaderIcon
                  size={20}
                  style={ProductDetailHeaderStyles.rightIcon}
                  source={require('@src/assets/cart_icon.png')}
                  onPress={handleShopPress}
                />,
                <MenuModal menu={memuItem}>
                  <HeaderIcon
                    size={20}
                    disabled
                    source={require('@src/assets/more_icon.png')}
                  />
                </MenuModal>,
              ]}
            />
            <ProductDetailAnchor {...props} ref={anchorRef} />
          </View>
          <ShareDialog ref={shareRef} />
        </>
      );
    },
  ),
);

const ProductDetailHeaderStyles = createStyleSheet({
  container: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 47,
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
  },
  rightIcon: {
    marginHorizontal: 8,
  },
  searchBarContainer: {width: 250, paddingLeft: 12},
});
