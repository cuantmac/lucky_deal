import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState, useCallback} from 'react';
import AddressItem from './AddressItem';
import Api from '../../../Api';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/core';
import Empty from '../../common/Empty';
import AppModule from '../../../../AppModule';
import {PRIMARY} from '../../../constants/colors';
import {standardAction} from '@src/redux';
import {Message} from '@src/helper/message';
import {CommonApi} from '@src/apis';

export default function ({navigation, route}) {
  const dispatch = useDispatch();

  const mainAddress = useSelector(
    (state) => state.deprecatedPersist.mainAddress,
  );
  const [addressList, setAddressList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const isFocus = useIsFocused();

  const mode = route.params ? route.params.mode : 'manage';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: mode === 'select' ? 'Select Address' : 'Manage Address',
      headerRight: () => (
        <TouchableOpacity
          style={{
            width: 48,
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            navigation.push('AddAddress');
            AppModule.reportClick('5', '447');
          }}>
          <Image
            resizeMode={'contain'}
            style={{
              width: 16,
              height: 16,
              resizeMode: 'center',
              tintColor: 'black',
            }}
            source={require('../../../assets/add.png')}
          />
        </TouchableOpacity>
      ),
    });
  }, [mode, navigation]);

  useEffect(() => {
    if (isFocus) {
      AppModule.reportShow('5', '444');
      setRefreshing(true);
      Api.addressList().then((res) => {
        let list = res.data?.list || [];
        setAddressList(list);
        setRefreshing(false);
      });
    }
  }, [dispatch, isFocus, mainAddress.address_id]);

  const getAddressList = useCallback(() => {
    return CommonApi.userListAddressUsingPOST().then((res) => {
      setAddressList(res.data.list);
    });
  }, [setAddressList]);

  // 切换地址main状态
  const handleOnMainClick = useCallback(
    (item) => {
      if (item.preferred) {
        return;
      }
      Message.loading();
      CommonApi.userEditAddressUsingPOST({
        ...item,
        preferred: item.preferred === 1 ? 0 : 1,
        only_preferred: 1,
      })
        .then((res) => {
          if (res.data.success) {
            return getAddressList();
          }
        })
        .then(() => {
          Message.hide();
        })
        .catch((e) => {
          Message.toast(e);
        });
    },
    [getAddressList],
  );

  // 删除当前地址
  const handleDelete = useCallback(
    (id) => {
      Message.loading();
      CommonApi.userDeleteAddressUsingPOST({address_id: id})
        .then(() => {
          return getAddressList();
        })
        .then(() => {
          Message.hide();
        })
        .catch((e) => {
          Message.toast(e);
        });
    },
    [getAddressList],
  );

  if (addressList.length === 0) {
    return refreshing ? (
      <ActivityIndicator color={PRIMARY} style={{flex: 1}} />
    ) : (
      <Empty
        image={require('../../../assets/empty.png')}
        title={'Nothing at all'}
      />
    );
  }

  const renderItem = ({item}) => {
    return (
      <AddressItem
        data={item}
        onMainPress={() => handleOnMainClick(item)}
        onDel={() => {
          handleDelete(item.address_id);
        }}
      />
    );
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={addressList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </>
  );
}
