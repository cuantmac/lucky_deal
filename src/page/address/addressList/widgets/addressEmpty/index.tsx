import {createStyleSheet} from '@src/helper/helper';
import {GlideImage} from '@src/widgets/glideImage';
import React, {FC} from 'react';
import {View, Text} from 'react-native';
import {NewAddressBtn} from '../newAddressBtn';

export const AddressEmpty: FC = () => {
  return (
    <View style={AddressEmptyStyles.container}>
      <View style={AddressEmptyStyles.content}>
        <GlideImage
          style={AddressEmptyStyles.img}
          source={require('@src/assets/address_empty_icon.png')}
        />
        <Text style={AddressEmptyStyles.text}>
          You haven’t saved any address.
        </Text>
      </View>
      <NewAddressBtn />
    </View>
  );
};

const AddressEmptyStyles = createStyleSheet({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    alignItems: 'center',
    paddingTop: 40,
  },
  img: {
    width: 104,
    height: 72,
  },
  text: {
    fontSize: 14,
    color: '#222',
    marginTop: 16,
    lineHeight: 17,
    marginBottom: 43,
  },
});
