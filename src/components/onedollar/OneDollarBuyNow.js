import {View, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {px} from '../../constants/constants';
import BottomSheet from '../dialog/BottomSheet';
import {navigationRef} from '../../utils/refs';
import AppModule from '../../../AppModule';
import Utils from '../../utils/Utils';
import SkuSelector from '../common/SkuSelector';
import QuantityView from './QuantityView';
import VipProductBuy from './VipProductBuy';
import CommonBuy from './CommonBuy';
import {useShallowEqualSelector} from '../../utils/hooks';
import {useDispatch} from 'react-redux';

import {
  branchMarketPath,
  branchProductDetailBuyNowClick,
  branchProductDetailBuyNowShow,
  categoryDetailPath,
} from '../../analysis/report';

export default function OneDollarBuyNow({path, goodsDetail}) {
  const [paying, setPaying] = useState(false);
  const dispatch = useDispatch();
  const branchData = branchMarketPath.getData();
  const {token, vip, now, profile} = useShallowEqualSelector((state) => ({
    ...state.deprecatedPersist,
    now: state.memory.now,
  }));
  useEffect(() => {
    branchData.H5PageID &&
      branchProductDetailBuyNowShow.setDataAndReport({
        H5PageID: branchData.H5PageID,
        H5ProductID: branchData.H5ProductID,
      });
  }, [branchData]);

  useEffect(() => {
    if (
      profile?.is_vip &&
      !goodsDetail.product_status &&
      goodsDetail.begin_time > now
    ) {
      AppModule.reportShow('3', '258', {
        ProductId: goodsDetail.product_id,
        CategoryId: goodsDetail.category_id,
        CateStation: goodsDetail.cate_station,
        FromPage: goodsDetail.product_from_page,
        RecommendType: goodsDetail.RecommendType,
      });
    }
  }, [
    goodsDetail.RecommendType,
    goodsDetail.begin_time,
    goodsDetail.cate_station,
    goodsDetail.category_id,
    goodsDetail.product_from_page,
    goodsDetail.product_id,
    goodsDetail.product_status,
    now,
    profile,
  ]);

  /**
   * 购买商品按钮点击弹出SKU弹窗。
   * @param buttonType 0-无需购买会员按钮，1-需要购买会员
   */
  const onPay = async (buttonType, action) => {
    branchData.H5PageID &&
      branchProductDetailBuyNowClick.setDataAndReport({
        H5PageID: branchData.H5PageID,
        H5ProductID: branchData.H5ProductID,
      });

    if (buttonType === 1 || buttonType === 0) {
      AppModule.reportClick('3', '259', {
        ProductId: goodsDetail.product_id,
        CategoryId: goodsDetail.category_id,
        CateStation: goodsDetail.cate_station,
        FromPage: goodsDetail.product_from_page,
        RecommendType: goodsDetail.RecommendType,
      });
    } else if (buttonType === 2) {
      AppModule.reportClick('3', '260', {
        ProductId: goodsDetail.product_id,
        CategoryId: goodsDetail.category_id,
        CateStation: goodsDetail.cate_station,
        FromPage: goodsDetail.product_from_page,
        RecommendType: goodsDetail.RecommendType,
        ProductCat: categoryDetailPath.getData().ProductCat,
      });
    }
    if (action === 'addToBag') {
      AppModule.reportClick('3', '297', {
        CategoryId: goodsDetail.category_id,
        CateStation: goodsDetail.cate_station,
        ProductId: goodsDetail.product_id,
        FromPage: goodsDetail.product_from_page,
        RecommendType: goodsDetail.RecommendType,
        ProductCat: categoryDetailPath.getData().ProductCat,
      });
    } else {
      AppModule.reportClick('3', '27', {
        ProductId: goodsDetail.product_id,
        CategoryId: goodsDetail.category_id,
        CateStation: goodsDetail.cate_station,
        FromPage: goodsDetail.product_from_page,
        RecommendType: goodsDetail.RecommendType,
        ProductCat: categoryDetailPath.getData().ProductCat,
      });
    }

    if (!token) {
      navigationRef.current?.navigate('FBLogin');
      return;
    }
    if (goodsDetail.begin_time > now) {
      Utils.toastFun('Please wait, coming soon');
      return;
    }
    setPaying(true);

    if (goodsDetail.product_sku.sku && goodsDetail.product_sku.sku.length) {
      if (action === 'addToBag') {
        AppModule.reportClick('3', '298', {
          CategoryId: goodsDetail.category_id,
          CateStation: goodsDetail.cate_station,
          ProductId: goodsDetail.product_id,
          FromPage: goodsDetail.product_from_page,
          RecommendType: goodsDetail.RecommendType,
          ProductCat: categoryDetailPath.getData().ProductCat,
        });
      } else {
        AppModule.reportClick('3', '26', {
          ProductId: goodsDetail.product_id,
          CategoryId: goodsDetail.category_id,
          CateStation: goodsDetail.cate_station,
          ProductCat: categoryDetailPath.getData().ProductCat,
        });
      }
      BottomSheet.showLayout(
        <SkuSelector
          detail={goodsDetail}
          skuList={goodsDetail.product_sku}
          showQuantity={true}
          showItem={false}
          from={'offers'}
          path={path}
          nextAction={action === 'addToBag' ? 1 : action === 'payNow' ? 2 : 0}
        />,
      );
    } else {
      BottomSheet.showLayout(
        <QuantityView
          detail={goodsDetail}
          showQuantity={true}
          from={'offers'}
          path={path}
          nextAction={action === 'addToBag' ? 1 : action === 'payNow' ? 2 : 0}
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
      }}>
      {paying ? (
        <ActivityIndicator
          color={'red'}
          style={{alignSelf: 'center', paddingVertical: 50 * px}}
        />
      ) : goodsDetail.product_type === 4 ? (
        <VipProductBuy
          paying={paying}
          onPay={(type, action) => {
            onPay(type, action);
          }}
          goodsDetail={goodsDetail}
        />
      ) : (
        <CommonBuy
          paying={paying}
          onPay={(type, action) => {
            onPay(type, action);
          }}
          goodsDetail={goodsDetail}
        />
      )}
    </View>
  );
}
