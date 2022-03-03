import {
  Image,
  Modal,
  TouchableOpacity,
  View,
  Text,
  ImageBackground,
} from 'react-native';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {px} from '../../constants/constants';
import AppModule from '../../../AppModule';
import Utils from '../../utils/Utils';
import {reportData} from '../../constants/reportData';
import {ModalContainer} from '../common/ModalContainer';
const DeeplinkDialog = ({}, ref) => {
  const [show, setShow] = useState(false);
  const [args, setArgs] = useState({});
  const [time, setTime] = useState(10);
  // const [type, setType] = useState(type);

  useImperativeHandle(
    ref,
    () => ({
      show: (_args) => {
        setArgs(_args);
        setShow(true);
      },
      hide: () => {
        setShow(false);
      },
      isShowing: () => {
        return show;
      },
    }),
    [show],
  );
  useEffect(() => {
    if (!show) {
      return;
    }
    let timer = setTimeout(() => {
      if (time > 0) {
        setTime(time - 1);
      } else {
        clearInterval(timer);
        setTime(0);
        args?.callBack();
        setShow(false);
        AppModule.reportClose('17', '161', {
          CategoryId: reportData.deepLinkCategoryId,
          AdsID: args.way,
          ProductId: args.ids,
        });
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [time, args, show]);
  useEffect(() => {
    if (show) {
      AppModule.reportShow('17', '158', {
        CategoryId: reportData.deepLinkCategoryId,
        AdsID: args.way,
        ProductId: args.ids,
      });
      AppModule.reportPv('DeeplinkAdsPopup', {
        way: args.way,
        product_id: args.ids,
      });
    }
  }, [show, args]);
  const list = () => {
    return (
      <ImageBackground
        style={{
          width: 800 * px,
          height: 1161 * px,

          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        source={require('../../assets/deeplink_list_bg.png')}>
        <ImageBackground
          style={{
            width: 198 * px,
            height: 198 * px,
            position: 'absolute',
            right: 20,
            top: 50,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            transform: [{rotate: '-30deg'}],
          }}
          source={require('../../assets/deeplink_list_off.png')}>
          <Text
            style={{
              color: '#F10C44',
              fontSize: 60 * px,
              fontWeight: 'bold',
              paddingTop: 15 * px,
            }}>
            {args.percent}
          </Text>
          <Text
            style={{
              color: '#F10C44',
              fontSize: 60 * px,
              fontWeight: 'bold',
              marginTop: -20 * px,
            }}>
            off
          </Text>
        </ImageBackground>
        <Text
          style={{
            fontSize: 46 * px,
            color: '#fff',
            marginTop: 50 * px,
            fontWeight: 'bold',
          }}>
          Special Offer for You
        </Text>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              // backgroundColor: '#FF0A27',
              width: 528 * px,
              height: 134 * px,
              alignItems: 'center',
              justifyContent: 'center',
              // borderRadius: 67 * px,
              // fontWeight: 'bold',
            }}
            onPress={() => {
              AppModule.reportClick('17', '159', {
                CategoryId: reportData.deepLinkCategoryId,
                AdsID: args.way,
                ProductId: args.ids,
              });
              AppModule.reportTap(
                'DeeplinkAdsPopup',
                'ld_deeplink_popup_buynow',
                {way: args.way, product_id: args.ids},
              );
              args.callBack();
              setShow(false);
            }}>
            <ImageBackground
              source={require('../../assets/deeplink_list_btn_bg.png')}
              // resizeMode={'contain'}
              style={{
                width: 528 * px,
                height: 134 * px,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 70 * px,
                  lineHeight: 120 * px,
                  color: '#C23600',
                  fontWeight: 'bold',
                }}>
                Buy Now
              </Text>
            </ImageBackground>
          </TouchableOpacity>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginBottom: 50 * px,
              marginTop: 30 * px,
            }}>
            <Text
              style={{fontSize: 40 * px, fontWeight: 'bold', color: '#fff'}}>
              Time Remaining:{' '}
            </Text>
            <Text
              style={{
                fontSize: 40 * px,
                fontWeight: 'bold',
                color: '#fff',
                marginLeft: 10 * px,
              }}>
              0{Utils.countDown(time)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            width: 70 * px,
            height: 70 * px,
            position: 'absolute',
            right: 5,
            top: 5,
            alignItems: 'center',
            justifyContent: 'center',
            // zIndex: 999,
          }}
          onPress={() => {
            AppModule.reportClose('17', '160', {
              CategoryId: reportData.deepLinkCategoryId,
              AdsID: args.way,
              ProductId: args.ids,
            });
            AppModule.reportTap('DeeplinkAdsPopup', 'ld_deeplink_popup_close', {
              way: args.way,
              product_id: args.ids,
            });
            setShow(false);
          }}>
          <Image
            style={{
              width: 30 * px,
              height: 30 * px,
            }}
            source={require('../../assets/icon_home_one_dollar_close.png')}
          />
        </TouchableOpacity>
      </ImageBackground>
    );
  };
  const simple = () => {
    return (
      <View
        style={{
          width: 800 * px,
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: 30 * px,
        }}>
        <ImageBackground
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 256 * px,
            height: 271 * px,
            zIndex: 9,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          source={require('../../assets/deeplink_off_bg.png')}>
          <Text
            style={{
              fontSize: 50 * px,
              color: '#fff',
              transform: [{rotate: '-45deg'}],
              marginLeft: -80 * px,
              marginTop: -80 * px,
            }}>
            {args.percent} OFF
          </Text>
        </ImageBackground>
        <View
          style={{
            width: 520 * px,
            height: 520 * px,
            backgroundColor: '#FBDE6A',
            alignItems: 'center',
            marginTop: 50 * px,
          }}>
          <Image
            source={require('../../assets/alert_membership_reward2.png')}
            resizeMode={'contain'}
            style={{
              width: 500 * px,
              maxHeight: 500 * px,
            }}
          />
        </View>
        <View
          style={{
            marginTop: 40 * px,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 30 * px, color: '#000', fontWeight: 'bold'}}>
            CURRENT PRICE
          </Text>
          <Text
            style={{
              fontSize: 100 * px,
              color: '#00CD69',
              marginVertical: 15 * px,
              fontWeight: 'bold',
            }}>
            ${args.price / 100}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: '#FF0A27',
            width: 528 * px,
            height: 134 * px,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 67 * px,
            fontWeight: 'bold',
          }}
          onPress={() => {
            AppModule.reportClick('17', '159', {
              CategoryId: reportData.deepLinkCategoryId,
              AdsID: args.way,
              ProductId: args.ids,
            });
            AppModule.reportTap(
              'DeeplinkAdsPopup',
              'ld_deeplink_popup_buynow',
              {way: args.way, product_id: args.ids},
            );
            args.callBack();
            setShow(false);
          }}>
          <Text style={{fontSize: 67 * px, color: '#fff', textAlign: 'center'}}>
            Buy Now
          </Text>
        </TouchableOpacity>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            marginBottom: 50 * px,
            marginTop: 30 * px,
          }}>
          <Text style={{fontSize: 40 * px, fontWeight: 'bold', color: '#000'}}>
            Time Remaining:{' '}
          </Text>
          <Text
            style={{
              fontSize: 40 * px,
              fontWeight: 'bold',
              color: '#FF0A27',
              marginLeft: 10 * px,
            }}>
            0{Utils.countDown(time)}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            width: 70 * px,
            height: 70 * px,
            position: 'absolute',
            right: 5,
            top: 5,
            alignItems: 'center',
            justifyContent: 'center',
            // zIndex: 999,
          }}
          onPress={() => {
            AppModule.reportClose('17', '160', {
              CategoryId: reportData.deepLinkCategoryId,
              AdsID: args.way,
              ProductId: args.ids,
            });
            AppModule.reportTap('DeeplinkAdsPopup', 'ld_deeplink_popup_close', {
              way: args.way,
              product_id: args.ids,
            });
            setShow(false);
          }}>
          <Image
            style={{
              width: 30 * px,
              height: 30 * px,
            }}
            source={require('../../assets/close.png')}
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
      <View
        style={{
          flex: 1,
          backgroundColor: '#000000cc',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {args.type === 1 ? simple() : list()}
      </View>
    </ModalContainer>
  );
};
export default forwardRef(DeeplinkDialog);
