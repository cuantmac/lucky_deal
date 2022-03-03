import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Text, TouchableOpacity, ImageBackground} from 'react-native';
import {px} from '../../../constants/constants';
export default forwardRef(({}, ref) => {
  const [show, setShow] = useState(false);
  const [args, setArgs] = useState({});
  useImperativeHandle(
    ref,
    () => ({
      showCartMoreAction: (_args = {}) => {
        setArgs(_args);
        setShow(true);
      },
      isShow: () => {
        return show;
      },
      hide: () => {
        setShow(false);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [show, args],
  );
  return (
    show && (
      <ImageBackground
        resizeMode={'contain'}
        style={{
          width: 333 * px,
          zIndex: 9999,
          height: 222 * px,
          paddingLeft: 20 * px,
          justifyContent: 'center',
          paddingTop: 30 * px,
          paddingBottom: 20 * px,
          position: 'absolute',
          right: 20 * px,
          top: 200 * px,
        }}
        source={require('../../../assets/orders_more_action_dialog_bg.png')}>
        <TouchableOpacity
          style={{
            height: 90 * px,
            width: 333 * px,
            justifyContent: 'center',
          }}
          onPress={args.onPress}>
          <Text style={{fontSize: 34 * px, color: '#282828'}} numberOfLines={1}>
            Apply for refund
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{height: 90 * px, width: 333 * px, justifyContent: 'center'}}
          onPress={args.contact}>
          <Text style={{fontSize: 34 * px, color: '#282828'}} numberOfLines={1}>
            Contact Us
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    )
  );
});
