import {createCtx} from '@src/helper/helper';
import React, {FC} from 'react';
import {useContext} from 'react';
import {ReactNode} from 'react';
import {useCallback} from 'react';
import {useRef} from 'react';
import {Animated, View} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

interface SwiperableCtxParams {
  close: () => void;
}

const [swiperableCtx, SwiperableProvider] = createCtx<SwiperableCtxParams>({
  close: () => {},
});

interface SwiperableProps {
  actions?: ReactNode;
  actionWidth?: number;
  disabled?: boolean;
}

export const Swiperable: FC<SwiperableProps> = ({
  children,
  actions,
  actionWidth = 100,
  disabled,
}) => {
  const swipeableRef = useRef<Swipeable>(null);

  const handleClose = useCallback(() => {
    swipeableRef.current?.close();
  }, []);

  const renderRightAction = useCallback(
    (ele: ReactNode, x: number, progress: Animated.AnimatedInterpolation) => {
      const trans = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [x, 0],
      });

      return (
        <Animated.View style={{flex: 1, transform: [{translateX: trans}]}}>
          {ele}
        </Animated.View>
      );
    },
    [],
  );

  const renderRightActions = useCallback(
    (
      progress: Animated.AnimatedInterpolation,
      _dragAnimatedValue: Animated.AnimatedInterpolation,
    ) => {
      const childLength = React.Children.count(actions);

      if (!actions) {
        return null;
      }

      return (
        <View
          style={{
            width: actionWidth,
            flexDirection: 'row',
          }}>
          {React.Children.map(actions, (ele, i) => {
            return renderRightAction(
              ele,
              actionWidth - (actionWidth / childLength) * i,
              progress,
            );
          })}
        </View>
      );
    },
    [actionWidth, actions, renderRightAction],
  );

  return (
    <SwiperableProvider providerValue={{close: handleClose}}>
      <Swipeable
        enabled={!disabled}
        ref={swipeableRef}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={renderRightActions}>
        {children}
      </Swipeable>
    </SwiperableProvider>
  );
};

interface SwiperableActionProps {
  children?: (close: SwiperableCtxParams['close']) => ReactNode;
}

export const SwiperableAction: FC<SwiperableActionProps> = ({children}) => {
  const {state} = useContext(swiperableCtx);
  return <>{children && children(state.close)}</>;
};
