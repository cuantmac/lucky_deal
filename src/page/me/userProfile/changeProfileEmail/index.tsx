import {CommonApi} from '@src/apis';
import {Message} from '@src/helper/message';
import {useNavigationParams} from '@src/hooks/useNavigationParams';
import {thunkAction} from '@src/redux';
import {ChangeProfileEmailRouteParams, goback} from '@src/routes';
import {useNavigationHeader} from '@src/widgets/navigationHeader';
import React, {FC, useCallback} from 'react';
import {UserInfoChange} from '../widgets/useInfoChange';

const EMAIL_REGX = /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i;

const ChangeProfileEmail: FC = () => {
  const params = useNavigationParams<ChangeProfileEmailRouteParams>();
  useNavigationHeader({
    title: 'Email Address',
  });

  const handleSubmit = useCallback((val: string) => {
    if (!EMAIL_REGX.test(val)) {
      Message.toast('The Email is not a valid Email address.');
      return;
    }
    Message.loading();
    CommonApi.updateUserInfoUsingPOST({
      email: val,
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

export default ChangeProfileEmail;
