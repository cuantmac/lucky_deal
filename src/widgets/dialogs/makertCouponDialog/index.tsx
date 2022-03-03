import {TouchableOpacity, View, ImageBackground, Text} from 'react-native';
import React, {useCallback, useState, FC} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {StandardCouponCard} from '@src/widgets/coupons/Coupons';
import {CouponMarketConfigResponse} from '@luckydeal/api-common';
import {Message} from '@src/helper/message';
import {CommonApi} from '@src/apis';
import {ReduxRootState} from '@src/redux';
import {useModal} from '@src/widgets/modal/modal';
import {useSelector, shallowEqual} from 'react-redux';
import {APPLY_COUPON_PAGE_ENUM} from '@src/constants/enum';
import {useFocusEffect} from '@react-navigation/core';
import {GlideImage} from '@src/widgets/glideImage';
import {CouponCenterRoute} from '@src/routes';
import {createStyleSheet} from '@src/helper/helper';
import {BUTTON_TYPE_ENUM, StandardButton} from '@src/widgets/button';

interface MarketCouponModalProps {
  page: APPLY_COUPON_PAGE_ENUM;
}

/**
 * 活动优惠券领取
 */
export const MarketCouponModal: FC<MarketCouponModalProps> = ({page}) => {
  const {token} = useSelector(
    ({persist}: ReduxRootState) => ({
      token: persist.persistAuth.token,
    }),
    shallowEqual,
  );
  const CouponCenterRouter = CouponCenterRoute.useRouteLink();

  const [marketCoupon, setMarketCoupon] = useState<
    CouponMarketConfigResponse
  >();
  const [
    MarketCouponDialogModal,
    setMarketCouponDialogModalVisible,
  ] = useModal();

  // 检查活动优惠券
  const checkActivityCoupon = useCallback(async () => {
    if (!token) {
      return;
    }
    const {data} = await CommonApi.couponMarketConfigUsingPOST();
    if (!data.apply_page?.includes(page)) {
      return;
    }
    if (data?.coupon_list?.length) {
      setMarketCoupon(data);
      setMarketCouponDialogModalVisible(true);
    }
  }, [page, setMarketCoupon, setMarketCouponDialogModalVisible, token]);

  // 点击领取活动优惠券
  const handleCollectAllCoupon = useCallback(
    async (data: CouponMarketConfigResponse) => {
      Message.loading();
      try {
        const res = await CommonApi.couponMarketRewardUsingPOST({
          activity_id: data.activity_id as number,
        });
        setMarketCoupon(res.data);
        if (res.data.toast) {
          Message.toast(res.data.toast);
        } else {
          Message.hide();
        }
      } catch (e) {
        Message.toast(e);
      }
    },
    [setMarketCoupon],
  );

  const handleCouponCheckout = useCallback(() => {
    setMarketCouponDialogModalVisible(false);
    CouponCenterRouter.navigate();
  }, [CouponCenterRouter, setMarketCouponDialogModalVisible]);

  useFocusEffect(
    useCallback(() => {
      checkActivityCoupon();
    }, [checkActivityCoupon]),
  );

  return (
    <>
      {/* 活动优惠券弹窗 */}
      <MarketCouponDialogModal maskClosable>
        <>
          {marketCoupon && (
            <MarketCouponDialog
              onClose={() => setMarketCouponDialogModalVisible(false)}
              onCheckout={handleCouponCheckout}
              data={marketCoupon}
              onCollectClick={() => handleCollectAllCoupon(marketCoupon)}
            />
          )}
        </>
      </MarketCouponDialogModal>
    </>
  );
};

interface MarketCouponDialogProps {
  data: CouponMarketConfigResponse;
  onCollectClick?: () => void;
  onCheckout: () => void;
  onClose: () => void;
}

const MarketCouponDialog: FC<MarketCouponDialogProps> = ({
  onCollectClick,
  data: {coupon_list, bullet_title, subtitle, status, image},
  onClose,
  onCheckout,
}) => {
  return (
    <View style={MarketCouponDialogStyles.container}>
      <ImageBackground
        source={
          image ? {uri: image} : require('@src/assets/coupon_market_gb.png')
        }
        style={MarketCouponDialogStyles.background}>
        <TouchableOpacity
          style={MarketCouponDialogStyles.closeWrap}
          onPress={onClose}>
          <GlideImage
            style={MarketCouponDialogStyles.closeImage}
            source={require('@src/assets/close.png')}
            tintColor={'#000'}
          />
        </TouchableOpacity>
        <View style={MarketCouponDialogStyles.topContent}>
          <Text style={MarketCouponDialogStyles.titleText} numberOfLines={2}>
            {bullet_title}
          </Text>
          {subtitle ? (
            <Text
              style={MarketCouponDialogStyles.subTitleText}
              numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              justifyContent: 'flex-start',
            }}>
            {coupon_list?.length > 0 &&
              coupon_list?.map((item, index) => {
                return (
                  <StandardCouponCard
                    data={item}
                    key={index}
                    showCode={false}
                  />
                );
              })}
          </View>
        </ScrollView>
        <View style={MarketCouponDialogStyles.bottonContainer}>
          {status ? (
            <>
              <CollectBtn onPress={onClose}>OK</CollectBtn>
              <TouchableOpacity onPress={onCheckout}>
                <Text style={MarketCouponDialogStyles.checkText}>
                  CHECK COUPONS
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <CollectBtn onPress={onCollectClick}>COLLECT ALL</CollectBtn>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

interface CollectBtnProps {
  onPress?: () => void;
  children: string;
}

const CollectBtn: FC<CollectBtnProps> = ({onPress, children}) => {
  return (
    <StandardButton
      onPress={onPress}
      title={children}
      type={BUTTON_TYPE_ENUM.HIGH_LIGHT}
    />
  );
};

const MarketCouponDialogStyles = createStyleSheet({
  container: {
    backgroundColor: 'white',
    position: 'relative',
  },
  background: {
    width: 327,
    height: 435,
    paddingTop: 30,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  closeWrap: {
    padding: 12,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  closeImage: {
    width: 15,
    height: 15,
  },
  topContent: {
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  titleText: {
    color: '#222',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '700',
  },
  subTitleText: {
    color: '#222',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 14,
  },
  bottonContainer: {
    paddingTop: 16,
    justifyContent: 'center',
    marginTop: 'auto',
  },
  checkText: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '700',
    color: '#666',
    paddingTop: 12,
  },
});
