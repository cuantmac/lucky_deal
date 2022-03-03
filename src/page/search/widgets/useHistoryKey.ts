import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
function useHistoryKey() {
  const [searchHistoryKeys, setSearchHistoryKeys] = useState<string[]>([]);

  const saveSearchHistoryKeys = useCallback(
    (item?: string) => {
      AsyncStorage.getItem('search_key').then((searchKeyString) => {
        if (searchKeyString) {
          const keys = JSON.parse(searchKeyString);
          if (keys.length >= 15) {
            keys.splice(14, 1);
          }
          //插入第一条。
          if (item && keys.indexOf(item) === -1) {
            keys.unshift(item);
            AsyncStorage.setItem('search_key', JSON.stringify(keys));
            setSearchHistoryKeys(keys);
          }
        }
      });
    },
    [setSearchHistoryKeys],
  );

  const clearSearchHistoryKeys = useCallback(() => {
    AsyncStorage.removeItem('search_key').then(() => {
      setSearchHistoryKeys([]);
    });
  }, [setSearchHistoryKeys]);
  useEffect(() => {
    AsyncStorage.getItem('search_key').then((searchKeyString) => {
      if (searchKeyString) {
        setSearchHistoryKeys(JSON.parse(searchKeyString));
      }
    });
  }, []);

  return {searchHistoryKeys, saveSearchHistoryKeys, clearSearchHistoryKeys};
}

export default useHistoryKey;
