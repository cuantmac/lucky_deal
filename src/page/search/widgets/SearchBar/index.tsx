import {
  FlatList,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Keyboard,
} from 'react-native';
import React, {memo, useCallback, useRef, useState, useEffect} from 'react';
import {CommonApi} from '@src/apis';
import {createStyleSheet} from '@src/helper/helper';
import {goback} from '@src/routes';
import SearchKeyCell from './SearchKeyCell';
import {debounce} from 'lodash';
import {CustomHeader} from '@src/widgets/navigationHeader/customHeader';
import {GlideImage} from '@src/widgets/glideImage';

interface SearchBarProps {
  onSearch: (key: string) => void;
  onClear?: () => void;
  onSearchHistoryChange?: (val?: string) => void;
  value?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onSearchHistoryChange,
  onClear,
  value,
}) => {
  const searchRef = useRef<TextInput | null>();
  /**
   * 搜索关键词.
   */
  const [searchKey, setSearchKey] = useState('');
  const [searchKeyList, setSearchKeyList] = useState<string[]>([]);

  /**
   * 清空搜索框.
   */
  const clearTextValue = useCallback(() => {
    searchRef.current?.clear();
    setSearchKey('');
    if (onClear) {
      onClear();
    }
  }, [searchRef, onClear]);

  const handleSearch = useCallback(
    (val: string) => {
      setSearchKey(val);
      onSearch(val);
      setSearchKeyList([]);
      searchRef.current?.blur(); //失去焦点
      Keyboard.dismiss();
    },
    [onSearch],
  );

  const handleFocus = useCallback(() => {
    if (searchKey?.length === 0) {
      if (onClear) {
        onClear();
      }
    }
  }, [searchKey, onClear]);

  const handleSubmitEditing = useCallback(
    (key: string) => {
      handleSearch(key);
      if (onSearchHistoryChange) {
        onSearchHistoryChange(key);
      }
    },
    [handleSearch, onSearchHistoryChange],
  );

  const getLenovoSearchKeys = useCallback((key: string) => {
    CommonApi.searchLenovoWordUsingPOST({key_word: key}).then((res) =>
      setSearchKeyList(res.data.words || []),
    );
  }, []);

  const renderItem = ({index, item}: {index: number; item: string}) => {
    return (
      <SearchKeyCell
        noBorder={index === searchKeyList.length - 1}
        onPress={() => {
          handleSearch(item);
        }}>
        {item}
      </SearchKeyCell>
    );
  };

  const debounceGetLenovoSearchKeys = useCallback(
    debounce(getLenovoSearchKeys, 500),
    [],
  );

  const handleChangeSearchKey = useCallback(
    (val: string) => {
      setSearchKey(val);
      if (val) {
        debounceGetLenovoSearchKeys(val);
        return;
      }
      setSearchKeyList([]);
    },
    [debounceGetLenovoSearchKeys],
  );

  useEffect(() => {
    setSearchKeyList([]);
    setSearchKey(value || '');
  }, [value]);
  return (
    <>
      <CustomHeader
        headerStyle={styles.headerContainer}
        headerBackVisible={false}
        headerLeft={[
          <View style={styles.inputWarp}>
            <TextInput
              ref={(ref) => {
                searchRef.current = ref;
              }}
              returnKeyType={'search'}
              enablesReturnKeyAutomatically={true}
              placeholder="Search"
              selectionColor={'#F04B33'}
              style={styles.inputInner}
              onFocus={handleFocus}
              onChangeText={handleChangeSearchKey}
              value={searchKey}
              onSubmitEditing={() => handleSubmitEditing(searchKey)}
            />

            {searchKey ? (
              <TouchableOpacity
                onPress={clearTextValue}
                style={styles.clearKeyBtn}>
                <GlideImage
                  style={styles.clearKeyIcon}
                  source={require('@src/assets/close.png')}
                />
              </TouchableOpacity>
            ) : null}
          </View>,
        ]}
        headerRight={
          <TouchableOpacity onPress={() => goback()} style={styles.cancelWrap}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        }
      />
      {searchKey && searchKeyList.length ? (
        <FlatList
          keyboardShouldPersistTaps={'handled'}
          style={styles.searchPanel}
          data={searchKeyList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : null}
    </>
  );
};

const styles = createStyleSheet({
  headerContainer: {
    borderBottomWidth: 0,
  },
  inputWarp: {
    width: 295,
    justifyContent: 'center',
  },
  inputInner: {
    backgroundColor: '#F1F2F2',
    borderRadius: 30,
    height: 32,
    paddingLeft: 15,
    paddingRight: 15,
  },
  clearKeyBtn: {
    position: 'absolute',
    right: 0,
    padding: 10,
  },
  clearKeyIcon: {
    width: 10,
    height: 10,
  },
  cancelWrap: {
    marginLeft: 10,
  },
  cancelText: {
    fontSize: 14,
    color: '#383838',
  },
  searchPanel: {
    backgroundColor: '#fff',
    width: '100%',
    position: 'absolute',
    height: '100%',
    zIndex: 999,
    top: 50,
    left: 0,
  },
});
export default memo(SearchBar);
