import React, {useEffect, useState} from 'react';
import {px} from '../../../constants/constants';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  FlatList,
} from 'react-native';
import BottomSheet from '../../dialog/BottomSheet';
import GlideImage from '../../native/GlideImage';
import Utils from '../../../utils/Utils';
let selectedInterval;
function CouponSelecteList({coupons, callBack, selectedCoupon}) {
  const [couponList, setCouponList] = useState(
    coupons.map((item) => {
      return {...item, selected: false};
    }),
  );
  useEffect(() => {
    resetChooserState(selectedCoupon ? selectedCoupon.coupon_id : -1);
    if (selectedInterval) {
      clearInterval(selectedInterval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coupons]);

  const resetChooserState = (id) => {
    const newChoosers = couponList.map((item) => {
      if (item.coupon_id === id) {
        item.selected = !item.selected;
      } else {
        item.selected = false;
      }
      return item;
    });
    setCouponList(newChoosers);
  };
  const renderItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => {
        resetChooserState(item.coupon_id);
        if (item.selected) {
          selectedInterval = setInterval(() => {
            BottomSheet.hideWithOutAnimation();
            clearInterval(selectedInterval);
            callBack(item);
          }, 500);
        } else {
          callBack(null);
        }
      }}>
      <ImageBackground
        style={{height: 337 * px, marginTop: 30 * px, flexDirection: 'row'}}
        resizeMode={'contain'}
        source={require('../../../assets/coupon_pink_bg.png')}>
        {item.discount_type === 1 ? (
          <View style={{flexDirection: 'column', justifyContent: 'center'}}>
            <Text
              style={{
                textAlign: 'center',
                width: 315 * px,
                fontSize: 60 * px,
                color: 'white',
                marginLeft: 50 * px,
                fontWeight: 'bold',
              }}>
              {item.amount + '% OFF'}
            </Text>
            {item.max_discount > 0 && (
              <Text
                style={{
                  textAlign: 'center',
                  width: 315 * px,
                  fontSize: 30 * px,
                  color: 'white',
                  marginLeft: 50 * px,
                }}>
                (Max ${item.max_discount / 100.0})
              </Text>
            )}
          </View>
        ) : (
          <Text
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              width: 315 * px,
              fontSize: 70 * px,
              color: 'white',
              marginLeft: 50 * px,
              fontWeight: 'bold',
            }}
            numberOfLines={1}>
            {`$${item.amount / 100.0}`}
          </Text>
        )}

        <View
          style={{
            height: 300 * px,
            paddingVertical: 40 * px,
            flexDirection: 'column',
            position: 'absolute',
            right: 60,
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={{
                fontSize: 40 * px,
                color: 'white',
                textAlign: 'left',
                width: 500 * px,
              }}>
              {item.title}
            </Text>
            <Text
              style={{
                fontSize: 30 * px,
                color: 'white',
                textAlign: 'left',
                width: 500 * px,
              }}
              numberOfLines={1}>
              $
              {(
                (item.discount_type === 1 ? item.remission_fee : item.amount) /
                100
              ).toFixed(2)}{' '}
              off Your Purchase
            </Text>
          </View>

          <Text style={{fontSize: 26 * px, color: 'white', textAlign: 'left'}}>
            {/*Expires:{Utils.formatDate2(item.expire_date)}*/}
            {item.begin_time}-{item.end_time}
          </Text>
        </View>
        <Image
          style={{
            width: 70 * px,
            height: 70 * px,
            alignSelf: 'center',
            position: 'absolute',
            right: 20,
          }}
          resizeMode={'contain'}
          source={
            item.selected
              ? require('../../../assets/select.png')
              : require('../../../assets/ic_white_unselected.png')
          }
        />
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#fff', minHeight: 800 * px}}>
      <Text
        style={{
          fontSize: 50 * px,
          color: '#EF4A36',
          marginVertical: 40 * px,
          alignSelf: 'center',
        }}
        numberOfLines={1}>
        Choose a coupon
      </Text>
      <FlatList
        style={{height: 800 * px}}
        data={couponList}
        onEndReachedThreshold={0.4}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity
        style={{
          width: 70 * px,
          height: 70 * px,
          position: 'absolute',
          right: 5,
          top: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          BottomSheet.hide();
        }}>
        <Image
          style={{
            width: 30 * px,
            height: 30 * px,
          }}
          source={require('../../../assets/close.png')}
        />
      </TouchableOpacity>
    </View>
  );
}

export default CouponSelecteList;
