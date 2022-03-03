import React, {FC} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TextInputProps,
  Image,
  TextInput,
} from 'react-native';
import {createStyleSheet} from '@src/helper/helper';

interface SectionListItemProps {
  onPress?: (str: string) => void;
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const SectionListItem: FC<SectionListItemProps> = ({
  textStyle,
  style,
  title,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={!onPress}
      style={[SectionListItemStyles.container, style]}
      onPress={() => onPress && onPress(title)}>
      <Text style={[SectionListItemStyles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const SectionListItemStyles = createStyleSheet({
  container: {
    paddingLeft: 12,
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: '#222',
  },
});

type AddressSearchProps = Omit<TextInputProps, 'onChangeText' | 'onChange'> & {
  onChange: (val: string) => void;
};

export const AddressSearch: FC<AddressSearchProps> = ({onChange, ...props}) => {
  return (
    <View style={AddressSearchStyles.container}>
      <TextInput
        style={AddressSearchStyles.textInput}
        numberOfLines={1}
        onChangeText={onChange}
        {...props}
      />
      <Image
        style={AddressSearchStyles.icon}
        source={require('@src/assets/icon_search.png')}
      />
    </View>
  );
};

const AddressSearchStyles = createStyleSheet({
  container: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: 14,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    borderRadius: 4,
  },
  textInput: {
    height: 35,
    paddingHorizontal: 10,
    flex: 1,
  },
  icon: {
    width: 15,
    height: 15,
    marginRight: 14,
  },
});
