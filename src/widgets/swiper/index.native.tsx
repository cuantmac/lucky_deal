import React, {Fragment, memo, ReactNode} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import Carousel from 'react-native-swiper';
export interface SwiperProps<T> {
  data: T[];
  renderItem: ({item}: {item: T; index: number}) => ReactNode;
  style?: StyleProp<ViewStyle>;
  loop?: boolean;
  onSlideChange?: (index: number) => void;
  spaceBetween?: number;
  sliderWidth?: number;
  sliderHeight?: number;
  autoplay?: boolean;
  autoplayInterval?: number;
  showsPagination?: boolean;
  dotView?: ReactNode;
  activeDotView?: ReactNode;
  paginationStyle?: ViewStyle;
}

export const Swiper = memo(function <T>({
  renderItem,
  data,
  style,
  loop = false,
  onSlideChange,
  sliderWidth,
  sliderHeight,
  autoplay = false,
  autoplayInterval = 3000,
  showsPagination = false,
  dotView,
  activeDotView,
  paginationStyle,
}: SwiperProps<T>) {
  return (
    <View style={[{width: sliderWidth, height: sliderHeight}, style]}>
      <Carousel
        paginationStyle={paginationStyle}
        loop={loop}
        autoplay={autoplay}
        autoplayTimeout={autoplayInterval / 1000}
        showsButtons={false}
        showsPagination={showsPagination}
        dot={dotView}
        //@ts-ignore
        height={'auto'}
        activeDot={activeDotView}
        onIndexChanged={(index) => {
          setTimeout(() => {
            onSlideChange && onSlideChange(index);
          }, 0);
        }}>
        {data.map((item, index) => {
          return <Fragment key={index}>{renderItem({item, index})}</Fragment>;
        })}
      </Carousel>
    </View>
  );
}) as <T>(props: SwiperProps<T>) => JSX.Element;
