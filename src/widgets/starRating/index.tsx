import {createStyleSheet} from '@src/helper/helper';
import React, {FC, useMemo} from 'react';
import {useEffect} from 'react';
import {useCallback} from 'react';
import {useState} from 'react';
import {ImageStyle, ViewStyle} from 'react-native';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {GlideImage, GlideImageProps} from '../glideImage';

interface StarRatingProps {
  rating?: number;
  maxStars?: number;
  fullStar?: GlideImageProps['source'];
  halfStar?: GlideImageProps['source'];
  emptyStar?: GlideImageProps['source'];
  onChange?: (val: number) => void;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  starStyle?: ImageStyle;
}

enum STAR_STATUS_ENUM {
  FULL,
  HALF,
  EMPTY,
}

export const StarRating: FC<StarRatingProps> = ({
  rating = 4,
  maxStars = 5,
  fullStar = require('@src/assets/full_start_icon.png'),
  halfStar = require('@src/assets/half_start_icon.png'),
  emptyStar = require('@src/assets/empty_start_icon.png'),
  onChange,
  disabled = false,
  containerStyle,
  starStyle,
}) => {
  const statusImgMap = useMemo(() => {
    return {
      [STAR_STATUS_ENUM.FULL]: fullStar,
      [STAR_STATUS_ENUM.HALF]: halfStar,
      [STAR_STATUS_ENUM.EMPTY]: emptyStar,
    };
  }, [emptyStar, fullStar, halfStar]);
  const [starStatus, setStartStatus] = useState<STAR_STATUS_ENUM[]>([]);

  const handleStartPress = useCallback(
    (index: number) => {
      onChange && onChange(index + 1);
    },
    [onChange],
  );

  useEffect(() => {
    setStartStatus(
      new Array(maxStars).fill(STAR_STATUS_ENUM.EMPTY).map((status, index) => {
        const r = index + 1;
        if (rating >= r) {
          return STAR_STATUS_ENUM.FULL;
        }
        if (rating > r - 1) {
          return STAR_STATUS_ENUM.HALF;
        }
        return status;
      }),
    );
  }, [maxStars, rating]);

  return (
    <View style={[StarRatingStyles.container, containerStyle]}>
      {starStatus.map((status, index) => {
        return (
          <TouchableOpacity
            onPress={() => handleStartPress(index)}
            disabled={disabled}
            key={index}>
            <GlideImage
              defaultSource={false}
              style={[StarRatingStyles.star, starStyle]}
              source={statusImgMap[status]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const StarRatingStyles = createStyleSheet({
  container: {
    flexDirection: 'row',
  },
  star: {
    width: 10,
    height: 10,
  },
});
