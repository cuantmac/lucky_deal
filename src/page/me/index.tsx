import {UserProfileDetailResponse} from '@luckydeal/api-common';
import {useFocusEffect} from '@react-navigation/core';
import {CommonApi} from '@src/apis';
import {ORDER_TYPE_ENUM} from '@src/constants/enum';
import {createStyleSheet} from '@src/helper/helper';
import {ReduxRootState} from '@src/redux';
import {
  CouponCenterRoute,
  ProxyOrderListRoute,
  WishListRoute,
  RecentViewRoute,
  requireAuth,
  ProxyHelpRoute,
  AddressListRoute,
  ADDRESS_LIST_TYPE_ENUM,
} from '@src/routes';
import {ListItem} from '@src/widgets/listItem';
import React, {FC, useCallback, useState} from 'react';
import {ScrollView} from 'react-native';
import {useSelector, shallowEqual} from 'react-redux';
import {MeHeader} from './widgets/meHeader';
import {UserInfo} from './widgets/userInfo';
import {
  MeModule,
  MeModuleGroup,
  MeModuleHeader,
  MeModuleIcon,
  MODULE_ICON_SIZE_ENUM,
  OrderViewAll,
  ServicesIcon,
} from './widgets/widgets';

const Me: FC = () => {
  const {token} = useSelector(
    (state: ReduxRootState) => ({
      token: state.persist.persistAuth.token,
    }),
    shallowEqual,
  );
  const [useProfile, setUserProfile] = useState<UserProfileDetailResponse>();

  const ProxyOrderListRouter = ProxyOrderListRoute.useExtraProxyRouteLink();
  const ProxyHelpRouter = ProxyHelpRoute.useExtraProxyRouteLink();
  const WishListRouter = WishListRoute.useRouteLink();
  const CouponCenterRouter = CouponCenterRoute.useRouteLink();
  const RecentViewRouter = RecentViewRoute.useRouteLink();
  const AddressListRouter = AddressListRoute.useRouteLink();

  const showNum = !!token;

  const handleNavigate2Order = useCallback(
    (orderType: ORDER_TYPE_ENUM) => {
      requireAuth().then(() => {
        ProxyOrderListRouter.navigate(
          {
            orderStatus: orderType,
          },
          {
            type: orderType,
          },
        );
      });
    },
    [ProxyOrderListRouter],
  );

  const getUserProfile = useCallback(() => {
    if (token) {
      CommonApi.userProfileDetailUsingPOST().then((res) => {
        setUserProfile(res.data);
      });
    }
  }, [token]);

  useFocusEffect(getUserProfile);

  return (
    <ScrollView style={MeStyles.container}>
      <MeModule>
        <MeHeader />
        <UserInfo />
        <MeModuleGroup style={MeStyles.userGroup}>
          <MeModuleIcon
            num={useProfile?.my_coupons_count}
            showNum={showNum}
            icon={require('@src/assets/me_coupon_icon.png')}
            title={'My Coupons'}
            size={MODULE_ICON_SIZE_ENUM.LARGE}
            onPress={() => {
              requireAuth().then(() => {
                CouponCenterRouter.navigate();
              });
            }}
          />
          <MeModuleIcon
            num={useProfile?.wish_list_count}
            showNum={showNum}
            icon={require('@src/assets/me_love_icon.png')}
            title={'Wish List'}
            size={MODULE_ICON_SIZE_ENUM.LARGE}
            onPress={() => {
              requireAuth().then(() => {
                WishListRouter.navigate();
              });
            }}
          />
          <MeModuleIcon
            num={useProfile?.recently_viewed_count}
            showNum={showNum}
            icon={require('@src/assets/me_recent_icon.png')}
            title={'Recently Viewed'}
            size={MODULE_ICON_SIZE_ENUM.LARGE}
            onPress={() => {
              requireAuth().then(() => {
                RecentViewRouter.navigate();
              });
            }}
          />
        </MeModuleGroup>
      </MeModule>
      <MeModule>
        <MeModuleHeader title={'My Orders'}>
          <OrderViewAll
            onPress={() => {
              handleNavigate2Order(ORDER_TYPE_ENUM.ALL);
            }}
          />
        </MeModuleHeader>
        <MeModuleGroup style={MeStyles.orderGroup}>
          <MeModuleIcon
            icon={require('@src/assets/me_unpaid_icon.png')}
            title={'Unpaid'}
            onPress={() => {
              handleNavigate2Order(ORDER_TYPE_ENUM.UN_PAID);
            }}
          />
          <MeModuleIcon
            icon={require('@src/assets/me_processing_icon.png')}
            title={'Processing'}
            onPress={() => {
              handleNavigate2Order(ORDER_TYPE_ENUM.TO_BE_SHIPPED);
            }}
          />
          <MeModuleIcon
            icon={require('@src/assets/me_shipped_icon.png')}
            title={'Shipped'}
            onPress={() => {
              handleNavigate2Order(ORDER_TYPE_ENUM.SHIPPED);
            }}
          />
          <MeModuleIcon
            icon={require('@src/assets/me_reviews_icon.png')}
            title={'Reviews'}
            onPress={() => {
              handleNavigate2Order(ORDER_TYPE_ENUM.RECIVED);
            }}
          />
        </MeModuleGroup>
      </MeModule>
      <MeModule showBottomSeparator={false}>
        <MeModuleHeader title={'More Services'} />
        <ListItem
          title={'Shipping Address'}
          titleStyle={MeStyles.servicesListTitle}
          showBottomLine
          forceHidePressIcon
          leftInsert={
            <ServicesIcon icon={require('@src/assets/me_address_icon.png')} />
          }
          onPress={() => {
            requireAuth().then(() => {
              AddressListRouter.navigate({
                type: ADDRESS_LIST_TYPE_ENUM.MANAGE,
              });
            });
          }}
        />
        <ListItem
          title={'Help Center'}
          titleStyle={MeStyles.servicesListTitle}
          showBottomLine
          forceHidePressIcon
          leftInsert={
            <ServicesIcon icon={require('@src/assets/me_help_icon.png')} />
          }
          onPress={() => {
            requireAuth().then(() => {
              ProxyHelpRouter.navigate();
            });
          }}
        />
      </MeModule>
    </ScrollView>
  );
};

const MeStyles = createStyleSheet({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  userGroup: {
    paddingTop: 19,
    paddingBottom: 12,
  },
  orderGroup: {
    paddingTop: 10,
    paddingBottom: 12,
  },
  servicesListTitle: {
    fontSize: 12,
  },
});

export default Me;
