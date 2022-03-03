import {FROM_SEARCH, px} from '../../constants/constants';
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import SearchRankingCard from './SearchRankingCard';
import Api from '../../Api';
import {useSelector} from 'react-redux';
import {reportData} from '../../constants/reportData';
import {navigationRef} from '../../utils/refs';
import {useConstant} from '../../utils/hooks';
import AppModule from '../../../AppModule';
import {MysteryRoute, ProductRoute} from '@src/routes';

export default function SearchRankingHorizontal({navigation}) {
  const [dataList, setDataList] = useState([]);
  const {token} = useSelector((state) => state.deprecatedPersist);
  let scrollOffset = useRef(0);
  const ViewAbilityConfig = {
    itemVisiblePercentThreshold: 100,
  };
  const fetchSearchList = useCallback(() => {
    Api.searchRankList(1, 10, token).then((res) => {
      if (res.error) {
        setDataList([]);
        return;
      }
      let list = res.data.list || [];
      setDataList(list);
    });
  }, [token]);

  useEffect(() => {
    fetchSearchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ProductRouter = ProductRoute.useRouteLink();
  const MysteryRouter = MysteryRoute.useRouteLink();

  const onPress = ({item, index}) => {
    AppModule.reportShow('16', '245', {
      ProductId: item.product_id || item.bag_id,
      PageStation: 1,
      ProdStation: index,
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
  const viewMore = () => {
    AppModule.reportShow('16', '246');
    navigation.navigate('SearchRanking');
  };
  const footerView = () => {
    return (
      <TouchableWithoutFeedback onPress={viewMore}>
        <View
          style={{
            backgroundColor: 'white',
            width: 360 * px,
            height: 700 * px,
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 350 * px,
              height: 350 * px,
              backgroundColor: '#eee',
            }}>
            <Image
              source={require('../../assets/more.png')}
              resizeMode={'contain'}
              style={{
                width: 104 * px,
                height: 104 * px,
              }}
            />
            <Text
              numberOfLines={1}
              style={{
                color: '#2A9A9A',
                fontSize: 50 * px,
                marginTop: 20 * px,
              }}>
              View All
            </Text>
          </View>

          <Text
            numberOfLines={2}
            style={{
              color: 'black',
              marginRight: 10,
              marginTop: 20 * px,
              fontSize: 46 * px,
              fontWeight: 'bold',
            }}>
            Click to view more
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const viewableItemsChanged = useConstant(() => ({viewableItems, changed}) => {
    viewableItems.forEach((item) => {
      AppModule.reportShow('16', '244', {
        ProductId: item.item.product_id || item.item.bag_id,
        PageStation: 1,
        ProdStation: item.index + 1,
        ShowType: scrollOffset.current !== 0 ? 1 : 0,
      });
    });
  });
  return (
    dataList.length > 0 && (
      <View
        style={{
          marginTop: 80 * px,
          marginLeft: 15 * px,
          marginRight: 15 * px,
          paddingHorizontal: 20 * px,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: 100 * px,
          }}>
          <Text style={{fontSize: 44 * px, fontWeight: 'bold', flex: 1}}>
            Search Ranking
          </Text>
          <TouchableOpacity onPress={viewMore} style={{paddingLeft: 40 * px}}>
            <Text
              style={{
                fontSize: 34 * px,
                textDecorationLine: 'underline',
                textDecorationStyle: 'solid',
                textDecorationColor: '#000',
              }}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          keyboardShouldPersistTaps={'handle'}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={ViewAbilityConfig}
          onScroll={({nativeEvent}) => {
            scrollOffset.current = nativeEvent.contentOffset.x;
          }}
          horizontal={true}
          data={dataList}
          renderItem={({item, index, separators}) => {
            return (
              <SearchRankingCard
                data={item}
                index={index}
                key={index + item.product_id}
                onPress={() => onPress({item, index})}
              />
            );
          }}
          ListFooterComponent={footerView}
          keyExtractor={(item, index) =>
            (item.product_id || item.bag_id).toString() + index
          }
        />
      </View>
    )
  );
}
