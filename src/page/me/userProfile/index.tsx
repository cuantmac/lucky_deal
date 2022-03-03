import {createStyleSheet, isWeb} from '@src/helper/helper';
import {Message} from '@src/helper/message';
import {GlideImage} from '@src/widgets/glideImage';
import {ListItem} from '@src/widgets/listItem';
import {useActionSheet} from '@src/widgets/modal/modal';
import * as ImagePicker from 'react-native-image-picker';
import {useNavigationHeader} from '@src/widgets/navigationHeader';
import {Space} from '@src/widgets/space';
import React, {FC, useCallback, useMemo} from 'react';
import {PermissionsAndroid} from 'react-native';
import {ActionModalItem} from './widgets';
import {CommonApi, ImageFile, uploadFile} from '@src/apis';
import {ReduxRootState, thunkAction} from '@src/redux';
import {useSelector, shallowEqual} from 'react-redux';
import {UpdateUserInfoRequestV2} from '@luckydeal/api-common';
import {ChangeProfileEmailRoute, ChangeProfileNameRoute} from '@src/routes';

const UserProfile: FC = () => {
  const {userProfile} = useSelector(
    (state: ReduxRootState) => ({
      token: state.persist.persistAuth.token,
      userProfile: state.persist.persistUserProfile,
    }),
    shallowEqual,
  );

  const [AvatarActionSheet, setAvatarActionSheetVisible] = useActionSheet();
  const [GenderActionSheet, setGenderActionSheetVisible] = useActionSheet();
  const ChangeProfileNameRouter = ChangeProfileNameRoute.useRouteLink();
  const ChangeProfileEmailRouter = ChangeProfileEmailRoute.useRouteLink();

  const genderOption = useMemo(() => {
    return [
      {name: 'Male', value: 1},
      {name: 'Female', value: 2},
      {name: 'Secret', value: 0},
    ];
  }, []);

  const gender = useMemo(() => {
    const genderNumer = userProfile.profle?.gender || 0;
    return (
      genderOption.find(({value}) => value === genderNumer)?.name || 'Secret'
    );
  }, [genderOption, userProfile.profle]);

  useNavigationHeader({
    title: 'Profile',
  });

  const handleAvatarPress = useCallback(() => {
    setAvatarActionSheetVisible(true);
  }, [setAvatarActionSheetVisible]);

  const handleAvatarCacel = useCallback(() => {
    setAvatarActionSheetVisible(false);
  }, [setAvatarActionSheetVisible]);

  // 更新用户个人信息
  const updateUserProfile = useCallback((params: UpdateUserInfoRequestV2) => {
    rlog('参数', params);
    CommonApi.updateUserInfoUsingPOST(params)
      .then(() => {
        return thunkAction.userProfileAsync();
      })
      .then(() => {
        Message.hide();
      })
      .catch((e) => {
        Message.toast(e);
      });
  }, []);

  // 保存头像
  const saveAvatar = useCallback(
    (files?: ImageFile[]) => {
      if (!files?.length) {
        return;
      }
      Message.loading();
      uploadFile(files)
        .then((res) => {
          const avatar = (res.data?.url_list || [])[0];
          if (avatar) {
            updateUserProfile({avatar: avatar});
          } else {
            Message.hide();
          }
        })
        .catch((e) => {
          Message.toast(e);
        });
    },
    [updateUserProfile],
  );

  // 拍照
  const takePhoto = useCallback(async () => {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
    for (let key in granted) {
      if ((granted as any)[key] !== PermissionsAndroid.RESULTS.GRANTED) {
        return;
      }
    }
    setAvatarActionSheetVisible(false);
    ImagePicker.launchCamera(
      {
        maxWidth: 500,
        maxHeight: 500,
        mediaType: 'photo',
        includeBase64: false,
        saveToPhotos: true,
      },
      (response) => {
        if (!response.errorCode) {
          saveAvatar(
            response.assets
              ?.map(({uri, fileName, type}) => ({uri, name: fileName, type}))
              .filter(({uri}) => !!uri) as ImageFile[],
          );
        }
      },
    );
  }, [saveAvatar, setAvatarActionSheetVisible]);

  // 选择图片
  const selectImage = useCallback(async () => {
    setAvatarActionSheetVisible(false);
    ImagePicker.launchImageLibrary(
      {
        maxWidth: 500,
        maxHeight: 500,
        mediaType: 'photo',
        includeBase64: false,
        selectionLimit: 1,
      },
      (response) => {
        if (!response.errorCode) {
          saveAvatar(
            response.assets
              ?.map(({uri, fileName, type}) => ({uri, name: fileName, type}))
              .filter(({uri}) => !!uri) as ImageFile[],
          );
        }
      },
    );
  }, [saveAvatar, setAvatarActionSheetVisible]);

  const handleNamePress = useCallback(() => {
    ChangeProfileNameRouter.navigate({
      value: userProfile.profle?.nick_name || '',
    });
  }, [ChangeProfileNameRouter, userProfile.profle]);

  const handleEmailPress = useCallback(() => {
    ChangeProfileEmailRouter.navigate({
      value: userProfile.profle?.email || '',
    });
  }, [ChangeProfileEmailRouter, userProfile.profle]);

  const handleGenderPress = useCallback(() => {
    setGenderActionSheetVisible(true);
  }, [setGenderActionSheetVisible]);

  const handleGenderOptionPress = useCallback(
    (val: number) => {
      Message.loading();
      setGenderActionSheetVisible(false);
      updateUserProfile({gender: val});
    },
    [setGenderActionSheetVisible, updateUserProfile],
  );

  return (
    <>
      <ListItem
        onPress={isWeb() ? undefined : handleAvatarPress}
        title={'Avatar'}
        pressIconStyle={UserProfileStyles.avatarPressIcon}
        rightInsert={
          <GlideImage
            resizeMode="cover"
            style={UserProfileStyles.avatarIcon}
            source={{uri: userProfile.profle?.avatar}}
          />
        }
      />
      <ListItem title={'Member ID'} value={userProfile.profle?.lucky_id} />
      <Space backgroundColor={'transparent'} height={9} />
      <ListItem
        title={'Nickname'}
        value={userProfile.profle?.nick_name}
        onPress={handleNamePress}
      />
      <ListItem
        title={'Email Address'}
        value={userProfile.profle?.email || 'Add Email'}
        onPress={handleEmailPress}
      />
      <ListItem title={'Gender'} value={gender} onPress={handleGenderPress} />
      <AvatarActionSheet maskClosable useDefaultTemplate={false}>
        <ActionModalItem value={'Take photo'} onPress={takePhoto} />
        <ActionModalItem value={'Select from album'} onPress={selectImage} />
        <ActionModalItem
          hideBottomLine
          value={'Cancel'}
          onPress={handleAvatarCacel}
        />
      </AvatarActionSheet>

      <GenderActionSheet maskClosable useDefaultTemplate={false}>
        {genderOption.map(({name, value}) => {
          return (
            <ActionModalItem
              value={name}
              onPress={() => handleGenderOptionPress(value)}
              key={value}
            />
          );
        })}
      </GenderActionSheet>
    </>
  );
};

const UserProfileStyles = createStyleSheet({
  avatarIcon: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  avatarPressIcon: {
    marginLeft: 5,
  },
});

export default UserProfile;
