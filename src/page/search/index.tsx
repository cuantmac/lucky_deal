import {View} from 'react-native';
import React, {useState, useCallback} from 'react';
import {createStyleSheet} from '@src/helper/helper';
import useHistoryKey from './widgets/useHistoryKey';
import SearchBar from './widgets/SearchBar';
import SearchHistory from './widgets/SearchHistory';
import DiscoverMore from './widgets/DiscoverMore';
import SearchRanking from './widgets/SearchRanking';
import {ProductListRoute} from '@src/routes';

const SearchPage: React.FC = () => {
  const {
    searchHistoryKeys,
    saveSearchHistoryKeys,
    clearSearchHistoryKeys,
  } = useHistoryKey();
  const ProductListRouter = ProductListRoute.useRouteLink();

  const [keyValue, setKeyValue] = useState('');

  const handleChangeKeyword = useCallback(
    (val: string) => {
      setKeyValue(val);
      ProductListRouter.navigate({
        threeCategoryId: 0,
        keyword: val,
        behavior: 'back',
      });
    },
    [ProductListRouter],
  );

  return (
    <View style={styles.container}>
      <SearchBar
        onSearchHistoryChange={saveSearchHistoryKeys}
        onSearch={handleChangeKeyword}
        onClear={() => {}}
        value={keyValue}
      />
      <SearchHistory
        onChange={handleChangeKeyword}
        data={searchHistoryKeys}
        onClear={() => clearSearchHistoryKeys()}
      />
      <DiscoverMore onChange={handleChangeKeyword} />
      <SearchRanking />
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    height: '100%',
    backgroundColor: '#fff',
  },
});
export default SearchPage;
