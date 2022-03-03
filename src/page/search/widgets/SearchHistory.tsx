import {View} from 'react-native';
import React from 'react';
import {createStyleSheet} from '@src/helper/helper';
import PanelTitle from './PanelTitle';
import Tag from './Tag';

interface SearchHistory {
  data?: string[];
  onChange?: (val: string) => void;
  onClear?: () => void;
}

const SearchHistory: React.FC<SearchHistory> = ({data, onChange, onClear}) => {
  if (!data?.length) {
    return null;
  }
  return (
    <View style={styles.container}>
      <PanelTitle onClick={onClear} iconType="del">
        Search history
      </PanelTitle>

      <View style={styles.cells}>
        {data?.map((item) => (
          <Tag onClick={() => onChange && onChange(item)} key={item}>
            {item}
          </Tag>
        ))}
      </View>
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  cells: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
});
export default SearchHistory;
