import {CouponDetail, CouponInfoItem, CouponItem} from '@luckydeal/api-common';
import {
  convertAmount,
  convertAmountUS,
  createStyleSheet,
  styleAdapter,
} from '@src/helper/helper';
import React, {FC} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {ImageBackground, View, Text} from 'react-native';
import {COUPON_DISCOUNT_TYPE_ENUM} from '@src/constants/enum';

const parseTime = (time: number, type?: boolean) => {
  let now = new Date(time * 1000);
  var year = now.getFullYear(); //取得4位数的年份
  var month = now.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月
  var date = now.getDate(); //返回日期月份中的天数（1到31）
  var hour = now.getHours(); //返回日期中的小时数（0到23）
  var minute = now.getMinutes(); //返回日期中的分钟数（0到59）
  var second = now.getSeconds(); //返回日期中的秒数（0到59）
  let returnTime =
    (date > 9 ? date : '0' + date) +
    '/' +
    (month > 9 ? month : '0' + month) +
    ('/' + year);
  if (type) {
    returnTime =
      returnTime +
      ' ' +
      (hour > 9 ? hour : '0' + hour) +
      ':' +
      (minute > 9 ? minute : '0' + minute);
  }

  return returnTime;
};

/**
 * 解析优惠券
 * 统一优惠券显示
 */
export function parseCouponItem(coupon: CouponItem) {
  const couponAmount =
    coupon.discount_type === COUPON_DISCOUNT_TYPE_ENUM.DISCOUNT
      ? `${coupon.amount}% OFF`
      : `US $${convertAmount(coupon.amount)}`;
  return {
    couponAmount,
    useProductText: coupon.use_description,
    title: coupon.title,
    expireTimeText: `${parseTime(coupon.begin_time)}-${parseTime(
      coupon.end_time,
    )}`,
  };
}

/**
 * 解析优惠券
 * 统一优惠券显示
 */
export function parseCouponInfoItem(coupon: CouponInfoItem | CouponDetail) {
  return {
    couponAmount:
      coupon.discount_type === COUPON_DISCOUNT_TYPE_ENUM.DISCOUNT
        ? `${coupon.amount}% OFF`
        : convertAmountUS(coupon.amount) + ' OFF',
    couponAmountDesc:
      coupon.discount_type === COUPON_DISCOUNT_TYPE_ENUM.DISCOUNT
        ? `(up to ${convertAmountUS(
            (coupon as CouponDetail).max_discount || 0,
          )})`
        : null,
    expireTimeText: `${coupon.begin_time}-${coupon.end_time}`,
    useProductText:
      (coupon as CouponInfoItem).use_description ||
      (coupon as CouponDetail).use_product,
    title: coupon.title,
  };
}

interface MarketCouponCardProps {
  data: CouponItem;
}

/**
 * 活动优惠券 弹窗中使用
 */
export const MarketCouponCard: FC<MarketCouponCardProps> = ({data}) => {
  const parser = parseCouponItem(data);
  return (
    <ImageBackground
      source={require('@src/assets/home_coupon_card_bg.png')}
      style={styleAdapter(
        {
          width: 820,
          height: 160,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginTop: 24,
        },
        true,
      )}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        <Text
          style={styleAdapter(
            {
              fontSize: 40,
              width: 204,
              textAlign: 'center',
              color: '#EF3224',
            },
            true,
          )}>
          {parser.couponAmount}
        </Text>
      </View>
      <View
        style={styleAdapter(
          {
            justifyContent: 'space-around',
            alignItems: 'flex-start',
            paddingVertical: 10,
            flex: 1,
            paddingHorizontal: 35,
          },
          true,
        )}>
        <Text
          style={styleAdapter(
            {
              fontSize: 33,
              textAlign: 'left',
              color: '#F27200',
            },
            true,
          )}>
          {parser.title}
        </Text>
        <Text
          numberOfLines={2}
          style={styleAdapter(
            {
              fontSize: 22,
              textAlign: 'left',
              marginTop: 20,
              color: '#F27200',
            },
            true,
          )}>
          {parser.useProductText}
        </Text>
        <Text
          style={styleAdapter(
            {
              fontSize: 22,
              color: '#F27200',
              textAlign: 'left',
            },
            true,
          )}>
          {parser.expireTimeText}
        </Text>
      </View>
    </ImageBackground>
  );
};

interface StandardCouponCardProps {
  data: CouponInfoItem | CouponDetail;
  showCode?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}

export const StandardCouponCard: FC<StandardCouponCardProps> = ({
  children,
  disabled = false,
  onPress,
  data,
  showCode = true,
}) => {
  const couponParser = parseCouponInfoItem(data);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
      style={StandardCouponCardStyles.wrapContainer}>
      <View
        style={[
          StandardCouponCardStyles.container,
          disabled && StandardCouponCardStyles.containerDisabled,
        ]}>
        <View
          style={[
            StandardCouponCardStyles.couponBar,
            disabled && StandardCouponCardStyles.couponBarDisabled,
          ]}
        />
        <View style={StandardCouponCardStyles.topContainer}>
          <View style={StandardCouponCardStyles.topLeftContainer}>
            <View style={StandardCouponCardStyles.priceContainer}>
              <Text
                style={[
                  StandardCouponCardStyles.amountText,
                  disabled && StandardCouponCardStyles.textDisabled,
                ]}>
                {couponParser.couponAmount}
              </Text>
              {couponParser.couponAmountDesc && (
                <Text
                  style={[
                    StandardCouponCardStyles.amountDescText,
                    disabled && StandardCouponCardStyles.textDisabled,
                  ]}>
                  {' '}
                  {couponParser.couponAmountDesc}
                </Text>
              )}
            </View>
            <Text
              style={[
                StandardCouponCardStyles.couponTitle,
                disabled && StandardCouponCardStyles.textDisabled,
              ]}>
              {couponParser.title}
            </Text>
            {showCode && (
              <Text
                style={[
                  StandardCouponCardStyles.couponTitle,
                  disabled && StandardCouponCardStyles.textDisabled,
                ]}>
                code: {(data as CouponDetail).promo_code}
              </Text>
            )}
          </View>
          <View style={StandardCouponCardStyles.action}>{children}</View>
        </View>
        <View style={StandardCouponCardStyles.lineContainer}>
          <TouchableOpacity style={StandardCouponCardStyles.line} />
        </View>
        <View style={StandardCouponCardStyles.bottomContainer}>
          <StandardCouponCardDescItem disabled={disabled}>
            {couponParser.expireTimeText}
          </StandardCouponCardDescItem>
          <StandardCouponCardDescItem disabled={disabled}>
            {couponParser.useProductText}
          </StandardCouponCardDescItem>
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface StandardCouponCardDescItemProps {
  disabled?: boolean;
}

const StandardCouponCardDescItem: FC<StandardCouponCardDescItemProps> = ({
  children,
  disabled,
}) => {
  return (
    <View style={StandardCouponCardStyles.descContainer}>
      <View style={StandardCouponCardStyles.dot} />
      <Text
        style={[
          StandardCouponCardStyles.descText,
          disabled && StandardCouponCardStyles.textDisabled,
        ]}>
        {children}
      </Text>
    </View>
  );
};

export const StandardCouponCardUsedAction: FC = () => {
  return <CouponAction disabled>Used</CouponAction>;
};

export const StandardCouponCardExpiredAction: FC = () => {
  return <CouponAction disabled>Expired</CouponAction>;
};

interface StandardCouponCardGetActionProps {
  get?: boolean;
}

export const StandardCouponCardGetAction: FC<StandardCouponCardGetActionProps> = ({
  get,
}) => {
  return (
    <CouponAction disabled={get}>
      {get ? 'Collected' : 'Get it now'}
    </CouponAction>
  );
};

interface StandardCouponCardSelectActionProps {
  selected?: boolean;
}

export const StandardCouponCardSelectAction: FC<StandardCouponCardSelectActionProps> = ({
  selected,
}) => {
  return (
    <View
      style={[
        StandardCouponCardStyles.selectAction,
        !selected && StandardCouponCardStyles.selectActionDisabled,
      ]}>
      {selected && (
        <Image
          resizeMode={'contain'}
          style={styleAdapter({width: 10, height: 10})}
          source={require('@src/assets/coupon_select.png')}
        />
      )}
    </View>
  );
};

interface CouponActionProps {
  children?: string;
  disabled?: boolean;
}

const CouponAction: FC<CouponActionProps> = ({children, disabled}) => {
  return (
    <Text
      style={[
        StandardCouponCardStyles.actionText,
        disabled && StandardCouponCardStyles.actionTextDisabled,
      ]}>
      {children}
    </Text>
  );
};

const StandardCouponCardStyles = createStyleSheet({
  wrapContainer: {
    marginTop: 12,
    overflow: 'hidden',
  },
  container: {
    position: 'relative',
    paddingHorizontal: 20,
    backgroundColor: '#fff2f4',
  },
  containerDisabled: {
    borderColor: '#D7D7D7',
    backgroundColor: '#f4f4f4',
  },
  couponBar: {
    height: 4,
    backgroundColor: '#D0011A',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  couponBarDisabled: {
    backgroundColor: '#B5B5B5',
  },
  topContainer: {
    height: 75,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topLeftContainer: {
    justifyContent: 'center',
  },
  action: {
    justifyContent: 'center',
  },
  bottomContainer: {
    height: 49,
    justifyContent: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    color: '#D0011A',
    fontSize: 21,
    fontWeight: '700',
    lineHeight: 25,
    height: 25,
  },
  amountDescText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D0011A',
  },
  textDisabled: {
    color: '#666666',
  },
  couponTitle: {
    color: '#D0011A',
    fontSize: 12,
    marginTop: 2,
  },
  descContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 3,
    backgroundColor: '#666',
  },
  descText: {
    fontSize: 10,
    lineHeight: 14,
    marginLeft: 4,
    color: '#666',
  },
  lineContainer: {
    position: 'relative',
    height: 1,
    overflow: 'hidden',
    marginHorizontal: -20,
  },
  line: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 1,
    borderColor: 'white',
  },
  circle: {
    width: 22,
    height: 22,
    backgroundColor: 'white',
    borderRadius: 22,
    borderColor: '#ffe0e4',
    borderStyle: 'solid',
    position: 'absolute',
    borderWidth: 1,
    top: -11.5,
  },
  circleDisabled: {
    borderColor: '#D7D7D7',
  },
  leftCircle: {
    left: -31,
  },
  rightCircle: {
    right: -31,
  },
  actionText: {
    width: 80,
    height: 24,
    backgroundColor: '#D0011A',
    lineHeight: 24,
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    borderRadius: 2,
    fontWeight: '700',
  },
  actionTextDisabled: {
    backgroundColor: '#B5B5B5',
  },
  selectAction: {
    width: 16,
    height: 16,
    backgroundColor: '#D0011A',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectActionDisabled: {
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderColor: '#979797',
    borderWidth: 1,
    width: 15,
    height: 15,
  },
});
