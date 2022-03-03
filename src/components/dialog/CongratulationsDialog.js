import {
  Image,
  ImageBackground,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {px} from '../../constants/constants';
import Utils from '../../utils/Utils';
import AppModule from '../../../AppModule';
import {ModalContainer} from '../common/ModalContainer';
export default forwardRef(({}, ref) => {
  const [show, setShow] = useState(false);
  const [args, setArgs] = useState({});
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

  const Card = ({data}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            width: 200 * px,
            lineHeight: 224 * px,
            fontSize: 60 * px,
            color: 'white',
            marginLeft: 10 * px,
            alignItems: 'center',
            textAlign: 'center',
          }}
          numberOfLines={1}>
          ${Utils.priceFilter(data.amount)}
        </Text>
        <View
          style={{
            marginLeft: 50 * px,
            flex: 1,
            height: 224 * px,
            paddingVertical: 30 * px,
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 40 * px,
              color: 'white',
              textAlign: 'left',
              width: 550 * px,
            }}>
            {data.title}
          </Text>
          <Text
            style={{
              fontSize: 28 * px,
              color: 'white',
              textAlign: 'left',
              width: 550 * px,
            }}>
            {data.use_description}
          </Text>
          <Text style={{fontSize: 26 * px, color: 'white', textAlign: 'left'}}>
            {data.begin_time}-{data.end_time}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <ModalContainer
      transparent={true}
      animationType={'fade'}
      onRequestClose={() => {}}
      visible={show}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#000000cc',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: 865 * px,
            backgroundColor: 'white',
            alignItems: 'center',
            borderRadius: 20 * px,
          }}>
          <Text
            style={{
              color: '#353434',
              fontSize: 60 * px,
              marginTop: 60 * px,
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            Congratulations!
          </Text>
          <Text
            style={{
              color: '#282828',
              fontSize: 50 * px,
              marginTop: 40 * px,
              textAlign: 'center',
            }}>
            {args.content}
          </Text>
          {args.couponList?.map((item, index) => {
            return (
              <ImageBackground
                key={index}
                source={require('../../assets/code_coupon_card_bg.png')}
                style={{width: 755 * px, height: 224 * px, marginTop: 60 * px}}>
                <Card data={item} />
              </ImageBackground>
            );
          })}

          <TouchableOpacity
            style={{
              marginTop: 90 * px,
              marginBottom: 60 * px,
              width: 520 * px,
              height: 100 * px,
              borderRadius: 10 * px,
              backgroundColor: '#EC3A30',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              if (args.callBack) {
                args.callBack();
              }
              setShow(false);
            }}>
            <Text
              style={{
                fontSize: 50 * px,
                fontWeight: 'bold',
                color: 'white',
              }}>
              OK
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 70 * px,
              height: 70 * px,
              position: 'absolute',
              right: 0,
              top: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              AppModule.reportClose('22', '281');
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
      </View>
    </ModalContainer>
  );
});
