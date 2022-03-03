import {useNavigation} from '@react-navigation/native';
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import InputSpinner from 'react-native-input-spinner';
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  View,
  ImageSourcePropType,
  TextStyle,
  ViewStyle,
  TextInput,
} from 'react-native';
import {PRIMARY} from '../../constants/colors';
import {px, SCREEN_WIDTH} from '../../constants/constants';
import GlideImage from '../native/GlideImage';
import {
  isOffersOrBag,
  PAGE_FORM_ENUM,
  PAY_TYPE_ENUM,
  SHOPPING_METHOD_ENUM,
} from './utils';
import {Timer} from '../common/Timer';
import {ScrollView} from 'react-native-gesture-handler';
import {useFetching, useShallowEqualSelector} from '../../utils/hooks';
import Api from '../../Api';
import {PayMethodList, usePaymethod} from '../../hooks/usePaymethod';
import {PAY_METHOD_ENUM, PAY_STYLE_ENUM} from '../../constants/enum';
import {
  LogisticsChannelItemProps,
  OrderDetailData,
  UserOrderConfirm,
} from '../../types/models/order.model';

import {RefundTip} from '../me/order/OrderComponent';
import BottomSheet from '../dialog/BottomSheet';
const GlideImageEle = GlideImage as any;

interface PayTipProps {
  price: string;
  pricePercent: string;
  loading: boolean;
  onPress: (type: PAY_TYPE_ENUM) => void;
  onClose: () => void;
}

/**
 * 放弃支付弹窗
 *
 * @param param0 PayTipProps
 */
export const PayTip: FC<PayTipProps> = ({
  price,
  pricePercent,
  loading,
  onPress,
  onClose,
}) => {
  return (
    <ImageBackground
      source={require('../../assets/pay_tip_new_bg.png')}
      style={{
        width: 801 * px,
        height: 1198 * px,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}>
      <Text
        style={{
          color: '#000',
          fontSize: 70 * px,
          marginLeft: 77 * px,
          marginRight: 77 * px,
          marginTop: 0 * px,
          textAlign: 'center',
          fontWeight: 'bold',
        }}>
        Already {pricePercent}% off
      </Text>
      <Text
        style={{
          color: '#000',
          marginTop: 20 * px,
          fontSize: 40 * px,
          marginLeft: 44 * px,
          marginRight: 44 * px,
          textAlign: 'center',
        }}>
        Sure to give up the payment? Pay the deal now you will save ${price}
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: PRIMARY,
          marginHorizontal: 8,
          height: 136 * px,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20 * px,
          width: 600 * px,
          marginTop: 40 * px,
          marginBottom: 60 * px,
        }}
        onPress={() => onPress && onPress(PAY_TYPE_ENUM.DIALOG_PAY)}>
        {loading ? (
          <ActivityIndicator color={'white'} />
        ) : (
          <Text
            style={{
              color: 'white',
              fontSize: 60 * px,
              fontWeight: 'bold',
            }}>
            PLACE ORDER
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: 70 * px,
          height: 70 * px,
          position: 'absolute',
          right: 10 * px,
          top: 40 * px,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={onClose}>
        <Image
          style={{
            width: 30 * px,
            height: 30 * px,
            tintColor: 'white',
          }}
          source={require('../../assets/close.png')}
        />
      </TouchableOpacity>
    </ImageBackground>
  );
};

/**
 * Pay header
 *
 * @param param0 UsePayHeaderParams
 */
export const usePayHeader = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: 'Order Confirmation',
    });
  }, [navigation]);
};

/**
 * 商品信息容器
 */
export const PayInfoContainer: FC<{title: string; value?: string}> = ({
  children,
  title,
  value,
}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        marginTop: 30 * px,
        justifyContent: 'flex-start',
        paddingBottom: 40 * px,
      }}>
      {title && (
        <View
          style={{
            paddingHorizontal: 30 * px,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 40 * px,
              fontWeight: 'bold',
              lineHeight: 117 * px,
            }}>
            {title}
          </Text>
          <Text
            style={{
              fontSize: 30 * px,
            }}>
            {value}
          </Text>
          <View style={{height: 1, backgroundColor: '#F2F2F2'}} />
        </View>
      )}
      {children}
    </View>
  );
};

type SkuItem = OrderDetailData.Skuinfo;

interface PayInfoHeaderProps {
  containerStyle?: ViewStyle;
  img: ImageSourcePropType;
  title: string;
  price: number;
  priceBefore: number | undefined;
  onPress?: () => void;
  count?: number;
  editCount?: boolean;
  onCountChange?: (val: number) => void;
  max?: number;
  min?: number;
  isVip?: boolean;
  showSaved?: boolean;
  order_id?: string;
  // order_items?: string;
  showReview?: boolean;
  goReview?: () => void;
  hideBeforePrice?: boolean;
  refund_status?: number;
}

/**
 * 商品信息头部
 */
export const PayInfoHeader: FC<PayInfoHeaderProps & PayHeaderSkuProps> = memo(
  ({
    containerStyle,
    isVip = false,
    showSaved = true,
    img,
    title,
    sku,
    price,
    priceBefore,
    onPress,
    count,
    editCount = false,
    onCountChange,
    max,
    min,
    order_id,
    showReview,
    goReview,
    hideBeforePrice = false,
    refund_status = -1,
  }) => {
    return (
      <View>
        {isVip && (
          <Image
            style={{width: 260 * px, height: 50 * px}}
            source={require('../../assets/pro/pro_tag.png')}
          />
        )}
        {order_id ? (
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20 * px,
              marginLeft: 10,
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 40 * px}}>Order id:</Text>
            <Text
              selectable={true}
              style={{
                flexDirection: 'row',
                marginTop: 20 * px,
                marginLeft: 10,
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 40 * px}}>Order id:</Text>
              <Text
                selectable={true}
                style={{
                  color: '#5D5D5D',
                  marginLeft: 20 * px,
                  fontSize: 30 * px,
                  marginVertical: 20 * px,
                }}>
                {order_id}
              </Text>
            </Text>
          </View>
        ) : null}
        <TouchableOpacity
          disabled={!onPress}
          activeOpacity={0.8}
          onPress={onPress}
          style={[
            {
              flex: 1,
              flexDirection: 'row',
              paddingTop: 10,
              paddingHorizontal: 10,
              marginBottom: 40 * px,
            },
            containerStyle,
          ]}>
          <GlideImageEle
            source={img}
            resizeMode="center"
            style={{
              width: 230 * px,
              height: 230 * px,
              borderRadius: 20 * px,
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignSelf: 'flex-start',
              marginLeft: 10,
            }}>
            <Text
              numberOfLines={2}
              style={{
                color: 'black',
                fontSize: 40 * px,
              }}>
              {title}
            </Text>

            <PayHeaderSku sku={sku} />

            {showSaved && (
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: '#FFD7D7',
                  borderRadius: 10 * px,
                  paddingVertical: 5 * px,
                  paddingHorizontal: 10 * px,
                }}>
                <Text
                  style={{
                    color: '#E00404',
                    fontSize: 34 * px,
                    fontWeight: '500',
                    borderRadius: 20 * px,
                    textAlign: 'center',
                  }}>
                  Saved{' '}
                  {priceBefore
                    ? Math.ceil(
                        parseFloat(
                          ((priceBefore - price) / priceBefore).toFixed(2),
                        ) * 100,
                      )
                    : 0}
                  %
                </Text>
              </View>
            )}
            {refund_status > -1 ? (
              <RefundTip refund_status={refund_status} />
            ) : null}
          </View>

          <View
            style={{
              marginLeft: 20 * px,
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}>
            <View style={{alignItems: 'flex-end'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    color: '#010101',
                    fontSize: 40 * px,
                    fontWeight: 'bold',
                  }}>
                  ${price}
                </Text>
                {isVip && (
                  <Image
                    style={{
                      width: 145 * px,
                      height: 40 * px,
                      marginLeft: 9 * px,
                    }}
                    source={require('../../assets/pro/pro_price_tag.png')}
                  />
                )}
              </View>

              {!hideBeforePrice && (
                <Text
                  style={{
                    color: '#888686',
                    textDecorationLine: 'line-through',
                    fontSize: 30 * px,
                  }}>
                  ${priceBefore}
                </Text>
              )}
            </View>

            {editCount ? (
              <View>
                <InputSpinner
                  max={max}
                  min={min}
                  step={1}
                  colorMax={'#7A7A7A'}
                  colorMin={'#7A7A7A'}
                  value={count}
                  initialValue={count}
                  rounded={false}
                  editable={false}
                  style={{
                    width: 260 * px,
                    height: 80 * px,
                    alignItems: 'center',
                  }}
                  inputStyle={{
                    width: 100 * px,
                    height: 74 * px,
                    borderTopWidth: 2 * px,
                    borderBottomWidth: 2 * px,
                    borderColor: '#656565',
                    textAlign: 'center',
                  }}
                  buttonStyle={{
                    width: 80 * px,
                    height: 74 * px,
                    borderWidth: 2 * px,
                    borderRadius: 12 * px,
                    borderColor: '#656565',
                    backgroundColor: '#fff',
                  }}
                  buttonLeftImage={
                    <Image
                      style={{
                        width: 60 * px,
                        height: 60 * px,
                        alignSelf: 'center',
                        tintColor: count === min ? '#A5A5A5' : 'black',
                      }}
                      source={require('../../assets/cart_decrease_icon.png')}
                    />
                  }
                  buttonTextColor={'#000'}
                  buttonRightImage={
                    <Image
                      style={{
                        width: 40 * px,
                        height: 40 * px,
                        alignSelf: 'center',
                        tintColor: count === max ? '#A5A5A5' : 'black',
                      }}
                      source={require('../../assets/cart_increase_icon.png')}
                    />
                  }
                  onChange={(num: number) => {
                    onCountChange && onCountChange(num);
                  }}
                />
              </View>
            ) : (
              <Text
                style={{
                  color: '#888686',
                }}>
                x{count}
              </Text>
            )}
            {showReview ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={goReview}
                style={{
                  borderRadius: 10 * px,
                  backgroundColor: 'rgba(240, 74, 51, 1)',
                  height: 70 * px,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 5 * px,
                  paddingHorizontal: 40 * px,
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontSize: 30 * px,
                    color: '#fff',
                    textAlign: 'center',
                  }}>
                  Review
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
    );
  },
);

interface PayHeaderSkuProps {
  sku: SkuItem[] | undefined;
}

const PayHeaderSku: FC<PayHeaderSkuProps> = ({sku}) => {
  const skuLen = sku?.length || 0;
  return (
    <View
      style={{
        flexDirection: 'row',
        marginVertical: 10 * px,
      }}>
      {sku?.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sku.map((item, i) => {
            return (
              <View
                key={'sku' + i}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#F8F8F8',
                  borderTopLeftRadius: i === 0 ? 10 * px : 0,
                  borderBottomLeftRadius: i === 0 ? 10 * px : 0,
                  borderTopRightRadius: i === skuLen - 1 ? 10 * px : 0,
                  borderBottomRightRadius: i === skuLen - 1 ? 10 * px : 0,
                  paddingVertical: 5 * px,
                  marginRight: 15 * px,
                }}>
                <Text
                  style={{
                    fontSize: 30 * px,
                    paddingHorizontal: 10 * px,
                    color: '#707070',
                  }}
                  numberOfLines={1}>
                  {item.sku_value + (i === skuLen - 1 ? '' : ',')}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={{height: 40 * px}} />
      )}
    </View>
  );
};

interface PayInfoListItemProps {
  title: string;
  text: string;
  onPress?: () => void;
  textStyle?: TextStyle;
  titleStyle?: TextStyle;
  containerStyle?: ViewStyle;
  showPressIcon?: boolean;
}

/**
 * 列表条目
 *
 * @param param0 PayInfoListItemProps
 */
export const PayInfoListItem: FC<PayInfoListItemProps> = ({
  title,
  text,
  onPress,
  textStyle,
  titleStyle,
  containerStyle,
  showPressIcon = false,
}) => {
  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        {
          backgroundColor: 'white',
          flexDirection: 'row',
          alignItems: 'center',
          height: 70 * px,
          marginTop: 5,
        },
        containerStyle,
      ]}>
      <Text
        style={[
          {
            marginLeft: 30 * px,
            fontSize: 40 * px,
            flex: 1,
          },
          titleStyle,
        ]}>
        {title}
      </Text>
      <Text
        style={[
          {
            color: '#727272',
            marginRight: 12,
            fontSize: 40 * px,
          },
          textStyle,
        ]}>
        {text}
      </Text>
      {(!!onPress || showPressIcon) && (
        <Image
          style={{
            width: 21 * px,
            height: 37 * px,
            marginRight: 12,
            marginLeft: -2,
          }}
          resizeMode={'contain'}
          source={require('../../assets/me_arrow.png')}
        />
      )}
    </TouchableOpacity>
  );
};

export const LogisticsMethod: FC<
  ShoppingMethodProps & {logistic?: LogisticsChannelItemProps}
> = memo(({onChange, logistic, method, logisticsChannel}) => {
  return (
    <TouchableOpacity
      onPress={() =>
        BottomSheet.showLayout(
          <ShoppingMethod
            method={method}
            onChange={onChange}
            logisticsChannel={logisticsChannel}
          />,
          568 * px,
          true,
        )
      }
      activeOpacity={0.8}
      style={{
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        height: 140 * px,
        marginTop: 30 * px,
      }}>
      <Text
        style={{
          marginLeft: 30 * px,
          fontSize: 40 * px,
          flex: 1,
          color: '#000000',
          fontWeight: 'bold',
        }}>
        Shipping Method
      </Text>
      <Text
        style={{
          color: '#5E5E5E',
          marginRight: 12,
          fontSize: 34 * px,
        }}>
        {logistic?.en_title} +${(logistic?.price || 0) / 100.0}
      </Text>
      <Image
        style={{
          width: 21 * px,
          height: 37 * px,
          marginRight: 12,
          marginLeft: -2,
        }}
        resizeMode={'contain'}
        source={require('../../assets/me_arrow.png')}
      />
    </TouchableOpacity>
  );
});

interface ShoppingMethodProps {
  method: number;
  onChange?: (method: SHOPPING_METHOD_ENUM) => void;
  logisticsChannel: LogisticsChannelItemProps[];
}

/**
 * 物流方式选择
 */
export const ShoppingMethod: FC<ShoppingMethodProps> = memo(
  ({method, onChange, logisticsChannel}) => {
    const [shipMethodId, setShipMethodId] = useState<number>(method);
    return (
      <View
        style={{
          width: SCREEN_WIDTH,
          backgroundColor: '#fff',
          marginTop: 30 * px,
          borderTopLeftRadius: 20 * px,
          borderTopRightRadius: 20 * px,
        }}>
        <Text
          style={{
            fontSize: 44 * px,
            paddingTop: 20 * px,
            fontWeight: 'bold',
            alignSelf: 'center',
            marginBottom: 50 * px,
          }}>
          Shipping Method
        </Text>
        {logisticsChannel && logisticsChannel.length > 0 ? (
          <View>
            {logisticsChannel.map((item, i) => {
              return (
                <View key={item.id + item.send_type + i}>
                  <ShoppingMethodItem
                    title={item.en_title}
                    text={`Estimated to delivery within ${item.send_time} days.`}
                    amount={item.price / 100.0}
                    active={shipMethodId === item.id}
                    onPress={() => {
                      setShipMethodId(item.id);
                      onChange && !item.is_select && onChange(item.id);
                      setTimeout(() => {
                        BottomSheet.hide();
                      }, 500);
                    }}
                  />
                  <View
                    style={{
                      height: 2 * px,
                      marginLeft: '2%',
                      marginRight: '2%',
                      width: '96%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      backgroundColor: '#F2F2F2',
                    }}
                  />
                </View>
              );
            })}
          </View>
        ) : null}
      </View>
    );
  },
);

interface ShoppingMethodItemProps {
  onPress: () => void;
  active: boolean;
  text: string;
  title: string;
  amount: number;
  disable?: boolean;
}

const ShoppingMethodItem: FC<ShoppingMethodItemProps> = ({
  onPress,
  active,
  text,
  title,
  amount,
  disable,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        height: 140 * px,
        alignItems: 'center',
        paddingLeft: 30 * px,
        paddingRight: 30 * px,
        flexDirection: 'row',
        paddingVertical: 20 * px,
      }}>
      <View style={{flex: 1}}>
        <Text
          style={{
            fontSize: 35 * px,
            color: title === 'FREE SHIPPING DISCOUNT' ? '#E11616' : '#000000',
            marginLeft: 20 * px,
            textAlign: 'left',
          }}>
          {title}
        </Text>
        <Text
          style={{
            fontSize: 30 * px,
            color: '#000000',
            marginLeft: 20 * px,
            textAlign: 'left',
          }}>
          {text}
        </Text>
      </View>

      {!disable && (
        <Text
          style={{
            fontSize: 35 * px,
            color: '#000000',
            marginLeft: 20 * px,
            textAlign: 'left',
          }}>
          ${amount}
        </Text>
      )}
      <View
        style={{
          justifyContent: 'center',
          marginLeft: 40 * px,
        }}>
        <Image
          style={{
            width: 70 * px,
            height: 70 * px,
            alignSelf: 'center',
          }}
          source={
            active
              ? require('../../assets/select.png')
              : disable
              ? require('../../assets/ic_disable_select.png')
              : require('../../assets/unselect.png')
          }
        />
      </View>
    </TouchableOpacity>
  );
};

export const PayMethodComponent: FC<
  PayMethodProps & {payAmount: number}
> = memo(({method, onChange, payAmount, paySource = 1}) => {
  const [loading, , data] = usePaymethod(paySource);
  const [selectedPayMethod, setSelectedPayMethod] = useState<PayMethodList>();
  useEffect(() => {
    if (data && data.length) {
      const item = data.find(({pay_type}) => pay_type === method);
      if (item) {
        onChange && onChange(method);
      } else {
        onChange && onChange(data[0].pay_type);
      }
      setSelectedPayMethod(item || data[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, method]);
  return (
    <TouchableOpacity
      onPress={() => {
        data &&
          BottomSheet.showLayout(
            <BottomPayMethod
              onChange={onChange}
              method={method}
              payAmount={payAmount}
              payMethods={data}
            />,
            568 * px,
            true,
          );
      }}
      activeOpacity={0.8}
      style={{
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        height: 140 * px,
        marginTop: 30 * px,
      }}>
      <Text
        style={{
          marginLeft: 30 * px,
          fontSize: 40 * px,
          flex: 1,
          color: '#000000',
          fontWeight: 'bold',
        }}>
        Payment Method
      </Text>
      {loading || !selectedPayMethod ? (
        <ActivityIndicator color={PRIMARY} />
      ) : (
        <>
          <GlideImageEle
            style={{
              width: 80 * px,
              height: 80 * px,
            }}
            source={{uri: selectedPayMethod?.icon}}
          />
          <Text
            style={{
              color: '#5E5E5E',
              marginRight: 12,
              marginLeft: 12 * px,
              fontSize: 34 * px,
            }}>
            {selectedPayMethod?.name}
          </Text>
        </>
      )}

      <Image
        style={{
          width: 21 * px,
          height: 37 * px,
          marginRight: 12,
          marginLeft: -2,
        }}
        resizeMode={'contain'}
        source={require('../../assets/me_arrow.png')}
      />
    </TouchableOpacity>
  );
});

export const BottomPayMethod: FC<{
  method: PAY_METHOD_ENUM;
  onChange?: (method: PAY_METHOD_ENUM) => void;
  payMethods: PayMethodList[];
  payAmount: number;
}> = memo(({method, onChange, payAmount, payMethods}) => {
  const [payMethodType, setPayMethodType] = useState<number>(method);
  return (
    <View
      style={{
        backgroundColor: '#fff',
        marginTop: 30 * px,
        borderRadius: 20 * px,
        paddingBottom: 100 * px,
      }}>
      <Text
        style={{
          fontSize: 90 * px,
          paddingTop: 20 * px,
          color: '#000',
          fontWeight: 'bold',
          alignSelf: 'center',
          marginBottom: 80 * px,
        }}>
        ${payAmount / 100.0}
      </Text>

      {payMethods?.map((item, index) => {
        return (
          <React.Fragment key={item.pay_type}>
            <PayMethodItem
              img={{uri: item.icon}}
              text={item.name}
              active={payMethodType === item.pay_type}
              onPress={() => {
                setPayMethodType(item.pay_type);
                onChange && onChange(item.pay_type);
                setTimeout(() => {
                  BottomSheet.hide();
                }, 500);
              }}
              uiStyle={PAY_STYLE_ENUM.CHECK_RIGHT}
            />
            {index !== payMethods.length && (
              <View
                style={{
                  height: 2 * px,
                  marginLeft: '2%',
                  marginRight: '2%',
                  width: '96%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  backgroundColor: '#F2F2F2',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
});

interface PayMethodProps {
  payUIStyle?: PAY_STYLE_ENUM;
  showTitle?: boolean;
  method: PAY_METHOD_ENUM;
  defaultMethod: PAY_METHOD_ENUM;
  paySource?: number;
  onChange?: (method: PAY_METHOD_ENUM) => void;
}

/**
 * 支付方式选择
 */
export const PayMethod: FC<PayMethodProps & {payAmount: number}> = memo(
  ({
    method,
    onChange,
    defaultMethod,
    payAmount,
    payUIStyle = PAY_STYLE_ENUM.CHECK_LEFT,
    showTitle = true,
    paySource = 1,
  }) => {
    const [loading, , data] = usePaymethod(paySource);
    useEffect(() => {
      if (data && data.length) {
        const item = data.find(({pay_type}) => pay_type === defaultMethod);
        if (item) {
          onChange && onChange(defaultMethod);
        } else {
          onChange && onChange(data[0].pay_type);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, defaultMethod]);
    return (
      <View
        style={{
          backgroundColor: '#fff',
          marginTop: 30 * px,
          //borderRadius: 20 * px,
        }}>
        {showTitle && (
          <Text
            style={{
              fontSize: payAmount === 0 ? 40 * px : 50 * px,
              paddingTop: 20 * px,
              color: '#000',
              fontWeight: 'bold',
              paddingHorizontal: 30 * px,
            }}>
            {payAmount === 0 ? 'Payment method' : `${payAmount / 100.0}`}
          </Text>
        )}
        {loading && (
          <View
            style={{
              height: 120 * px,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator color={PRIMARY} style={{alignSelf: 'center'}} />
          </View>
        )}
        {data?.map((item, index) => {
          return (
            <React.Fragment key={item.pay_type}>
              <PayMethodItem
                img={{uri: item.icon}}
                text={item.name}
                active={method === item.pay_type}
                onPress={() => onChange && onChange(item.pay_type)}
                uiStyle={payUIStyle}
              />
              {index !== data.length && (
                <View
                  style={{
                    height: 2 * px,
                    marginLeft: '2%',
                    marginRight: '2%',
                    width: '96%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    backgroundColor: '#F2F2F2',
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    );
  },
);

interface PayMethodItemProps {
  onPress: () => void;
  active: boolean;
  img: ImageSourcePropType;
  text: string;
  uiStyle: PAY_STYLE_ENUM;
}

const PayMethodItem: FC<PayMethodItemProps> = ({
  onPress,
  img,
  active,
  text,
  uiStyle,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        height: 140 * px,
        alignItems: 'center',
        paddingLeft: 30 * px,
        paddingRight: 30 * px,
        width: '100%',
        flexDirection: 'row',
        paddingVertical: 20 * px,
      }}>
      {uiStyle === PAY_STYLE_ENUM.CHECK_LEFT ? (
        <>
          <Image
            style={{
              width: 70 * px,
              height: 70 * px,
              marginRight: 30 * px,
            }}
            source={
              active
                ? require('../../assets/select.png')
                : require('../../assets/unselect.png')
            }
          />
          <GlideImageEle
            style={{
              width: 80 * px,
              height: 80 * px,
            }}
            source={img}
          />
          <Text
            style={{
              fontSize: 35 * px,
              color: '#000000',
              marginLeft: 20 * px,
              justifyContent: 'center',
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            {text}
          </Text>
        </>
      ) : (
        <>
          <GlideImageEle
            style={{
              width: 80 * px,
              height: 80 * px,
            }}
            source={img}
          />
          <Text
            style={{
              flex: 1,
              fontSize: 35 * px,
              color: '#000000',
              marginLeft: 20 * px,
              fontWeight: 'bold',
            }}>
            {text}
          </Text>
          <Image
            style={{
              width: 70 * px,
              height: 70 * px,
              marginRight: 30 * px,
            }}
            source={
              active
                ? require('../../assets/select.png')
                : require('../../assets/unselect.png')
            }
          />
        </>
      )}
    </TouchableOpacity>
  );
};

type scoreProps = {
  can_user_score: number;
  score_rate: number;
};

interface ScoreUseComponentProps {
  selectCoinFun: () => void;
  scores: scoreProps;
  useScores: number;
}

export const ScoreUseComponent: FC<ScoreUseComponentProps> = memo(
  ({selectCoinFun, scores, useScores}) => {
    return (
      <View
        style={{
          marginTop: 30 * px,
          backgroundColor: '#fff',
          paddingVertical: 10 * px,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            height: 120 * px,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 20 * px,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
            <Image
              source={require('../../assets/mystery_score.png')}
              style={{width: 64 * px, height: 64 * px}}
            />
            <Text style={{fontSize: 35 * px, marginLeft: 20 * px}}>
              Use {scores.can_user_score} credits offset $
              {scores.can_user_score / scores.score_rate}
            </Text>
          </View>
          <TouchableOpacity onPress={selectCoinFun}>
            <Image
              style={{
                width: 70 * px,
                height: 70 * px,
              }}
              source={
                useScores
                  ? require('../../assets/select.png')
                  : require('../../assets/unselect.png')
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);
/**
 * 支付界面底部文案
 */
export const PayInfoFooter: FC = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 77 * px,
        marginHorizontal: 12,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../assets/ic_safe.png')}
          style={{width: 56 * px, height: 68 * px}}
        />
        <Text style={{marginLeft: 5, fontSize: 40 * px, color: '#000'}}>
          Powered by paypal
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../assets/ic_24hours.png')}
          style={{width: 63 * px, height: 63 * px}}
        />
        <Text style={{marginLeft: 5, fontSize: 40 * px, color: '#000'}}>
          Free return in 24h
        </Text>
      </View>
    </View>
  );
};

interface FinalAmountProps {
  finalPrice: string | number;
}

/**
 * 显示最终金额
 */
export const FinalAmount: FC<FinalAmountProps> = ({finalPrice}) => {
  return (
    <View
      style={{
        marginHorizontal: 40 * px,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30 * px,
      }}>
      <Text
        style={{
          marginLeft: 12,
          fontSize: 50 * px,
          flex: 1,
          fontWeight: 'bold',
        }}>
        Total
      </Text>
      <Text
        style={{
          color: '#000',
          marginRight: 12,
          fontSize: 50 * px,
          fontWeight: 'bold',
        }}>
        ${finalPrice}
      </Text>
    </View>
  );
};

interface PayInfoOrderTimerProps {
  expireTime: number;
}

/**
 * 如果是订单列表进入， 显示当前的订单有效期倒计时
 */
export const PayInfoOrderTimer: FC<PayInfoOrderTimerProps> = ({expireTime}) => {
  return (
    <Timer targetTime={expireTime}>
      {(time) => {
        return (
          <View
            style={{
              paddingHorizontal: 30 * px,
              backgroundColor: '#fff',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',

                height: 150 * px,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  width: 361 * px,
                  textAlign: 'center',
                  fontSize: 40 * px,
                  color: '#282828',
                }}>
                Remaining Payment Time:
              </Text>
              <Text style={{color: '#FF1C20', fontSize: 50 * px}}>{time}</Text>
            </View>
            <View
              style={{
                height: 0,
                backgroundColor: '#F2F2F2',
              }}
            />
          </View>
        );
      }}
    </Timer>
  );
};

interface PayBottomButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  textStyle?: TextStyle;
  text: string;
}

/**
 *
 * pay 底部按钮
 *
 * @param param0 PayBottomButtonProps
 */
export const PayBottomButton: FC<PayBottomButtonProps> = ({
  disabled = false,
  onPress,
  loading,
  textStyle,
  text,
}) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: disabled ? '#A0A0A0' : PRIMARY,
        marginHorizontal: 8,
        height: 136 * px,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20 * px,
        width: 980 * px,
      }}
      disabled={loading || disabled}
      onPress={onPress}>
      {loading ? (
        <ActivityIndicator color={'white'} />
      ) : (
        <Text
          style={[
            {
              color: 'white',
              fontSize: 60 * px,
              fontWeight: 'bold',
            },
            textStyle,
          ]}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export const PayFixedBottomContainer: FC = ({children}) => {
  return (
    <View
      style={{
        justifyContent: 'center',
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingBottom: 45 * px,
      }}>
      {children}
    </View>
  );
};

interface OrderCancelBtnProps {
  loading: boolean;
  onPress: () => void;
}

export const OrderCancelBtn: FC<OrderCancelBtnProps> = memo(
  ({loading, onPress}) => {
    return (
      <TouchableOpacity
        style={{
          marginTop: 10 * px,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        disabled={loading}
        onPress={onPress}>
        {loading ? (
          <ActivityIndicator color={PRIMARY} />
        ) : (
          <Text
            style={{
              color: '#9A9A9A',
              fontSize: 50 * px,
              textDecorationColor: '#9A9A9A',
              textDecorationLine: 'underline',
              textDecorationStyle: 'solid',
            }}>
            cancel
          </Text>
        )}
      </TouchableOpacity>
    );
  },
);

//直接购买商品转换成购物车商品
export const useDirectBuyToCartData = () => {};

/**
 * 当vip状态发生变化的时候重新获取产品数据
 */
export const usePayInfoChange = (
  productId: number | undefined,
  from: PAGE_FORM_ENUM,
  qty: number,
  skuInfo: OrderDetailData.Skuinfo[] | undefined,
  use_fast_expenses: number,
  gift_id: number,
  useScores: number,
  coupon_id: number,
  productType: number,
  mysteryGiftId: number,
  shoppingMethod: number,
  selectProductId: number,
  couponCode?: string,
) => {
  const is_vip = useShallowEqualSelector(
    (state: any) => state.deprecatedPersist.profile.is_vip,
  ) as any;
  // const preFetch = useRef<any>();
  let [loading, updateOrderConfirmInfo, res] = useFetching<
    UserOrderConfirm.RootObject
  >(Api.updateOrderConfirmInfo);

  const result = useMemo(() => {
    if (res?.data && res.data.coupon_info) {
      const couponInfo = res.data.coupon_info;
      const commonCoupon = couponInfo.filter((item) => {
        return item.coupon_type_id !== 7;
      });
      const codeCoupon = couponInfo.filter((item) => {
        return item.coupon_type_id === 7;
      });
      return {
        ...res.data,
        code_coupon: codeCoupon,
        common_coupon: commonCoupon,
      };
    }

    if (res?.data) {
      return {
        ...res.data,
        code_coupon: null,
        common_coupon: null,
      };
    }

    return {
      not_available_coupon_list: [],
      product_price: null,
      tax_price: null,
      expenses_price: null,
      coupon_info: null,
      code_coupon: null,
      common_coupon: null,
      free_shipping_fee: null,
      free_tax_fee: null,
      free_gift_detail: null,
      can_user_score: 0,
      score_rate: 1,
      selected_coupon: null,
      logistics_channel: [],
      need_pay_price: 0,
      product_discount: null,
    };
  }, [res]);
  const updatePayInfo = useCallback(async () => {
    if (isOffersOrBag(from)) {
      // preFetch.current && preFetch.current.cancel();
      const _productId = productType === 8 ? mysteryGiftId : productId;
      await updateOrderConfirmInfo(
        _productId,
        // 产品类型在这只区分福袋 和 其他
        from === 'mystery' ? 1 : productType === 8 ? productType : 0,
        qty,
        skuInfo,
        use_fast_expenses,
        gift_id,
        useScores,
        coupon_id,
        shoppingMethod,
        selectProductId,
        couponCode,
      );
      // try {
      //   await preFetch.current;
      // } catch (error) {}
    }
  }, [
    from,
    productType,
    mysteryGiftId,
    productId,
    updateOrderConfirmInfo,
    qty,
    skuInfo,
    use_fast_expenses,
    gift_id,
    useScores,
    coupon_id,
    shoppingMethod,
    selectProductId,
    couponCode,
  ]);
  useEffect(() => {
    updatePayInfo();
  }, [updatePayInfo, is_vip]);
  return [loading, result, updatePayInfo] as const;
};

// free Shopping, free tax

interface FreeItemProps {
  children: any;
  onPress?: () => void;
  isFree: boolean;
  styles?: any;
  category: string;
}

/**
 * 列表条目
 *
 * @param param0 PayInfoListItemProps
 */
export const FreeItem: FC<FreeItemProps> = ({
  children,
  onPress,
  isFree,
  styles,
  category,
}) => {
  return (
    <TouchableOpacity
      disabled={isFree}
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        {
          backgroundColor: 'white',
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 40 * px,
          paddingHorizontal: 20 * px,
          marginTop: 0,
        },
        styles,
      ]}>
      <View
        style={{
          justifyContent: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}>
        <Image
          resizeMode={'contain'}
          source={
            category === 'tax'
              ? require('../../assets/ic_free.png')
              : require('../../assets/ic_not_free.png')
          }
          style={{width: 60 * px, height: 60 * px, marginRight: 20 * px}}
        />
        {children}
      </View>
      {!isFree ? (
        <Image
          style={{
            width: 21 * px,
            height: 37 * px,
            marginRight: 12,
            marginLeft: -2,
          }}
          resizeMode={'contain'}
          source={require('../../assets/me_arrow.png')}
        />
      ) : null}
    </TouchableOpacity>
  );
};

interface ChildProps {
  amount: number;
  category: string; //1:shopping；2:tax
  isFree: boolean;
  free_up_fee: number;
}

export const FreeChild = ({
  amount,
  category,
  isFree,
  free_up_fee,
}: ChildProps) => {
  const freeUpContent = free_up_fee ? `(Up to $${free_up_fee / 100} off)` : '';
  return isFree ? (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}>
      <Text style={{fontSize: 36 * px, marginRight: 10 * px}}>
        Eligible for
      </Text>
      <Text style={{fontSize: 36 * px, color: 'red'}}>
        {category === 'shopping' ? 'FREE SHIPPING' : 'FREE TAX'}
      </Text>
      <Text style={{fontSize: 36 * px, marginRight: 10 * px}}>
        {freeUpContent}
      </Text>
    </View>
  ) : (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}>
      <Text style={{fontSize: 36 * px, marginRight: 10 * px}}>Buy</Text>
      <Text style={{fontSize: 36 * px, color: 'red'}}>
        ${amount / 100.0} MORE
      </Text>
      <Text
        style={{
          fontSize: 36 * px,
          marginRight: 10 * px,
          marginHorizontal: 10 * px,
        }}>
        to enjoy
      </Text>
      <Text style={{fontSize: 36 * px, color: 'red'}}>
        {category === 'shopping' ? 'FREE SHIPPING' : 'FREE TAX'}
      </Text>
      <Text style={{fontSize: 36 * px, marginRight: 10 * px}}>
        {freeUpContent}
      </Text>
    </View>
  );
};
interface OrderNoteProps {
  noteContent?: string;
  onChangeText?: (value: string) => void;
  editable: boolean;
  style?: any;
}

export const OrderNoteComponent: FC<OrderNoteProps> = ({
  noteContent,
  onChangeText,
  editable,
  style,
}) => {
  const [message, setMessage] = useState(noteContent || '');
  return (
    <View
      style={[
        {
          backgroundColor: '#fff',
          marginTop: 30 * px,
        },
        style,
      ]}>
      <Text
        style={{
          fontSize: 40 * px,
          paddingTop: 20 * px,
          fontWeight: 'bold',
          paddingHorizontal: 30 * px,
        }}>
        Order Note
      </Text>
      <TextInput
        editable={editable}
        multiline={true}
        maxLength={300}
        style={{
          marginVertical: 20 * px,
          borderWidth: 2 * px,
          borderRadius: 10 * px,
          borderColor: '#929292',
          minHeight: 110 * px,
          maxHeight: 330 * px,
          paddingHorizontal: 10 * px,
          marginHorizontal: 30 * px,
          color: '#282828',
          flex: 1,
        }}
        onChangeText={(value) => {
          setMessage(value);
          onChangeText && onChangeText(value);
        }}
        value={message}
      />
    </View>
  );
};

// 新用户一元购订单返券金额
interface OneDollerReturnCouponProps {
  amount: string | number;
}

export const OneDollerReturnCoupon: FC<OneDollerReturnCouponProps> = ({
  amount,
}) => {
  return (
    <View
      style={{
        // marginHorizontal: 40 * px,
        backgroundColor: '#F76E64',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 120 * px,
        marginBottom: 20 * px,
        width: '100%',
      }}>
      <Text
        style={{
          fontSize: 40 * px,
        }}>
        Get
      </Text>
      <Text
        style={{
          fontSize: 50 * px,
          color: '#fff',
        }}>
        {' '}
        {amount} USD{' '}
      </Text>
      <Text
        style={{
          fontSize: 40 * px,
        }}>
        Coupon after placing order
      </Text>
    </View>
  );
};
