import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import * as ReactNative from 'react-native-web';
import React, {FC} from 'react';
import {StatusBar} from 'react-native';
import 'react-native-gesture-handler';
import {ReduxProvider} from './redux';
import {
  CouponCenterRoute,
  MainRoute,
  MysteryRoute,
  PayRoute,
  PolicyRoute,
  ProductReviewsRoute,
  ProductRoute,
  ProductListRoute,
  SearchRoute,
  ShopPushRoute,
  SearchRankingRoute,
  UserProfileRoute,
  SettingsRoute,
  ChangeProfileEmailRoute,
  ChangeProfileNameRoute,
  AboutListRoute,
  FollowUsRoute,
  RecentViewRoute,
  WishListRoute,
  AddressListRoute,
  EditAddressRoute,
  LoginRoute,
  PrivacyPolicyRoute,
  TermsOfServiceRoute,
} from './routes';
import {ModalProvider} from './widgets/modal';
import {NavigationContainer} from './widgets/navigationContainer';
import {BACKGROUND_BASE_COLOR} from './constants/colors';
import {Init} from './init';

{
  const PropTypes = require('prop-types');
  ReactNative.Text.propTypes = {style: PropTypes.any};
  ReactNative.View.propTypes = {style: PropTypes.any};
  ReactNative.Image.propTypes = {style: PropTypes.any};
}

const Stack = createStackNavigator();

const AppWeb: FC = () => {
  return (
    <ReduxProvider>
      <ModalProvider>
        <Init />
        <StatusBar barStyle="dark-content" backgroundColor={'white'} />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={MainRoute.name}
            screenOptions={{
              cardStyle: {
                flex: 1,
                backgroundColor: BACKGROUND_BASE_COLOR,
              },
              headerShown: false,
              gestureEnabled: true,
              gestureDirection: 'horizontal',
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}>
            <Stack.Screen
              name={MainRoute.name}
              component={MainRoute.component}
            />
            <Stack.Screen
              name={ProductRoute.name}
              component={ProductRoute.component}
            />
            <Stack.Screen
              name={MysteryRoute.name}
              component={MysteryRoute.component}
            />
            <Stack.Screen
              name={PolicyRoute.name}
              component={PolicyRoute.component}
            />
            <Stack.Screen name={PayRoute.name} component={PayRoute.component} />
            <Stack.Screen
              name={ProductListRoute.name}
              getId={({params}: any) => {
                return params.threeCategoryId + '';
              }}
              component={ProductListRoute.component}
            />
            <Stack.Screen
              name={SearchRoute.name}
              component={SearchRoute.component}
            />
            <Stack.Screen
              name={ProductReviewsRoute.name}
              component={ProductReviewsRoute.component}
            />
            <Stack.Screen
              name={CouponCenterRoute.name}
              component={CouponCenterRoute.component}
            />
            <Stack.Screen
              name={ShopPushRoute.name}
              component={ShopPushRoute.component}
            />
            <Stack.Screen
              name={SearchRankingRoute.name}
              component={SearchRankingRoute.component}
            />
            <Stack.Screen
              name={UserProfileRoute.name}
              component={UserProfileRoute.component}
            />
            <Stack.Screen
              name={SettingsRoute.name}
              component={SettingsRoute.component}
            />
            <Stack.Screen
              name={ChangeProfileEmailRoute.name}
              component={ChangeProfileEmailRoute.component}
            />
            <Stack.Screen
              name={ChangeProfileNameRoute.name}
              component={ChangeProfileNameRoute.component}
            />
            <Stack.Screen
              name={AboutListRoute.name}
              component={AboutListRoute.component}
            />
            <Stack.Screen
              name={FollowUsRoute.name}
              component={FollowUsRoute.component}
            />
            <Stack.Screen
              name={RecentViewRoute.name}
              component={RecentViewRoute.component}
            />
            <Stack.Screen
              name={WishListRoute.name}
              component={WishListRoute.component}
            />
            <Stack.Screen
              name={AddressListRoute.name}
              component={AddressListRoute.component}
            />
            <Stack.Screen
              name={EditAddressRoute.name}
              component={EditAddressRoute.component}
            />
            <Stack.Screen
              name={LoginRoute.name}
              component={LoginRoute.component}
            />
            <Stack.Screen
              name={TermsOfServiceRoute.name}
              component={TermsOfServiceRoute.component}
            />
            <Stack.Screen
              name={PrivacyPolicyRoute.name}
              component={PrivacyPolicyRoute.component}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ModalProvider>
    </ReduxProvider>
  );
};

export default AppWeb;
