import {useNavigation} from '@react-navigation/native';
import React, {FC, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Animated,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AppModule from '../../../AppModule';
import {px} from '../../constants/constants';
import {reportData} from '../../constants/reportData';
import {CategoryTwoList} from '../../types/models/product.model';
import {useConstant} from '../../utils/hooks';
import Empty from '../common/Empty';
import GlideImageWeak from '../native/GlideImage';

let GlideImage: any = GlideImageWeak;

//一级分类tab
interface LeftTabProps {
  onPress: () => void;
  text: string;
  active: boolean;
}
export const LeftTab = ({text, active, onPress}: LeftTabProps) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: active ? '#F6F6F6' : '#fff',
        width: 300 * px,
        height: 162 * px,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30 * px,
      }}
      onPress={onPress}>
      <Text
        textBreakStrategy={'balanced'}
        numberOfLines={2}
        style={[
          active
            ? {fontSize: 42 * px, fontWeight: 'bold', color: '#000'}
            : {fontSize: 34 * px, color: '#202020'},
          {
            textAlign: 'center',
            alignSelf: 'center',
          },
        ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};
interface HeaderTabsProps {
  two_item_id: number;
  two_item_name: string;
}
interface HeaderTabs {
  list: HeaderTabsProps[];
  onPress: (i: number) => void;
  activeIndex: number;
}
//二级分类，顶部快速切换tabs
export const HeaderTabs = ({list, onPress, activeIndex}: HeaderTabs) => {
  const headerRabsRef = useRef<ScrollView>(null);
  useEffect(() => {
    headerRabsRef.current?.scrollTo({
      x: activeIndex * 300 * px - 180 * px,
      y: 0 * px,
      animated: true,
    });
  }, [activeIndex]);
  return (
    <Animated.View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        ref={headerRabsRef}
        contentContainerStyle={{
          paddingVertical: 40 * px,
        }}
        horizontal={true}>
        {list.map((item, index) => {
          return (
            <HeaderTabItem
              text={item.two_item_name}
              active={activeIndex === index}
              onPress={() => {
                onPress(index);
              }}
              key={index}
            />
          );
        })}
      </ScrollView>
    </Animated.View>
  );
};
//二级分类，顶部快速切换tabItem
export const HeaderTabItem = ({text, active, onPress}: LeftTabProps) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: active ? '#F95240' : '#ffffff',
        width: 280 * px,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100 * px,
        marginHorizontal: 20 * px,
      }}
      onPress={onPress}>
      <Text
        numberOfLines={2}
        style={{
          paddingVertical: 5 * px,
          fontSize: 30 * px,
          color: active ? '#fff' : '#000',
          textAlign: 'center',
        }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export interface CategoryListProps {
  topId: number;
  listData: CategoryTwoList.Data['list'];
  onRefresh: () => void;
  loading: boolean;
}
interface TwoCategoryProps {
  topId: number;
  twoListItem: CategoryTwoList.List;
}
interface ViewChangeProps {
  viewableItems: any[];
  changed: any[];
}

export const CategoryList: FC<CategoryListProps> = ({
  topId,
  listData,
  onRefresh,
  loading,
}) => {
  const flatListRef = useRef<FlatList>(null);
  let tabSelectRef = useRef(false);
  const viewConfig = useConstant(() => ({
    itemVisiblePercentThreshold: 100,
    waitForInteraction: true,
  }));
  const topTabList = listData.filter((item) => {
    return item.child_item?.length > 0;
  });
  const [select, setSelected] = useState(0);
  const scrollTo = (val: number) => {
    tabSelectRef.current = true;
    setSelected(val);
    flatListRef.current?.scrollToIndex({
      index: val,
      animated: true,
    });
    setTimeout(() => {
      tabSelectRef.current = false;
    }, 3000);
  };
  const onViewChange = useConstant(() => ({changed}: ViewChangeProps) => {
    if (tabSelectRef.current) {
      return;
    }

    if (changed[0].isViewable) {
      setSelected(changed[0].index);
    }
  });
  return (
    <View style={{flex: 1}}>
      <HeaderTabs
        list={topTabList}
        activeIndex={select}
        onPress={(i) => scrollTo(i)}
      />
      <FlatList
        ref={flatListRef}
        style={{
          backgroundColor: '#F6F6F6',
          paddingLeft: 20 * px,
        }}
        data={listData}
        onRefresh={onRefresh}
        refreshing={loading}
        keyExtractor={(item) => item.two_item_id + ''}
        onViewableItemsChanged={onViewChange}
        viewabilityConfig={viewConfig}
        renderItem={({item}) => {
          return item.child_item?.length ? (
            <CategoryItem twoListItem={item} topId={topId} />
          ) : null;
        }}
        ListEmptyComponent={
          <Empty
            image={require('../../assets/empty.png')}
            title={'Nothing at all'}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
};

export const CategoryItem: FC<TwoCategoryProps> = ({twoListItem, topId}) => {
  const navigation = useNavigation();
  const goCategoryInfo = (
    type: number,
    data?: CategoryTwoList.threeDataProps,
  ) => {
    if (type === 2) {
      AppModule.reportClick(reportData.categoryHome, '369', {
        ProductCat: twoListItem.two_item_id,
      });
      navigation.navigate('CategoryDetail', {
        topId: topId,
        categoryList: twoListItem,
        from: 'category',
      });
    } else {
      AppModule.reportClick(reportData.categoryHome, '370', {
        ProductCat: data?.three_item_id,
      });
      navigation.navigate('CategoryDetail', {
        topId: topId,
        categoryList: twoListItem,
        item: data,
        from: 'category',
      });
    }
  };
  return (
    <View
      style={{
        flex: 1,
        marginBottom: 20 * px,
        backgroundColor: '#fff',
        paddingLeft: 20 * px,
        marginRight: 20 * px,
      }}>
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
        onPress={() => goCategoryInfo(2)}>
        <Text
          style={{
            fontSize: 40 * px,
            marginVertical: 20 * px,
            fontWeight: 'bold',
          }}>
          {twoListItem.two_item_name}
        </Text>
        <Image
          source={require('../../assets/icon_right_black.png')}
          style={{
            width: 15 * px,
            height: 25 * px,
            marginLeft: 20 * px,
            alignSelf: 'center',
          }}
        />
      </TouchableOpacity>
      <ThreeCategory
        threeList={twoListItem.child_item}
        goCategoryInfo={goCategoryInfo}
      />
    </View>
  );
};

interface ThreeCategoryProps {
  threeList: CategoryTwoList.List['child_item'];
  goCategoryInfo: (type: number, data: CategoryTwoList.threeDataProps) => void;
}

export const ThreeCategory: FC<ThreeCategoryProps> = ({
  threeList,
  goCategoryInfo,
}) => {
  return (
    <View
      // key={index}
      style={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        flexDirection: 'row',
        flex: 1,
      }}>
      {threeList.map((item, i) => {
        return (
          <TouchableOpacity
            onPress={() => goCategoryInfo(3, item)}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 30 * px,
              marginVertical: 20 * px,
            }}
            key={i}>
            <View
              style={{
                backgroundColor: '#F6F6F6',
                borderRadius: 10 * px,
                padding: 10 * px,
                // overflow: 'hidden',
              }}>
              <GlideImage
                showDefaultImage={true}
                source={{uri: item.picture}}
                defaultSource={require('../../assets/lucky_deal_default_middle.png')}
                resizeMode={'contain'}
                style={{
                  width: 180 * px,
                  height: 180 * px,
                }}
              />
            </View>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 30 * px,
                color: '#5C5C5C',
                textAlign: 'center',
                marginTop: 15 * px,
                width: 182 * px,
              }}>
              {item.three_item_name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
