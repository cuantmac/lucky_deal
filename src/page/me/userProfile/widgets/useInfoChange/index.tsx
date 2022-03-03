import {createStyleSheet, isWeb} from '@src/helper/helper';
import {BUTTON_TYPE_ENUM, StandardButton} from '@src/widgets/button';
import {GlideImage} from '@src/widgets/glideImage';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {
  Keyboard,
  ScrollView,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

interface UserInfoChangeProps {
  defaultValue?: string;
  onSubmit?: (val: string) => void;
}

export const UserInfoChange: FC<UserInfoChangeProps> = ({
  defaultValue = '',
  onSubmit,
}) => {
  const [value, setValue] = useState<string>(defaultValue);

  const handleTextChange = useCallback<
    NonNullable<TextInputProps['onChangeText']>
  >((val) => {
    setValue(val);
  }, []);

  const handleSubmit = useCallback(() => {
    Keyboard.dismiss();
    onSubmit && onSubmit(value);
  }, [onSubmit, value]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <ScrollView keyboardShouldPersistTaps={'handled'}>
      <View style={UserInfoChangeStyles.inputContainer}>
        <TextInput
          onSubmitEditing={handleSubmit}
          autoFocus
          onChangeText={handleTextChange}
          value={value}
          // @ts-ignore
          style={[UserInfoChangeStyles.inputText, isWeb() && {outlineWidth: 0}]}
        />
        {!!value && (
          <TouchableOpacity
            style={UserInfoChangeStyles.clearImageWrap}
            onPress={() => setValue('')}>
            <GlideImage
              style={UserInfoChangeStyles.clearImage}
              source={require('@src/assets/close.png')}
            />
          </TouchableOpacity>
        )}
      </View>
      <StandardButton
        title={'SAVE'}
        onPress={handleSubmit}
        type={BUTTON_TYPE_ENUM.HIGH_LIGHT}
        wrapStyle={UserInfoChangeStyles.buttonContainer}
      />
    </ScrollView>
  );
};

const UserInfoChangeStyles = createStyleSheet({
  inputContainer: {
    height: 40,
    backgroundColor: 'white',
    marginTop: 12,
    position: 'relative',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  inputText: {
    fontSize: 14,
    color: '#222',
    height: '100%',
  },
  clearImageWrap: {
    padding: 10,
    position: 'absolute',
    right: 6,
  },
  clearImage: {
    width: 11,
    height: 11,
  },
  buttonContainer: {
    marginTop: 16,
    marginHorizontal: 12,
  },
});
