import React, {
  FC,
  memo,
  ReactNode,
  Fragment,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import {Swiper as SwiperReact, SwiperSlide} from 'swiper/react';
import SwiperCore, {Autoplay} from 'swiper';
import 'swiper/swiper.scss';
import './styles.css';
import {View, ViewStyle} from 'react-native';
import {createStyleSheet} from '@src/helper/helper';

export interface SwiperProps<T> {
  data: T[];
  renderItem: ({item}: {item: T; index: number}) => ReactNode;
  style?: ViewStyle;
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
SwiperCore.use([Autoplay]);
export const Swiper = memo(function <T>({
  renderItem,
  data,
  sliderWidth,
  sliderHeight,
  spaceBetween = 0,
  loop = false,
  onSlideChange,
  style,
  autoplayInterval = 3000,
  autoplay = false,
  showsPagination = false,
  dotView,
  activeDotView,
  paginationStyle,
}: SwiperProps<T>) {
  const paganationRef = useRef<PaganationRef>(null);
  return (
    <View style={[SwiperStyles.container, style]}>
      <SwiperReact
        onSlideChange={({realIndex}) => {
          paganationRef.current?.setActiveIndex(realIndex);
          onSlideChange && onSlideChange(realIndex);
        }}
        autoplay={
          autoplay
            ? {
                delay: autoplayInterval,
                disableOnInteraction: false,
              }
            : undefined
        }
        loop={loop}
        spaceBetween={spaceBetween}
        style={{width: sliderWidth, height: sliderHeight}}>
        {data.map((item, index) => {
          return (
            <SwiperSlide key={index}>{renderItem({item, index})}</SwiperSlide>
          );
        })}
      </SwiperReact>
      {showsPagination && (
        <Paganation
          ref={paganationRef}
          data={data}
          paginationStyle={paginationStyle}
          dotView={dotView}
          activeDotView={activeDotView}
        />
      )}
    </View>
  );
}) as <T>(props: SwiperProps<T>) => JSX.Element;

interface PaganationProps {
  data: unknown[];
  paginationStyle?: ViewStyle;
  dotView?: ReactNode;
  activeDotView?: ReactNode;
}

interface PaganationRef {
  setActiveIndex: (val: number) => void;
}

const Paganation = forwardRef<PaganationRef, PaganationProps>(
  ({data, paginationStyle, dotView, activeDotView}, ref) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const dot = dotView || <DefaultDot />;
    const activeDot = activeDotView || <DefaultActiveDot />;

    useImperativeHandle(
      ref,
      () => {
        return {
          setActiveIndex,
        };
      },
      [],
    );
    if (!data.length) {
      return null;
    }
    return (
      <View style={[SwiperStyles.paginationContainer, paginationStyle]}>
        {data.map((val, index) => {
          return (
            <Fragment key={index}>
              {index === activeIndex ? activeDot : dot}
            </Fragment>
          );
        })}
      </View>
    );
  },
);

const DefaultDot: FC = () => {
  return <View style={SwiperStyles.dot} />;
};

const DefaultActiveDot: FC = () => {
  return <View style={SwiperStyles.activeDot} />;
};

const SwiperStyles = createStyleSheet({
  container: {
    position: 'relative',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
    zIndex: 2,
  },
  dot: {
    backgroundColor: 'rgba(255,255,255,.5)',
    width: 5,
    height: 5,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'rgba(255,255,255,0)',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
});
