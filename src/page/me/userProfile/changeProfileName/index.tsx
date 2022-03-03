import {CommonApi} from '@src/apis';
import {Message} from '@src/helper/message';
import {useNavigationParams} from '@src/hooks/useNavigationParams';
import {thunkAction} from '@src/redux';
import {ChangeProfileNameRouteParams, goback} from '@src/routes';
import {useNavigationHeader} from '@src/widgets/navigationHeader';
import React, {FC, useCallback} from 'react';
import {UserInfoChange} from '../widgets/useInfoChange';

const NICKNAME_REGX = /^.{2,24}$/;

const ChangeProfileName: FC = () => {
  const params = useNavigationParams<ChangeProfileNameRouteParams>();
  useNavigationHeader({
    title: 'Nickname',
  });

  const handleSubmit = useCallback((val: string) => {
    if (!NICKNAME_REGX.test(val)) {
      Message.toast('Please enter 2-24 characters.');
      return;
    }
    Message.loading();
    CommonApi.updateUserInfoUsingPOST({
      user_name: val,
    })
      .then(() => {
        return thunkAction.userProfileAsync();
      })
      .then(() => {
        Message.hide();
        goback();
      })
      .catch((e) => {
        Message.toast(e);
      });
  }, []);

  return <UserInfoChange onSubmit={handleSubmit} defaultValue={params.value} />;
};

export default ChangeProfileName;
