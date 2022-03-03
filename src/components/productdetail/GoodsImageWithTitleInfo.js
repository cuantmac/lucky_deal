import {Dimensions, Image, View, Text} from 'react-native';
import {px} from '../../constants/constants';
import Carousel from 'react-native-snap-carousel/src/carousel/Carousel';
import Utils from '../../utils/Utils';
import React, {useMemo, useState, useCallback, memo} from 'react';
import GlideImage from '../native/GlideImage';
import AppModule from '../../../AppModule';
import GoodsTitleInfo from './GoodsTitleInfo';
import {GoodsVideo} from './GoodsVideo';
import {categoryDetailPath} from '../../analysis/report';
import {Timer, TimerFormate} from '../common/Timer';
import {useShallowEqualSelector} from '../../utils/hooks';
import {useIsFocused} from '@react-navigation/core';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {dialogs} from '../../utils/refs';
import {BoxContainProductComponent} from './BoxContainProductComponent';
import {Space} from '../common/Space';
import {FlashSalesBanner} from './FlashSalesBanner';

const {width: screenWidth} = Dimensions.get('window');
export default memo(({height, way, goodsDetail, newsCoupon}) => {
  //处理图片或者视屏数据源 1.将图片数据源转换成统一格式
  const imageBanners = goodsDetail.image?.map((item) => {
    return {
      uri: item,
      type: 'image',
      poster: item,
    };
  });

  //2.将视屏数据对象转换成统一格式，放到同一数组中
  const banners = imageBanners
    ? [
        {
          uri: AppModule.versionCode >= 42 ? goodsDetail.cover_video : '',
          type: 'video',
          poster: goodsDetail.cover_image,
        },
        ...imageBanners,
      ].filter(({uri}) => {
        return uri && uri.length > 0;
      })
    : [];

  const [activeSlide, setActiveSlide] = useState(0);
  const RenderItem = useCallback(({item}) => {
    if (item.type === 'image') {
      return (
        <GlideImage
          key={item.uri}
          showDefaultImage={true}
          source={Utils.getImageUri(item.uri)}
          defaultSource={require('../../assets/lucky_deal_default_large.jpg')}
          resizeMode={'contain'}
          style={{
            width: screenWidth,
            height: height,
          }}
        />
      );
    } else if (item.type === 'video') {
      return (
        item.uri && (
          <GoodsVideo
            width={screenWidth}
            height={height}
            uri={item.uri}
            poster={item.poster}
          />
        )
      );
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ImageTitle = useCallback(() => {
    return (
      <View style={styles.imageTitleContain}>
        <View
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            flex: 1,
          }}>
          <Text
            style={{
              fontSize: 60 * px,
              color: '#fff',
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            {goodsDetail?.image_title}
          </Text>

          {goodsDetail?.image_content ? (
            <Text
              style={{fontSize: 50 * px, color: '#fff', textAlign: 'center'}}>
              {goodsDetail?.image_content}
            </Text>
          ) : null}
        </View>
        {goodsDetail?.image_product_type ? (
          <Text
            style={{
              fontSize: 40 * px,
              color: '#fff',
              textAlign: 'center',
              width: 300 * px,
              marginBottom: 20 * px,
            }}>
            {goodsDetail?.image_product_type}
          </Text>
        ) : null}
      </View>
    );
  }, [goodsDetail]);

  const focus = useIsFocused();
  const PaginationView = useMemo(() => {
    return banners && banners.length > 1 ? (
      <Text
        style={{
          position: 'absolute',
          height: 40 * px,
          paddingHorizontal: 10 * px,
          zIndex: 99,
          bottom: 56 * px,
          right: 10 * px,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: 16 * px,
          fontSize: 26 * px,
          textAlign: 'center',
          lineHeight: 40 * px,
          color: 'white',
        }}>{` ${activeSlide + 1}/${banners.length}`}</Text>
    ) : null;
  }, [activeSlide, banners]);
  const SnapToItem = useCallback(
    (index) => {
      if (!focus) {
        return;
      }
      AppModule.reportClick('3', '21', {
        ProductId: goodsDetail.product_id,
        ImageIndex: index,
        CategoryId: goodsDetail.category_id,
        CateStation: goodsDetail.cate_station,
        ProductCat: categoryDetailPath.getData().ProductCat,
      });
      setActiveSlide(index);
    },
    [
      goodsDetail.product_id,
      goodsDetail.category_id,
      goodsDetail.cate_station,
      focus,
    ],
  );

  return (
    <View style={styles.infoContainer}>
      <View style={{position: 'relative'}}>
        <View
          style={{
            width: screenWidth,
            height: height,
            position: 'relative',
          }}>
          {banners ? (
            <Carousel
              autoplay={false}
              autoplayInterval={4000}
              loop={true}
              data={banners}
              renderItem={RenderItem}
              sliderWidth={screenWidth}
              sliderHeight={height}
              itemWidth={screenWidth}
              hasParallaxImages={true}
              onSnapToItem={(index) => {
                SnapToItem(index);
              }}
              useScrollView={true}
            />
          ) : null}
          {PaginationView}
          {goodsDetail?.product_type === 4 && goodsDetail?.product_status ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                width: screenWidth,
                height: height,
              }}>
              <Image
                source={require('../../assets/sold_l.png')}
                style={{width: 563 * px, height: 455 * px}}
              />
            </View>
          ) : null}
        </View>
        {goodsDetail.product_type === 1 && goodsDetail?.image_title ? (
          <ImageTitle />
        ) : null}
        <Space height={2} backgroundColor="#eee" />
        {/* 限时折扣腰带 */}
        <FlashSalesBanner flashSales={goodsDetail.flash_sales} />
        <GoodsTitleInfo
          way={way}
          goodsDetail={goodsDetail}
          newsCoupon={newsCoupon}
        />
        <BoxContainProductComponent
          bag_chart_list={goodsDetail.bag_chart_list}
        />
        <Space height={20} backgroundColor="#eee" />
      </View>
    </View>
  );
});

const styles = {
  flexRow: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  infoContainer: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 36 * px,
    marginTop: 6,
    marginBottom: 6,
  },
  titleDes: {
    fontSize: 50 * px,
    includeFontPadding: false,
  },
  titleOldPrice: {
    fontSize: 32 * px,
    color: '#8C8C8C',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    textDecorationColor: 'red',
    marginLeft: 5,
  },
  offPrice: {
    color: '#F34A31',
    fontSize: 26 * px,
    marginLeft: 15 * px,
    padding: 1,
    backgroundColor: '#FFC9C1',
  },
  imageTitleContain: {
    width: screenWidth,
    height: 180 * px,
    backgroundColor: 'rgba(255, 83, 115, 1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20 * px,
  },
};

export const BagGiftBannerOnCard = ({itemSize}) => {
  const {oneDollerCategory, token} = useShallowEqualSelector(
    (state) => state.deprecatedPersist,
  );
  if (!oneDollerCategory) {
    return null;
  }
  return oneDollerCategory.only_one_category.is_new_user || !token ? (
    <View
      style={{
        width: itemSize,
        height: 66 * px,
        backgroundColor: '#FE6B6B',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        bottom: 0,
      }}>
      <Text
        style={{
          fontSize: 36 * px,
          color: '#fff',
          textAlign: 'center',
        }}>
        Free Gift included
      </Text>
    </View>
  ) : null;
};
