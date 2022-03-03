import {
  FlatList,
  TouchableOpacity,
  View,
  Image,
  Text,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import AppModule from '../../../../AppModule';
import {px, SCREEN_WIDTH} from '../../../constants/constants';
import {PRIMARY} from '../../../constants/colors';
import {useShallowEqualSelector} from '../../../utils/hooks';
import {useIsFocused} from '@react-navigation/core';
import CustomerServiceFooter from './CustomerServiceFooter';
import {useDispatch} from 'react-redux';
import Api from '../../../Api';
import Utils from '../../../utils/Utils';

export default function CustomerHelp({navigation}) {
  const focus = useIsFocused();
  const {profile, userID, deviceInfo, unreadMsgCount} = useShallowEqualSelector(
    (state) => {
      return state.deprecatedPersist;
    },
  );
  const dispatch = useDispatch();
  const [faqTypes, setFaqTypes] = useState();
  const customerService = useCallback(
    (btnType) => {
      if (btnType === 1) {
        AppModule.reportClick('10', '413');
      } else if (btnType === 2) {
        AppModule.reportClick('10', '414');
      }
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
    },
    [profile, userID, deviceInfo, dispatch],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white', elevation: 0},
      headerTitleAlign: 'center',
      title: 'Help & Contact Us',
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            customerService(1);
          }}>
          <Image
            style={{
              width: 67 * px,
              height: 67 * px,
              marginHorizontal: 40 * px,
            }}
            source={require('../../../assets/faq_msg.png')}
          />
          {unreadMsgCount > 0 && (
            <View
              style={{
                position: 'absolute',
                right: 8,
                top: 0,
                borderColor: '#FF4A1A',
                borderWidth: 1,
                backgroundColor: '#fff',
                borderRadius: 6,
                width: 12,
                height: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: '#FF4A1A',
                  fontSize: 9,
                  fontWeight: 'bold',
                }}>
                {unreadMsgCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, unreadMsgCount, customerService]);
  useEffect(() => {
    if (focus) {
      AppModule.reportShow('10', '273');

      Api.faqTypes().then((res) => {
        if (res.code === 0) {
          setFaqTypes(res.data.list);
        }
      });
    }
  }, [focus]);

  const fetchContent = (item) => {
    AppModule.reportClick('10', '407', {
      FAQid: item.faq_type,
    });
    navigation.navigate('CustomerHelpList', {
      faqItem: item,
    });
  };

  const FaqRenderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          fetchContent(item);
        }}
        style={{
          alignItems: 'center',
          width: SCREEN_WIDTH / 2,
          marginTop: 84 * px,
        }}>
        <View
          style={{
            width: 180 * px,
            height: 180 * px,
            borderRadius: 90 * px,
            backgroundColor: '#eee',
            justifyContent: 'center',
          }}>
          <Image
            style={{width: 90 * px, height: 90 * px, alignSelf: 'center'}}
            resizeMode={'contain'}
            source={Utils.getImageUri(item.image)}
          />
        </View>
        <Text style={{fontSize: 30 * px, color: 'black'}}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{backgroundColor: '#fff', flex: 1, position: 'relative'}}>
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor={'transparent'}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          borderTopColor: '#D8D8D8',
          borderTopWidth: 2 * px,
        }}>
        <FlatList
          contentContainerStyle={{
            paddingBottom: 100 * px,
          }}
          numColumns={2}
          data={faqTypes}
          onEndReachedThreshold={0.4}
          renderItem={FaqRenderItem}
          keyExtractor={(item) => item.faq_type.toString()}
          ListFooterComponent={() => {
            if (faqTypes && faqTypes?.length > 0) {
              return (
                <CustomerServiceFooter
                  onPress={() => {
                    customerService(2);
                  }}
                />
              );
            } else {
              return (
                <ActivityIndicator color={PRIMARY} style={{padding: 10}} />
              );
            }
          }}
        />
      </View>
    </View>
  );
}
