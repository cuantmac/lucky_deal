import {SCREEN_HEIGHT} from '@src/constants/constants';
import {createStyleSheet} from '@src/helper/helper';
import {GlideImage} from '@src/widgets/glideImage';
import React, {
  RefObject,
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
} from 'react';
import {
  ScrollView,
  ScrollViewProps,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {} from 'react-native-gesture-handler';

interface TopAnchorProps {
  scrollRef?: RefObject<ScrollView | FlatList>;
}

export interface TopAnchorRef {
  scroll: NonNullable<ScrollViewProps['onScroll']>;
}

export const TopAnchor = forwardRef<TopAnchorRef, TopAnchorProps>(
  ({scrollRef}, ref) => {
    const [show, setShow] = useState(false);
    useImperativeHandle(
      ref,
      () => {
        return {
          scroll: ({
            nativeEvent: {
              contentOffset: {y},
            },
          }) => {
            if (y > SCREEN_HEIGHT / 2) {
              setShow(true);
              return;
            }
            setShow(false);
          },
        };
      },
      [],
    );
    const handleScrollTop = useCallback(() => {
      if ((scrollRef?.current as ScrollView)?.scrollTo) {
        (scrollRef?.current as ScrollView)?.scrollTo({
          x: 0,
          y: 0,
          animated: true,
        });
      }
      if ((scrollRef?.current as FlatList)?.scrollToOffset) {
        (scrollRef?.current as FlatList)?.scrollToOffset({
          animated: true,
          offset: 0,
        });
      }
    }, [scrollRef]);

    if (!show) {
      return null;
    }

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={TopAnchorStyles.container}
        onPress={handleScrollTop}>
        <GlideImage
          style={TopAnchorStyles.img}
          source={require('@src/assets/top_icon.png')}
          defaultSource={false}
        />
      </TouchableOpacity>
    );
  },
);

const TopAnchorStyles = createStyleSheet({
  container: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    padding: 10,
  },
  img: {
    width: 40,
    height: 40,
  },
});
