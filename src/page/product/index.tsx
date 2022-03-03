import {
  BagProductDetailResponse,
  OfferProductDetailResponse,
} from '@luckydeal/api-common';
import {CommonApi} from '@src/apis';
import {APPLY_COUPON_PAGE_ENUM} from '@src/constants/enum';
import {Message} from '@src/helper/message';
import {useNavigationParams} from '@src/hooks/useNavigationParams';
import {ReduxRootState} from '@src/redux';
import {ProductRouteParams, requireAuth} from '@src/routes';
import {useLoading} from '@src/utils/hooks';
import {AnchorProvider} from '@src/widgets/anchor';
import {TopAnchor, TopAnchorRef} from '@src/widgets/anchor/topAnchor';
import {MarketCouponModal} from '@src/widgets/dialogs/makertCouponDialog';
import {PageStatusControl} from '@src/widgets/pageStatusControl';
import {CouponInfo} from '@src/widgets/productDetail/couponInfo';
import {ProductBanner} from '@src/widgets/productDetail/productBanner';
import {ProductBottomButton} from '@src/widgets/productDetail/productBottonButton';
import {ProductDescription} from '@src/widgets/productDetail/productDescription';
import {ProductDetailFixedTop} from '@src/widgets/productDetail/productDetailFixedTop';
import {
  ProductDetailHeader,
  ProductDetailHeaderRef,
} from '@src/widgets/productDetail/productDetailHeader';
import {ProductInfo} from '@src/widgets/productDetail/productInfo';
import {ProductPolicy} from '@src/widgets/productDetail/productPolicy';
import {ProductReview} from '@src/widgets/productDetail/productReview';
import {ShippingInfo} from '@src/widgets/productDetail/shippingInfo';
import {
  OnSkuChangePrams,
  ProductStatusProvider,
  SkuSelectModal,
  SkuSelectModalRef,
} from '@src/widgets/productDetail/skuSelect/skuSelectModal';
import {SkuSimpleShow} from '@src/widgets/productDetail/skuSelect/skuSimpleShow';
import React, {FC, useCallback, useEffect, useState, useRef} from 'react';
import {LayoutRectangle, ScrollView, StatusBar} from 'react-native';
import {useSelector, shallowEqual} from 'react-redux';

interface ProductProps {
  isMystery?: boolean;
}

const Product: FC<ProductProps> = ({isMystery}) => {
  const {token} = useSelector(
    (state: ReduxRootState) => ({
      token: state.persist.persistAuth.token,
    }),
    shallowEqual,
  );
  const params = useNavigationParams<ProductRouteParams>();
  const [detail, setDetail] = useState<
    OfferProductDetailResponse | BagProductDetailResponse
  >();
  const [loading, withLoading] = useLoading(true);
  const skuModalRef = useRef<SkuSelectModalRef>(null);
  const [skuParams, setSkuParams] = useState<OnSkuChangePrams>();
  const [scrollLayout, setScrollLayout] = useState<LayoutRectangle>();
  const headerRef = useRef<ProductDetailHeaderRef>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const topAnchorRef = useRef<TopAnchorRef>(null);

  const fetchDetailData = useCallback<() => Promise<unknown>>(() => {
    if (isMystery) {
      return CommonApi.luckyBagDetailUsingPOST({
        bag_id: +params.productId,
      }).then((res) => {
        setDetail(res.data);
        return res;
      });
    }
    return CommonApi.luckyOfferDetailUsingPOST({
      product_id: +params.productId,
    }).then((res) => {
      setDetail(res.data);
      return res;
    });
  }, [isMystery, params.productId]);

  const getDetailData = useCallback(
    (flag?: boolean) => {
      setTimeout(() => {
        flag && setDetail(undefined);
        withLoading(fetchDetailData()).catch((e) => {
          Message.toast(e);
        });
      });
    },
    [fetchDetailData, withLoading],
  );

  const handleOpenSku = useCallback(() => {
    skuModalRef.current?.show();
  }, []);

  const handleAdd2CartSku = useCallback(() => {
    skuModalRef.current?.show({
      showAdd2Bag: true,
    });
  }, []);

  const handleBuyNowSku = useCallback(() => {
    skuModalRef.current?.show({
      showBuyNow: true,
    });
  }, []);

  const handleLovePress = useCallback(() => {
    requireAuth().then(() => {
      Message.loading();
      CommonApi.likeProductUsingPOST({
        product_id: +params.productId,
        product_type: detail?.product_type || 0,
      })
        .then(() => {
          return fetchDetailData();
        })
        .then(() => {
          Message.hide();
        })
        .catch((e) => {
          Message.toast(e);
        });
    });
  }, [detail, fetchDetailData, params.productId]);

  const preProductId = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (
      preProductId.current !== undefined &&
      preProductId.current !== +params.productId
    ) {
      getDetailData(true);
      return;
    }
    getDetailData();
    preProductId.current = +params.productId;
  }, [getDetailData, params.productId]);

  useEffect(() => {
    if (token && detail) {
      CommonApi.userBrowseDataUsingPOST({
        product_info: [
          {product_id: +params.productId, product_type: detail.product_type},
        ],
      });
    }
  }, [detail, params.productId, token]);

  return (
    <ProductStatusProvider>
      <StatusBar barStyle="dark-content" backgroundColor={'white'} />
      <AnchorProvider key={params.productId}>
        <PageStatusControl
          onRefresh={getDetailData}
          showEmpty
          loading={loading}
          hasData={!!detail}>
          {detail && (
            <>
              <ScrollView
                ref={scrollViewRef}
                scrollEventThrottle={16}
                onLayout={({nativeEvent: {layout}}) => {
                  setScrollLayout(layout);
                }}
                onScroll={(scrollParams) => {
                  headerRef.current &&
                    headerRef.current.handleOnScroll(scrollParams);
                  topAnchorRef.current?.scroll(scrollParams);
                }}>
                <ProductBanner data={detail} />
                <ProductInfo
                  price={skuParams?.price}
                  data={detail}
                  onLovePress={handleLovePress}
                />
                <SkuSimpleShow
                  skuParams={skuParams}
                  data={detail}
                  onPress={handleOpenSku}
                />
                <CouponInfo productId={+params.productId} />
                <ShippingInfo data={detail} />
                <ProductDescription data={detail} />
                <ProductReview data={detail} />
                <ProductPolicy />
              </ScrollView>
              <ProductBottomButton
                onAdd2BagPress={handleAdd2CartSku}
                onBuyNowPress={handleBuyNowSku}
              />
              <ProductDetailFixedTop>
                <ProductDetailHeader
                  data={detail}
                  ref={headerRef}
                  scrollRef={scrollViewRef}
                  scrollLayout={scrollLayout}
                  offset={90}
                />
              </ProductDetailFixedTop>
            </>
          )}
        </PageStatusControl>
        <SkuSelectModal
          onSkuChange={setSkuParams}
          data={detail}
          ref={skuModalRef}
        />
        <MarketCouponModal page={APPLY_COUPON_PAGE_ENUM.PRODUCT_DETAIL} />
        <TopAnchor ref={topAnchorRef} scrollRef={scrollViewRef} />
      </AnchorProvider>
    </ProductStatusProvider>
  );
};

export default Product;
