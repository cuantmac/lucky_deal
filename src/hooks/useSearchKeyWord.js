import {useEffect, useState} from 'react';
import {useShallowEqualSelector} from '../utils/hooks';
export function useSearchKeyWord() {
  const {searchKeyWords, searchIndex} = useShallowEqualSelector((state) => ({
    searchKeyWords: state.deprecatedPersist.searchKeyWords,
    searchIndex: state.deprecatedPersist.searchIndex,
  }));
  const [words, setWords] = useState('');

  useEffect(() => {
    let wordsSize = searchKeyWords?.length;
    if (wordsSize > 0) {
      setWords(searchKeyWords[searchIndex % wordsSize]);
    }
  }, [searchIndex, searchKeyWords]);

  return words;
}
