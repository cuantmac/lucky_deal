import {Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {px, PATH_DEEPLINK} from '../../constants/constants';
import {useSelector} from 'react-redux';
import {PRIMARY} from '../../constants/colors';
import BottomSheet from '../dialog/BottomSheet';
import {navigationRef} from '../../utils/refs';
import AppModule from '../../../AppModule';
import Utils from '../../utils/Utils';
import MysterySkuSelector from './MysterySkuSelector';
import QuantityView from '../onedollar/QuantityView';
import {Timer} from '../common/Timer';
import GoodsBottomButtons from '../productdetail/GoodsBottomButtons';
import {categoryDetailPath} from '../../analysis/report';

export default function BuyNow({path, way, goodsDetail, newsCoupon}) {
  const now = useSelector((state) => state.memory.now);
  const [paying, setPaying] = useState(false);
  const {token} = useSelector((state) => state.deprecatedPersist);

  const onAddToBag = () => {
    onPay(1);
  };
  const onPay = (actionType = 0) => {
    AppModule.reportClick('3', '27', {
      ProductId: goodsDetail.bag_id || goodsDetail.product_id,
      CategoryId: goodsDetail.category_id,
      CateStation: goodsDetail.cate_station,
      FromPage: goodsDetail.product_from_page,
      RecommendType: goodsDetail.RecommendType,
      ProductCat: categoryDetailPath.getData().ProductCat,
    });
    if (!token) {
      navigationRef.current?.navigate('FBLogin');
      return;
    }
    if (goodsDetail.begin_time > now) {
      Utils.toastFun('Please wait, coming soon');
      return;
    }
    setPaying(true);
    if (goodsDetail?.sku_info?.length > 0) {
      AppModule.reportClick('3', '26', {
        ProductId: goodsDetail.bag_id || goodsDetail.product_id,
        CategoryId: goodsDetail.category_id,
        CateStation: goodsDetail.cate_station,
        ProductCat: categoryDetailPath.getData().ProductCat,
      });
      BottomSheet.showLayout(
        <MysterySkuSelector
          detail={goodsDetail}
          skuList={goodsDetail.sku_info}
          showQuantity={true}
          showItem={true}
          path={path}
          way={way}
          from={'mystery'}
          nextAction={actionType}
        />,
      );
    } else {
      AppModule.reportClick('3', '26', {
        CategoryId: goodsDetail.category_id,
        CateStation: goodsDetail.cate_station,
        ProductId: goodsDetail.bag_id || goodsDetail.product_id,
        ProductCat: categoryDetailPath.getData().ProductCat,
      });
      BottomSheet.showLayout(
        <QuantityView
          detail={goodsDetail}
          showQuantity={true}
          from={'mystery'}
          path={path}
          nextAction={actionType}
        />,
      );
    }
    setPaying(false);
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4 * px,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 4,
        paddingVertical: 50 * px,
      }}>
      <Timer targetTime={goodsDetail.begin_time}>
        {(time, hasEnd) => {
          return !hasEnd ? (
            <TouchableOpacity
              onPress={() => {
                if (goodsDetail.begin_time > now) {
                  Utils.toastFun('Please wait, coming soon');
                }
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 70 * px,
                  fontWeight: '600',
                  height: 136 * px,
                  lineHeight: 136 * px,
                  textAlign: 'center',
                  backgroundColor: PRIMARY,
                  borderRadius: 20 * px,
                  marginHorizontal: 30 * px,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                Coming in: {time}
              </Text>
            </TouchableOpacity>
          ) : (
            <GoodsBottomButtons
              goodsDetail={goodsDetail}
              leftOnPress={onAddToBag}
              rightOnPress={() => onPay(2)}
              buttonContent={`Buy Now ($${goodsDetail.mark_price / 100})`}
            />
          );
        }}
      </Timer>
    </View>
  );
}
// goodsDetail.mark_price - couponAmount / 100
