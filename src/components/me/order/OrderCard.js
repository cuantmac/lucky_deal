import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import {pure} from 'recompose';
import {px} from '../../../constants/constants';
import Api from '../../../Api';
import AppModule from '../../../../AppModule';
import Utils, {toast} from '../../../utils/Utils';
import {ACCENT, PRIMARY} from '../../../constants/colors';
import GlideImage from '../../native/GlideImage';
import {useSelector} from 'react-redux';
import {Timer} from '../../common/Timer';
import {reportData} from '../../../constants/reportData';
import {payPath} from '../../../analysis/report';
import {REPORT_FROM_PAGE_ENUM} from '../../../analysis/reportEnum';
import {Space} from '../../common/Space';
import {PayRoute} from '@src/routes';
import {TimerConsumer} from '@src/widgets/timer';

export default pure(function ({data, onRefresh, navigation}) {
  const {appCheck} = useSelector((state) => state.deprecatedPersist);
  const [loading, setLoading] = useState(false);
  const PayRouter = PayRoute.useRouteLink();

  const getDetail = () => {
    payPath.mergeData({FromPage: REPORT_FROM_PAGE_ENUM.ORDER_LIST});
    PayRouter.navigate({
      orderId: data.order_id,
    });
  };
  const goOrder = () => {
    AppModule.reportClick('11', '115', {
      OrderId: data.order_id,
      ProductId: data.product_id,
      AuctionId: data.auction_id,
      CategoryId: data.category_id,
    });
    AppModule.reportTap('Orders', 'ld_product_order_pay_click', {
      product_id: data.product_id,
      auction_id: data.auction_id,
      order_id: data.order_id,
    });
    getDetail();
  };
  const goDetail = () => {
    AppModule.reportTap('Orders', 'ld_product_order_click', {
      product_id: data.product_id,
      auction_id: data.auction_id,
      order_id: data.order_id,
    });
    AppModule.reportClick('11', '116', {
      OrderId: data.order_id,
      ProductId: data.product_id,
      AuctionId: data.auction_id,
      CategoryId: data.category_id,
    });
    if (data.order_status === 0) {
      getDetail();
    } else {
      navigation.navigate('OrderDetail', {
        order_id: data.order_id,
        product_from_page: reportData.orderList,
        refreshCallBack: () => {
          onRefresh();
        },
      });
    }
  };
  const handleRecived = ({order_id, order_type}) => {
    Alert.alert(
      'Notice',
      'Are you sure you have received the item?',
      [
        {
          text: 'Sure',
          onPress: () => {
            setLoading(true);
            Api.orderReceived(order_id, order_type).then((res) => {
              setLoading(false);
              if (res.code === 0) {
                toast.current.show('The deal has finished');
                onRefresh();
              }
            });
          },
        },
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };
  return (
    <View
      style={{
        backgroundColor: '#fff',
        padding: 30 * px,
        paddingBottom: 0,
      }}>
      <TouchableNativeFeedback onPress={goDetail}>
        <View
          style={{
            flexDirection: 'row',
            paddingBottom: 40 * px,
          }}>
          <View
            style={{
              position: 'relative',
              width: 230 * px,
              height: 230 * px,
              borderRadius: 20 * px,
            }}>
            <GlideImage
              source={Utils.getImageUri(data.image)}
              resizeMode={'center'}
              style={{
                width: 230 * px,
                height: 230 * px,
                borderRadius: 20 * px,
              }}
            />
            {data.items ? (
              <View
                style={{
                  position: 'absolute',
                  width: 230 * px,
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
                  {data.items} Item(s)
                </Text>
              </View>
            ) : null}
          </View>
          <View
            style={{
              flexDirection: 'column',
              flex: 1,
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                overflow: 'hidden',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                <Text
                  numberOfLines={2}
                  style={{
                    color: 'black',
                    maxWidth: 470 * px,
                    fontSize: 40 * px,
                    marginLeft: 10,
                  }}>
                  Order Id: {data.order_id}
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 28 * px,
                    marginLeft: 10,
                    marginTop: 10,
                  }}>
                  Deal Done Time:{' '}
                  {new Date(data.order_time * 1000).toDateString()}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#010101',
                    fontSize: 45 * px,
                    marginLeft: 10,
                    fontWeight: 'bold',
                    marginRight: 10,
                    includeFontPadding: false,
                  }}>
                  ${data.order_price / 100.0}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 10,
                marginTop: 10 * px,
              }}>
              <View style={{flex: 1}} />
              {data.order_status === 2 &&
                (loading ? (
                  <View
                    style={{
                      backgroundColor: '#FF9C27',
                      borderRadius: 10 * px,
                      height: 77 * px,
                      marginRight: 10,
                      width: 200 * px,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <ActivityIndicator color={'white'} size={'small'} />
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => handleRecived(data)}>
                    <Text
                      style={{
                        backgroundColor: '#FF9C27',
                        borderRadius: 10 * px,
                        color: 'white',
                        fontSize: 30 * px,
                        textAlign: 'center',
                        lineHeight: 77 * px,
                        height: 77 * px,
                        marginRight: 10,
                        width: 200 * px,
                      }}>
                      Received
                    </Text>
                  </TouchableOpacity>
                ))}
              {data.order_status === 0 ? ( // 未支付订单
                <TimerConsumer targetTime={data.expire_time * 1000}>
                  {({value: time, hasEnd}) => {
                    // 倒计时结束Pay Now按钮消失
                    if (hasEnd) {
                      return null;
                    }
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '100%',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Image
                            resizeMode={'contain'}
                            style={{width: 53 * px, height: 53 * px}}
                            source={require('../../../assets/clock.png')}
                          />
                          <Text
                            style={{
                              marginLeft: 15 * px,
                              fontSize: 34 * px,
                              color: '#FF2001',
                            }}>
                            {time}
                          </Text>
                        </View>
                        <TouchableOpacity onPress={goOrder}>
                          <Text
                            style={{
                              borderColor: '#F04A33',
                              borderRadius: 38 * px,
                              borderWidth: 2 * px,
                              color: '#F04A33',
                              fontSize: 30 * px,
                              textAlign: 'center',
                              lineHeight: 77 * px,
                              height: 77 * px,
                              marginRight: 10,
                              width: 200 * px,
                            }}>
                            Pay Now
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                </TimerConsumer>
              ) : data.user_can_feed_back === 1 && appCheck ? (
                <View style={{flexDirection: 'column', marginTop: 10 * px}}>
                  <ImageBackground
                    source={require('../../../assets/ic_yellow_tips.png')}
                    style={{
                      marginLeft: 100 * px,
                      width: 94 * px,
                      height: 51 * px,
                      marginTop: -20 * px,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 26 * px,
                        fontWeight: 'bold',
                        color: '#fff',
                        alignSelf: 'center',
                        lineHeight: 40 * px,
                      }}>
                      +{data.feed_back_bids}Bids
                    </Text>
                  </ImageBackground>
                  <TouchableOpacity
                    onPress={() => {
                      AppModule.reportClick('11', '117', {
                        OrderId: data.order_id,
                        ProductId: data.product_id,
                        AuctionId: data.auction_id,
                      });
                      AppModule.reportTap(
                        'Orders',
                        'ld_product_order_feedback_click',
                        {
                          auction_id: data.auction_id,
                          order_id: data.order_id,
                        },
                      );
                      navigation.navigate('OrderFeedback', {
                        data: data,
                        onGoBack: () => {
                          //回调函数
                          onRefresh();
                        },
                      });
                    }}>
                    <Text
                      style={{
                        backgroundColor: ACCENT,
                        color: 'white',
                        fontSize: 30 * px,
                        textAlign: 'center',
                        lineHeight: 77 * px,
                        height: 77 * px,
                        marginRight: 10,
                        width: 200 * px,
                        borderRadius: 10 * px,
                      }}>
                      Feedback
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              {data.order_status >= 1 &&
              data.order_status !== 5 &&
              data.order_status !== 3 &&
              data.order_status !== 14 ? (
                <View>
                  <Text
                    style={{
                      borderColor: '#F04A33',
                      borderRadius: 38 * px,
                      borderWidth: 2 * px,
                      color: '#F04A33',
                      fontSize: 30 * px,
                      textAlign: 'center',
                      lineHeight: 77 * px,
                      height: 77 * px,
                      marginRight: 10,
                      width: 200 * px,
                    }}>
                    View Details
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
      <Space height={2} backgroundColor={'#d6d6d6'} />
    </View>
  );
});
