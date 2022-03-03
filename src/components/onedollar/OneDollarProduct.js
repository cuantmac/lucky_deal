import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/core';
import AuctionPlaceholder from '../auctionProduct/AuctionPlaceholder';
import GoodsImageWithTitleInfo from '../productdetail/GoodsImageWithTitleInfo';
import GoodsWebDescription from '../productdetail/GoodsWebDescription';
import OneDollarBuyNow from './OneDollarBuyNow';
import {px} from '../../constants/constants';
import AppModule from '../../../AppModule';
import {updateBackMessageCount} from '../../redux/persistReducers';
import Api from '../../Api';
import DetailHeaderButton from '../common/DetailHeaderButton';
import SkuInfo from './SkuInfo';
import CouponDetailCard from '../me/coupon/CouponDetailCard';
import ProductReview from '../productdetail/ProductReview';
import {ShippingInfo} from '../productdetail/GoodsDetailComponent';
import GoodsRecommendList from '../productdetail/GoodsRecommendList';
import {categoryDetailPath} from '../../analysis/report';
import {useMarketCouponCheck} from '../home/CheckCouponDialog';
import {APPLY_COUPON_PAGE_ENUM} from '../../constants/enum';
import {DiscountInfo} from '../productdetail/DiscountInfo';
export default function OneDollarProduct({route, navigation}) {
  const {
    product_id,
    category_id,
    cate_station,
    way,
    path,
    product_from_page,
    RecommendType,
  } = route.params;
  useMarketCouponCheck(APPLY_COUPON_PAGE_ENUM.PRODUCT_DETAIL);
  const dispatch = useDispatch();
  const focus = useIsFocused();
  const {token, feedBackList} = useSelector((state) => state.deprecatedPersist);
  const [goodsDetail, setGoodsDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const headerRef = useRef();
  const [newsCoupon, setCoupon] = useState();
  const timer = useRef();
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
        ProductId: product_id,
        ProductFrom: path,
      });
    }
  }, [cate_station, category_id, focus, path, product_id]);

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
      ProductId: product_id,
      ProductFrom: path,
      FromPage: product_from_page,
      RecommendType: RecommendType,
      ProductCat: categoryDetailPath.getData().ProductCat,
    });
  }, [
    RecommendType,
    cate_station,
    category_id,
    path,
    product_from_page,
    product_id,
  ]);

  const getData = useCallback(() => {
    Api.onlyOneDetail(product_id).then((res) => {
      if (res.code !== 0) {
        return;
      }
      let detail = {
        ...res.data,
        category_id: category_id,
        cate_station: cate_station,
        product_from_page: product_from_page,
        goods_type: 0,
        RecommendType: RecommendType,
      };
      AppModule.log('Product detail:', JSON.stringify(detail));
      setGoodsDetail(detail);
      let coupon = detail?.coupon_info?.length > 0 && detail?.coupon_info[0];
      setCoupon(coupon);
      setLoading(false);
    });
  }, [product_id, category_id, cate_station, product_from_page, RecommendType]);

  useEffect(() => {
    if (!focus) {
      return;
    }
    getData();

    return () => {
      setLoading(false);
    };
  }, [focus, getData, product_id, token]);

  const headerView = useMemo(() => {
    return (
      <View>
        <GoodsImageWithTitleInfo
          goodsDetail={goodsDetail}
          height={998 * px}
          way={way}
          is_can_first_order_discounts={
            goodsDetail?.is_can_first_order_discounts
          }
          newsCoupon={newsCoupon}
        />
        {goodsDetail?.product_sku ? (
          <SkuInfo
            productSkus={goodsDetail.product_sku}
            data={goodsDetail}
            way={way}
            path={path}
            from={product_from_page}
          />
        ) : null}
        <DiscountInfo
          productId={product_id}
          freeShipping={goodsDetail?.free_shipping}
        />
        <CouponDetailCard product_type={goodsDetail?.product_type} />
        <ProductReview
          detail={goodsDetail}
          navigation={navigation}
          goodsType={0}
        />
        <GoodsWebDescription detail={goodsDetail} />
        {goodsDetail.logistics_channel && (
          <ShippingInfo
            shippingTime={goodsDetail.logistics_channel.send_time}
            preparingTime={goodsDetail.logistics_channel.preparing_time}
          />
        )}
      </View>
    );
  }, [
    goodsDetail,
    way,
    newsCoupon,
    path,
    product_from_page,
    product_id,
    navigation,
  ]);

  return loading ? (
    <AuctionPlaceholder />
  ) : (
    <View style={[styles.screenStyle]}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <View
        style={{
          paddingBottom: 260 * px,
          marginTop: StatusBar.currentHeight || 0,
        }}>
        <GoodsRecommendList
          detail={goodsDetail}
          onScroll={(offset) => {
            headerRef.current?.setScrollY(offset);
          }}
          navigation={navigation}
          headerView={headerView}
          goodsType={0}
        />
      </View>
      <OneDollarBuyNow path={path} goodsDetail={goodsDetail} />
      <DetailHeaderButton ref={headerRef} data={goodsDetail} way={way} />
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
