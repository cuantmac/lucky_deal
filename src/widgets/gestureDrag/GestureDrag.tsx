import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {useWindowDimensions, Animated, Easing} from 'react-native';
import {
  State,
  PanGestureHandler,
  PanGestureHandlerProperties,
} from 'react-native-gesture-handler';

interface GestureDragProps {
  distance?: number;
  top?: number;

  boxWidth: number;
  children: (val: {left: boolean; moving: boolean}) => JSX.Element;
}

export const GestureDrag: FC<GestureDragProps> = ({
  children,
  distance = 10,
  top = 0,
  boxWidth,
}) => {
  const {width} = useWindowDimensions();
  const animatedX = useRef(new Animated.Value(0)).current;
  const animatedY = useRef(new Animated.Value(0)).current;
  const [offset, setOffset] = useState({
    x: width - distance - boxWidth,
    y: top,
  });
  const [enable, setEnable] = useState(true);
  const [left, setLeft] = useState(false);
  const [moving, setMoving] = useState(false);

  const onPanGestureEvent = useRef(
    Animated.event(
      [{nativeEvent: {translationX: animatedX, translationY: animatedY}}],
      {
        useNativeDriver: false,
      },
    ),
  ).current;

  const onHandlerStateChange = useCallback<
    NonNullable<PanGestureHandlerProperties['onHandlerStateChange']>
  >(
    (event) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        setMoving(true);
      }

      if (event.nativeEvent.oldState === State.ACTIVE) {
        setMoving(false);
        setOffset({
          x: offset.x + event.nativeEvent.translationX,
          y: offset.y + event.nativeEvent.translationY,
        });
        animatedX.setValue(0);
        animatedY.setValue(0);
      }
    },
    [animatedX, animatedY, offset.x, offset.y],
  );

  useEffect(() => {
    const center = (width - boxWidth) / 2;
    if (offset.x <= center && offset.x !== distance) {
      // 吸附左侧
      setEnable(false);
      setLeft(true);
      Animated.timing(animatedX, {
        toValue: distance - offset.x,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => {
        setTimeout(() => {
          setOffset({x: distance, y: offset.y});
          animatedX.setValue(0);
          animatedY.setValue(0);
          setEnable(true);
        }, 100);
      });
      return;
    }

    const rightDistance = width - distance - boxWidth;
    if (offset.x > center && offset.x !== rightDistance) {
      // 吸附右侧
      setEnable(false);
      setLeft(false);
      Animated.timing(animatedX, {
        toValue: rightDistance - offset.x,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => {
        setTimeout(() => {
          setOffset({x: rightDistance, y: offset.y});
          animatedX.setValue(0);
          animatedY.setValue(0);
          setEnable(true);
        }, 100);
      });
    }
  }, [animatedX, animatedY, boxWidth, distance, offset.x, offset.y, width]);

  return (
    <PanGestureHandler
      enabled={enable}
      onGestureEvent={onPanGestureEvent}
      onHandlerStateChange={onHandlerStateChange}>
      <Animated.View
        style={{
          position: 'absolute',
          left: Animated.add(new Animated.Value(offset.x), animatedX),
          top: Animated.add(new Animated.Value(offset.y), animatedY),
        }}>
        {children({left, moving: moving})}
      </Animated.View>
    </PanGestureHandler>
  );
};
