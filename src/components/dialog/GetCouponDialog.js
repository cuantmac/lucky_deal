import {
  Modal,
  TouchableOpacity,
  View,
  ImageBackground,
  Text,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {px, SCREEN_HEIGHT} from '../../constants/constants';
import {ScrollView} from 'react-native-gesture-handler';
import {
  homeCouponDiaShow,
  homeCouponDiaClick,
  homeCouponDiaClose,
} from '../../analysis/report';
import {ModalContainer} from '../common/ModalContainer';
import {MarketCouponCard} from '../../widgets/coupons/Coupons';
import {navigationRef} from '../../utils/refs';
import {PRIMARY} from '../../constants/colors';
export default forwardRef(({}, ref) => {
  const [show, setShow] = useState(false);
  const [couponData, setCouponData] = useState({});
  const [args, setArgs] = useState({});
  const [loading, setLoading] = useState(false);
  useImperativeHandle(
    ref,
    () => ({
      show: (_args) => {
        setArgs(_args);
        setCouponData(_args.data);
        // console.log('---_args', _args);
        setShow(true);
      },
      hide: () => {
        setShow(false);
      },
      isShowing: () => {
        return show;
      },
      updateData(data) {
        setCouponData(data);
      },
      setLoading(bool) {
        setLoading(bool);
      },
    }),
    [show],
  );

  useEffect(() => {
    if (show) {
      homeCouponDiaShow.setDataAndReport();
    }
  }, [show]);

  const handleCollect = useCallback(
    (activityId) => {
      homeCouponDiaClick.setDataAndReport();
      args?.handleCollect && args?.handleCollect(activityId);
    },
    [args],
  );

  const handleOkPress = useCallback(() => {
    setShow(false);
  }, []);

  if (!couponData || !show) {
    return null;
  }

  const Coupons = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#000000cc',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: 914 * px,
            height: 1190 * px,
            borderRadius: 30 * px,
            alignItems: 'center',
            position: 'relative',
          }}>
          <ImageBackground
            source={
              couponData.image
                ? {uri: couponData.image}
                : require('../../assets/home_coupon_bg2.png')
            }
            style={{
              width: 914 * px,
              height: 1190 * px,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 860 * px,
                height: 286 * px,
                // marginTop: 30 * px,
              }}>
              <View
                style={{
                  width: 550 * px,
                  // marginBottom: 10 * px,
                  marginLeft: 20 * px,
                  height: 150 * px,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#FFEA96',
                    fontSize: 45 * px,
                    textAlign: 'center',
                  }}
                  numberOfLines={2}>
                  {couponData.bullet_title}
                </Text>
              </View>
              {couponData.subtitle ? (
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 35 * px,
                    width: 450 * px,
                    textAlign: 'center',
                  }}
                  numberOfLines={2}>
                  {couponData.subtitle}
                </Text>
              ) : null}
            </View>
            <ScrollView showsVerticalScrollIndicator={true}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                {couponData?.coupon_list?.length > 0 &&
                  couponData?.coupon_list?.map((item, index) => {
                    return <MarketCouponCard data={item} key={index} />;
                  })}
              </View>
            </ScrollView>
            <View
              style={{
                height: 200 * px,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {couponData.status ? (
                <>
                  <CollectBtn onPress={handleOkPress}>OK</CollectBtn>
                  <TouchableOpacity
                    onPress={() => {
                      navigationRef.current.navigate('CouponCenter');
                      setShow(false);
                    }}>
                    <Text
                      style={{
                        color: '#ddd',
                      }}>
                      Check Coupons
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <CollectBtn
                  loading={loading}
                  onPress={() => handleCollect(couponData.activity_id)}>
                  Collect(All)
                </CollectBtn>
              )}
            </View>
          </ImageBackground>
        </View>
        <TouchableOpacity
          style={{
            width: 90 * px,
            height: 90 * px,
            position: 'absolute',
            right: 90 * px,
            top: (SCREEN_HEIGHT - 1400 * px) / 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            homeCouponDiaClose.setDataAndReport();
            if (args && args.closeCallBack) {
              args.closeCallBack();
            }
            setShow(false);
          }}>
          <Image
            style={{
              width: 54 * px,
              height: 54 * px,
            }}
            source={require('../../assets/activity/slot_close.png')}
            tintColor={'#fff'}
          />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <ModalContainer
      transparent={true}
      animationType={'fade'}
      onRequestClose={() => {
        setShow(false);
      }}
      visible={show}>
      <Coupons />
    </ModalContainer>
  );
});

const CollectBtn = ({onPress, children, loading = false}) => {
  return (
    <TouchableOpacity
      onPress={loading ? undefined : onPress}
      activeOpacity={0.8}>
      <ImageBackground
        source={require('../../assets/home_coupon_btn.png')}
        style={{
          height: 120 * px,
          width: 493 * px,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {loading ? (
          <ActivityIndicator size="small" color={PRIMARY} />
        ) : (
          <Text
            style={{
              fontSize: 52 * px,
              color: '#fff',
              textAlign: 'center',
            }}>
            {children}
          </Text>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
};
