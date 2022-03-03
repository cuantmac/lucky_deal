import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ViewPropTypes,
  ImageBackground,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';

import {px} from '../../../constants/constants';
import GlideImage from '../../native/GlideImage';
import {useSelector} from 'react-redux';
import AppModule from '../../../../AppModule';
import {TextInput} from 'react-native-gesture-handler';
import {payPath} from '../../../analysis/report';
import {REPORT_FROM_PAGE_ENUM} from '../../../analysis/reportEnum';
import {PayRoute} from '@src/routes';
import {TimerConsumer, TimerProvider} from '@src/widgets/timer';

// 模块容器
export const GroupContainer = ({top = 11, containerStyle, children}) => {
  return (
    <View
      style={[
        {
          marginHorizontal: 28 * px,
          backgroundColor: '#fff',
          marginTop: top,
          borderRadius: 20 * px,
          borderTopColor: '#D5D5D5',
          borderTopWidth: 2 * px,
        },
        containerStyle,
      ]}>
      {children}
    </View>
  );
};

GroupContainer.propTypes = {
  containerStyle: ViewPropTypes.style,
  top: PropTypes.number,
};

// 模块的title
export const GroupTitle = ({children, rightComponent}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingTop: 40 * px,
        justifyContent: 'space-between',
        paddingHorizontal: 28 * px,
      }}>
      <Text
        style={{
          fontSize: 40 * px,
          fontWeight: 'bold',
        }}>
        {children}
      </Text>
      {rightComponent}
    </View>
  );
};

export const GroupItem = ({title, icon, content, onPress, redContent}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          height: 124 * px,
          alignItems: 'center',
          paddingHorizontal: 28 * px,
        }}>
        <Image
          style={{width: 58 * px, height: 58 * px}}
          resizeMode={'contain'}
          source={icon}
        />
        <Text
          style={{
            marginLeft: 78 * px,
            fontSize: 40 * px,
            lineHeight: Platform.OS === 'ios' ? 0 : 170 * px,
          }}>
          {title}
        </Text>
        {content ? (
          <Text
            style={{
              color: '#4d4d4d',
              marginLeft: 'auto',
              fontSize: 40 * px,
              lineHeight: Platform.OS === 'ios' ? 0 : 170 * px,
            }}>
            {content}
          </Text>
        ) : redContent ? (
          <View style={{marginLeft: 'auto', flexDirection: 'row'}}>
            <Text
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: '#FF4A1A',
                color: '#fff',
                lineHeight: Platform.OS === 'ios' ? 0 : 12,
                marginRight: 10 * px,
                textAlign: 'center',
                fontSize: 30 * px,
              }}>
              {redContent}
            </Text>
            <Image
              style={{width: 18 * px, height: 32 * px}}
              source={require('../../../assets/me/me_arrow_icon.png')}
            />
          </View>
        ) : (
          <Image
            style={{marginLeft: 'auto', width: 18 * px, height: 32 * px}}
            source={require('../../../assets/me/me_arrow_icon.png')}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

GroupItem.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  icon: PropTypes.number.isRequired,
  content: PropTypes.string,
};

export const SettingItem = ({
  title,
  content,
  icon,
  editing,
  type,
  placeholder,
  onPress,
  change,
  color,
  onBlur,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 28 * px,
          paddingVertical: 15 * px,
        }}>
        <Text
          style={{
            width: 250 * px,
            marginLeft: 15 * px,
            fontSize: 40 * px,
            lineHeight: 100 * px,
          }}>
          {title}
        </Text>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {title === 'Avatar' ? (
            <View
              style={{
                width: 140 * px,
                height: 140 * px,
                borderRadius: 140 * px,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <GlideImage
                style={{
                  width: 96 * px,
                  height: 96 * px,
                  borderRadius: 96 * px,
                }}
                resizeMode={'stretch'}
                source={{uri: icon}}
                defaultSource={require('../../../assets/defalut_avatar.png')}
              />
            </View>
          ) : editing && type !== 'pick' ? (
            <TextInput
              onBlur={onBlur}
              autoFocus={true}
              textContentType={type}
              placeholder={placeholder}
              style={{
                flex: 1,
                lineHeight: 100 * px,
                color: '#4d4d4d',
                textAlign: 'right',
                fontSize: 40 * px,
                borderRadius: 10 * px,
                height: 100 * px,
                paddingHorizontal: 20 * px,
              }}
              onChangeText={(text) => change(text)}
              blurOnSubmit={true}
            />
          ) : (
            <Text
              style={{
                color: color || '#4d4d4d',
                fontSize: 40 * px,
                lineHeight: 100 * px,
                textAlign: 'right',
              }}>
              {content}
            </Text>
          )}
          <Image
            style={{marginLeft: 30 * px, width: 18 * px, height: 32 * px}}
            source={require('../../../assets/me/me_arrow_icon.png')}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

SettingItem.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  change: PropTypes.func,
  onBlur: PropTypes.func,
  icon: PropTypes.string,
  content: PropTypes.string,
  placeholder: PropTypes.string,
  editing: PropTypes.bool.isRequired,
  color: PropTypes.string,
};

export const Dropdown = ({label, list, value, change}) => {
  console.log('value', value);
  return (
    <TouchableOpacity
      onPress={null}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 28 * px,
        paddingVertical: 15 * px,
        justifyContent: 'space-between',
      }}>
      <Text
        style={{
          width: 250 * px,
          marginLeft: 15 * px,
          fontSize: 40 * px,
          lineHeight: 100 * px,
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
Dropdown.propTypes = {
  list: PropTypes.array.isRequired,
  change: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number,
};

// 横向容器
export const GroupRowContainer = ({children}) => {
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
      {children}
    </View>
  );
};

// Service 和 My Orders 横向的 item
export const GroupRowItem = ({title, onPress, icon, tipNum = 0}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{flex: 1, paddingVertical: 49 * px, alignItems: 'center'}}>
      <View>
        <Image
          style={{width: 68 * px, height: 68 * px}}
          resizeMode={'contain'}
          source={icon}
        />
        {tipNum > 0 && (
          <View
            style={{
              position: 'absolute',
              top: -15 * px,
              left: 50 * px,
              height: 30 * px,
              minWidth: 30 * px,
              borderColor: '#FF4A1A',
              borderWidth: 1,
              borderRadius: 30 * px,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
            }}>
            <Text
              style={{
                fontSize: 20 * px,
                lineHeight: Platform.OS === 'ios' ? 0 * px : 38 * px,
                color: '#FF4A1A',
                textAlign: 'center',
              }}>
              {tipNum}
            </Text>
          </View>
        )}
      </View>
      <Text
        style={{fontSize: 30 * px, marginTop: 30 * px, textAlign: 'center'}}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

GroupRowItem.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  icon: PropTypes.number.isRequired,
  tipNum: PropTypes.number,
};

// 未支付订单提示
export const UnPaidTip = ({
  time,
  onPress,
  hasEnd,
  title,
  image,
  total,
  orderId,
  items,
  orderType,
}) => {
  useEffect(() => {
    AppModule.reportShow('10', '236', {
      OrderID: orderId,
      OrderSource: orderType,
    });
  }, [orderId, orderType]);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        marginTop: -45 * px,
        paddingBottom: 20 * px,
        paddingHorizontal: 29 * px,
      }}>
      <ImageBackground
        source={require('../../../assets/unpaid_tip_border.png')}
        resizeMode={'stretch'}
        style={{
          width: '100%',
        }}>
        <View
          style={{
            padding: 15 * px,
            flexDirection: 'row',
            marginTop: 30 * px,
          }}>
          <View style={{position: 'relative'}}>
            <GlideImage
              source={{uri: image}}
              style={{width: 184 * px, height: 184 * px, borderRadius: 20 * px}}
            />
            {items ? (
              <View
                style={{
                  position: 'absolute',
                  width: 184 * px,
                  height: 64 * px,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  bottom: 0,
                  left: 0,
                  borderBottomLeftRadius: 20 * px,
                  borderBottomRightRadius: 20 * px,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 34 * px,
                    lineHeight: 64 * px,
                    textAlign: 'center',
                  }}>
                  {items} Item(s)
                </Text>
              </View>
            ) : null}
          </View>
          <View
            style={{
              marginLeft: 18 * px,
              justifyContent: 'space-around',
              flex: 1,
            }}>
            <Text style={{fontSize: 28 * px}}>
              Waiting for payment:{' '}
              <Text style={{color: '#FF3838'}}>{time}</Text>
            </Text>
            <Text style={{fontSize: 28 * px}} numberOfLines={2}>
              Order ID: {orderId}
            </Text>
            <Text style={{fontSize: 28 * px}}>
              Total:{' '}
              <Text style={{color: '#FF3838', fontSize: 36 * px}}>
                ${total}
              </Text>
            </Text>
          </View>
          <View style={{marginLeft: 'auto', justifyContent: 'center'}}>
            <View
              activeOpacity={0.8}
              style={{
                backgroundColor: hasEnd ? '#A0A0A0' : '#3C7DE3',
                borderRadius: 10 * px,
                width: 200 * px,
                height: 80 * px,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 30 * px, color: '#fff'}}>Pay Now</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

UnPaidTip.propTypes = {
  time: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  hasEnd: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  total: PropTypes.string.isRequired,
  orderId: PropTypes.string.isRequired,
  items: PropTypes.number,
  orderType: PropTypes.number,
};

/**
 * 有未支付订单时显示未支付订单
 * 无未支付订单则返回null
 */
export const UnPayTipComponent = () => {
  const latestUnpaidOrder = useSelector(
    (state) => state.deprecatedPersist.latestUnpaidOrder,
  );
  const token = useSelector((state) => state.deprecatedPersist.token);
  const {orderData} = latestUnpaidOrder;
  const PayRouter = PayRoute.useRouteLink();
  const handlepress = () => {
    AppModule.reportClick('10', '237', {
      OrderID: orderData.order_id,
      OrderSource: orderData.order_type,
    });
    payPath.mergeData({FromPage: REPORT_FROM_PAGE_ENUM.ME});
    PayRouter.navigate({
      orderId: orderData.order_id,
    });
  };
  return token && orderData ? (
    <TimerProvider>
      <TimerConsumer targetTime={orderData.expire_time * 1000}>
        {({value: time, hasEnd}) => {
          return (
            <UnPaidTip
              orderId={orderData.order_id}
              title={orderData.title}
              image={orderData.image}
              total={parseFloat(orderData.order_price / 100).toFixed(2)}
              hasEnd={hasEnd}
              time={time}
              onPress={() => {
                handlepress();
              }}
              items={orderData.items}
              orderType={orderData.order_type}
            />
          );
        }}
      </TimerConsumer>
    </TimerProvider>
  ) : null;
};
