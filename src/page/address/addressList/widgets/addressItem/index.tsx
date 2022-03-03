import {AddressItem as AddressItemType} from '@luckydeal/api-common';
import {createStyleSheet} from '@src/helper/helper';
import {ADDRESS_LIST_TYPE_ENUM} from '@src/routes';
import {CheckBoxIcon} from '@src/widgets/checkboxIcon';
import {GlideImage} from '@src/widgets/glideImage';
import {Space} from '@src/widgets/space';
import React, {FC, useMemo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

interface AddressItemProps {
  type: ADDRESS_LIST_TYPE_ENUM;
  data: AddressItemType;
  onEditPress: (val: AddressItemType) => void;
  onDeletePress: (val: AddressItemType) => void;
  onSelectPress: (val: AddressItemType) => void;
  localSeletedAddressId?: number;
}

export const AddressItem: FC<AddressItemProps> = ({
  data,
  type,
  onEditPress,
  onSelectPress,
  onDeletePress,
  localSeletedAddressId,
}) => {
  const detailAddress = useMemo(() => {
    return [
      data.address_line_two,
      data.city,
      data.state,
      data.country,
      data.zip,
    ]
      .filter((val) => !!val)
      .join(',');
  }, [data]);

  const isMagane = type === ADDRESS_LIST_TYPE_ENUM.MANAGE;
  const checked = localSeletedAddressId === data.address_id;
  return (
    <View style={AddressItemStyles.container}>
      <TouchableOpacity
        onPress={() => {
          if (isMagane) {
            onEditPress(data);
            return;
          }
          onSelectPress(data);
        }}
        activeOpacity={0.8}
        style={AddressItemStyles.topContainer}>
        <View style={AddressItemStyles.content}>
          <Text numberOfLines={1} style={AddressItemStyles.weightText}>
            {data.full_name}
            {'  '}
            <Text style={AddressItemStyles.phoneText}>{data.phone_number}</Text>
          </Text>
          <Text style={AddressItemStyles.addressText} numberOfLines={1}>
            {data.address_line_one}
          </Text>
          {!!detailAddress && (
            <Text style={AddressItemStyles.addressText}>{detailAddress}</Text>
          )}
        </View>
        <View style={AddressItemStyles.checkBoxContainer}>
          {isMagane ? (
            <GlideImage
              defaultSource={false}
              tintColor="#999"
              style={AddressItemStyles.pressIcon}
              source={require('@src/assets/thiny_black_icon.png')}
            />
          ) : (
            <CheckBoxIcon checked={checked} />
          )}
        </View>
      </TouchableOpacity>
      <Space height={1} backgroundColor={'#E5E5E5'} />
      <View style={AddressItemStyles.bottomContainer}>
        {data.preferred === 1 && (
          <Text style={AddressItemStyles.defaultText}>Default</Text>
        )}

        <TouchableOpacity
          onPress={() => {
            onEditPress(data);
          }}
          activeOpacity={0.8}
          style={[AddressItemStyles.actionContainer, {marginLeft: 'auto'}]}>
          <Text style={AddressItemStyles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onDeletePress(data);
          }}
          activeOpacity={0.8}
          style={AddressItemStyles.actionContainer}>
          <Text style={AddressItemStyles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AddressItemStyles = createStyleSheet({
  container: {
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  topContainer: {
    flexDirection: 'row',
    paddingVertical: 11,
    marginBottom: -2,
  },
  content: {
    flex: 1,
  },
  checkBoxContainer: {
    justifyContent: 'center',
    paddingLeft: 10,
  },
  weightText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 19,
    color: '#222',
    marginBottom: 14,
  },
  phoneText: {
    fontSize: 13,
    color: '#666',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 17,
    marginBottom: 4,
  },
  bottomContainer: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: -15,
  },
  defaultText: {
    height: 16,
    lineHeight: 16,
    fontSize: 10,
    fontWeight: '300',
    paddingHorizontal: 4,
    borderColor: '#D0011A',
    color: '#D0011A',
    borderWidth: 1,
  },
  actionContainer: {
    paddingHorizontal: 15,
    height: '100%',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    color: '#666',
  },
  pressIcon: {
    width: 10,
    height: 10,
  },
});
