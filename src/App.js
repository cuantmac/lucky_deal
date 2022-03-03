/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {LogBox, Platform, StatusBar, Text, SafeAreaView} from 'react-native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import MainScreen from '@src/page/tabs';
import SelectRegion from './components/me/address/SelectRegion';
import Orders from './components/me/order/Orders';
import {GOOGLE_WEB_CLIENT_ID} from './constants/constants';
import AddComent from './components/auctionProduct/AddComent';
import MessageList from './components/me/message/MessageList';
import {toast} from './utils/Utils';
import AppModule from '../AppModule';
import Login from './components/login/Login';
import Register from './components/login/Register';
import {GoogleSignin} from '@react-native-community/google-signin';
import EmailVerify from './components/login/EmailVerify';
import ForgetPassword from './components/login/ForgetPassword';
import OrderDetail from './components/me/order/OrderDetail';
import MyWebview from './components/common/MyWebview';
import TrackWebView from './components/me/order/TrackWebView';
import {dialogs} from './utils/refs';
import * as Sentry from '@sentry/react-native';
import ExitAppDialog from './components/dialog/ExitAppDialog';
import ShareDialog from './components/dialog/ShareDialog';
import {AlertDialogView} from './components/dialog/AlertDialog';
import FeedBack from './components/me/feedback/FeedBack';
import FeedBackMessageList from './components/me/feedback/FeedBackMessageList';
import Toast from 'react-native-easy-toast';
import {BottomSheetView} from './components/dialog/BottomSheet';
import {BoxCategoryList} from './components/mystery/BoxCategoryList';
import OrderFeedback from './components/me/order/OrderFeedback';
import PacyPayWebView from './components/pay/PacyPayWebView';
import PolicyContent from './components/productdetail/PolicyContent';
import DeeplinkDialog from './components/dialog/DeeplinkDialog';
import DeleteSearchHistoryDialog from './components/dialog/DeleteSearchHistoryDialog';
import GetCouponDialog from './components/dialog/GetCouponDialog';
import NewList from './components/new/NewList';
import SearchInput from './components/search/SearchInput';
import {reportData} from './constants/reportData';
// import SearchRanking from './components/search/SearchRanking';
import CustomerHelpList from './components/me/feedback/CustomerHelpList';
import CustomerHelp from './components/me/feedback/CustomerHelp';
import CustomerHelpContent from './components/me/feedback/CustomerHelpContent';
import ChooseOrderList from './components/me/feedback/ChooseOrderList';
import ApplyCodeCoupon from './components/me/coupon/ApplyCodeCoupon';
import CongratulationsDialog from './components/dialog/CongratulationsDialog';
import LoadingDialog from './components/dialog/LoadingDialog';
import BadgeCartAutoDismissDialog from './components/dialog/BadgeCartAutoDismissDialog';
import CategoryDetail from './components/category/CategoryDetail';

import OrderCancel from './components/me/order/OrderCancel';
import OrderStatusMoreAction from './components/me/order/OrderStatusMoreAction';
import ChooseRefundProductList from './components/me/order/ChooseRefundProductList';
//多件多折列表
import DiscountList from './components/activity/discout/DiscountList';
//限时折扣
import FlashDealsView from './components/activity/flashDeals/FlashDealsView';
import {ReduxProvider} from './redux';
import {
  CouponCenterRoute,
  MysteryRoute,
  PacypayRoute,
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
  TermsOfServiceRoute,
  PrivacyPolicyRoute,
} from './routes';
import {ModalProvider} from './widgets/modal';
import {NavigationContainer} from './widgets/navigationContainer';
import {BACKGROUND_BASE_COLOR} from './constants/colors';
import {Init} from './init';
let oldRender = Text.render;
Text.render = function (...args) {
  let origin = oldRender.call(this, ...args);

  return React.cloneElement(origin, {
    style: [{fontFamily: 'PingFang SC'}, origin.props.style],
  });
};

LogBox.ignoreLogs([
  'currentlyFocusedInput',
  'YellowBox',
  'no-op',
  'Setting a timer',
  '`useNativeDriver` was not specified',
]);

const Stack = createStackNavigator();
export default function () {
  useEffect(() => {
    AppModule.reportGeneral('app_luckydeal', 'ld_appstart');
  }, []);

  useEffect(() => {
    let time = new Date().getTime();
    reportData.appStartTime = time;
    return () => {
      let diff = new Date().getTime() - time;
      AppModule.reportClose('1', '5', {
        ld_use_time: diff,
      });
      AppModule.reportValue('app_luckydeal', 'ld_use_time', {value: diff});
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
      });
    }
  }, []);

  //增加Sentry错误上报
  useEffect(() => {
    Sentry.init({
      dsn:
        'https://bac76bdde1c8451990e7216b9f2bc77e@o414686.ingest.sentry.io/5304603',
    });
  }, []);

  return (
    <ReduxProvider>
      {/* mian views */}
      <SafeAreaView style={{flex: 1}}>
        <ModalProvider>
          <Init />
          <StatusBar barStyle="dark-content" backgroundColor={'white'} />
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                cardStyle: {
                  backgroundColor: BACKGROUND_BASE_COLOR,
                },
                headerShown: false,
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}>
              {/*No Login*/}
              <Stack.Screen name="Main" component={MainScreen} />
              <Stack.Screen name="MyWebview" component={MyWebview} />
              <Stack.Screen name="NewList" component={NewList} />
              <Stack.Screen name={'TrackWebView'} component={TrackWebView} />
              {/*Need Login*/}

              <Stack.Screen name="SelectRegion" component={SelectRegion} />
              <Stack.Screen name="Orders" component={Orders} />
              <Stack.Screen name="OrderDetail" component={OrderDetail} />
              <Stack.Screen name="AddComent" component={AddComent} />
              <Stack.Screen name="MessageList" component={MessageList} />
              <Stack.Screen name="FeedBack" component={FeedBack} />
              <Stack.Screen
                name="FeedBackMessageList"
                component={FeedBackMessageList}
              />
              <Stack.Screen name="OrderFeedback" component={OrderFeedback} />

              <Stack.Screen name="SearchInput" component={SearchInput} />
              {/* <Stack.Screen name={'SearchRanking'} component={SearchRanking} /> */}
              <Stack.Screen name={'CustomerHelp'} component={CustomerHelp} />
              <Stack.Screen
                name={'CustomerHelpContent'}
                component={CustomerHelpContent}
              />
              <Stack.Screen
                name={'CustomerHelpList'}
                component={CustomerHelpList}
              />
              <Stack.Screen
                name={'ChooseOrderList'}
                component={ChooseOrderList}
              />
              <Stack.Screen
                name={'ApplyCodeCoupon'}
                component={ApplyCodeCoupon}
              />
              <Stack.Screen name="OrderCancel" component={OrderCancel} />
              <Stack.Screen
                name={'PacyPayWebView'}
                component={PacyPayWebView}
              />
              <Stack.Screen
                name={'CategoryDetail'}
                component={CategoryDetail}
              />
              <Stack.Screen
                name={'ChooseRefundProductList'}
                component={ChooseRefundProductList}
              />
              <Stack.Screen name={'DiscountList'} component={DiscountList} />
              <Stack.Screen name={'PolicyContent'} component={PolicyContent} />
              <Stack.Screen
                name={'BoxCategoryList'}
                component={BoxCategoryList}
              />
              <Stack.Screen name="FlashDealsView" component={FlashDealsView} />

              {/* ---------------------重构-------------------------*/}
              <Stack.Screen
                name={ProductRoute.name}
                component={ProductRoute.component}
              />
              <Stack.Screen
                name={MysteryRoute.name}
                component={MysteryRoute.component}
              />
              <Stack.Screen
                name={PayRoute.name}
                component={PayRoute.component}
              />
              <Stack.Screen
                name={PacypayRoute.name}
                component={PacypayRoute.component}
              />
              <Stack.Screen
                name={PolicyRoute.name}
                component={PolicyRoute.component}
              />
              <Stack.Screen
                name={ProductListRoute.name}
                getId={({params}) => params.threeCategoryId + ''}
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
          {/* dialogs views */}
          <AlertDialogView />
          <BottomSheetView />
          <ExitAppDialog ref={dialogs.exitAppRef} />
          <ShareDialog ref={dialogs.shareRef} />
          <DeeplinkDialog ref={dialogs.deeplinkRef} />
          <GetCouponDialog ref={dialogs.getCouponRef} />
          <DeleteSearchHistoryDialog ref={dialogs.clearHistoryRef} />
          <CongratulationsDialog ref={dialogs.congratulationsDialog} />
          <LoadingDialog ref={dialogs.loadingDialog} />
          <BadgeCartAutoDismissDialog ref={dialogs.badgeCartDialog} />
          <OrderStatusMoreAction ref={dialogs.moreActionRef} />
        </ModalProvider>
      </SafeAreaView>
      <Toast ref={toast} position="center" />
    </ReduxProvider>
  );
}
