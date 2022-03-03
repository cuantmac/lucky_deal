import {createStyleSheet, isAndroid, isWeb} from '@src/helper/helper';
import {
  BUILD_ID,
  DEV_MODE,
  getActiveBundleVersion,
  VERSION_NAME,
} from '@src/helper/nativeBridge';
import {ReduxRootState} from '@src/redux';
import {
  AboutListRoute,
  AddressListRoute,
  ADDRESS_LIST_TYPE_ENUM,
  FollowUsRoute,
  requireAuth,
  UserProfileRoute,
} from '@src/routes';
import {ListItem} from '@src/widgets/listItem';
import {useNavigationHeader} from '@src/widgets/navigationHeader';
import {Space} from '@src/widgets/space';
import React, {FC, useState} from 'react';
import {Linking, Text, View} from 'react-native';
import {useSelector, shallowEqual} from 'react-redux';
import {AuthButton} from './authButton';

const Settings: FC = () => {
  const {token, userId} = useSelector(
    (state: ReduxRootState) => ({
      token: state.persist.persistAuth.token,
      userId: state.persist.persistAuth.user_id,
    }),
    shallowEqual,
  );

  const [count, setCount] = useState(0);

  const UserProfileRouter = UserProfileRoute.useRouteLink();
  const AboutListRouter = AboutListRoute.useRouteLink();
  const FollowUsRouter = FollowUsRoute.useRouteLink();
  const AddressListRouter = AddressListRoute.useRouteLink();

  useNavigationHeader({
    title: 'Settings',
  });

  return (
    <>
      {!!token && (
        <>
          <ListItem
            title={'Profile'}
            onPress={() => UserProfileRouter.navigate()}
          />
          <ListItem
            title={'Shipping Address'}
            onPress={() => {
              AddressListRouter.navigate({
                type: ADDRESS_LIST_TYPE_ENUM.MANAGE,
              });
            }}
          />
          <Space height={9} backgroundColor={'transparent'} />
        </>
      )}
      <ListItem
        title={'About Gesleben'}
        onPress={() => AboutListRouter.navigate()}
      />
      {!isWeb() && (
        <ListItem
          title={'Rating Gesleben'}
          onPress={() => {
            Linking.openURL(
              isAndroid()
                ? 'https://play.google.com/store/apps/details?id=com.luckydeal'
                : 'https://apps.apple.com/us/app/lucky-deal-get-discount-goods/id1531277195',
            );
          }}
        />
      )}
      <ListItem
        title={'Follow Us'}
        onPress={() =>
          requireAuth().then(() => {
            FollowUsRouter.navigate();
          })
        }
      />
      {!isWeb() && (
        <ListItem
          title={'Version'}
          value={'v' + VERSION_NAME}
          forceHidePressIcon
          onPress={() => {
            setCount((old) => (old > 2 ? 0 : old + 1));
          }}
        />
      )}
      <AuthButton />
      {count > 2 && <VersionInfo />}
    </>
  );
};

const VersionInfo: FC = () => {
  const {userId} = useSelector(
    (state: ReduxRootState) => ({
      userId: state.persist.persistAuth.user_id,
    }),
    shallowEqual,
  );
  return (
    <View style={VersionInfoStyles.container}>
      <Text>user Id: {userId}</Text>
      <Text>Build {BUILD_ID || 'Unknown'}</Text>
      <Text>Bundle {getActiveBundleVersion() || 'None'}</Text>
      <Text>Env: {DEV_MODE ? 'Dev' : 'Gp'}</Text>
    </View>
  );
};

const VersionInfoStyles = createStyleSheet({
  container: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: 40,
  },
});

export default Settings;
