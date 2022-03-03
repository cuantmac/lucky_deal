import React, {useLayoutEffect, useState} from 'react';
import WebView from 'react-native-webview';
import {
  ActivityIndicator,
  View,
  StatusBar,
  DeviceEventEmitter,
  TouchableOpacity,
  Image,
} from 'react-native';
import {PRIMARY} from '../../constants/colors';
import ListenPayBackPress from '../../components/common/ListenPayBackPress';
export default function ({route, navigation}) {
  const url = route.params.url;
  const body = route.params.body;
  const from = route.params?.from || '';
  let postBody = '';
  Object.keys(body).forEach((key) => {
    let value = encodeURIComponent(body[key]); //需要编码处理,特殊字符会导致验证不通过。
    postBody += key;
    postBody += '=' + value + '&';
  });
  console.log('postBody=' + postBody);
  const [isLoadComplete, setLoadComplete] = useState(false);
  const webview = React.createRef(null);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: 'Pay Now',
      headerLeft: () => (
        <TouchableOpacity
          style={{
            width: 48,
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            emitGoBack();
          }}>
          <Image
            resizeMode={'contain'}
            style={{
              width: 16,
              height: 16,
              tintColor: 'black',
            }}
            source={require('../../assets/back.png')}
          />
        </TouchableOpacity>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, route]);
  const onMessage = (e) => {
    let message = e.nativeEvent.data;
    try {
      if (typeof JSON.parse(message) === 'object') {
        let webMessage = JSON.parse(message);
        if (webMessage.type === 'goBack') {
          emitGoBack();
        }
      }
    } catch (e) {}
  };

  const emitGoBack = () => {
    if (from === 'pay') {
      DeviceEventEmitter.emit('CHECK_ORDER_STATUS');
    } else if (from === 'vip') {
      DeviceEventEmitter.emit('vipPaySuccess', null);
    } else if (from === 'score') {
      DeviceEventEmitter.emit('scorePaySuccess');
    }
    navigation.goBack();
  };
  return (
    <View style={{flex: 1}}>
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor={'transparent'}
      />
      <ListenPayBackPress onGoBack={emitGoBack} interrupt={true} />
      <WebView
        source={{
          uri: url,
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          body: postBody,
        }}
        ref={webview}
        onMessage={onMessage}
        onLoadEnd={() => {
          setLoadComplete(true);
        }}
        onError={() => {
          setLoadComplete(true);
        }}
      />
      {!isLoadComplete && (
        <ActivityIndicator
          color={PRIMARY}
          style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
          size="large"
        />
      )}
    </View>
  );
}
