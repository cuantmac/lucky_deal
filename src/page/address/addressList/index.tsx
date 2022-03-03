import {AddressItem as AddressItemType} from '@luckydeal/api-common';
import {CommonApi} from '@src/apis';
import {createStyleSheet} from '@src/helper/helper';
import {Message} from '@src/helper/message';
import {useNavigationParams} from '@src/hooks/useNavigationParams';
import {ReduxRootState, standardAction} from '@src/redux';
import {
  AddressListRouteParams,
  ADDRESS_LIST_TYPE_ENUM,
  EditAddressRoute,
  goback,
} from '@src/routes';
import {useLoading} from '@src/utils/hooks';
import {BUTTON_TYPE_ENUM} from '@src/widgets/button';
import {useNavigationHeader} from '@src/widgets/navigationHeader';
import {PageStatusControl} from '@src/widgets/pageStatusControl';
import {Space} from '@src/widgets/space';
import React, {FC, useCallback, useState, useEffect, Fragment} from 'react';
import {DeviceEventEmitter, ScrollView} from 'react-native';
import {useSelector, shallowEqual} from 'react-redux';
import {AddressEmpty} from './widgets/addressEmpty';
import {AddressItem} from './widgets/addressItem';
import {NewAddressBtn} from './widgets/newAddressBtn';

const AddressList: FC = () => {
  const {addressId} = useSelector(
    (state: ReduxRootState) => ({
      token: state.persist.persistAuth.token,
      addressId: state.persist.persistSelectedAddress,
    }),
    shallowEqual,
  );
  const {type} = useNavigationParams<AddressListRouteParams>();
  const [addressList, setAddressList] = useState<AddressItemType[]>();
  const [loading, withLoading] = useLoading();

  const EditAddressRouter = EditAddressRoute.useRouteLink();

  useNavigationHeader({
    title: 'Shipping Address',
  });

  const getAddressList = useCallback(() => {
    return CommonApi.userListAddressUsingPOST().then((res) => {
      setAddressList(res.data.list);
    });
  }, [setAddressList]);

  const handleEditAddress = useCallback(
    (val: AddressItemType) => {
      EditAddressRouter.navigate({
        id: val.address_id,
      });
    },
    [EditAddressRouter],
  );

  const handleDeleteAddress = useCallback(
    (val: AddressItemType) => {
      Message.confirm({
        content: 'Are you sure to delete this item?',
        actions: [
          {
            text: 'Cancel',
            onPress: () => {},
          },
          {
            text: 'Delete',
            onPress: () => {
              Message.loading();
              CommonApi.userDeleteAddressUsingPOST({address_id: val.address_id})
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
            type: BUTTON_TYPE_ENUM.HIGH_LIGHT,
          },
        ],
      });
    },
    [getAddressList],
  );

  const handleSelectAddress = useCallback((val: AddressItemType) => {
    standardAction.setSelectedAddress(val.address_id);
    setTimeout(() => {
      goback();
    }, 500);
  }, []);

  const hasData = !!addressList?.length;

  useEffect(() => {
    withLoading(getAddressList());
    const unsubscribe = DeviceEventEmitter.addListener(
      'UPDATE_ADDRESS_LIST',
      () => {
        Message.loading();
        getAddressList().finally(() => {
          Message.hide();
        });
      },
    );
    return () => unsubscribe.remove();
  }, [getAddressList, hasData, withLoading]);

  return (
    <PageStatusControl
      hasData={hasData}
      loading={loading}
      showEmpty
      emptyComponent={<AddressEmpty />}>
      <ScrollView>
        {addressList?.map((item, index) => {
          return (
            <Fragment key={item.address_id}>
              <AddressItem
                localSeletedAddressId={addressId}
                onDeletePress={handleDeleteAddress}
                onEditPress={handleEditAddress}
                onSelectPress={handleSelectAddress}
                data={item}
                type={type as ADDRESS_LIST_TYPE_ENUM}
              />
              {addressList.length - 1 !== index && (
                <Space height={9} backgroundColor={'transparent'} />
              )}
            </Fragment>
          );
        })}
        <NewAddressBtn wrapStyle={AddressListStyles.newAddressbtn} />
      </ScrollView>
    </PageStatusControl>
  );
};

const AddressListStyles = createStyleSheet({
  newAddressbtn: {
    marginVertical: 16,
  },
});

export default AddressList;
