import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {px} from '../../constants/constants';
import Api from '../../Api';
import AppModule from '../../../AppModule';
import {useShallowEqualSelector} from '../../utils/hooks';
import {useDispatch} from 'react-redux';
export default function ({tagPress}) {
  const [request, setRequest] = useState(false);
  const {searchKeyWords} = useShallowEqualSelector((state) => ({
    searchKeyWords: state.deprecatedPersist.searchKeyWords,
  }));
  const [expand, setExpand] = useState(() => {
    return searchKeyWords && searchKeyWords.length < 9;
  });
  const resortKeywords = useCallback((words) => {
    let length = words.length;
    //从基数位置开始填入10条数据。
    let ranDomBaseNum = Math.floor(Math.random() * length) + 1; //the + 1 makes it so its not 0.
    let insertLength = 0;
    let sortedWords = [];
    let gap = 1;
    while (insertLength < Math.min(10, length)) {
      sortedWords.push(words[(ranDomBaseNum + insertLength * gap) % length]);
      insertLength++;
    }
    return sortedWords;
  }, []);

  const [keyWords, setKeyWords] = useState(resortKeywords(searchKeyWords));
  const dispatch = useDispatch();

  const resortWordsWrapper = useCallback(() => {
    setRequest(true);
    let timeOut = setTimeout(() => {
      setKeyWords(resortKeywords(searchKeyWords));
      setExpand(false);
      setRequest(false);
      clearTimeout(timeOut);
    }, 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    AppModule.reportShow('16', '155');
    if (!searchKeyWords || searchKeyWords.length === 0) {
      searchKey();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchKey = () => {
    setRequest(true);
    Api.searchKeys().then((res) => {
      setRequest(false);
      if (res.code === 0) {
        dispatch({type: 'setSearchKeyWords', payload: res.data.key_words});
        setExpand(false);
        setKeyWords(resortKeywords(res.data.key_words));
      }
    });
  };
  return (
    <View style={{paddingLeft: 58 * px}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 80 * px,
        }}>
        <Text
          style={{
            fontSize: 42 * px,
            color: '#000000',
            height: 80 * px,
            lineHeight: 80 * px,
            textAlign: 'center',
          }}
          numberOfLines={1}>
          Discover more
        </Text>
        {request ? (
          <View
            style={{
              width: 80 * px,
              height: 80 * px,
              justifyContent: 'center',
            }}>
            <ActivityIndicator
              color={'red'}
              style={{
                width: 38 * px,
                height: 38 * px,
              }}
            />
          </View>
        ) : (
          <TouchableOpacity
            onPress={resortWordsWrapper}
            style={{
              width: 80 * px,
              height: 80 * px,
              justifyContent: 'center',
            }}>
            <Image
              style={{width: 38 * px, height: 38 * px}}
              resizeMode={'contain'}
              source={require('../../assets/icon_search_refresh.png')}
            />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10 * px,
          flexWrap: 'wrap',
        }}>
        {(!expand && keyWords.length > 8 ? keyWords.slice(0, 8) : keyWords).map(
          (item, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  tagPress(item);
                }}
                key={index}
                activeOpacity={0.8}
                style={styles.skuTextBackGround}>
                <Text
                  style={{
                    fontSize: 32 * px,
                    color: '#5D5D5D',
                    textAlign: 'center',
                    lineHeight: 66 * px,
                    height: 66 * px,
                  }}
                  numberOfLines={1}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          },
        )}
        {keyWords && keyWords.length < 9 ? null : !expand ? (
          <TouchableOpacity
            onPress={() => {
              setExpand(true);
            }}
            activeOpacity={0.8}
            style={{
              height: 66 * px,
              width: 66 * px,
              justifyContent: 'center',
              backgroundColor: '#F5F5F5',
              alignItems: 'center',
              marginRight: 20 * px,
              marginVertical: 5,
              borderRadius: 33 * px,
            }}>
            <Image
              style={{width: 38 * px, height: 38 * px}}
              resizeMode={'contain'}
              source={require('../../assets/icon_search_pull.png')}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setExpand(false);
            }}
            activeOpacity={0.8}
            style={{
              height: 66 * px,
              width: 66 * px,
              justifyContent: 'center',
              backgroundColor: '#F5F5F5',
              alignItems: 'center',
              marginRight: 20 * px,
              marginVertical: 5,
              borderRadius: 33 * px,
            }}>
            <Image
              style={{width: 38 * px, height: 38 * px}}
              resizeMode={'contain'}
              source={require('../../assets/icon_search_expand.png')}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  skuTextBackGround: {
    height: 66 * px,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 33 * px,
    paddingHorizontal: 30 * px,
    marginRight: 20 * px,
    marginVertical: 5,
  },
});
