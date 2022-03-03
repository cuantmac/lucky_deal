import {Text, TouchableOpacity} from 'react-native';
import React from 'react';

import {createStyleSheet} from '@src/helper/helper';

interface SearchHistory {
  children: string;
  onClick?: () => void;
}

const Tag: React.FC<SearchHistory> = ({children, onClick}) => {
  return (
    <TouchableOpacity onPress={onClick} activeOpacity={0.8} style={styles.cell}>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = createStyleSheet({
  cell: {
    flexDirection: 'row',
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 8,
    marginRight: 5,
    marginVertical: 3,
  },
  text: {
    fontSize: 12,
  },
});
export default Tag;
