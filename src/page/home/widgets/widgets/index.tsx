import {
  NewHomePageDataItem,
  NewHomePageImageItem,
  ProductSimpleBaseItem,
} from '@luckydeal/api-common';
import {CommonApi} from '@src/apis';
import {PRODUCT_CATEGPRY_TYPE} from '@src/constants/enum';
import {createStyleSheet, px2dp, styleAdapter} from '@src/helper/helper';
import {MysteryRoute, ProductListRoute, ProductRoute} from '@src/routes';
import {GlideImage, GlideImageProps} from '@src/widgets/glideImage';
import {
  InfiniteFlatList,
  InfiniteFlatListProps,
} from '@src/widgets/infiniteList/infiniteFlatList';
import {
  createLoadingIndicator,
  defaultCreateLoadingIndicatorParams,
} from '@src/widgets/infiniteList/loadingIndicator';
import {Space} from '@src/widgets/space';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {
  TouchableOpacity,
  ViewStyle,
  View,
  Text,
  Image,
  Dimensions,
  StyleProp,
} from 'react-native';

interface BannerItemProps {
  autoHeight?: boolean;
  style?: ViewStyle;
  data: NewHomePageImageItem;
  imageStyle?: GlideImageProps['style'];
  imageWidth?: number;
}

enum BANNER_JUMP_TYPE {
  CATEGORY_DETAIL = 1,
  PRODUCT = 2,
}

type ImageSize = {
  width: number;
  height: number;
};

export const BannerItem: FC<BannerItemProps> = ({
  style,
  data,
  imageStyle,
  autoHeight,
  imageWidth = Dimensions.get('window').width,
}) => {
  const ProductRouter = ProductRoute.useRouteLink();
  const MysteryRouter = MysteryRoute.useRouteLink();
  const ProductListRouter = ProductListRoute.useRouteLink();
  const [imageSize, setImageSize] = useState<ImageSize>({
    width: imageWidth || 0,
    height: px2dp(150),
  });
  const handlePress = useCallback(() => {
    if (data.jumpType === BANNER_JUMP_TYPE.CATEGORY_DETAIL) {
      const levelIds = data?.levelIds || [0, 0, 0];
      ProductListRouter.navigate({
        topCategoryId: levelIds[0],
        secondCategoryId: levelIds[1],
        threeCategoryId: levelIds[2],
        behavior: 'back',
      });
      return;
    }

    if (data.jumpType === BANNER_JUMP_TYPE.PRODUCT) {
      if (data.productType === PRODUCT_CATEGPRY_TYPE.MYSTERY) {
        MysteryRouter.navigate({
          productId: data.productId || 0,
        });
        return;
      }
      ProductRouter.navigate({
        productId: data.productId || 0,
      });
    }
  }, [MysteryRouter, ProductListRouter, ProductRouter, data]);

  useEffect(() => {
    if (autoHeight && data.url) {
      Image.getSize(
        data.url,
        (width, height) => {
          setImageSize({
            width: imageWidth,
            height: (imageWidth / width) * height,
          });
        },
        () => {},
      );
    }
  }, [autoHeight, data.url, imageWidth]);

  return (
    <TouchableOpacity onPress={handlePress} style={style} activeOpacity={0.8}>
      <GlideImage
        useNative={false}
        style={[autoHeight ? imageSize : BannerItemStyles.img, imageStyle]}
        resizeMode="cover"
        source={{uri: data.url}}
      />
    </TouchableOpacity>
  );
};

const BannerItemStyles = createStyleSheet({
  img: {
    width: '100%',
    height: '100%',
  },
});

type HorizontalInfiniteFlatListProps = {
  tabId: number;
  item: NewHomePageDataItem;
} & Omit<
  InfiniteFlatListProps<ProductSimpleBaseItem>,
  'fetch' | 'horizontal' | 'LoadingIndicator'
>;

const LoadingIndicator = createLoadingIndicator({
  ...defaultCreateLoadingIndicatorParams,
  Complete: () => null,
});

export const HorizontalInfiniteFlatList: FC<HorizontalInfiniteFlatListProps> = ({
  tabId,
  item,
  ...props
}) => {
  const fetchData = useCallback(
    (page: number, size: number) => {
      return CommonApi.newHomePageProductDataUsingPOST({
        id: tabId,
        limit: size,
        page,
        type_id: item.id,
      }).then((res) => {
        return {
          list: res.data.list,
        };
      });
    },
    [item.id, tabId],
  );

  return (
    <HomeModule>
      <Title name={item.name} />
      <InfiniteFlatList
        horizontal
        style={{
          backgroundColor: 'white',
        }}
        contentContainerStyle={styleAdapter({paddingLeft: 12})}
        showsHorizontalScrollIndicator={false}
        fetch={fetchData}
        LoadingIndicator={LoadingIndicator}
        {...props}
      />
    </HomeModule>
  );
};

interface HomeModuleProps {
  style?: StyleProp<ViewStyle>;
  hideSpace?: boolean;
  spaceHeight?: number;
}

export const HomeModule: FC<HomeModuleProps> = ({
  children,
  style,
  hideSpace,
  spaceHeight = 12,
}) => {
  return (
    <View style={[HomeModuleStyles.container, style]}>
      {!hideSpace && (
        <Space height={spaceHeight} backgroundColor={'transparent'} />
      )}
      {children}
    </View>
  );
};

const HomeModuleStyles = createStyleSheet({
  container: {
    marginHorizontal: 12,
  },
});

interface TitleProp {
  name?: string;
  style?: StyleProp<ViewStyle>;
}

export const Title: FC<TitleProp> = ({name, style}) => {
  return (
    <>
      {name ? (
        <>
          <View style={[TitleStyles.wrap, style]}>
            <Text style={TitleStyles.title}>{name}</Text>
          </View>
        </>
      ) : null}
    </>
  );
};

const TitleStyles = createStyleSheet({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 40,
  },
  title: {
    color: '#222222',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
