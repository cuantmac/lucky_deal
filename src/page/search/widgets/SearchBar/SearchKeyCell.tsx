import {Image, TouchableOpacity, Text} from 'react-native';
import React from 'react';
import {createStyleSheet} from '@src/helper/helper';
interface SearchKeyCellProps {
  onPress: () => void;
  children: string;
  noBorder?: boolean;
}

const SearchKeyCell: React.FC<SearchKeyCellProps> = ({
  onPress,
  children,
  noBorder,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          borderBottomWidth: noBorder ? 0 : 1,
        },
      ]}>
      <Text style={styles.text} numberOfLines={1}>
        {children}
      </Text>
      <Image
        style={styles.icon}
        source={require('@src/assets/search_icon_right_arrow.png')}
      />
    </TouchableOpacity>
  );
};

const styles = createStyleSheet({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomColor: '#f1f1f1',
  },
  text: {
    flex: 1,
    color: '#000000',
    fontSize: 14,
  },
  icon: {
    marginLeft: 5,
    width: 12,
    height: 10,
  },
});

export default SearchKeyCell;
