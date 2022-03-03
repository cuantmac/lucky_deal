import React, {useEffect, useLayoutEffect, useState} from 'react';
import WebView from 'react-native-webview';
import {
  ActivityIndicator,
  Dimensions,
  View,
  StatusBar,
  DeviceEventEmitter,
  TouchableOpacity,
  Image,
} from 'react-native';
import {PRIMARY} from '../../constants/colors';
import ListenPayBackPress from './ListenPayBackPress';
export default function ({route, navigation}) {
  const url = route.params.pay_url;
  const from = route.params?.from || '';
  const [isLoadComplete, setLoadComplete] = useState(false);
  const webview = React.createRef(null);
  const {width, height} = Dimensions.get('window');
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: route.params.title,
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
    if (from === 'orderPay') {
      DeviceEventEmitter.emit('updateOrderDetail');
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
        source={{uri: url}}
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
