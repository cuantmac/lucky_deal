import React, {FC, useEffect, useLayoutEffect, useState} from 'react';
import {ActivityIndicator, Dimensions, View} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {PolicyContentData} from '../../types/models/product.model';
import Api from '../../Api';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {PRIMARY} from '../../constants/colors';
import {StatusBar} from 'react-native';

const AutoWebView = AutoHeightWebView as any;
interface PolicyContentParams {
  id: number;
  title: string;
}

type NavigationParams = {
  policy: PolicyContentParams;
};

const PolicyContent: FC = () => {
  const navigation = useNavigation<StackNavigationProp<NavigationParams>>();
  const {params} = useRoute<RouteProp<NavigationParams, 'policy'>>();
  const {id, title} = params;
  const [policy, setPolicy] = useState<PolicyContentData.Data>();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: title,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    Api.policyDetail(id).then((res) => {
      setPolicy(res.data);
    });
  }, [id]);
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor={'transparent'}
      />
      {policy ? (
        <AutoWebView
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
            width: Dimensions.get('window').width - 15,
            marginTop: 5,
            marginLeft: 7,
          }}
          customStyle={
            'img {max-width: 100%;height: auto;} p {width:95%;margin:auto}'
          }
          source={{
            html: '<div>' + policy?.content + '</div>',
          }}
          viewportContent={'width=device-width, user-scalable=no'}
        />
      ) : (
        <ActivityIndicator color={PRIMARY} style={{alignSelf: 'center'}} />
      )}
    </View>
  );
};

export default PolicyContent;
