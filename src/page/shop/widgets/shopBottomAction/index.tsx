import {
  CartSelectInfoItem,
  DiscountProductItem,
  UserCartListResponse,
} from '@luckydeal/api-common';
import {
  convertAmountUS,
  createStyleSheet,
  getProductStatus,
} from '@src/helper/helper';
import {BUTTON_TYPE_ENUM, StandardButton} from '@src/widgets/button';
import {GlideImage} from '@src/widgets/glideImage';
import {useActionSheet} from '@src/widgets/modal/modal';
import {ACTION_SHEET_CONTENT_PADDING_HORIZONTAL} from '@src/widgets/modal/modal/widgets';
import {Space} from '@src/widgets/space';
import React, {FC} from 'react';
import {useMemo} from 'react';
import {ScrollView, ViewStyle} from 'react-native';
import {TextStyle} from 'react-native';
import {View, Text, TouchableOpacity} from 'react-native';
import {ShopItemSelect, ShopItemSelectProps} from '../shopItemSelect';

interface ShopBottomActionProps {
  onCheckedAllPress?: ShopItemSelectProps['onChange'];
  onCheckoutPress?: () => void;
  cartData: UserCartListResponse;
}

export const ShopBottomAction: FC<ShopBottomActionProps> = ({
  cartData,
  onCheckedAllPress,
  onCheckoutPress,
}) => {
  const [
    ActionSheetModal,
    setActionSheetModalVisible,
    visible,
  ] = useActionSheet();

  const checked = useMemo(() => {
    const list = cartData.list.filter((item) => {
      return !getProductStatus(item).disabled;
    });
    if (!list.length) {
      return false;
    }
    for (let item of list) {
      if (!item.is_select) {
        return false;
      }
    }
    return true;
  }, [cartData.list]);

  const showCoupon = (cartData.select_info?.coupon?.remission_fee || 0) > 0;
  const total = cartData.select_info?.total || 0;

  return (
    <>
      <ShopItemSelect
        onChange={onCheckedAllPress}
        checked={checked}
        style={ShopBottomActionStyles.container}>
        <Text style={ShopBottomActionStyles.allText}>All</Text>
        <TouchableOpacity
          onPress={() => {
            if (total <= 0) {
              return;
            }
            setActionSheetModalVisible(true);
          }}
          activeOpacity={0.6}
          style={ShopBottomActionStyles.priceContainer}>
          <View style={ShopBottomActionStyles.totalPriceContainer}>
            <Text numberOfLines={1} style={ShopBottomActionStyles.totalText}>
              Total: {convertAmountUS(total)}
            </Text>
            {!showCoupon && total > 0 && (
              <GlideImage
                tintColor="#666"
                style={[
                  ShopBottomActionStyles.pressIcon,
                  {
                    transform: [{rotateZ: visible ? '0deg' : '180deg'}],
                  },
                ]}
                source={require('@src/assets/productList/arrow-up.png')}
              />
            )}
          </View>
          {showCoupon && (
            <View style={{alignSelf: 'flex-start'}}>
              <Text numberOfLines={1} style={ShopBottomActionStyles.couponText}>
                Saved:{' '}
                {convertAmountUS(
                  cartData.select_info?.coupon?.remission_fee || 0,
                )}{' '}
                &gt;
              </Text>
            </View>
          )}
          {cartData.select_info?.has_coupon && (
            <Text numberOfLines={1} style={ShopBottomActionStyles.codeText}>
              Apply a Coupon Code on the next step
            </Text>
          )}
        </TouchableOpacity>
        <StandardButton
          onPress={onCheckoutPress}
          type={BUTTON_TYPE_ENUM.HIGH_LIGHT}
          wrapStyle={ShopBottomActionStyles.button}
          title={'CHECKOUT'}
        />
      </ShopItemSelect>
      {cartData.select_info && (
        <ActionSheetModal
          maskClosable
          title={showCoupon ? 'Promotion Detail' : 'Detail'}>
          <PromotionDetail data={cartData.select_info} />
        </ActionSheetModal>
      )}
    </>
  );
};

const ShopBottomActionStyles = createStyleSheet({
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  allText: {
    fontSize: 14,
    color: '#222',
  },
  priceContainer: {
    marginLeft: 24,
    flex: 1,
  },
  totalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    lineHeight: 17,
  },
  pressIcon: {
    width: 11,
    height: 6,
    marginLeft: 5,
  },
  couponText: {
    marginTop: 4,
    alignSelf: 'flex-start',
    fontSize: 10,
    color: 'rgba(208,1,26,1)',
    backgroundColor: 'rgba(208,1,26,.1)',
    lineHeight: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  codeText: {
    fontSize: 10,
    color: '#222',
    lineHeight: 12,
    marginTop: 4,
  },
  button: {
    width: 90,
    marginHorizontal: 12,
  },
});

interface PromotionDetailProps {
  data: CartSelectInfoItem;
}

const PromotionDetail: FC<PromotionDetailProps> = ({data}) => {
  const remissionFee = data.coupon?.remission_fee || 0;
  return (
    <>
      <PromotionListItem
        title={'Subtotal'}
        value={convertAmountUS(data.sub_total)}
      />
      <PromotionListItem
        title={'Shipping fee'}
        value={convertAmountUS(data.shipping_fee)}
      />
      <PromotionListItem
        title={'Tax fee'}
        value={convertAmountUS(data.tax_fee)}
      />
      {remissionFee > 0 && (
        <PromotionListItem
          valueStyle={{color: 'rgba(208,1,26,1)'}}
          title={'Coupon'}
          value={convertAmountUS(remissionFee, true)}
        />
      )}

      <PromotionListItem
        titleStyle={{fontWeight: '700'}}
        title={'Total'}
        value={convertAmountUS(data.total)}
      />
      {!!data.discount_info?.length && (
        <>
          <Space
            height={9}
            backgroundColor={'#f6f6f6'}
            marginRight={-ACTION_SHEET_CONTENT_PADDING_HORIZONTAL}
            marginLeft={-ACTION_SHEET_CONTENT_PADDING_HORIZONTAL}
          />
          <Text style={PromotionDetailStyles.couponText}>
            Coupon Saved {convertAmountUS(remissionFee)}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {data.discount_info.map((item, index) => {
              return <CouponProduct data={item} key={index} />;
            })}
          </ScrollView>
          <PromotionListItem
            valueStyle={{color: 'rgba(208,1,26,1)'}}
            title={'Coupon'}
            value={convertAmountUS(data.coupon?.remission_fee || 0, true)}
          />
        </>
      )}
    </>
  );
};

interface PromotionListItemProps {
  title: string;
  value: string;
  titleStyle?: TextStyle;
  valueStyle?: TextStyle;
  style?: ViewStyle;
}

const PromotionListItem: FC<PromotionListItemProps> = ({
  title,
  titleStyle,
  value,
  valueStyle,
  style,
}) => {
  return (
    <View style={[PromotionDetailStyles.container, style]}>
      <Text style={[PromotionDetailStyles.text, titleStyle]}>{title}</Text>
      <Text style={[PromotionDetailStyles.text, valueStyle]}>{value}</Text>
    </View>
  );
};

const PromotionDetailStyles = createStyleSheet({
  container: {
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 12,
    color: '#222',
    lineHeight: 14,
  },
  couponText: {
    height: 38,
    lineHeight: 38,
    fontSize: 12,
    color: '#D0011A',
  },
});

interface CouponProductProps {
  data: DiscountProductItem;
}
export const CouponProduct: FC<CouponProductProps> = ({data}) => {
  return (
    <View style={CouponProductStyles.thumbContainer}>
      <GlideImage
        style={CouponProductStyles.thumbImg}
        source={{uri: data.image}}
      />
      <Text style={CouponProductStyles.thumbText}>x{data.qty}</Text>
    </View>
  );
};

const CouponProductStyles = createStyleSheet({
  thumbContainer: {
    width: 80,
    height: 80,
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 8,
    position: 'relative',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  thumbText: {
    width: 24,
    height: 24,
    position: 'absolute',
    right: 4,
    bottom: 4,
    lineHeight: 24,
    textAlign: 'center',
    fontSize: 12,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.50)',
    borderRadius: 24,
  },
});
