import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getDeviceInfo} from '@src/helper/nativeBridge';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {ViewStyle, View, InteractionManager, Platform} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';

interface HtmlRenderProps {
  html?: string;
  style?: ViewStyle;
}

export const HtmlRender: FC<HtmlRenderProps> = ({html = '', style}) => {
  const [state, setState] = useState(1);
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const onWebViewMessage = (event: WebViewMessageEvent) => {
    const h = Number(event.nativeEvent.data);
    if (state === h) {
      return;
    }
    setState(h);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      setIsFocused(false);
    });
    return unsubscribe;
  }, [navigation]);

  /**
   *  webview 在android 11(Api 30)设备上，当页面跳转动画未完成就加载webview内容时，会造成app crash
   *  解决办法 等待react native动画结束
   */
  useFocusEffect(
    useCallback(() => {
      InteractionManager.runAfterInteractions(() => setIsFocused(true));
    }, []),
  );

  /**
   * webview 在android 12(Api 31) 设备上，滚动时bunces效果出来时，webview会造成 App crash
   * 解决办法 判断android版本 对31及以上版本设置 opacity 0.99可以解决
   */
  useEffect(() => {
    if (Platform.OS === 'android') {
      getDeviceInfo().then((res) => {
        const apiVersion = +(res.android_version || '1');
        setOpacity(apiVersion >= 31 ? 0.99 : 1);
      });
    } else {
      setOpacity(1);
    }
  }, []);

  if (!isFocused || !opacity) {
    return null;
  }

  return (
    <View
      style={[
        {
          backgroundColor: 'white',
        },
        style,
      ]}>
      <WebView
        style={[
          {
            height: state,
            opacity,
            minHeight: 1,
          },
        ]}
        source={{
          html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <style>
          html, body {
            width:100%;
            height:100%;
            overflow:hidden;
          }
          body {
            margin:0;
            display:flex;
          }
          .html-render {
            width:100%;
            background: white;
          }
          img {
            max-width: 100%;
            height: auto!important;
          }
          p {
            line-height: 22px;
            font-size: 14px;
          }
          table {
            width: 100% !important;
            table-layout: fixed;
            word-break: break-all;
            word-wrap: break-word;
            border-collapse: collapse;
          }
          </style>
        </head>
        <body>
          <div class="html-render">
            ${html}
          </div>
        </body>
        <script>
          let images = document.images;
          let length = images == null ? 0 : images.length;
          for (var i = 0; i < length; i++) {
              let item = images[i];
              item.onerror = function () {
                item.src ='https://static.luckydeal.vip/images/lucky_deal_default_large.jpg';
                item.onerror = null;
          };}
          let scrollHeight = document.body.scrollHeight;
          window.ReactNativeWebView.postMessage(document.body.scrollHeight);
          setInterval(function(){
            let currentScrollHeight = document.body.scrollHeight;
            if(currentScrollHeight !== scrollHeight) {
              window.ReactNativeWebView.postMessage(document.body.scrollHeight);
              scrollHeight = currentScrollHeight;
            }
          }, 1000);
        </script>
        </html>
        `,
        }}
        onMessage={onWebViewMessage}
      />
    </View>
  );
};
