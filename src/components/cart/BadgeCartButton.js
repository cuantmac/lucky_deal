import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {Image, Text, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import {px, SCREEN_WIDTH} from '../../constants/constants';
import {dialogs, navigationRef} from '../../utils/refs';
import {useShallowEqualSelector} from '../../utils/hooks';
import {useIsFocused} from '@react-navigation/core';
import AppModule from '../../../AppModule';
/**
 * sourceType 1: 列表 2-详情 3-Add Items(凑单列表) 4:多件多折列表
 */
export default forwardRef(
  ({style, tintColor, sourceType, headerRight = false}, ref) => {
    const [positionPoint, setPositionPoint] = useState({x: 0, y: 0});
    const cartBadgeRef = useRef();
    const {cartNum} = useShallowEqualSelector(
      (state) => state.deprecatedPersist,
    );
    const focus = useIsFocused();
    const onLayout = (e) => {
      cartBadgeRef.current?.measure((fx, fy, width, height, ox, oy) => {
        if (headerRight) {
          setPositionPoint({
            x: SCREEN_WIDTH - 40 * px - 500 * px,
            y: oy + height,
          });
        } else {
          setPositionPoint({
            x: ox + width - 500 * px,
            y: oy + height,
          });
        }
      });
    };
    const goCart = () => {
      if (sourceType === 1) {
        AppModule.reportClick('2', '293');
      } else if (sourceType === 2) {
        AppModule.reportClick('3', '295');
      }
      navigationRef.current?.navigate('Cart', {
        showLeft: true,
        showRight: true,
      });
    };

    useEffect(() => {
      let sub = DeviceEventEmitter.addListener('showCartDialog', (data) => {
        if (focus) {
          showDialog(data);
        }
      });
      return () => {
        sub.remove();
      };
    }, [showDialog, focus, positionPoint]);

    useEffect(() => {
      if (focus) {
        if (sourceType === 1) {
          AppModule.reportShow('2', '292');
        } else if (sourceType === 2) {
          AppModule.reportShow('3', '294');
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const showDialog = useCallback(
      (data) => {
        if (sourceType === 3) {
          AppModule.reportShow('26', '397');
        } else {
          AppModule.reportShow('3', '302');
        }
        dialogs.badgeCartDialog?.current.show({
          x: positionPoint.x,
          y: positionPoint.y,
          title: data.title,
          image: data.image,
          price: data.price,
          report: () => {
            if (sourceType === 3) {
              AppModule.reportClick('26', '398');
            }
          },
        });
      },
      [positionPoint.x, positionPoint.y, sourceType],
    );
    useImperativeHandle(
      ref,
      () => ({
        showCartDialog: () => {
          showDialog();
        },
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [positionPoint],
    );
    return (
      <TouchableOpacity
        ref={cartBadgeRef}
        onLayout={onLayout}
        onPress={goCart}
        style={[
          {
            width: 80 * px,
            height: 80 * px,
            marginHorizontal: 40 * px,
            justifyContent: 'center',
          },
          style,
        ]}>
        <Image
          style={{
            width: 48 * px,
            height: 53 * px,
            alignSelf: 'center',
            tintColor: tintColor ? tintColor : 'black',
          }}
          resizeMode={'contain'}
          source={require('../../assets/cart_badge.png')}
        />
        {cartNum > 0 && (
          <Text
            style={{
              position: 'absolute',
              right: 0,
              top: 2,
              backgroundColor: '#FF4A1A',
              borderRadius: 15 * px,
              width: 30 * px,
              height: 30 * px,
              lineHeight: 30 * px,
              color: '#fff',
              fontSize: 24 * px,
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}>
            {cartNum}
          </Text>
        )}
      </TouchableOpacity>
    );
  },
);
