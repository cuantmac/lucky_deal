import {ActivityIndicator, Dimensions, ScrollView, View} from 'react-native';
import React, {useEffect, useLayoutEffect} from 'react';
import {px} from '../../../constants/constants';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {PRIMARY} from '../../../constants/colors';
import CustomerServiceFooter from './CustomerServiceFooter';
import AppModule from '../../../../AppModule';
import {useShallowEqualSelector} from '../../../utils/hooks';
import {useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/core';

export default function CustomerHelpContent({route, navigation}) {
  const {content, faqItem} = route.params;
  const dispatch = useDispatch();
  const focus = useIsFocused();
  const {profile, userID, token, deviceInfo} = useShallowEqualSelector(
    (state) => {
      return state.deprecatedPersist;
    },
  );

  /**
   * 处理 &nbsp; 导致webView显示文本不换行bug
   * @returns {*}
   */
  const filterContent = () => {
    return content.replace(/(&nbsp;)+/g, ' ');
  };
  const submitTicket = () => {
    AppModule.reportClick('10', '410', {
      FAQid: faqItem.faq_type,
    });
    //点击提交问题按钮，如果是订单相关的问题（My Order FAQs, Payment FAQs, Shipping & Delivery FAQs, Return & Refund FAQs 入口提交的问题）,则弹出订单选择页面，让用户先选择订单；
    if ((faqItem.need_login === 1 || faqItem.need_order === 1) && !token) {
      navigation.navigate('FBLogin');
      return;
    }
    if (faqItem.need_order === 1) {
      navigation.navigate('ChooseOrderList', {
        faqItem: faqItem,
      });
    } else {
      AppModule.openYFKChat(
        profile.nick_name || 'LD_user',
        userID || deviceInfo.tk,
        null,
        null,
        null,
        null,
        null,
      );
      dispatch({type: 'updateUnreadMsgCount', payload: 0});
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white', elevation: 0},
      headerTitleAlign: 'center',
      title: faqItem.title,
    });
  }, [faqItem, navigation]);

  useEffect(() => {
    if (focus) {
      AppModule.reportShow('10', '409', {
        FAQid: faqItem.faq_type,
      });
    }
  }, [faqItem, focus]);
  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
        borderTopWidth: 2 * px,
        borderTopColor: '#d8d8d8',
      }}>
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={{
          minHeight: '100%',
        }}
        style={{
          backgroundColor: 'white',
          flex: 1,
        }}>
        <View>
          {content ? (
            <AutoHeightWebView
              customScript={`
            let images = document.images;
            let length = images == null ? 0 : images.length;
            for (var i = 0; i < length; i++) {
                let item = images[i];
                item.onerror = function () {
                   item.src ='https://static.luckydeal.vip/images/lucky_deal_default_large.jpg';
                   item.onerror = null;
            };}`}
              style={{
                width: Dimensions.get('window').width - 10,
                marginVertical: 10,
                marginLeft: 5,
              }}
              customStyle={
                'img {max-width: 100%;height: auto;} p {width:95%;margin:auto;} span {width:95%;margin:auto}'
              }
              source={{
                html: '<div style="width: 100%">' + filterContent() + '</div>',
              }}
              viewportContent={'width=device-width, user-scalable=no'}
            />
          ) : (
            <ActivityIndicator color={PRIMARY} style={{alignSelf: 'center'}} />
          )}
          <CustomerServiceFooter onPress={submitTicket} />
        </View>
      </ScrollView>
    </View>
  );
}
