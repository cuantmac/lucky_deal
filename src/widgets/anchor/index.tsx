import {createCtx, isWeb, px2dp} from '@src/helper/helper';
import React, {
  FC,
  forwardRef,
  RefObject,
  useRef,
  useMemo,
  ReactNode,
  useEffect,
  useCallback,
  useContext,
  useState,
  useImperativeHandle,
} from 'react';
import {useWindowDimensions} from 'react-native';
import {
  LayoutRectangle,
  ScrollViewProps,
  View,
  ViewProps,
  ScrollView,
} from 'react-native';

interface AnchorItem {
  title: string;
  layout: LayoutRectangle;
  id: number;
  active?: boolean;
}

export const [AnchorCtx, AnchorProvider] = createCtx<
  Record<number, AnchorItem>
>({});

export interface AnchorCollecterProps {
  title: string;
  id: number;
}

// 收集锚点数据
export const AnchorCollecter: FC<AnchorCollecterProps> = ({
  children,
  title,
  id,
}) => {
  const {update} = useContext(AnchorCtx);
  const viewRef = useRef<View>(null);
  const [layout, setLayout] = useState<LayoutRectangle>();

  const handleSetLayout = useCallback((newLayout: LayoutRectangle) => {
    setLayout((old) => {
      if (!old) {
        return newLayout;
      }
      if (
        old.y === newLayout.y &&
        old.x === newLayout.x &&
        old.width === newLayout.width &&
        old.height === newLayout.height
      ) {
        return old;
      }
      if (newLayout.width === 0 && newLayout.height === 0) {
        return old;
      }
      return newLayout;
    });
  }, []);

  const handleLayout = useCallback<NonNullable<ViewProps['onLayout']>>(
    ({nativeEvent: {layout: newLayout}}) => {
      !isWeb() && handleSetLayout(newLayout);
    },
    [handleSetLayout],
  );

  useEffect(() => {
    if (isWeb()) {
      const measure = () => {
        viewRef.current &&
          viewRef.current.measure((x, y, width, height) => {
            if (width === 0 && height === 0) {
              return;
            }
            handleSetLayout({x, y, width, height});
          });
      };
      measure();
      const timer = setInterval(measure, 2000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [handleSetLayout]);

  useEffect(() => {
    update((old) => {
      if (!layout) {
        return old;
      }
      return {
        ...old,
        [id]: {
          title,
          id,
          layout,
          active: old[id]?.active,
        },
      };
    });
  }, [id, layout, title, update]);

  const RenderChild = useMemo(() => {
    return (
      <View ref={viewRef} onLayout={handleLayout}>
        {children}
      </View>
    );
  }, [children, handleLayout]);

  return RenderChild;
};

export type AnchorConsumerRef = {
  handleOnScroll: NonNullable<ScrollViewProps['onScroll']>;
};

export interface AnchorConsumerProps {
  children: (
    props: AnchorItem[],
    onPress: (params: AnchorItem) => void,
  ) => ReactNode;
  scrollRef?: RefObject<ScrollView>;
  scrollLayout?: LayoutRectangle;
  offset?: number;
}

// 渲染锚点 提供跳转锚点方法
export const AnchorConsumer = forwardRef<
  AnchorConsumerRef,
  AnchorConsumerProps
>(({children, scrollRef, scrollLayout, offset = 0}, ref) => {
  const {state: anchorState, update} = useContext(AnchorCtx);

  const toArray = (params: Record<number, AnchorItem>) => {
    return Object.keys(params)
      .sort((id1, id2) => +id1 - +id2)
      .map((id) => {
        return params[+id];
      });
  };
  const state = useMemo(() => {
    return toArray(anchorState);
  }, [anchorState]);
  const {height} = useWindowDimensions();
  const handlePress = useCallback(
    (params: AnchorItem) => {
      if (!scrollRef || !scrollLayout) {
        return;
      }
      scrollRef.current &&
        scrollRef.current.scrollTo({
          x: 0,
          y: params.layout.y - scrollLayout.y - px2dp(offset),
          animated: true,
        });
    },
    [offset, scrollLayout, scrollRef],
  );

  const handleScrollActive = useCallback(
    (y: number) => {
      const value = height + y;
      update((old) => {
        const oldState = toArray({...old});
        for (let i = oldState.length - 1; i >= 0; i--) {
          const item = oldState[i];
          if (value >= item.layout.y) {
            if (item.active) {
              return old;
            }
            oldState.forEach((val) => {
              val.active = false;
            });
            item.active = true;
            return {...old};
          }
        }
        return {...old};
      });
    },
    [height, update],
  );

  useImperativeHandle(
    ref,
    () => {
      return {
        handleOnScroll: ({
          nativeEvent: {
            contentOffset: {y},
          },
        }) => {
          handleScrollActive(y);
        },
      };
    },
    [handleScrollActive],
  );

  useEffect(() => {
    const item = state.find(({active}) => active);
    if (state.length && !item) {
      state[0].active = true;
      update((old) => ({...old}));
    }
  }, [state, update]);

  if (!scrollRef || !scrollLayout) {
    return null;
  }

  return <>{children(state, handlePress)}</>;
});
