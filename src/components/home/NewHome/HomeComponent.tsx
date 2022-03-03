import {MRecommendProduct, ProductSimpleBaseItem} from '@luckydeal/api-common';
import {useNavigation} from '@react-navigation/core';
import React, {FC, memo, useCallback} from 'react';
import {useMemo} from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  ViewProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {
  FROM_MYSTERY,
  FROM_OFFERS,
  FROM_SUPER_BOX,
  px,
} from '../../../constants/constants';
import {reportData} from '../../../constants/reportData';
import {MysteryRoute, ProductRoute} from '../../../routes';
import {
  CategoryThreeItem,
  CategoryTwoItem,
  HomeBannerListItem,
  MHomeMysteryBoxesApi,
  MHomeNavApi,
} from '../../../types/models/config.model';
import {navigationRef} from '../../../utils/refs';
import Utils from '../../../utils/Utils';
import {HomeFlashSaleItem} from '../../../widgets/productItem/HomeFlashSaleItem';
import {ProductListItem} from '../../../widgets/productItem/ProductListItem';
import {Timer, TimerFormate} from '../../common/Timer';
import GlideImage from '../../native/GlideImage';

const ScreenWidth = Dimensions.get('window').width;
const GlideImageEl = GlideImage as any;

interface HomeModuleContainerProps {
  style?: StyleProp<ViewStyle>;
}

export const HomeModuleContainer: FC<HomeModuleContainerProps> = ({
  style,
  children,
}) => {
  return (
    <View
      style={[
        {
          borderRadius: 10 * px,
          backgroundColor: 'white',
          marginTop: 20 * px,
          paddingBottom: 20 * px,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

interface HomeModuleTitleProps {
  rightComponent?: JSX.Element;
}

export const HomeModuleTitle: FC<HomeModuleTitleProps> = ({
  children,
  rightComponent,
}) => {
  return (
    <View
      style={{
        height: 100 * px,
        paddingHorizontal: 24 * px,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Text style={{fontSize: 38 * px, fontWeight: 'bold'}}>{children}</Text>
      {rightComponent}
    </View>
  );
};
interface HomeTopTabsProps {
  list: Array<MHomeNavApi.MHomeNavItem>;
  tabChange: (index: number) => void;
  activeTab: number;
}
export const HomeTopTabs: FC<HomeTopTabsProps> = memo(
  ({list, tabChange, activeTab}) => {
    return (
      <ScrollView horizontal={true}>
        {list.map((item, index) => {
          return (
            <TabItem
              data={item}
              tabChange={tabChange}
              active={index === activeTab}
              index={index}
              key={index}
            />
          );
        })}
      </ScrollView>
    );
  },
);
interface TabItemProps {
  data: MHomeNavApi.MHomeNavItem;
  tabChange: (i: number) => void;
  active: boolean;
  index: number;
}
export const TabItem: FC<TabItemProps> = memo(
  ({data, tabChange, active, index}) => {
    return (
      <TouchableOpacity
        onPress={() => tabChange(index)}
        style={{
          width: 200 * px,
        }}>
        <View style={{}}>
          <Text
            style={{
              textDecorationLine: 'underline',
              textDecorationStyle: 'solid',
              fontSize: active ? 34 * px : 30 * px,
              color: active ? '#000' : '#747474',
              height: 25 * px,
            }}>
            {data.item_name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
);
interface middleBannerProps {
  bannerList: HomeBannerListItem[];
  onPress: (item: HomeBannerListItem, i: number) => void;
}
export const MiddleBanner: FC<middleBannerProps> = memo(
  ({bannerList, onPress}) => {
    if (!bannerList || bannerList.length === 0) {
      return null;
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 20 * px,
        }}>
        {bannerList.map((item, index) => {
          if (index > 1) {
            return null;
          }
          return (
            <TouchableOpacity
              onPress={() => onPress(item, index)}
              key={index}
              style={{flex: 1}}>
              <GlideImageEl
                defaultSource={require('../../../assets/ph.png')}
                source={Utils.getImageUri(item.image)}
                resizeMode={'stretch'}
                style={{
                  width: ScreenWidth / 2 - 20 * px,
                  height: 200 * px,
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  },
);

interface HomeMysteryListProps {
  data: MHomeMysteryBoxesApi.MHomeMysteryBoxesResponse;
}
//首页盲盒列表
export const HomeMysteryList: FC<HomeMysteryListProps> = ({data}) => {
  const onPress = useCallback((boxCardData) => {
    navigationRef.current?.navigate('BoxCategoryList', {
      one_category_id: boxCardData.one_category_id,
      two_category_id: boxCardData.two_category_id,
      three_category_id: boxCardData.three_category_id,
      title: boxCardData.name,
    });
  }, []);
  const itemSize = (Dimensions.get('window').width - 20) / 2;

  if (!data || !data.list || data.list.length === 0) {
    return null;
  }
  return (
    <HomeModuleContainer>
      <HomeModuleTitle>{data.module_name}</HomeModuleTitle>
      <View
        style={{
          flexDirection: 'row',
          // justifyContent: 'space-around',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}>
        {data.list.map((item, index) => {
          return (
            <TouchableWithoutFeedback
              onPress={() => {
                onPress(item);
              }}
              key={index}>
              <View
                style={{
                  width: itemSize,
                  // height: itemSize,
                  marginBottom: 30 * px,
                  marginRight: index % 2 ? 0 : 20 * px,
                  // backgroundColor: '#eee',
                  overflow: 'hidden',
                  // borderRadius: 20 * px,
                }}>
                <GlideImageEl
                  showDefaultImage={true}
                  source={Utils.getImageUri(item.image)}
                  defaultSource={require('../../../assets/lucky_deal_default_high.png')}
                  resizeMode={'stretch'}
                  style={{
                    width: itemSize,
                    height: itemSize,
                    backgroundColor: '#eee',
                    overflow: 'hidden',
                  }}
                />
                <View
                  style={{paddingHorizontal: 15 * px, marginVertical: 20 * px}}>
                  <Text
                    numberOfLines={2}
                    style={{
                      color: 'black',
                      paddingRight: 5 * px,
                      //marginLeft: 8,
                      marginRight: 10,
                      fontSize: 40 * px,
                      // width: 400 * px,
                    }}>
                    {item.name ? item.name : 'Unknown'}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </HomeModuleContainer>
  );
};

interface FlashSaleListProps {
  data: MRecommendProduct;
}
//首页推荐列表
export const FlashSaleList: FC<FlashSaleListProps> = memo(({data}) => {
  const navigation = useNavigation();

  const viewMoreFun = useCallback(() => {
    navigation.navigate('FlashDealsView');
  }, [navigation]);

  const itemPress = useCallback(() => {
    viewMoreFun();
  }, [viewMoreFun]);

  const list = useMemo(() => {
    return data?.product_list?.slice(0, 8);
  }, [data]);

  if (!data || !data.product_list || !data.product_list.length) {
    return null;
  }

  return (
    <HomeModuleContainer>
      <TouchableOpacity onPress={itemPress} activeOpacity={0.8}>
        <HomeModuleTitle
          rightComponent={
            <Timer targetTime={data.act_end_time}>
              {(time) => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{fontSize: 40 * px}}>Ends in</Text>
                    <TimerFormate
                      time={time}
                      styles={{
                        minWidth: 54 * px,
                        paddingHorizontal: 10 * px,
                        height: 54 * px,
                        backgroundColor: '#000',
                        borderRadius: 10 * px,
                        fontSize: 36 * px,
                        textAlign: 'center',
                        color: '#fff',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      color={'#000'}
                    />
                    <Image
                      resizeMode="contain"
                      style={{width: 15 * px}}
                      source={require('../../../assets/i_right.png')}
                    />
                  </View>
                );
              }}
            </Timer>
          }>
          {data.title}
        </HomeModuleTitle>
      </TouchableOpacity>

      <View style={{paddingRight: 15 * px}}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={list}
          keyExtractor={(item, index) => {
            return index + '';
          }}
          renderItem={({item, index}) => {
            return (
              <HomeFlashSaleItem
                showMore={index === 7}
                key={index}
                data={item}
                onPress={itemPress}
              />
            );
          }}
        />
      </View>
    </HomeModuleContainer>
  );
});

interface HomeRecommendProps {
  data: MRecommendProduct;
  type: string;
}
//首页推荐列表
export const HomeRecommendList: FC<HomeRecommendProps> = memo(({data}) => {
  const ProductRouter = ProductRoute.useRouteLink();
  const MysteryRouter = MysteryRoute.useRouteLink();
  const goDetail = useCallback(
    (item, index) => {
      if (item.product_category === 1) {
        //1 --福袋，2--直购，3--大转盘 4---vip商品 5---专题页 6---特殊页面
        MysteryRouter.navigate({
          productId: item.bag_id || item.product_id,
        });
      } else if (item.product_category === 2 || item.product_category === 4) {
        ProductRouter.navigate({
          productId: item.bag_id || item.product_id,
        });
      }
    },
    [MysteryRouter, ProductRouter],
  );

  const itemPress = useCallback(
    (item, index) => {
      goDetail(item, index);
    },
    [goDetail],
  );

  if (!data || !data.product_list || !data.product_list.length) {
    return null;
  }

  return (
    <HomeModuleContainer style={{marginBottom: 20 * px}}>
      <HomeModuleTitle>{data.title}</HomeModuleTitle>
      <View style={{paddingRight: 15 * px}}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={data.product_list}
          keyExtractor={(item, index) => {
            return index + '';
          }}
          renderItem={({item, index}) => {
            return (
              <HomeFlashSaleItem
                key={index}
                data={item}
                showTag
                onPress={() => itemPress(item, index)}
              />
            );
          }}
        />
      </View>
    </HomeModuleContainer>
  );
});

// 首页bestSellList Item
interface ItemRenderProps {
  item: ProductSimpleBaseItem[];
  index: number;
  goDetail: (item: ProductSimpleBaseItem, index: number) => void;
}
export const ItemRender: FC<ItemRenderProps> = memo(
  ({item, index, goDetail}) => (
    <View
      style={{
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
      key={index}>
      {item.map((data, i) => {
        return (
          <View style={{flexDirection: 'row'}} key={i}>
            <ProductListItem
              data={data}
              onPress={() => goDetail(data, index)}
              key={i + data.title}
            />
          </View>
        );
      })}
    </View>
  ),
);

interface CategoryTwoTabsProps {
  tabList: CategoryTwoItem[];
  activeTab: number;
  selectTab: (type: number, id: number, i: number) => void;
}
//首页二级分类tab
export const CategoryTwoTabs: FC<CategoryTwoTabsProps> = ({
  tabList,
  activeTab,
  selectTab,
}) => {
  if (!tabList || !tabList.length) {
    return null;
  }
  return (
    <ScrollView
      horizontal={true}
      style={{marginVertical: 30 * px, marginHorizontal: 20 * px}}>
      {tabList.map((item, i) => {
        return (
          <TouchableOpacity
            key={i}
            onPress={() => selectTab(2, item.two_item_id, i)}
            style={{
              flexDirection: 'row',
              marginRight: 30 * px,
              paddingVertical: 10 * px,
              paddingHorizontal: 20 * px,
              alignItems: 'center',
              backgroundColor:
                activeTab === item.two_item_id ? '#F8F8F8' : '#fff',
              borderRadius: 20 * px,
            }}>
            <Text
              numberOfLines={1}
              style={{
                width: 200 * px,
                fontSize: 26 * px,
                color: activeTab === item.two_item_id ? '#000' : '#747474',
              }}>
              {item.two_item_name}
            </Text>
            {activeTab === item.two_item_id ? (
              <Image
                source={require('../../../assets/icon_down.png')}
                style={{width: 14 * px, height: 18 * px, marginLeft: 10 * px}}
              />
            ) : null}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};
//首页三级分类tab
interface CategoryThreeTabsProps {
  tabList: CategoryThreeItem[];
  activeTab: number;
  selectTab: (type: number, id: number, i: number) => void;
}
export const CategoryThreeTabs: FC<CategoryThreeTabsProps> = ({
  tabList,
  activeTab,
  selectTab,
}) => {
  if (!tabList || !tabList.length) {
    return null;
  }
  return (
    <ScrollView
      horizontal={true}
      style={{marginHorizontal: 20 * px, marginVertical: 40 * px}}>
      {tabList.map((item, i) => {
        return (
          <View
            style={{justifyContent: 'center', alignItems: 'center'}}
            key={i}>
            <TouchableOpacity
              key={i}
              onPress={() => selectTab(3, item.three_item_id, i)}
              style={{
                flexDirection: 'row',
                marginHorizontal: 20 * px,
                paddingVertical: 10 * px,
                paddingHorizontal: 20 * px,
                alignItems: 'center',
                justifyContent: 'space-around',
                borderRightWidth: 3 * px,
                borderRightColor: '#747474',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  width: 200 * px,
                  fontSize: 30 * px,
                  fontWeight:
                    activeTab === item.three_item_id ? 'bold' : 'normal',
                  color: activeTab === item.three_item_id ? '#000' : '#747474',
                }}>
                {item.three_item_name}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
};

export const HomeViewBackground: FC<ViewProps> = ({children}) => {
  return (
    <View style={{width: ScreenWidth, backgroundColor: 'rgb(236,236,236)'}}>
      {children}
    </View>
  );
};
