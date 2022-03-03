import React, {FC} from 'react';
import {ActivityIndicator, useWindowDimensions, View} from 'react-native';
// import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import {px, StatusBarHeight} from '../../constants/constants';
import {CategoryList, LeftTab} from './CategoryComponent';
import {
  CategoryTopList,
  CategoryTwoList,
} from '../../types/models/product.model';
import {PRIMARY} from '../../constants/colors';

interface ListContainerProps {
  list: CategoryTopList.Data['list'];
  listTwo: CategoryTwoList.Data['list'];
  getCategoryTwo: (i: number, index: number) => void;
  activeIndex: number;
  loading: boolean;
}
const ListContainer: FC<ListContainerProps> = ({
  list,
  listTwo,
  getCategoryTwo,
  activeIndex,
  loading,
}) => {
  const {height} = useWindowDimensions();
  const reFresh = () => {
    let _active = list[activeIndex];
    getCategoryTwo(_active.top_item_id, activeIndex);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#F6F6F6',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flex: 1,
      }}>
      <View
        style={{
          width: 300 * px,
          minHeight: height - (StatusBarHeight as number) - 75 * px,
          backgroundColor: 'white',
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginBottom: 240 * px}}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {list.map((item, index) => {
            return (
              <LeftTab
                text={item.top_item_name}
                active={activeIndex === index}
                onPress={() => getCategoryTwo(item.top_item_id, index)}
                key={index}
              />
            );
          })}
        </ScrollView>
      </View>
      {loading && !listTwo?.length ? (
        <ActivityIndicator
          color={PRIMARY}
          style={{flex: 1, height: 1000 * px, justifyContent: 'center'}}
        />
      ) : (
        <CategoryList
          topId={list.length > activeIndex ? list[activeIndex]?.top_item_id : 0}
          listData={listTwo}
          onRefresh={reFresh}
          loading={loading}
        />
      )}
    </View>
  );
};
export default ListContainer;
