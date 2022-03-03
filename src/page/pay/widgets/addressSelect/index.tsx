import {AddressItem} from '@luckydeal/api-common';
import {createStyleSheet, styleAdapter} from '@src/helper/helper';
import {standardAction} from '@src/redux';
import {
  AddressListRoute,
  ADDRESS_LIST_TYPE_ENUM,
  EditAddressRoute,
} from '@src/routes';
import {StandardButton} from '@src/widgets/button';
import {GlideImage} from '@src/widgets/glideImage';
import {LoadingIndicator} from '@src/widgets/loadingIndicator';
import React, {FC, useCallback, memo, useMemo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {PayModuleContainer} from '../payModuleContainer';

interface AddressSelectProps {
  address?: AddressItem;
  loading: boolean;
  disabled?: boolean;
}

export const AddressSelect: FC<AddressSelectProps> = memo(
  ({address, loading, disabled}) => {
    return (
      <PayModuleContainer>
        {loading ? (
          <LoadingIndicator style={styleAdapter({paddingVertical: 10})} />
        ) : address ? (
          <AddressEditItem disabled={disabled} address={address} />
        ) : (
          <AddressAddItem />
        )}
      </PayModuleContainer>
    );
  },
);

const AddressAddItem: FC = () => {
  const EditAddressRouter = EditAddressRoute.useRouteLink();
  const handlePress = useCallback(() => {
    EditAddressRouter.navigate({});
  }, [EditAddressRouter]);

  return (
    <View style={AddressSelectStyles.addressAddItemContainer}>
      <StandardButton
        onPress={handlePress}
        textStyle={AddressSelectStyles.buttonText}
        title={'+Add Shipping Address'}
      />
    </View>
  );
};

type AddressEditItemProps = Pick<Required<AddressSelectProps>, 'address'> & {
  disabled?: boolean;
};

const AddressEditItem: FC<AddressEditItemProps> = ({address, disabled}) => {
  const AddressListRouter = AddressListRoute.useRouteLink();

  const handlePress = useCallback(() => {
    standardAction.setSelectedAddress(address.address_id);
    AddressListRouter.navigate({type: ADDRESS_LIST_TYPE_ENUM.SELECT});
  }, [AddressListRouter, address.address_id]);

  const detailAddress = useMemo(() => {
    return [
      address.address_line_two,
      address.city,
      address.state,
      address.country,
      address.zip,
    ]
      .filter((val) => !!val)
      .join(',');
  }, [
    address.address_line_two,
    address.city,
    address.country,
    address.state,
    address.zip,
  ]);
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled}
      style={AddressSelectStyles.addressEditItemContainer}>
      <GlideImage
        source={require('@src/assets/select_address_icon.png')}
        style={{width: 17, height: 19}}
      />
      <View style={AddressSelectStyles.addressEditItemContent}>
        <View style={AddressSelectStyles.addressTopContainer}>
          <Text
            numberOfLines={1}
            style={[
              AddressSelectStyles.addressText,
              AddressSelectStyles.topText,
            ]}>
            {address.full_name}
            {'  '}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              AddressSelectStyles.addressText,
              AddressSelectStyles.phoneText,
            ]}>
            {address.phone_number}
          </Text>
        </View>
        <Text numberOfLines={1} style={AddressSelectStyles.addressText}>
          {address.address_line_one}
        </Text>
        {!!detailAddress && (
          <Text style={AddressSelectStyles.addressText}>{detailAddress}</Text>
        )}
      </View>
      {disabled || (
        <GlideImage
          tintColor="#999"
          defaultSource={false}
          source={require('@src/assets/i_right.png')}
          style={{width: 10, height: 10}}
        />
      )}
    </TouchableOpacity>
  );
};

const AddressSelectStyles = createStyleSheet({
  addressAddItemContainer: {
    paddingVertical: 20,
  },
  buttonText: {
    fontWeight: '400',
    fontSize: 13,
  },
  addressEditItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  addressEditItemContent: {
    flex: 1,
    paddingHorizontal: 12,
  },
  addressText: {
    lineHeight: 17,
    color: '#222',
    fontSize: 12,
    marginBottom: 4,
  },
  addressTopContainer: {
    flexDirection: 'row',
  },
  topText: {
    fontWeight: '700',
    marginBottom: 10,
    fontSize: 14,
    color: '#222',
  },
  phoneText: {
    fontSize: 12,
    color: '#222',
  },
});
