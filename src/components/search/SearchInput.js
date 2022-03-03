import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import SearchBar from './SearchBar';
import SearchHistory from './SearchHistory';
import SearchKeyWords from './SearchKeyWords';
import {px, StatusBarHeight} from '../../constants/constants';
import SearchResultList from './SearchResultList';
import SearchNoEditBar from './SearchNotEditBar';
import AppModule from '../../../AppModule';
import {useDispatch} from 'react-redux';
import {useShallowEqualSelector} from '../../utils/hooks';
import SearchRankingHorizontal from './SearchRankingHorizontal';
function SearchInput({route, navigation}) {
  const {searchKeyWords, searchIndex} = useShallowEqualSelector((state) => ({
    searchKeyWords: state.deprecatedPersist.searchKeyWords,
    searchIndex: state.deprecatedPersist.searchIndex,
  }));
  const [showResultList, setShowResultList] = useState(false);

  const [placeHolder, setPlaceHolder] = useState(() => {
    if (route.params?.needShowSearchKeyWords) {
      return route.params?.needShowSearchKeyWords;
    }
    let wordsSize = searchKeyWords?.length;
    if (wordsSize > 0) {
      return searchKeyWords[searchIndex % wordsSize];
    }
  });
  const [keyWords, setKeyWords] = useState();
  const [inputBlur, setInputBlur] = useState(false);
  const [history, setHistory] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch({type: 'setSearchIndex', payload: searchIndex + 1});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1, backgroundColor: 'white'}}>
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <> */}
        {showResultList ? (
          <SearchNoEditBar
            title={keyWords}
            onFocusCallBack={() => {
              setShowResultList(false);
            }}
          />
        ) : (
          <SearchBar
            searchWord={keyWords}
            placeHolder={placeHolder}
            blur={inputBlur}
            searchCallBack={(keyWords) => {
              setKeyWords(keyWords);
              setShowResultList(true);
              setHistory(keyWords);
            }}
            onFocusCallBack={() => {
              setShowResultList(false);
            }}
          />
        )}
        {showResultList ? (
          <View
            style={{
              backgroundColor: 'white',
              marginTop: StatusBarHeight + 200 * px,
              flex: 1,
            }}>
            <SearchResultList keyWords={keyWords} />
          </View>
        ) : (
          <ScrollView
            keyboardShouldPersistTaps={'handle'}
            style={{
              backgroundColor: 'white',
              marginTop: StatusBarHeight + 200 * px,
              height: '100%',
            }}>
            <SearchHistory
              keyWord={history}
              tabPress={(words) => {
                AppModule.reportClick('16', '150', {
                  KeywordType: '0',
                  Keyword: words,
                });
                setInputBlur(true);
                setKeyWords(words);
                setTimeout(() => {
                  setShowResultList(true);
                }, 300);
              }}
            />
            <SearchKeyWords
              tagPress={(keyWord) => {
                AppModule.reportClick('16', '150', {
                  KeywordType: '1',
                  Keyword: keyWord,
                });
                setInputBlur(true);
                setKeyWords(keyWord);
                setTimeout(() => {
                  setShowResultList(true);
                }, 300);
              }}
            />
            <SearchRankingHorizontal navigation={navigation} />
          </ScrollView>
        )}
        {/* </>
        </TouchableWithoutFeedback> */}
      </KeyboardAvoidingView>
    </View>
  );
}

export default SearchInput;
