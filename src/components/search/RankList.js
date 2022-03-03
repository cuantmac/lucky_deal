import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import Api from '../../Api';
import Empty from '../common/Empty';
import {PRIMARY} from '../../constants/colors';
import RankCard from './RankCard';
import {FROM_HOME, FROM_SEARCH, px} from '../../constants/constants';
import {navigationRef} from '../../utils/refs';
import {reportData} from '../../constants/reportData';
import AppModule from '../../../AppModule';
import {useConstant, useShallowEqualSelector} from '../../utils/hooks';
import {MysteryRoute, ProductRoute} from '@src/routes';

export default function ({navigation}) {
  const {token} = useShallowEqualSelector((state) => ({
    token: state.deprecatedPersist.token,
  }));
  const [rankList, setRankList] = useState([]);
  const [isRefreshing, setRefreshing] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [isLoadComplete, setLoadComplete] = useState(false);
  const pageRef = useRef(1);
  const flatListRef = useRef();
  const showTypeRef = useRef(0);
  const ViewAbilityConfig = {
    itemVisiblePercentThreshold: 100,
  };
  const viewableItemsChanged = useConstant(() => ({viewableItems, changed}) => {
    viewableItems.forEach((item) => {
      AppModule.reportShow('16', '248', {
        ProductId: item.item.product_id || item.item.bag_id,
        PageStation: pageRef.current,
        ProdStation: item.index + 1,
        ShowType: showTypeRef.current,
      });
    });
  });

  const scrollToTop = () => {
    AppModule.reportClick('16', '250');
    flatListRef.current?.scrollToOffset({offset: 0});
  };

  const fetchDataList = useCallback(() => {
    let page = pageRef.current;
    Api.searchRankList(page, 20, token).then((res) => {
      let list = res.data?.list || [];
      if (list.length < 10) {
        setLoadComplete(true);
      }
      if (page > 1) {
        setRankList((old) => old.concat(list));
      } else {
        setRankList(list);
      }
      setRefreshing(false);
      setLoading(false);
    });
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    pageRef.current = 1;
    setLoadComplete(false);
    fetchDataList();
  }, [fetchDataList]);

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = () => {
    if (isLoading || isLoadComplete) {
      return;
    }
    showTypeRef.current = 2;
    setLoading(true);
    pageRef.current = pageRef.current + 1;
    fetchDataList();
  };

  const ProductRouter = ProductRoute.useRouteLink();
  const MysteryRouter = MysteryRoute.useRouteLink();

  if (rankList.length === 0) {
    return isRefreshing ? (
      <ActivityIndicator color={PRIMARY} style={{flex: 1}} />
    ) : (
      <Empty
        image={require('../../assets/empty.png')}
        title={'Nothing at all'}
      />
    );
  }
  const onPress = ({item, index}) => {
    AppModule.reportClick('16', '249', {
      ProductId: item.product_id || item.bag_id,
      PageStation: pageRef.current,
      ProdStation: index + 1,
      CategoryId: reportData.searchRankCategoryId,
    });
    if (item.product_category === 1) {
      // 福袋商品
      MysteryRouter.navigate({
        productId: item.bag_id || item.product_id,
      });
    } else if (item.product_category === 2 || item.product_category === 4) {
      ProductRouter.navigate({
        productId: item.bag_id || item.product_id,
      });
    }
  };
  const renderItem = ({item, index}) => (
    <RankCard
      data={item}
      index={index}
      onPress={() => onPress({item, index})}
    />
  );

  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <FlatList
        ref={flatListRef}
        style={{paddingTop: 10 * px}}
        data={rankList}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={() => {
          if (isLoadComplete) {
            return <View style={{height: 20 * px}} />;
          }
          return <ActivityIndicator color={PRIMARY} style={{padding: 10}} />;
        }}
        onEndReachedThreshold={0.4}
        onEndReached={loadMore}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={ViewAbilityConfig}
        onScroll={({nativeEvent}) => {
          showTypeRef.current = 1;
        }}
      />
      {rankList && rankList.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={scrollToTop}
          style={{
            position: 'absolute',
            right: 40 * px,
            bottom: 200 * px,
            width: 150 * px,
            height: 150 * px,
          }}>
          <Image
            style={{width: 150 * px, height: 150 * px}}
            resizeMode={'contain'}
            source={require('../../assets/search_up_arrow.png')}
          />
        </TouchableOpacity>
      )}
    </>
  );
}
