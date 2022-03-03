import {
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from 'react-native';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {ModalContainer} from '../common/ModalContainer';
import {px, SCREEN_WIDTH} from '../../constants/constants';
import GlideImage from '../native/GlideImage';
import Utils from '../../utils/Utils';
import {navigationRef} from '../../utils/refs';
import AppModule from '../../../AppModule';

export default forwardRef(({}, ref) => {
  const [show, setShow] = useState(false);
  const [args, setArgs] = useState({});
  const goCart = () => {
    setShow(false);
    AppModule.reportClick('3', '303');
    navigationRef.current?.navigate('Cart', {
      showLeft: true,
      showRight: true,
    });
    args?.report && args?.report();
  };
  useImperativeHandle(
    ref,
    () => ({
      show: (_args = {}) => {
        setArgs(_args);
        setShow(true);
        setTimeout(() => {
          setShow(false);
        }, 3000);
      },
      hide: () => {
        setShow(false);
      },
    }),
    [],
  );

  return (
    <ModalContainer
      transparent={true}
      animationType={'fade'}
      onRequestClose={() => {
        setShow(false);
      }}
      visible={show}>
      <TouchableOpacity
        onPress={() => {
          setShow(false);
        }}
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ImageBackground
          style={{
            left: args.x ? args.x : 0,
            top: args.y ? args.y : 0,
            position: 'absolute',
            flexDirection: 'column',
            flex: 1,
            width: 523 * px,
            height: 298 * px,
            paddingLeft: 20 * px,
          }}
          source={require('../../assets/cart_badge_dialog_bg.png')}>
          <View style={{flexDirection: 'row'}}>
            <GlideImage
              source={Utils.getImageUri(args?.image)}
              resizeMode="center"
              style={{
                marginTop: 50 * px,
                width: 147 * px,
                height: 147 * px,
                borderRadius: 20 * px,
              }}
            />
            <View
              style={{
                marginTop: 50 * px,
                flex: 1,
                flexDirection: 'column',
                alignSelf: 'flex-start',
                marginLeft: 10,
              }}>
              <Text
                numberOfLines={1}
                style={{
                  maxWidth: SCREEN_WIDTH - 420 * px,
                  color: '#050505',
                  fontSize: 28 * px,
                }}>
                {args?.title}
              </Text>
              <Text
                style={{
                  marginTop: -10 * px,
                  alignSelf: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                  color: '#010101',
                  fontSize: 40 * px,
                }}>
                ${(args?.price / 100).toFixed(2)}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={goCart}
            style={{
              marginTop: 10 * px,
              width: 440 * px,
              alignSelf: 'center',
              borderRadius: 10 * px,
              backgroundColor: '#3C7DE3',
              height: 70 * px,
            }}>
            <Text
              style={{
                fontSize: 30 * px,
                color: '#fff',
                lineHeight: 70 * px,
                textAlign: 'center',
              }}
              numberOfLines={1}>
              View My Bag
            </Text>
          </TouchableOpacity>
        </ImageBackground>
      </TouchableOpacity>
    </ModalContainer>
  );
});
