import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Api from '../../Api';
import {useIsFocused} from '@react-navigation/core';
import AppModule from '../../../AppModule';
import PropTypes from 'prop-types';
import {
  FROM_MYSTERY,
  FROM_OFFERS,
  FROM_SUPER_BOX,
  px,
} from '../../constants/constants';
import {useShallowEqualSelector} from '../../utils/hooks';
import Utils from '../../utils/Utils';
import {reportData} from '../../constants/reportData';
import {categoryDetailPath} from '../../analysis/report';
import {ProductListItem} from '../../widgets/productItem/ProductListItem';
import {RecommendListHeader} from '../../widgets/productItem/RecommendListHeader';
import {SPCComponent} from '../productdetail/GoodsDetailComponent';
import {MysteryRoute, ProductRoute} from '../../routes';

/**
 *
 * @param detail
 * @param navigation
 * @param headerView
 * @param onScroll
 * @param goodsType  0--直购， 1--福袋
 * @returns {*}
 * @constructor
 */
export default function GoodsRecommendList({
  detail,
  navigation,
  headerView,
  onScroll,
  goodsType,
}) {
  const {userInBucket} = useShallowEqualSelector(
    (state) => state.deprecatedPersist,
  );
  const pageNum = 20;
  const [dataList, setDataList] = useState([]);
  const [isLoadComplete, setLoadComplete] = useState(false);
  const pageRef = useRef(1);
  const dataListRef = useRef([]);
  const [isRefreshing, setRefreshing] = useState(false);

  const loadingRef = useRef(false);
  const allLoadedRef = useRef(false);
  const focus = useIsFocused();

  const response = useCallback((res) => {
    if (res.error) {
      setRefreshing(false);
      dataListRef.current = [];
      setDataList(dataListRef.current);
      Utils.toastFun(
        'Sorry, there are something wrong, please try again later',
      );
      return;
    }
    let list = res.data.list || [];
    if (list.length < pageNum) {
      setLoadComplete(true);
    }
    if (pageRef.current === 1) {
      dataListRef.current = list;
    } else if (list.length > 0) {
      list.forEach((item) => {
        dataListRef.current.push(item);
      });
    } else {
      allLoadedRef.current = true;
    }
    setDataList([...dataListRef.current] || []);
    setRefreshing(false);
    loadingRef.current = false;
    pageRef.current += 1;
  }, []);

  const fetchRecommendList = useCallback(() => {
    if (goodsType === 0) {
      Api.recommendList(
        pageRef.current,
        detail.product_id || detail.bag_id,
        pageNum,
      ).then((res) => {
        response(res);
      });
    } else if (goodsType === 1) {
      Api.recommendBagList(
        pageRef.current,
        detail.product_id || detail.bag_id,
        pageNum,
      ).then((res) => {
        response(res);
      });
    }
  }, [detail.bag_id, detail.product_id, goodsType, response]);

  useEffect(() => {
    if (isRefreshing && focus) {
      //直购不分桶
      if (userInBucket || goodsType === 0) {
        fetchRecommendList();
      } else {
        setLoadComplete(true);
      }
    }
  }, [fetchRecommendList, focus, goodsType, isRefreshing, userInBucket]);

  useEffect(() => {
    if (focus && dataList.length === 0) {
      pageRef.current = 1;
      setRefreshing(true);
    }
  }, [dataList.length, focus]);

  const onLoadMore = useCallback(() => {
    if (!loadingRef.current && !allLoadedRef.current) {
      loadingRef.current = true;
      AppModule.reportClick('3', '219', {
        CategoryId: detail.category_id,
        CateStation: detail.cate_station,
        ProductId: detail.product_id || detail.bag_id,
        ProductCat: categoryDetailPath.getData().ProductCat,
      });
      fetchRecommendList();
    }
  }, [
    detail.bag_id,
    detail.cate_station,
    detail.category_id,
    detail.product_id,
    fetchRecommendList,
  ]);

  const ProductRouter = ProductRoute.useRouteLink();
  const MysteryRouter = MysteryRoute.useRouteLink();

  const renderItem = useCallback(
    ({item, index}) => (
      <View
        style={{
          backgroundColor: '#fff',
          padding: 5,
        }}>
        <ProductListItem
          style={{flex: 1}}
          data={item}
          onPress={() => {
            AppModule.reportClick('3', '218', {
              CategoryId: detail.category_id,
              CateStation: detail.cate_station,
              ProductId: detail.product_id || detail.bag_id,
              ProductCat: categoryDetailPath.getData().ProductCat,
            });
            if (item.product_category === 1) {
              //1 --福袋，2--直购，3--大转盘

              MysteryRouter.push({
                productId: item.product_id || item.bag_id,
              });
            } else if (
              item.product_category === 2 ||
              item.product_category === 4
            ) {
              ProductRouter.push({
                productId: item.product_id || item.bag_id,
              });
            }
          }}
        />
      </View>
    ),
    [
      MysteryRouter,
      ProductRouter,
      detail.bag_id,
      detail.cate_station,
      detail.category_id,
      detail.product_id,
    ],
  );

  const FooterView = useMemo(() => {
    return (
      <>
        {isLoadComplete ? (
          dataList.length === 0 ? null : (
            <EndLine />
          )
        ) : (
          <View style={{backgroundColor: '#fff', flex: 1}}>
            <TouchableOpacity
              onPress={onLoadMore}
              activeOpacity={0.6}
              style={{
                alignSelf: 'center',
                alignItems: 'center',
                marginTop: 40 * px,
                marginBottom: 40 * px,
              }}>
              <Text style={{fontSize: 40 * px, color: '#8A8A8A'}}>
                View more
              </Text>
              <Image
                style={{width: 49 * px, height: 33 * px, marginTop: 20 * px}}
                source={require('../../assets/icon_down_more.png')}
              />
            </TouchableOpacity>
          </View>
        )}
        <SPCComponent />
      </>
    );
  }, [dataList.length, isLoadComplete, onLoadMore]);

  const MoreHeader = useMemo(() => {
    return (
      <>
        {headerView}
        {dataList && dataList.length > 0 && (
          <RecommendListHeader>Recommend for you</RecommendListHeader>
        )}
      </>
    );
  }, [dataList, headerView]);

  return (
    <FlatList
      columnWrapperStyle={{
        backgroundColor: '#fff',
      }}
      onScroll={({nativeEvent}) => {
        if (onScroll) {
          onScroll(nativeEvent.contentOffset.y);
        }
      }}
      onScrollEndDrag={({nativeEvent}) => {
        if (onScroll) {
          onScroll(nativeEvent.contentOffset.y);
        }
      }}
      ListHeaderComponent={MoreHeader}
      ListFooterComponent={FooterView}
      data={dataList}
      numColumns={2}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
    />
  );
}

GoodsRecommendList.prototype = {
  detail: PropTypes.object.isRequired,
  onScroll: PropTypes.func,
  headerView: PropTypes.element.isRequired,
  goodsType: PropTypes.number.isRequired,
};

const EndLine = () => {
  return (
    <View
      style={{
        height: 208 * px,
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={{height: 1, backgroundColor: '#9C9C9C', width: 350 * px}} />
      <Text
        style={{
          fontSize: 41 * px,
          color: '#4E4E4E',
          marginHorizontal: 20 * px,
        }}>
        END
      </Text>
      <View style={{height: 1, backgroundColor: '#9C9C9C', width: 350 * px}} />
    </View>
  );
};
