import {
  Animated,
  Easing,
  Modal,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {
  createRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {px} from '../../constants/constants';
import {ModalContainer} from '../common/ModalContainer';

export default class BottomSheet {
  static ref = createRef();

  static showLayout(layout, minHeight = 568 * px, outDismiss = false) {
    BottomSheet.ref.current?.show({layout, minHeight, outDismiss});
  }

  static hide() {
    BottomSheet.ref.current?.hide();
  }

  static hideWithOutAnimation() {
    BottomSheet.ref.current?.hideWithOutAnimation();
  }

  static isShowing() {
    return BottomSheet.ref.current?.isShowing();
  }
}

export const BottomSheetView = forwardRef(() => {
  const [show, setShow] = useState(false);
  const [args, setArgs] = useState({});
  const translateY = useRef(new Animated.Value(1920 * px)).current;

  useImperativeHandle(
    BottomSheet.ref,
    () => ({
      show: (_args) => {
        setArgs(_args);
        setShow(true);
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
      },
      hide: () => {
        Animated.timing(translateY, {
          toValue: 1920 * px,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start(() => {
          setShow(false);
        });
      },
      isShowing: () => {
        return show;
      },

      hideWithOutAnimation: () => {
        setShow(false);
      },
    }),
    [show, translateY],
  );

  return (
    <ModalContainer
      // transparent={true}
      // animationType={'fade'}
      onRequestClose={() => {
        BottomSheet.hide();
      }}
      visible={show}>
      {args.outDismiss ? (
        <TouchableWithoutFeedback
          onPress={() => {
            BottomSheet.hide();
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#000000cc',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            {/* <TouchableWithoutFeedback onPress={() => {}}> */}
            <Animated.View
              style={{
                width: '100%',
                backgroundColor: 'white',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                minHeight: args.minHeight ? args.minHeight : 568 * px,
                transform: [{translateY: translateY}],
              }}>
              {React.isValidElement(args.layout) && args.layout}
            </Animated.View>
            {/* </TouchableWithoutFeedback> */}
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: '#000000cc',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          {/* <TouchableWithoutFeedback onPress={() => {}}> */}
          <Animated.View
            style={{
              width: '100%',
              backgroundColor: 'white',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              minHeight: args.minHeight ? args.minHeight : 568 * px,
              transform: [{translateY: translateY}],
            }}>
            {React.isValidElement(args.layout) && args.layout}
          </Animated.View>
          {/* </TouchableWithoutFeedback> */}
        </View>
      )}
    </ModalContainer>
  );
});
