import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Text, TouchableOpacity, ImageBackground} from 'react-native';
import {px} from '../../constants/constants';
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
    [show],
  );
  return (
    show && (
      <ImageBackground
        resizeMode="stretch"
        style={{
          width: 320 * px,
          zIndex: 9,
          height: 160 * px,
          paddingLeft: 20 * px,
          justifyContent: 'space-between',
          position: 'absolute',
          right: args.x || 0,
          top: args.y || 0,
          paddingTop: 20 * px,
        }}
        source={require('../../assets/cart_more_action_dialog_bg.png')}>
        <TouchableOpacity
          style={{
            width: 320 * px,
            height: 70 * px,
            justifyContent: 'center',
          }}
          onPress={() => {
            args.moveWishListFun && args.moveWishListFun();
          }}>
          <Text style={{fontSize: 34 * px, color: '#282828'}} numberOfLines={1}>
            Move To Wish List
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: 320 * px,
            height: 70 * px,
            justifyContent: 'center',
          }}
          onPress={() => {
            args.deleteFun && args.deleteFun();
          }}>
          <Text style={{fontSize: 34 * px, color: '#282828'}} numberOfLines={1}>
            Delete
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    )
  );
});
