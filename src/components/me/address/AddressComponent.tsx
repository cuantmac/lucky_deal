import React, {FC} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TextInputProps,
  Image,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {px} from '../../../constants/constants';

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
      activeOpacity={0.7}
      disabled={!onPress}
      style={[{paddingLeft: 30 * px, justifyContent: 'center'}, style]}
      onPress={() => onPress && onPress(title)}>
      <Text style={[{fontSize: 50 * px}, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

type AddressSearchProps = Omit<TextInputProps, 'onChangeText' | 'onChange'> & {
  onChange: (val: string) => void;
};

export const AddressSearch: FC<AddressSearchProps> = ({onChange, ...props}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginHorizontal: 30 * px,
        marginVertical: 40 * px,
        backgroundColor: '#D3D3D3',
        alignItems: 'center',
        borderRadius: 10 * px,
      }}>
      <TextInput
        style={{height: 100 * px, flex: 1, paddingHorizontal: 10 * px}}
        numberOfLines={1}
        onChangeText={onChange}
        {...props}
      />
      <Image
        style={{width: 44 * px, height: 44 * px, marginRight: 40 * px}}
        source={require('../../../assets/icon_search.png')}
      />
    </View>
  );
};
