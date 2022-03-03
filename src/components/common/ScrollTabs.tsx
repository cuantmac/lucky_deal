import React, {
  FC,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  Ref,
} from 'react';
import {
  View,
  ViewStyle,
  ViewProps,
  Animated,
  useWindowDimensions,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';

type ScrollTabsProps<T> = {
  // scrollToNext?:boolean,
  row?: number;
  column?: number;
  data: T[];
  hideBar?: boolean;
  renderItem: (params: {item: T; index: number}) => JSX.Element;
} & Pick<ScrollTabItemContainerProps, 'itemContainerStyle'> &
  Pick<
    ScrollBarProps,
    'barBgStyle' | 'barStyle' | 'barContainerStyle' | 'barHeight' | 'barWidth'
  > &
  ScrollContainerProps;

interface ScrollTabsRef {
  scroll: (x?: number) => void;
}

/**
   * 支持设置 row 和 column控制容器中显示的行数和列
   * 支持设置bar容器的宽高和其他样式属性，内部的滚动条宽度会根据容器的宽度自适应
   * 支持隐藏bar
   *
   * @param param0 ScrollTabsProps
   * @example
   *
   * ```
   * <ScrollTabs
      data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]}
      renderItem={({item, index}) => {
        return <Text>{item}</Text>;
      }}
      row={3}
      column={4}
    />
   * ```
   */
export function ScrollTab<T>(
  {
    data,
    renderItem,
    row = 2,
    column = 5,
    containerStyle,
    itemContainerStyle,
    hideBar = false,
    barBgStyle,
    barContainerStyle,
    barStyle,
    barWidth,
    barHeight,
  }: ScrollTabsProps<T>,
  ref: Ref<ScrollTabsRef>,
): JSX.Element {
  const groupData = groupByNumber(data, row);
  const [containerWidth, setContainerWidth] = useState(0);
  const itemWidth = containerWidth / column;
  const scrollXAnimte = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<T>>();
  const windowWidth = useWindowDimensions().width;

  useImperativeHandle(
    ref,
    () => {
      return {
        scroll(x) {
          // console.log('--------flatListRef', flatListRef);
          flatListRef.current?.scrollToOffset({
            offset: x ? windowWidth : -windowWidth,
            animated: true,
          });
        },
      };
    },
    [windowWidth],
  );

  return (
    <ScrollContainer
      containerStyle={containerStyle}
      onLayout={({
        nativeEvent: {
          layout: {width},
        },
      }) => setContainerWidth(width)}>
      {!!containerWidth && (
        <>
          <Animated.FlatList
            ref={flatListRef as any}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: scrollXAnimte,
                    },
                  },
                },
              ],
              {useNativeDriver: true},
            )}
            scrollEventThrottle={1}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={groupData as any}
            keyExtractor={(item: T[], index: number) => index + ''}
            renderItem={({
              item: scrollTabContainerItem,
              index: scrollTabIndex,
            }: {
              item: T[];
              index: number;
            }) => {
              return (
                <ScrollTabItemContainer
                  itemContainerStyle={itemContainerStyle}
                  width={itemWidth}
                  key={scrollTabIndex}>
                  {scrollTabContainerItem.map((item, index) => {
                    return React.cloneElement(renderItem({item, index}), {
                      key: index,
                    });
                  })}
                </ScrollTabItemContainer>
              );
            }}
          />
          {hideBar || (
            <ScrollBar
              barHeight={barHeight}
              barWidth={barWidth}
              barContainerStyle={barContainerStyle}
              barBgStyle={barBgStyle}
              barStyle={barStyle}
              scrollAnimate={scrollXAnimte}
              screenWidth={itemWidth * column}
              scrollWidth={itemWidth * groupData.length}
            />
          )}
        </>
      )}
    </ScrollContainer>
  );
}

interface ScrollContainerProps {
  containerStyle?: Omit<
    ViewStyle,
    | 'padding'
    | 'paddingStart'
    | 'paddingEnd'
    | 'paddingHorizontal'
    | 'paddingLeft'
    | 'paddingRight'
  >;
}

const ScrollContainer: FC<ScrollContainerProps & ViewProps> = ({
  containerStyle,
  children,
  ...props
}) => {
  return (
    <View {...props} style={[containerStyle]}>
      {children}
    </View>
  );
};

type ScrollTabItemContainerProps = {
  width: number;
  itemContainerStyle?: ViewStyle;
};

const ScrollTabItemContainer: FC<ScrollTabItemContainerProps> = ({
  children,
  width,
  itemContainerStyle,
}) => {
  return (
    <View style={[{alignItems: 'center'}, itemContainerStyle, {width}]}>
      {children}
    </View>
  );
};

type ScrollBarProps = {
  barContainerStyle?: ViewStyle;
  barBgStyle?: Omit<ViewStyle, 'width' | 'height'>;
  barStyle?: Omit<ViewStyle, 'width' | 'height'>;
  barWidth?: number;
  barHeight?: number;
  screenWidth: number;
  scrollWidth: number;
  scrollAnimate: Animated.Value;
};

const ScrollBar: FC<ScrollBarProps> = ({
  barContainerStyle,
  barBgStyle,
  barStyle,
  barWidth = 35,
  barHeight = 3,
  screenWidth,
  scrollWidth,
  scrollAnimate,
}) => {
  const barWidthRate =
    scrollWidth > screenWidth ? screenWidth / scrollWidth : 1;
  return (
    <View style={[barContainerStyle, {alignItems: 'center'}]}>
      <View
        style={[
          {
            backgroundColor: '#B5B5B5',
            borderRadius: barHeight / 2,
          },
          barBgStyle,
          {width: barWidth, height: barHeight, overflow: 'hidden'},
        ]}>
        <Animated.View
          style={[
            {
              backgroundColor: '#F04933',
              borderRadius: barHeight / 2,
            },
            barStyle,
            {
              width: barWidth * barWidthRate,
              height: barHeight,
              transform: [
                {
                  translateX: scrollAnimate.interpolate({
                    inputRange: [
                      0,
                      scrollWidth > screenWidth ? scrollWidth - screenWidth : 0,
                    ],
                    outputRange: [0, barWidth - barWidth * barWidthRate],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
};

export const ScrollTabs = forwardRef(ScrollTab) as <T>(
  p: ScrollTabsProps<T> & {ref?: Ref<ScrollTabsRef>},
) => JSX.Element;

/**
 *
 * 根据num将data分组形成一个二维数组
 *
 * @param data any[]
 * @param num 多少个为一组
 * @example
 *
 * groupByNumber([1,2,3,4],2);
 * [[1,2], [3,4]]
 */
function groupByNumber<T>(data: T[], num: number): T[][] {
  if (num < 1) {
    throw new Error('gourp num must > 0');
  }
  const group: T[][] = [];
  let index = 0;
  for (;;) {
    const target = index + num;
    const groupItem = data.slice(index, target);
    if (groupItem.length) {
      group.push(groupItem);
      index = target;
      continue;
    }
    break;
  }
  return group;
}
