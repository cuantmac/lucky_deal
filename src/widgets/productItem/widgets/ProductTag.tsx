import {ActivityTagListItem} from '@luckydeal/api-common';
import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import {StyleProp, Text, TextStyle, View, ViewStyle} from 'react-native';
import {px} from '../../../constants/constants';

interface ProductTagProps {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  tags?: ActivityTagListItem[];
}

export const ProductTag: FC<ProductTagProps> = ({
  tags = [],
  containerStyle,
  textStyle,
}) => {
  if (!tags?.length) {
    return null;
  }
  return (
    <View style={[ProductTagStyles.container, containerStyle]}>
      {tags.map(({name}) => {
        return (
          <Text style={[ProductTagStyles.text, textStyle]} key={name}>
            {name}
          </Text>
        );
      })}
    </View>
  );
};

const ProductTagStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: -5 * px,
    marginTop: 10 * px,
  },
  text: {
    backgroundColor: 'black',
    color: 'white',
    height: 40 * px,
    fontSize: 25 * px,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10 * px,
    paddingHorizontal: 10 * px,
    marginRight: 5 * px,
    marginTop: 5 * px,
  },
});
