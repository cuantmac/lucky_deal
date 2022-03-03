import {View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';

import {createStyleSheet} from '@src/helper/helper';
import {CommonApi} from '@src/apis';
import {useLoading} from '@src/utils/hooks';

import PanelTitle from './PanelTitle';
import Tag from './Tag';

interface SearchHistory {
  data?: string[];
  onChange?: (val: string) => void;
}

const DiscoverMore: React.FC<SearchHistory> = ({onChange}) => {
  const [keywords, setKeywords] = useState<string[]>([]);

  const [loading, withLoading] = useLoading(false);

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
  const getSearchKey = useCallback(() => {
    return CommonApi.searchKeywordUsingPOST().then((res) =>
      setKeywords(resortKeywords(res.data.key_words || [])),
    );
  }, [resortKeywords]);

  useEffect(() => {
    getSearchKey();
  }, [getSearchKey]);

  if (!keywords.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <PanelTitle
        iconType="refresh"
        loading={loading}
        onClick={() => withLoading(getSearchKey())}>
        Discover more
      </PanelTitle>

      <View style={styles.cells}>
        {keywords?.map((item) => (
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
export default DiscoverMore;
