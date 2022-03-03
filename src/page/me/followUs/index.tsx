import React, {useState, useEffect, useCallback, FC} from 'react';
import {Text, TouchableOpacity, Image, View, Linking} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import {
  FB_DL,
  FB_URL,
  INS,
  px,
  SNAPCHAT,
  YOUTUBE,
  YOUTUBE_DL,
} from '../../../constants/constants';
import {ReduxRootState} from '@src/redux';
import {FollowItem} from '@luckydeal/api-common';
import {CommonApi} from '@src/apis';
import {Message} from '@src/helper/message';
import {useLoading} from '@src/utils/hooks';
import {PageStatusControl} from '@src/widgets/pageStatusControl';
import {GlideImageProps} from '@src/widgets/glideImage';
import {useNavigationHeader} from '@src/widgets/navigationHeader';
import {styleAdapter} from '@src/helper/helper';
import {navigate2Login} from '@src/routes';

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

export default function FollowUs() {
  const {token} = useSelector(
    (state: ReduxRootState) => ({
      token: state.persist.persistAuth.token,
    }),
    shallowEqual,
  );
  const [followList, setFollowList] = useState<FollowItem[]>();
  const [loading, withLoading] = useLoading();

  useNavigationHeader({
    title: 'Follow Us',
  });

  const getFollowList = useCallback(() => {
    return CommonApi.userFollowListUsingPOST().then((res) => {
      setFollowList(res.data.list);
    });
  }, []);

  const handleFollow = async (
    id: number,
    {path, webPath}: typeof FOLLOW_LIST['Facebook'],
  ) => {
    if (path && (await Linking.canOpenURL(path))) {
      await Linking.openURL(path);
    } else {
      await Linking.openURL(webPath);
    }
    Message.loading();
    try {
      await CommonApi.userFollowUsingPOST({id});
      // eslint-disable-next-line no-catch-shadow
    } catch (error) {}
    Message.hide();
    getFollowList();
  };

  useEffect(() => {
    withLoading(getFollowList());
  }, [getFollowList, token, withLoading]);

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <PageStatusControl
        hasData={!!followList?.length}
        loading={loading}
        showEmpty>
        {followList?.map(({id, type, status}) => {
          const item = (FOLLOW_LIST as any)[
            type
          ] as typeof FOLLOW_LIST['Facebook'];
          return (
            <ShareListItem
              onPress={() => handleFollow(id as number, item)}
              key={id}
              img={item.img}
              text={item.name}
              following={status === 1}
            />
          );
        })}
      </PageStatusControl>
    </View>
  );
}

interface ShareListItemProps {
  img: GlideImageProps['source'];
  text: string;
  following: boolean;
  onPress: () => void;
}

const ShareListItem: FC<ShareListItemProps> = ({
  img,
  text,
  following,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={following ? 1 : 0.8}
      disabled={following}
      onPress={onPress}
      style={styleAdapter(
        {
          paddingHorizontal: 32,
          paddingVertical: 35,
          flexDirection: 'row',
          alignItems: 'center',
        },
        true,
      )}>
      <Image source={img} style={styleAdapter({width: 88, height: 88}, true)} />
      <Text
        style={styleAdapter(
          {marginLeft: 75, fontSize: 40, color: '#040404'},
          true,
        )}>
        {text}
      </Text>
      {following ? (
        <Text
          style={styleAdapter(
            {fontSize: 30, color: '#040404', marginLeft: 'auto'},
            true,
          )}>
          Following
        </Text>
      ) : (
        <View
          style={styleAdapter(
            {
              marginLeft: 'auto',
              width: 132,
              height: 46,
              backgroundColor: '#60C1FF',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 46,
            },
            true,
          )}>
          <Text style={styleAdapter({fontSize: 30, color: 'white'}, true)}>
            Follow
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
