import React, {useLayoutEffect} from 'react';
import WebView from 'react-native-webview';
import {View, StatusBar, TouchableOpacity, Image} from 'react-native';
import Utils from '../../../utils/Utils';
export default function ({route, navigation}) {
  const trackNumber = JSON.stringify(
    Utils.filterSpecialWords(route?.params.trackNumber),
  );
  const webview = React.createRef(null);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: 'Shipping Info',
      headerLeft: () => (
        <TouchableOpacity
          style={{
            width: 48,
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            resizeMode={'contain'}
            style={{
              width: 16,
              height: 16,
              tintColor: 'black',
            }}
            source={require('../../../assets/back.png')}
          />
        </TouchableOpacity>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, route]);

  return (
    <View style={{flex: 1}}>
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor={'transparent'}
      />
      <WebView
        source={{
          html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
                </head>
             <body>
             <div id="YQContainer"></div>
             <script type="text/javascript" src="https://www.17track.net/externalcall.js"></script>
             </body>
            </html>`,
        }}
        ref={webview}
        injectedJavaScript={`
         window.onload = doTrack();
         function doTrack() {
            YQV5.trackSingle({
            //必须，指定承载内容的容器ID。
            YQ_ContainerId:"YQContainer",
            //可选，指定查询结果高度，最大为800px，默认为560px。
            YQ_Height: 800,
            //可选，指定运输商，默认为自动识别。
            // YQ_Fc:"0",
            //可选，指定UI语言，默认根据浏览器自动识别。
            // YQ_Lang:"en",
            //必须，指定要查询的单号。
            YQ_Num: ${trackNumber}
            });
         }`}
      />
    </View>
  );
}
