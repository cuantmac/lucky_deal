import React, {useCallback, useEffect, useState, FC} from 'react';
import {View, StatusBar, ActivityIndicator} from 'react-native';
import Empty from '../common/Empty';
import {useFetching} from '../../utils/hooks';
import Api from '../../Api';
import {PRIMARY} from '../../constants/colors';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import ListContainer from './ListContainer';
import Utils from '../../utils/Utils';
import {
  CategoryTopList,
  CategoryTwoList,
} from '../../types/models/product.model';

import AppModule from '../../../AppModule';
import {reportData} from '../../constants/reportData';
import {ResponseError} from '../../types/models/common.model';
import HomeSearchBar from '../search/HomeSearchBar';
const CategoryView: FC = () => {
  const navigation = useNavigation();
  const [error, setError] = useState(false);
  const [dataTwoList, setDataTwoList] = useState<CategoryTwoList.Data['list']>(
    [],
  );
  const [dataList, setDataList] = useState<CategoryTopList.Data['list']>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, categoryDataFetch] = useFetching<
    CategoryTopList.RootObject & ResponseError
  >(Api.categoryTopList);
  const [rightLoading, categoryTwoDataFetch] = useFetching<
    CategoryTwoList.RootObject & ResponseError
  >(Api.categoryInfo);
  const getCategoryTwo = useCallback(
    async (id: number, index: number) => {
      AppModule.reportClick(reportData.categoryHome, '368', {
        ProductCat: id,
      });
      let res = await categoryTwoDataFetch(id);
      if (res.code === 0) {
        let _list = res.data?.list || [];
        let new_list = _list.filter((item) => {
          return item.child_item?.length > 0;
        });
        setDataTwoList(new_list);
        setActiveIndex(index);
      } else {
        Utils.toastFun(res.error);
      }
    },
    [categoryTwoDataFetch],
  );
  const getData = useCallback(async () => {
    let res = await categoryDataFetch();
    if (res.code === 0) {
      let _list = res.data?.list || [];
      setDataList(_list);
      if (_list.length === 0) {
        return;
      }
      let _rightData = _list[activeIndex];

      getCategoryTwo(_rightData.top_item_id, 0);
    } else {
      Utils.toastFun(res.error);
    }
  }, [activeIndex, categoryDataFetch, getCategoryTwo]);
  const focus = useIsFocused();
  useEffect(() => {
    if (!focus) {
      return;
    }
    AppModule.reportShow(reportData.categoryHome, '367');

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);

  if (error) {
    return (
      <Empty
        error={true}
        onRefresh={() => {
          setError(false);
        }}
      />
    );
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F6F6F6',
        position: 'relative',
      }}>
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor={'#ffff0000'}
      />
      <HomeSearchBar navigation={navigation} />
      {loading && !dataList?.length ? (
        <ActivityIndicator
          color={PRIMARY}
          style={{
            flex: 1,
          }}
        />
      ) : (
        <ListContainer
          list={dataList}
          listTwo={dataTwoList}
          getCategoryTwo={getCategoryTwo}
          activeIndex={activeIndex}
          loading={rightLoading}
        />
      )}
    </View>
  );
};
export default CategoryView;
