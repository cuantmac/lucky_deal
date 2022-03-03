import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TouchableWithoutFeedbackProps,
  ViewProps,
  Animated,
  useWindowDimensions,
  ScrollView,
  PanResponder,
  Easing,
  ImageStyle,
  ImageProps,
  StatusBar,
} from 'react-native';
import {ModalContainer} from '../common/ModalContainer';
const ModalContainerRef = ModalContainer as any;
export interface ExpandProps<T> {
  title: ReactNode;
  data: T[];
  renderItem: ({
    item,
    index,
    closeExpand,
  }: {
    item: T;
    index: number;
    closeExpand: () => Promise<void>;
  }) => JSX.Element;
  showRotateIcon?: boolean;
  rotateIconStyle?: ImageStyle;
  rotateImageSource?: ImageProps['source'];
  rotateImageProps?: Omit<ImageProps, 'style'>;
  duration?: number;
  keyExtra?: (item: T, index: number) => string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  onShow?: () => void;
  onClose?: () => void;
  // 如果statusBar设置了 translucent 高度需要加上StatusBar
  statusBarTranslucent?: boolean;
}

export function Expand<T>({
  renderItem,
  title,
  data,
  keyExtra,
  textStyle,
  containerStyle,
  duration = 200,
  showRotateIcon = true,
  rotateIconStyle,
  rotateImageSource = require('../../assets/icon_search_expand.png'),
  rotateImageProps,
  onShow,
  onClose,
  statusBarTranslucent = false,
}: ExpandProps<T>): JSX.Element {
  const scaleSize = useWindowDimensions();
  const containerViewRef = useRef<TouchableOpacity>(null);
  const [position, setPosition] = useState({left: 0, top: 0});
  const [visible, setVisible] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animateHeight = useRef(new Animated.Value(0)).current;
  const maxContentHeight = scaleSize.height - position.top;
  const hasMesurSize = contentHeight > 0;
  const animatedInstance = useRef<Animated.CompositeAnimation>();

  const openAnimate = useCallback(() => {
    animatedInstance.current = Animated.timing(animateHeight, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    animatedInstance.current.start(() => {
      onShow && onShow();
    });
  }, [animateHeight, duration, onShow]);

  const closeAnimate = useCallback(() => {
    return new Promise<void>((resolve) => {
      animatedInstance.current && animatedInstance.current.stop();
      animatedInstance.current = Animated.sequence([
        Animated.delay(200),
        Animated.timing(animateHeight, {
          toValue: 0,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]);
      animatedInstance.current.start(() => {
        setVisible(false);
        onClose && onClose();
        setTimeout(() => {
          resolve();
        }, 100);
      });
    });
  }, [animateHeight, onClose]);

  const handleTogglePress = useCallback(() => {
    if (visible) {
      closeAnimate();
    } else {
      setVisible(!visible);
    }
  }, [closeAnimate, visible]);

  // 计算当前按钮位置
  const handleOnLayout = useCallback<
    NonNullable<TouchableWithoutFeedbackProps['onLayout']>
  >(() => {
    containerViewRef.current?.measure((x, y, width, height, pagex, pagey) => {
      const statusBarHeight = statusBarTranslucent
        ? StatusBar.currentHeight || 0
        : 0;
      setPosition({
        top: pagey + height + statusBarHeight,
        left: pagex,
      });
    });
  }, [statusBarTranslucent]);

  // 计算内容的高度
  const handleContentLayout = useCallback<NonNullable<ViewProps['onLayout']>>(
    ({
      nativeEvent: {
        layout: {height},
      },
    }) => {
      setContentHeight(height);
    },
    [],
  );

  useEffect(() => {
    if (!hasMesurSize) {
      return;
    }
    if (visible) {
      openAnimate();
    }
    if (!visible) {
      setContentHeight(0);
    }
  }, [hasMesurSize, openAnimate, visible]);

  return (
    <>
      <TouchableOpacity
        ref={containerViewRef}
        onLayout={handleOnLayout}
        style={[{flexDirection: 'row', alignItems: 'center'}, containerStyle]}
        onPress={handleTogglePress}>
        {React.isValidElement(title) ? (
          title
        ) : (
          <Text style={textStyle}>{title}</Text>
        )}
        {showRotateIcon && (
          <Animated.Image
            resizeMode={'stretch'}
            {...rotateImageProps}
            style={[
              {
                width: 12,
                height: 20,
              },
              rotateIconStyle,
              {
                transform: [
                  {
                    rotateZ: animateHeight.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['-180deg', '0deg'],
                    }),
                  },
                ],
              },
            ]}
            source={rotateImageSource}
          />
        )}
      </TouchableOpacity>
      <ModalContainerRef
        transparent
        visible={visible}
        onRequestClose={() => closeAnimate()}>
        <ExpandMask top={position.top} onPress={handleTogglePress}>
          <Animated.View
            style={{
              opacity: hasMesurSize ? 1 : 0,
              maxHeight: hasMesurSize
                ? animateHeight.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, contentHeight],
                  })
                : maxContentHeight,
              overflow: 'hidden',
            }}>
            <ScrollView
              onLayout={handleContentLayout}
              style={{
                minHeight: contentHeight,
                maxHeight: maxContentHeight,
                backgroundColor: 'white',
              }}>
              {data.map((item, index) => {
                return (
                  <React.Fragment
                    key={keyExtra ? keyExtra(item, index) : index}>
                    {renderItem({item, index, closeExpand: closeAnimate})}
                  </React.Fragment>
                );
              })}
            </ScrollView>
          </Animated.View>
        </ExpandMask>
      </ModalContainerRef>
    </>
  );
}

interface ExpandMaskProps {
  top: number;
  onPress: () => void;
}

/**
 * expand底部阴影
 * 如果用户点击任何非事件区域均会触发阴影的点击事件，否则不会
 */
const ExpandMask: FC<ExpandMaskProps> = ({top, children, onPress}) => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        return true;
      },
      // 允许释放事件权限
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: () => {
        onPress && onPress();
      },
    }),
  ).current;
  return (
    <View
      style={{flex: 1, backgroundColor: 'transparent'}}
      {...panResponder.panHandlers}>
      <View style={{height: top}} />
      <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,.4)'}}>
        {children}
      </View>
    </View>
  );
};
