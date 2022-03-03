import {px} from '@src/constants/constants';
import {createStyleSheet, isWeb} from '@src/helper/helper';
import {GlideImage} from '@src/widgets/glideImage';
import React, {FC, memo} from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

interface OptionsTitleProps {
  title?: string;
}

export const OptionsTitle: FC<OptionsTitleProps> = ({title = 'title'}) => {
  return <Text style={OptionsTitleStyles.title}>*{title}</Text>;
};

const OptionsTitleStyles = createStyleSheet({
  title: {
    fontSize: 12,
    color: '#999',
    paddingTop: 18,
    paddingBottom: 8,
  },
});

type TextInputItemProps = TextInputProps & {
  title: string;
  label?: string;
};
export const TextInputItem: FC<TextInputItemProps> = memo(
  ({title, label, ...props}) => {
    return (
      <>
        <OptionsTitle title={title} />
        <View style={AddressStyles.textInputContainer}>
          {label && <Text style={AddressStyles.label}>{label}</Text>}
          <TextInput
            placeholderTextColor={'#C7C7D7'}
            //@ts-ignore
            style={[AddressStyles.textInput, isWeb() && {outlineWidth: 0}]}
            {...props}
          />
        </View>
      </>
    );
  },
);

type SelectInputItemProps = TextInputProps & {
  title: string;
  onPress: () => void;
};

export const SelectInputItem: FC<SelectInputItemProps> = memo(
  ({title, onPress, value, editable, ...props}) => {
    return (
      <View>
        <OptionsTitle title={title} />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          disabled={editable}
          style={AddressStyles.selectInputItemContainer}>
          <TextInput
            value={value}
            placeholderTextColor={'#C7C7D7'}
            editable={editable}
            style={[
              AddressStyles.textInput,
              {flex: 1},
              //@ts-ignore
              isWeb() && {outlineWidth: 0},
            ]}
            {...props}
          />
          <TouchableOpacity
            style={{paddingLeft: 50 * px}}
            activeOpacity={0.8}
            disabled={!editable}
            onPress={onPress}>
            <GlideImage
              tintColor="#999"
              style={AddressStyles.pressIcon}
              source={require('@src/assets/thiny_black_icon.png')}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  },
);

export const AddressModule: FC = ({children}) => {
  return <View style={AddressModuleStyles.container}>{children}</View>;
};

const AddressModuleStyles = createStyleSheet({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: 'white',
  },
});

const AddressStyles = createStyleSheet({
  textInputContainer: {
    height: 40,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    paddingRight: 9,
    borderRightWidth: 1,
    borderRightColor: '#e5e5e5',
    marginRight: 9,
    fontSize: 14,
    color: '#222',
    marginVertical: 10,
  },
  textInput: {
    height: '100%',
    fontSize: 14,
    color: '#222',
    flex: 1,
  },
  selectInputItemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    height: 40,
    paddingHorizontal: 14,
  },
  pressIcon: {
    width: 10,
    height: 10,
  },
  text: {
    fontSize: 14,
    color: '#222',
  },
});
