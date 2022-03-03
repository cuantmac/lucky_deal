import React, {useLayoutEffect, useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  View,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {useSelector} from 'react-redux';
import AppModule from '../../../../AppModule';
import {
  FB_DL,
  FB_URL,
  INS,
  px,
  SNAPCHAT,
  YOUTUBE,
  YOUTUBE_DL,
} from '../../../constants/constants';
import {PRIMARY} from '../../../constants/colors';
import Api from '../../../Api';
import {GroupContainer} from '../common/MeComponent';
import Empty from '../../common/Empty';

const FOLLOW_LIST = {
  Facebook: {
    img: require('../../../assets/fb.png'),
    path: FB_DL,
    webPath: FB_URL,
    point: '0',
    name: 'Facebook',
  },
  YouTube: {
    img: require('../../../assets/yt.png'),
    path: YOUTUBE_DL,
    webPath: YOUTUBE,
    point: '1',
    name: 'YouTube',
  },
  ins: {
    img: require('../../../assets/ins.png'),
    webPath: INS,
    point: '2',
    name: 'Instagram',
  },
  snapchat: {
    img: require('../../../assets/snapchat.png'),
    webPath: SNAPCHAT,
    point: '3',
    name: 'Snapchat',
  },
};

export default function FollowUs({navigation}) {
  const {token} = useSelector((state) => state.deprecatedPersist);
  const [followList, setFollowList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const getFollowList = () => {
    Api.getFollowList().then((res) => {
      setLoading(false);
      if (res.code === 0) {
        const list = res.data?.list || [];
        setFollowList(list);
      } else {
        setError(true);
      }
    });
  };

  const handleFollow = async (id, {point, path, webPath}) => {
    AppModule.reportClick('10', '227', {
      FollowType: point,
    });
    let res;
    if (path && (await Linking.canOpenURL(path))) {
      res = await Linking.openURL(path);
    } else {
      res = await Linking.openURL(webPath);
    }
    if (res) {
      setLoading(true);
      await Api.userFollow(id);
      getFollowList();
    }
  };

  useEffect(() => {
    if (token) {
      getFollowList();
    }
  }, [token]);
  useLayoutEffect(() => {
    AppModule.reportShow('10', '226');
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: 'Follow Us',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <Empty
        title={'Nothing at all'}
        error={true}
        onRefresh={() => {
          setError(false);
          setLoading(true);
          getFollowList();
        }}
      />
    );
  }

  if (loading) {
    return <ActivityIndicator color={PRIMARY} style={{flex: 1}} />;
  }

  return (
    <SafeAreaView>
      <StatusBar barStyle={'dark-content'} />
      <GroupContainer containerStyle={{minHeight: 808 * px}}>
        {followList.map(({id, type, status}) => {
          return (
            <ShareListItem
              onPress={() => handleFollow(id, FOLLOW_LIST[type])}
              key={id}
              img={FOLLOW_LIST[type].img}
              text={FOLLOW_LIST[type].name}
              following={status === 1}
            />
          );
        })}
      </GroupContainer>
    </SafeAreaView>
  );
}

const ShareListItem = ({img, text, following, onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={following ? 1 : 0.8}
      onPress={following ? null : onPress}
      style={{
        paddingHorizontal: 32 * px,
        paddingVertical: 35 * px,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Image source={img} style={{width: 88 * px, height: 88 * px}} />
      <Text style={{marginLeft: 75 * px, fontSize: 40 * px, color: '#040404'}}>
        {text}
      </Text>
      {following ? (
        <Text style={{fontSize: 30 * px, color: '#040404', marginLeft: 'auto'}}>
          Following
        </Text>
      ) : (
        <View
          style={{
            marginLeft: 'auto',
            width: 132 * px,
            height: 46 * px,
            backgroundColor: '#60C1FF',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 46 * px,
          }}>
          <Text style={{fontSize: 30 * px, color: 'white'}}>Follow</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
