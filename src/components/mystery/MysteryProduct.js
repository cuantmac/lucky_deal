import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/core';
import AuctionPlaceholder from '../auctionProduct/AuctionPlaceholder';
import GoodsImageWithTitleInfo from '../productdetail/GoodsImageWithTitleInfo';
import BuyNow from './BuyNow';
import {px} from '../../constants/constants';
import AppModule from '../../../AppModule';
import {updateBackMessageCount} from '../../redux/persistReducers';
import Api from '../../Api';
import DetailHeaderButton from '../common/DetailHeaderButton';
import MysterySkuInfo from './MysterySkuInfo';
import GoodsRecommendList from '../productdetail/GoodsRecommendList';
import GoodsWebDescription from '../productdetail/GoodsWebDescription';
import {ShippingInfo} from '../productdetail/GoodsDetailComponent';
import ProductReview from '../productdetail/ProductReview';
import {categoryDetailPath} from '../../analysis/report';
import {useMarketCouponCheck} from '../home/CheckCouponDialog';
import {APPLY_COUPON_PAGE_ENUM} from '../../constants/enum';
export default function MysteryProduct({route, navigation}) {
  useMarketCouponCheck(APPLY_COUPON_PAGE_ENUM.PRODUCT_DETAIL);
  const dispatch = useDispatch();
  const focus = useIsFocused();
  const headerRef = useRef();
  const {token, feedBackList} = useSelector((state) => state.deprecatedPersist);
  const [loading, setLoading] = useState(true);
  const [mysteryDetail, setMysteryDetail] = useState({});
  const timer = useRef();
  const {
    bag_id,
    category_id,
    cate_station,
    way,
    path,
    product_from_page,
    RecommendType,
  } = route.params;
  const newsCoupon =
    mysteryDetail?.coupon_info?.length > 0 && mysteryDetail?.coupon_info[0];

  useEffect(() => {
    let time = null;
    if (focus) {
      time = new Date().getTime();
    } else {
      let diff = new Date().getTime() - time;
      AppModule.reportClose('3', '234', {
        Viewtime: diff,
        CategoryId: category_id,
        CateStation: cate_station,
        ProductId: bag_id,
        ProductFrom: path,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);
  useEffect(() => {
    if (token && focus) {
      if (timer.current) {
        clearInterval(timer.current);
      }
      timer.current = setInterval(() => {
        dispatch(updateBackMessageCount(feedBackList.length));
      }, 60 * 1000);
    } else {
      clearInterval(timer.current);
    }

    return () => {
      clearInterval(timer.current);
    };
  }, [token, dispatch, feedBackList.length, focus]);

  useEffect(() => {
    AppModule.reportShow('3', '18', {
      CategoryId: category_id,
      CateStation: cate_station,
      ProductId: bag_id,
      ProductFrom: path,
      FromPage: product_from_page,
      RecommendType: RecommendType,
      ProductCat: categoryDetailPath.getData().ProductCat,
    });
  }, [
    RecommendType,
    bag_id,
    cate_station,
    category_id,
    path,
    product_from_page,
  ]);

  const getData = useCallback(() => {
    Api.luckyBagDetail(bag_id).then((res) => {
      let detail = {
        ...res.data,
        category_id: category_id,
        cate_station: cate_station,
        product_from_page: product_from_page,
        goods_type: 1,
        RecommendType: RecommendType,
      };
      setMysteryDetail(detail);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cate_station, category_id, bag_id, dispatch]);

  useEffect(() => {
    if (!focus) {
      return;
    }
    getData();
    return () => {
      setLoading(false);
    };
  }, [focus, getData]);
  const HeaderView = useMemo(() => {
    return (
      <View>
        <GoodsImageWithTitleInfo
          height={998 * px}
          way={way}
          goodsDetail={mysteryDetail}
          newsCoupon={newsCoupon}
        />
        {mysteryDetail.sku_info?.length > 0 ? (
          <MysterySkuInfo
            skuList={mysteryDetail.sku_info}
            data={mysteryDetail}
            from={'mystery'}
            path={path}
            way={way}
          />
        ) : null}
        <ProductReview
          navigation={navigation}
          detail={mysteryDetail}
          goodsType={1}
        />
        <GoodsWebDescription detail={mysteryDetail} />
        {mysteryDetail.logistics_channel && (
          <ShippingInfo
            shippingTime={mysteryDetail.logistics_channel.send_time}
            preparingTime={mysteryDetail.logistics_channel.preparing_time}
          />
        )}
      </View>
    );
  }, [mysteryDetail, navigation, newsCoupon, path, way]);

  return loading ? (
    <>
      <AuctionPlaceholder />
    </>
  ) : (
    <View style={[styles.screenStyle]}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <View
        style={{
          paddingBottom: 236 * px,
          marginTop: StatusBar.currentHeight || 0,
        }}>
        <GoodsRecommendList
          detail={mysteryDetail}
          onScroll={(offset) => {
            headerRef.current?.setScrollY(offset);
          }}
          navigation={navigation}
          headerView={HeaderView}
          goodsType={1}
        />
      </View>
      <BuyNow
        path={path}
        way={way}
        goodsDetail={mysteryDetail}
        newsCoupon={newsCoupon}
      />
      <DetailHeaderButton data={mysteryDetail} way={way} ref={headerRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
});
