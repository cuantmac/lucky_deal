import {createStyleSheet} from '@src/helper/helper';
import React, {FC} from 'react';
import {Text, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import {GlideImage} from '../glideImage';

interface SearchBarStaticProps {
  placeholder?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const SearchBarStatic: FC<SearchBarStaticProps> = ({
  placeholder = 'Search',
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={
        style ? [SearchBarStyles.container, style] : SearchBarStyles.container
      }>
      <GlideImage
        defaultSource={false}
        tintColor={'#757575'}
        style={SearchBarStyles.searchIcon}
        source={require('@src/assets/search_icon.png')}
      />
      <Text numberOfLines={1} style={SearchBarStyles.text}>
        {placeholder}
      </Text>
    </TouchableOpacity>
  );
};

const SearchBarStyles = createStyleSheet({
  container: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: '#f6f6f6',
    borderRadius: 32,
  },
  searchIcon: {
    width: 16,
    height: 16,
  },
  text: {
    marginLeft: 9,
    color: '#757575',
    fontSize: 13,
  },
});
