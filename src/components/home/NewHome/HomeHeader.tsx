import {View, Dimensions} from 'react-native';

import {FROM_MYSTERY, FROM_OFFERS, px} from '../../../constants/constants';
import React, {FC, useCallback} from 'react';
import ActivitySwiper from './ActivitySwiper';
import {
  MHomeIndexApi,
  MHomeMysteryBoxesApi,
} from '../../../types/models/config.model';
import {
  FlashSaleList,
  HomeMysteryList,
  HomeRecommendList,
  MiddleBanner,
} from './HomeComponent';
import {useNavigation} from '@react-navigation/core';
import {useFetching} from '../../../utils/hooks';
import Api from '../../../Api';
import {CategoryTwoList} from '../../../types/models/product.model';
import {ResponseError} from '../../../types/models/common.model';
import {MysteryRoute, ProductRoute} from '../../../routes';
const ActivitySwiperEl = ActivitySwiper as any;

interface HomeHeaderProps {
  homeIndexData: MHomeIndexApi.MHomeIndexResponse;
  homeSteryBoxes: MHomeMysteryBoxesApi.MHomeMysteryBoxesResponse;
}
export const HomeHeader: FC<HomeHeaderProps> = ({
  homeIndexData,
  homeSteryBoxes,
}) => {
  const navigation = useNavigation();
  const [, categoryInfoFetch] = useFetching<
    CategoryTwoList.RootObject & ResponseError
  >(Api.categoryInfo);
  const ProductRouter = ProductRoute.useRouteLink();
  const MysteryRouter = MysteryRoute.useRouteLink();
  const {width: screenWidth} = Dimensions.get('window');

  const goDetail = useCallback(
    (item, index) => {
      if (item.product_type === 1) {
        //1 --福袋，2--直购，3--大转盘 4---vip商品 5---专题页 6---特殊页面
        MysteryRouter.navigate({productId: item.product_id});
      } else if (item.product_type === 2 || item.product_type === 4) {
        ProductRouter.navigate({productId: item.product_id});
      }
    },
    [navigation],
  );
  const getCategoryData = useCallback(
    async (item) => {
      let res = await categoryInfoFetch(item.one_category_id);
      if (res.code === 0) {
        let list = res.data?.list || [];
        if (!list.length) {
          return;
        }
        let twoCategoryData;
        let threeCategoryData;
        // topId
        if (item.two_category_id) {
          twoCategoryData = list.find(
            (data) => data.two_item_id === item.two_category_id,
          );
          if (!twoCategoryData) {
            return;
          }
          if (item.three_category_id) {
            threeCategoryData = twoCategoryData.child_item.find(
              (data) => data.three_item_id === item.three_category_id,
            );
            navigation.navigate('CategoryDetail', {
              topId: item.one_category_id,
              categoryList: twoCategoryData,
              item: threeCategoryData,
              from: 'home',
            });
          } else {
            // threeCategoryData = twoCategoryData?.child_item[0];
            navigation.navigate('CategoryDetail', {
              topId: item.one_category_id,
              categoryList: twoCategoryData,
              from: 'home',
            });
          }
        } else {
          twoCategoryData = list[0];
          navigation.navigate('CategoryDetail', {
            topId: item.one_category_id,
            categoryList: twoCategoryData,
            from: 'home',
          });
        }
        // console.log('twoCategoryData', twoCategoryData);
        // console.log('threeCategoryData', threeCategoryData);
        navigation.navigate('CategoryDetail', {
          topId: item.one_category_id,
          categoryList: twoCategoryData,
          item: threeCategoryData,
          from: 'home',
        });
      }
    },
    [categoryInfoFetch, navigation],
  );
  const bannerOnPress = useCallback(
    (item, index) => {
      console.log('item', item);
      // banner 类型， 1-商品， 2-分类， 3-专题, 4-活动
      switch (item.banner_type) {
        case 1:
          goDetail(item, index);
          break;
        case 2:
          getCategoryData(item);
          break;
        case 3:
          // Utils.toastFun('Please wait 专题');
          break;
        case 4:
          navigation.navigate('DiscountList', {
            activity_id: item.activity_id,
            type: 'discount',
          });
          break;
        default:
          break;
      }
    },
    [getCategoryData, goDetail, navigation],
  );

  if (!homeIndexData) {
    return null;
  }
  return (
    <View>
      <ActivitySwiperEl
        type={'home'}
        homeStyle={{
          height: 430 * px,
          with: screenWidth,
        }}
        bannerList={homeIndexData.top_banner || []}
        itemWidth={screenWidth}
        itemHeight={430 * px}
        onPress={bannerOnPress}
      />
      <FlashSaleList data={homeIndexData.flash_sales_list} />
      <HomeMysteryList data={homeSteryBoxes} />
      <MiddleBanner
        bannerList={homeIndexData.middle_banner}
        onPress={bannerOnPress}
      />
      <HomeRecommendList
        data={homeIndexData.recommend_product_list}
        type={'detail'}
      />
    </View>
  );
};
