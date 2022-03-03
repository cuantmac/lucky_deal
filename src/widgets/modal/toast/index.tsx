import {PRIMARY} from '@src/constants/colors';
import {isWeb, px2dp} from '@src/helper/helper';
import Modal from 'react-native-modal';

import React, {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  FC,
  useCallback,
} from 'react';
import {createRef} from 'react';
import {StyleSheet} from 'react-native';
import {
  StyleProp,
  ViewStyle,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';

interface ToastParams {
  duration?: number;
  content: ReactNode;
  callback?: () => void;
}

interface ToastRef {
  toast: (params: ToastParams) => void;
  hide: () => void;
}

interface ToastProps {
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

const ToastContainer = forwardRef<ToastRef, ToastProps>(
  ({duration = 0, style}, ref) => {
    const [toastParams, setToastParams] = useState<ToastParams>();
    const timerRef = useRef<number>();
    const callbackRef = useRef<ToastParams['callback']>();

    const closeToast = useCallback(() => {
      toastParams?.callback && toastParams.callback();
      setToastParams(undefined);
    }, [toastParams]);

    useImperativeHandle(
      ref,
      () => {
        return {
          toast: (params) => {
            if (toastParams) {
              toastParams.callback && toastParams.callback();
            }
            setToastParams({
              ...params,
              duration:
                params.duration === undefined ? duration : params.duration,
            });
          },
          hide: () => {
            closeToast();
          },
        };
      },
      [closeToast, duration, toastParams],
    );

    useEffect(() => {
      if (toastParams) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        callbackRef.current = toastParams.callback;
        if (toastParams.duration !== 0) {
          timerRef.current = setTimeout(() => {
            closeToast();
          }, toastParams.duration);
        }
      }
    }, [closeToast, toastParams]);

    return (
      <>
        <Modal
          // @ts-ignore
          deviceHeight={isWeb() ? 'auto' : undefined}
          isVisible={!!toastParams}
          useNativeDriver
          backdropTransitionInTiming={10}
          backdropTransitionOutTiming={10}
          animationInTiming={10}
          animationOutTiming={10}
          animationOut="fadeOut"
          animationIn={'fadeIn'}
          hasBackdrop={false}>
          <View style={[ToastStyles.container, style]}>
            {toastParams?.content}
          </View>
        </Modal>
      </>
    );
  },
);

interface ToastProps {
  children?: string;
}

const Toast: FC<ToastProps> = ({children}) => {
  return <Text style={ToastStyles.toastText}>{children}</Text>;
};

const Loading: FC = () => {
  return (
    <View style={ToastStyles.loadingStyle}>
      <ActivityIndicator size={px2dp(30)} color={PRIMARY} />
    </View>
  );
};

const ToastStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: {
    backgroundColor: 'rgba(0,0,0,.6)',
    paddingHorizontal: px2dp(10),
    paddingVertical: px2dp(5),
    color: 'white',
    fontSize: px2dp(14),
    borderRadius: px2dp(4),
  },
  loadingStyle: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,.6)',
    borderRadius: px2dp(6),
  },
});

const toastRef = createRef<ToastRef>();

export const ToastPortal: FC = () => {
  return (
    <>
      <ToastContainer ref={toastRef} />
    </>
  );
};

export const ToastManager = {
  toast: (text: string) => {
    return new Promise<void>((resolve) => {
      toastRef.current?.toast({
        duration: 2000,
        content: <Toast>{text}</Toast>,
        callback: () => {
          setTimeout(() => {
            resolve();
          }, 100);
        },
      });
    });
  },
  loading: () => {
    toastRef.current?.toast({
      duration: 0,
      content: <Loading />,
    });
  },
  hide: () => {
    toastRef.current?.hide();
  },
};
