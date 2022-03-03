import {Text, TouchableOpacity, View, Image} from 'react-native';
import {px} from '../../../constants/constants';
import React, {useEffect, useState} from 'react';
import Timeline from './Timeline';
import AlertDialog from '../../dialog/AlertDialog';
import {ConfirmDialog} from '../../cart/CartItem';

export default function ({
  showTimeLine,
  _deliveryInfos,
  address,
  title,
  deliveryOrder,
  updateAddressCallBack,
  enableChangeAddress,
}) {
  let deliveryInfos =
    _deliveryInfos?.length &&
    _deliveryInfos.map((item) => {
      return {
        icon: 'http://static.luckydeal.vip/images/order_fly_inactive.png',
        ...item,
      };
    });
  const [expand, setExpand] = useState(false);
  const displayName = () => {
    var name = address.full_name || address.nick_name;
    if (name != null && name.length > 6) {
      name = name.replace(name.slice(2, 5), '*');
    }
    return name;
  };

  const displayPhoneNumber = () => {
    var phoneNumber = address.phone_number;
    if (phoneNumber != null && phoneNumber.length > 4) {
      phoneNumber = phoneNumber.replace(
        phoneNumber.slice(phoneNumber.length - 4, phoneNumber.length),
        '****',
      );
      return phoneNumber;
    }
  };

  const displayAddress = () => {
    return address.address;
  };
  const displayFirstLineInfo = {
    create_time: '',
    detail:
      displayName() + ', ' + displayPhoneNumber() + '. ' + displayAddress(),
    description: '',
    icon: 'http://static.luckydeal.vip/images/order_address.png',
  };

  const changeAddressOnPress = () => {
    AlertDialog.showLayout(
      ConfirmDialog({
        minHeight: 660 * px,
        content:
          'Please note that the update of your address maybe not successful, as when you are updating it, the order maybe just has being shipped.',
        okText: 'Update it',
        cancelText: 'Cancel',
        onOk: () => {
          updateAddressCallBack && updateAddressCallBack();
        },
        onCancel: () => {
          AlertDialog.hide();
        },
      }),
    );
  };

  var displayInfos = [];
  useEffect(() => {
    if (deliveryInfos != null) {
      if (
        !(
          deliveryInfos?.length > 0 &&
          deliveryInfos[0].detail === displayFirstLineInfo.detail
        )
      ) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        displayInfos = deliveryInfos.splice(0, 0, displayFirstLineInfo);
      }
      if (deliveryInfos?.length >= 2) {
        displayInfos = deliveryInfos.slice(0, 2);
      }
      setDeliveryInfoData(displayInfos);
    }
  }, [showTimeLine]);

  const [deliveryInfoData, setDeliveryInfoData] = useState(displayInfos);
  const DeliveryOrderInfo = () => {
    if (deliveryOrder === null || deliveryOrder.length === 0) {
      return <View />;
    }
    return (
      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          height: 272 * px,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          style={{width: 138 * px, height: 131 * px, marginLeft: 10}}
          resizeMode={'contain'}
          source={require('../../../assets/icon_package.png')}
        />
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
            height: 272 * px,
            justifyContent: 'center',
            alignSelf: 'flex-start',
          }}>
          <Text
            numberOfLines={2}
            style={{
              color: 'black',
              fontSize: 15,
              marginLeft: 10,
            }}>
            LuckyDeal Shipping
          </Text>
          <Text
            style={{
              color: '#9B9898',
              fontSize: 14,
              marginLeft: 10,
              marginTop: 5,
            }}>
            {deliveryOrder}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <View
      style={{
        backgroundColor: '#fff',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: 'black',
            marginLeft: 12,
            paddingVertical: 10,
            fontSize: 50 * px,
          }}>
          {title}
        </Text>
        {enableChangeAddress && (
          <TouchableOpacity
            style={{paddingVertical: 10}}
            onPress={changeAddressOnPress}>
            <Text
              style={{
                marginRight: 12,
                color: '#F04A33',
                fontSize: 38 * px,
              }}>
              Change address
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {showTimeLine ? (
        <View
          style={{
            backgroundColor: '#fff',
          }}>
          <Timeline
            style={{
              marginTop: 20,
            }}
            circleSize={20}
            showTime={false}
            descriptionStyle={{marginTop: 4, color: '#767474', fontSize: 12}}
            data={deliveryInfoData}
            titleStyle={{color: '#767474'}}
            innerCircle={'icon'}
            circleColor={'transparent'}
          />
          {!expand && deliveryInfos?.length > 2 ? (
            <TouchableOpacity
              onPress={() => {
                setDeliveryInfoData(deliveryInfos);
                setExpand(true);
              }}
              style={{
                borderBottomLeftRadius: 20 * px,
                borderBottomRightRadius: 20 * px,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  height: 40,
                  borderColor: '#EEEEEE',
                  borderTopWidth: 1,
                  textAlignVertical: 'center',
                }}>
                View History
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
      <DeliveryOrderInfo />
    </View>
  );
}
