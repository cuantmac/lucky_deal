import {
  BagProductDetailResponse,
  OfferProductDetailResponse,
} from '@luckydeal/api-common';
import {createStyleSheet, px2dp} from '@src/helper/helper';
import {AnchorCollecter} from '@src/widgets/anchor';
import {GlideImage} from '@src/widgets/glideImage';
import {Space} from '@src/widgets/space';
import {Swiper, SwiperProps} from '@src/widgets/swiper';
import {Video} from '@src/widgets/video';
import React, {FC, useCallback, useMemo, useState} from 'react';
import {memo} from 'react';
import {useWindowDimensions, View, Text, StyleSheet} from 'react-native';

interface ProductBannerProps {
  data: BagProductDetailResponse | OfferProductDetailResponse;
}

enum BANNER_ITEM_TYPE_ENUM {
  IMAGE,
  VIDEO,
}

interface BannerItem {
  type: BANNER_ITEM_TYPE_ENUM;
  uri: string;
  poster?: string;
}

export const ProductBanner: FC<ProductBannerProps> = memo(({data}) => {
  const {width} = useWindowDimensions();

  const bannerList = useMemo(() => {
    const bannerImage: BannerItem[] =
      data.image?.map((img) => {
        return {
          type: BANNER_ITEM_TYPE_ENUM.IMAGE,
          uri: img,
        };
      }) || [];
    const bannerVideo = data.cover_video && {
      uri: data.cover_video || '',
      type: BANNER_ITEM_TYPE_ENUM.VIDEO,
      poster: data.cover_image,
    };
    bannerVideo && bannerImage.unshift(bannerVideo);
    return bannerImage;
  }, [data]);
  const renderItem = useCallback<SwiperProps<BannerItem>['renderItem']>(
    ({item}) => {
      if (item.type === BANNER_ITEM_TYPE_ENUM.VIDEO) {
        return (
          <Video
            poster={item.poster}
            src={item.uri}
            width={width}
            height={width}
          />
        );
      }
      return (
        <GlideImage
          style={{width: width, height: width}}
          source={{uri: item.uri}}
        />
      );
    },
    [width],
  );

  const [index, setIndex] = useState(0);

  const handleOnSlideChange = useCallback((itemIndex: number) => {
    setIndex(itemIndex);
  }, []);

  return (
    <AnchorCollecter title={'Overview'} id={1}>
      <View style={ProductBannerStyles.container}>
        <Swiper
          sliderHeight={width}
          sliderWidth={width}
          data={bannerList}
          renderItem={renderItem}
          loop
          onSlideChange={handleOnSlideChange}
        />
        <AbsoluteContainer>
          <IndexNum current={index + 1} total={bannerList.length} />
        </AbsoluteContainer>
      </View>
      <Space height={0.5} />
    </AnchorCollecter>
  );
});

const AbsoluteContainer: FC = ({children}) => {
  return <View style={ProductBannerStyles.absoluteContainer}>{children}</View>;
};

interface PageNumProps {
  current?: number;
  total?: number;
}

const IndexNum: FC<PageNumProps> = ({current = 0, total = 0}) => {
  return (
    <View style={ProductBannerStyles.indexNumContainer}>
      <Text style={ProductBannerStyles.indexNumText}>
        {current}/{total}
      </Text>
    </View>
  );
};

const ProductBannerStyles = createStyleSheet({
  container: {
    position: 'relative',
    backgroundColor: 'white',
  },
  absoluteContainer: {
    position: 'absolute',
    bottom: 10,
    right: 16,
    zIndex: 1,
  },
  indexNumContainer: {
    width: 38,
    height: 22,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexNumText: {
    color: 'white',
    fontSize: 13,
    lineHeight: 18,
  },
});
