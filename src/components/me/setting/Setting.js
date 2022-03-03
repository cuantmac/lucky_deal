import React, {useLayoutEffect, useState, useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  DeviceEventEmitter,
  Keyboard,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';
import AppModule from '../../../../AppModule';
import {px} from '../../../constants/constants';
import {GroupContainer, SettingItem, Dropdown} from '../common/MeComponent';
import {useFetching} from '../../../utils/hooks';
import Utils from '../../../utils/Utils';
import Api from '../../../Api';
import {
  meProfileShow,
  meEmailEdit,
  meProfileSave,
} from '../../../analysis/report';
import {navigationRef} from '../../../utils/refs';
import BottomSheet from '../../dialog/BottomSheet';
import GenderSelectedCompoment from './GenderSelectedCompoment';

export default function Setting({navigation, route}) {
  const profile = useSelector((state) => {
    return state.deprecatedPersist.profile;
  });
  let initGender;
  switch (profile.gender) {
    case 1:
      initGender = 'Man';
      break;
    case 2:
      initGender = 'Woman';
      break;
    default:
      initGender = 'Secret';
  }
  const [useName, setUseName] = useState({
    label: 'Usename',
    value: profile.nick_name,
    editing: false,
  });
  const [email, setEmail] = useState({
    label: 'E-mail',
    value: profile.email || '+$1 Coupon',
    editing: false,
  });
  const [gender, setGender] = useState({
    label: 'Gender',
    value: profile.gender,
    valueKey: initGender,
    editing: false,
  });

  const [loading, updeteData] = useFetching(Api.updateUserInfo);
  const sendData = () => {
    meProfileSave.setDataAndReport();
    if (loading) {
      return;
    }
    if (!email.value) {
      Utils.toastFun('Please enter email');
      return;
    }
    if (email.value.indexOf('@') === -1 || email.value.indexOf('.') === -1) {
      Utils.toastFun('Please enter the right email');
      return;
    }
    updeteData(useName.value, email.value, gender.value).then((res) => {
      if (res.code === 0) {
        let data = res.data;
        let coupon_list = data?.coupon_list || [];
        if (coupon_list.length > 0) {
          DeviceEventEmitter.emit('showCouponDia', coupon_list);
        }
        navigationRef.current.goBack();

        // route?.params?.onGoBack(coupon_list);
      } else {
        Utils.toastFun(res.error);
      }
    });
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: 'Settings',
      headerLeft: () => (
        <TouchableOpacity
          style={{
            width: 48,
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            reset();
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
      headerRight: (props) => (
        <TouchableOpacity onPress={sendData}>
          {loading ? (
            <ActivityIndicator color={'red'} style={{marginRight: 20}} />
          ) : (
            <Text
              style={{
                fontSize: 40 * px,
                color: 'rgba(242, 84, 49, 1)',
                paddingHorizontal: 40 * px,
                paddingVertical: 10 * px,
              }}>
              Save
            </Text>
          )}
        </TouchableOpacity>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendData]);
  const genderList = [
    {label: 'Man', value: 1},
    {label: 'Woman', value: 2},
    {label: 'Secret', value: 0},
  ];
  const reset = () => {
    Keyboard.dismiss();
    setUseName((old) => {
      return {...old, editing: false};
    });
    setEmail((old) => {
      return {...old, editing: false};
    });
    setGender((old) => {
      return {...old, editing: false};
    });
  };
  useEffect(() => {
    meProfileShow.setDataAndReport();
    return () => {
      reset();
    };
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle={'dark-content'} />
      <GroupContainer>
        <SettingItem
          icon={profile.avatar}
          title={'Avatar'}
          editing={false}
          // onPress={() => {}}
        />
        <SettingItem
          title={useName.label}
          content={useName.value}
          editing={useName.editing}
          type={'username'}
          onPress={() => {
            setUseName((old) => {
              return {...old, editing: true};
            });
          }}
          change={(text) => {
            // console.log('text', text);
            setUseName((old) => ({...old, value: text}));
            // console.log('use', useName);
          }}
          onBlur={() => {
            setUseName((old) => {
              return {...old, editing: false};
            });
          }}
        />
        <SettingItem
          title={email.label}
          content={email.value}
          editing={email.editing}
          color={!profile.email ? 'rgba(248, 121, 42, 1)' : ''}
          type={'emailAddress'}
          onPress={() => {
            meEmailEdit.setDataAndReport();
            setEmail((old) => {
              return {...old, editing: true};
            });
          }}
          change={(text) => {
            setEmail((old) => ({...old, value: text}));
          }}
          onBlur={() => {
            setEmail((old) => {
              return {...old, editing: false};
            });
          }}
        />
        {/* {gender.editing ? ( */}
        <SettingItem
          title={gender.label}
          editing={false}
          content={gender.valueKey}
          onPress={() => {
            BottomSheet.showLayout(
              <GenderSelectedCompoment
                genderList={genderList}
                value={gender.value}
                onChange={(data) => {
                  let _data = genderList.find((item) => item.value === data);
                  console.log('-data', _data);
                  console.log('gendervalue', data);
                  setGender({
                    label: 'Gender',
                    valueKey: _data?.label,
                    value: data,
                    editing: false,
                  });
                }}
              />,
              360 * px,
              true,
            );
          }}
        />
        {/*<Dropdown*/}
        {/*  label={gender.label}*/}
        {/*  list={genderList}*/}
        {/*  value={gender.value}*/}
        {/*  change={(data) => {*/}
        {/*    let _data = genderList.find((item) => item.value === data);*/}
        {/*    console.log('-data', _data);*/}
        {/*    console.log('gendervalue', data);*/}
        {/*    setGender({*/}
        {/*      label: 'Gender',*/}
        {/*      valueKey: _data?.label,*/}
        {/*      value: data,*/}
        {/*      editing: false,*/}
        {/*    });*/}
        {/*  }}*/}
        {/*/>*/}
        {/* ) : (
          <SettingItem
            title={gender.label}
            content={gender.valueKey}
            editing={gender.editing}
            type={'pick'}
            onPress={() => {
              setGender((old) => {
                return {...old, editing: true};
              });
            }}
          />
        )} */}
      </GroupContainer>
    </SafeAreaView>
  );
}
