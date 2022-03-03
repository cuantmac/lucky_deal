/**
 * @Author: pandali
 * @Date: 2021-10-We 11:59:02
 * @Last Modified by:   pandali
 * @Last Modified time: 2021-10-We 11:59:02
 */
import {View, StyleSheet, Dimensions} from 'react-native';
import React, {FC, useState, useCallback, useEffect} from 'react';
import {CommonApi} from '@src/apis';
import {CategoryTopItem} from '@luckydeal/api-common/lib/api';
import {useLoading} from '@src/utils/hooks';
import {Empty} from '@src/widgets/empty';
import {PageStatusControl} from '@src/widgets/pageStatusControl';
import SearchBar from './widgets/SearchBar';
import Sidebar from './widgets/Sidebar';
import {CategoryDetail, CategoryProvider} from './widgets/categoryDetail';

const Category: FC = () => {
  /**
   * 一级分类列表数据.
   */
  const [topData, setTopData] = useState<CategoryTopItem[]>([]);
  /**
   * 一级分类选中项.
   */
  const [topActive, setTopActive] = useState<CategoryTopItem>();

  const [loading, withLoading] = useLoading(true);

  /**
   * 获取分类列表一级数据.
   */
  const getCategoryTopData = useCallback(() => {
    return CommonApi.categoryTopUsingPOST().then((res) => {
      if (res.data?.list) {
        setTopData(res.data.list);
      }
      if (res.data?.list) {
        const [first] = res.data.list;
        setTopActive(first);
      }
      return res;
    });
  }, []);

  useEffect(() => {
    withLoading(getCategoryTopData());
  }, [getCategoryTopData, withLoading]);

  const handleChangeTop = useCallback((item: CategoryTopItem) => {
    setTopActive(item);
  }, []);

  return (
    <CategoryProvider>
      <View style={CategoryStyles.container}>
        <SearchBar />
        <PageStatusControl
          onRefresh={() => {
            withLoading(getCategoryTopData());
          }}
          showEmpty
          emptyComponent={
            <Empty
              title="Temporarily no data"
              image={require('@src/assets/home_empty.png')}
              onRefresh={() => {
                withLoading(getCategoryTopData());
              }}
            />
          }
          hasData={!!topData?.length}
          loading={loading}>
          <View style={CategoryStyles.content}>
            <Sidebar
              onPress={handleChangeTop}
              active={topActive}
              data={topData}
            />
            {topActive && (
              <CategoryDetail key={topActive.top_item_id} topItem={topActive} />
            )}
          </View>
        </PageStatusControl>
      </View>
    </CategoryProvider>
  );
};

const CategoryStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    flex: 1,
    height: Dimensions.get('window').height - 50,
  },
});

export default Category;
