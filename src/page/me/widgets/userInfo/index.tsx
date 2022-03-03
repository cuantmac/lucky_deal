import {createStyleSheet} from '@src/helper/helper';
import {ReduxRootState} from '@src/redux';
import {requireAuth, UserProfileRoute} from '@src/routes';
import {GlideImage} from '@src/widgets/glideImage';
import React, {FC, useCallback} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useSelector, shallowEqual} from 'react-redux';

export const UserInfo: FC = () => {
  const {token, userProfile} = useSelector(
    (state: ReduxRootState) => ({
      token: state.persist.persistAuth.token,
      userProfile: state.persist.persistUserProfile,
    }),
    shallowEqual,
  );

  const UserProfileRouter = UserProfileRoute.useRouteLink();

  const hanldeAvatarPress = useCallback(() => {
    requireAuth().then(() => {
      UserProfileRouter.navigate();
    });
  }, [UserProfileRouter]);

  return (
    <View style={UserInfoStyles.container}>
      <TouchableOpacity
        style={UserInfoStyles.touch}
        activeOpacity={0.8}
        onPress={hanldeAvatarPress}>
        <GlideImage
          style={UserInfoStyles.avatar}
          resizeMode={'cover'}
          source={{uri: userProfile.profle?.avatar}}
        />
        <Text style={UserInfoStyles.text}>
          {token ? userProfile.profle?.nick_name : 'Sign in / Register'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const UserInfoStyles = createStyleSheet({
  container: {
    paddingHorizontal: 20,
  },
  touch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  text: {
    marginLeft: 12,
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
});
