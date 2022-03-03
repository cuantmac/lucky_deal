import React, {FC, useState} from 'react';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {View, StatusBar} from 'react-native';
import {useNavigationParams} from '@src/hooks/useNavigationParams';
import {goback, PacypayRouteParams} from '@src/routes';
import {useNavigationHeader} from '@src/widgets/navigationHeader';
import {useCallback} from 'react';
import {useEffect} from 'react';
import {Message} from '@src/helper/message';
import {useMemo} from 'react';

const Pacypay: FC = () => {
  const {pay_url, ...body} = useNavigationParams<PacypayRouteParams>();
  const [isLoadComplete, setLoadComplete] = useState(false);
  useNavigationHeader({
    title: 'Pay Now',
  });

  const postBody = useMemo(() => {
    let str = '';
    Object.keys(body).forEach((key) => {
      let value = encodeURIComponent(body[key]); //需要编码处理,特殊字符会导致验证不通过。
      str += key;
      str += '=' + value + '&';
    });
    return str;
  }, [body]);

  const onMessage = useCallback((e: WebViewMessageEvent) => {
    let message = e.nativeEvent.data;
    try {
      if (typeof JSON.parse(message) === 'object') {
        let webMessage = JSON.parse(message);
        if (webMessage.type === 'goBack') {
          goback();
        }
      }
      // eslint-disable-next-line no-catch-shadow
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!isLoadComplete) {
      Message.loading();
    }
    return () => {
      Message.hide();
    };
  }, [isLoadComplete]);

  return (
    <View style={{flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor={'transparent'} />
      <WebView
        source={{
          uri: pay_url,
          method: 'POST',
          body: postBody,
        }}
        onMessage={onMessage}
        onLoadEnd={() => {
          setLoadComplete(true);
        }}
        onError={() => {
          setLoadComplete(true);
        }}
      />
    </View>
  );
};

export default Pacypay;
