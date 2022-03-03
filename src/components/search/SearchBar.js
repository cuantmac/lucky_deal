import {
  Dimensions,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Keyboard,
} from 'react-native';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {useIsFocused} from '@react-navigation/core';
import {px, StatusBarHeight} from '../../constants/constants';
import {navigationRef} from '../../utils/refs';
import AppModule from '../../../AppModule';
import AsyncStorage from '@react-native-community/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import * as _ from 'lodash';
import Api from '../../Api';
const {width, height} = Dimensions.get('window');

const SearchBar = ({
  searchCallBack,
  onFocusCallBack,
  blur,
  searchWord,
  placeHolder,
}) => {
  const [searchKey, setSearchKey] = useState(searchWord);
  const [searchList, setSearchList] = useState();
  const [click, setClick] = useState(false);
  const dispatch = useDispatch();
  const allHistory = useSelector(
    (state) => state.deprecatedPersist.searchHistory,
  );
  const focus = useIsFocused();
  const searchRef = useRef();
  const [textChanged, setTextChanged] = useState(false);
  const goSearch = (type) => {
    if (searchKey?.length > 0 || placeHolder?.length > 0) {
      if (type !== 2) {
        if (searchKey?.length > 0) {
          saveHistoryItem(searchKey);
        }
        AppModule.reportClick('16', '148', {
          SearchType: type,
          Keyword: searchKey,
          KeywordType: textChanged ? '1' : '0',
        });
      } else {
        AppModule.reportClick('16', '150', {
          KeywordType: '2',
          Keyword: searchKey,
        });
      }
      searchRef.current?.blur(); //失去焦点
      Keyboard.dismiss();
      searchCallBack(searchKey || placeHolder);
      setClick(false);
    }
  };

  const fetchSearchWords = (value) => {
    Api.searchLenovoWord(value).then((res) => {
      if (res.code !== 0) {
        return;
      }
      const words = res.data.words || [];
      const needShowList = [];
      words.forEach((item) => {
        if (item.toLowerCase().startsWith(value.toLowerCase())) {
          needShowList.push(item);
        }
      });
      setSearchList(needShowList);
    });
  };
  const handleSearchData = useCallback(
    _.debounce((value) => {
      fetchSearchWords(value);
    }, 500),
    [],
  );

  useEffect(() => {
    if (searchKey && click) {
      goSearch(2);
    }
    const needShowList = [];
    setSearchList([]);
    searchList?.forEach((item) => {
      if (item.toLowerCase().startsWith(searchKey.toLowerCase())) {
        needShowList.push(item);
      }
    });
    setSearchList(needShowList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey, click]);

  const saveHistoryItem = useCallback(
    (item) => {
      //如果大于15条，就删除最后一条，
      if (allHistory && allHistory.length >= 15) {
        allHistory.splice(14, 1);
      }
      //插入第一条。
      if (allHistory.indexOf(item) === -1) {
        allHistory.unshift(item);
        AsyncStorage.setItem('search_key', JSON.stringify(allHistory));
        dispatch({type: 'setSearchHistory', payload: allHistory});
      }
    },
    [allHistory, dispatch],
  );

  const clearTextValue = () => {
    searchRef.current.clear();
    setSearchKey('');
  };

  useEffect(() => {
    if (blur) {
      searchRef.current.blur(); //失去焦点
    }
  }, [blur]);
  const focusObtain = () => {
    if (searchKey?.length > 0) {
      onFocusCallBack();
    }
  };

  const renderItem = ({index, item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSearchKey(item);
          setClick(true);
        }}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 120 * px,
          marginHorizontal: 31 * px,
          borderBottomWidth: 2 * px,
          borderBottomColor: '#ECEDEE',
        }}>
        <Text
          style={{
            color: '#000000',
            fontSize: 40 * px,
            textAlignVertical: 'center',
            marginLeft: 31 * px,
            maxWidth: width - 200 * px,
          }}
          numberOfLines={1}>
          {item}
        </Text>
        <Image
          style={{
            width: 32 * px,
            height: 30 * px,
            marginRight: 31 * px,
            alignSelf: 'center',
          }}
          source={require('../../assets/search_icon_right_arrow.png')}
        />
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <View
        style={{
          width: width,
          marginTop: StatusBarHeight + 20 * px,
          height: 160 * px,
          position: 'absolute',
          borderBottomColor: '#d6d6d6',
          borderBottomWidth: 2 * px,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: width,
            height: 90 * px,
            position: 'absolute',
            alignItems: 'center',

            left: 31 * px,
            top: 10,
          }}>
          <TextInput
            ref={(ref) => {
              searchRef.current = ref;
            }}
            returnKeyType={'search'}
            enablesReturnKeyAutomatically={true}
            placeholder={placeHolder}
            selectionColor={'#F04B33'}
            style={{
              paddingHorizontal: 30 * px,
              marginLeft: 20 * px,
              height: 90 * px,
              width: width - 240 * px,
              backgroundColor: '#F1F2F2',
              borderRadius: 45 * px,
              borderColor: '#F1F2F2',
              borderWidth: 1,
            }}
            onFocus={focusObtain}
            onChangeText={(value) => {
              setSearchKey(value);
              if (value) {
                setTextChanged(true);
                handleSearchData(value);
              } else {
                setSearchList([]);
              }
            }}
            value={searchKey}
            onSubmitEditing={() => {
              goSearch(1);
            }}
          />
          {searchKey ? (
            <TouchableOpacity
              onPress={clearTextValue}
              style={{
                position: 'absolute',
                right: 260 * px,
                height: 50 * px,
                width: 50 * px,
              }}>
              <Image
                style={{width: 50 * px, height: 50 * px}}
                source={require('../../assets/icon_search_clear_input.png')}
              />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={() => {
              navigationRef.current?.goBack();
            }}
            style={{
              position: 'absolute',
              right: 31 * px,
              width: 160 * px,
              height: 74 * px,
            }}>
            <Text style={{color: '#383838', fontSize: 44 * px}}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
      {searchKey && searchList && searchList.length > 0 ? (
        <FlatList
          keyboardShouldPersistTaps={'handled'}
          style={{
            zIndex: 9999,
            marginTop: StatusBarHeight + 180 * px,
            width: width,
            height: height,
          }}
          data={searchList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : null}
    </View>
  );
};

export default memo(SearchBar);
