import React, {FC, useCallback, useEffect, useState, useMemo} from 'react';
import {Image, View, ViewStyle} from 'react-native';
import {createStyleSheet, px2dp, styleAdapter} from '@src/helper/helper';
import {
  NewHomePageDataItem,
  NewHomePageImageItem,
  ProductSimpleBaseItem,
} from '@luckydeal/api-common/lib/api';
import {
  ProductCardItem,
  ProductCardItem1_2,
  ProductCardItem1_2_5,
  ProductCardItem1_3,
  ProductCardItem1_3_5,
} from '@src/widgets/productListItem';
import {Swiper, SwiperProps} from '@src/widgets/swiper';
import {HomeComponent} from '@src/page/home/widgets/index';
import {CommonApi} from '@src/apis';
import {Message} from '@src/helper/message';
import {
  BannerItem,
  HomeModule,
  HorizontalInfiniteFlatList,
  Title,
} from './widgets';

interface BaseItemProps {
  tabId: number;
  item: NewHomePageDataItem;
  onPress?: () => void;
  style?: ViewStyle;
}

export const IMG_1_1: FC<BaseItemProps> = ({item}) => {
  return (
    <HomeModule>
      <Title name={item.name} />
      {item?.images?.map((val, index) => {
        return (
          <BannerItem
            imageWidth={px2dp(351)}
            autoHeight
            key={index}
            style={styles_img_1_1.container}
            data={val}
          />
        );
      })}
    </HomeModule>
  );
};

export const IMG_1_2: FC<BaseItemProps> = ({item}) => {
  return (
    <HomeModule>
      <Title name={item.name} />
      <View style={styles_img_1_2.container}>
        {item?.images?.map((val, index) => {
          return (
            <BannerItem
              key={index}
              autoHeight
              imageWidth={px2dp(170)}
              data={val}
            />
          );
        })}
      </View>
    </HomeModule>
  );
};

const styles_img_1_2 = createStyleSheet({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
});

export const SWIPER: FC<BaseItemProps> = ({item}) => {
  const [height, setHeight] = useState<number>(px2dp(150));
  const renderItem = useCallback<
    SwiperProps<NewHomePageImageItem>['renderItem']
  >(({item: itemData}) => {
    return <BannerItem autoHeight imageWidth={px2dp(375)} data={itemData} />;
  }, []);

  const dotView = () => {
    return (
      <View
        style={{
          backgroundColor: 'rgba(255,255,255,.5)',
          width: 5,
          height: 5,
          borderRadius: 4,
          marginLeft: 3,
          marginRight: 3,
          marginTop: 3,
          marginBottom: 3,
        }}
      />
    );
  };

  const activeDotView = () => {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.5)',
          backgroundColor: 'rgba(255,255,255,0)',
          width: 8,
          height: 8,
          borderRadius: 4,
          marginLeft: 3,
          marginRight: 3,
          marginTop: 3,
          marginBottom: 3,
        }}
      />
    );
  };

  useEffect(() => {
    const firstImg = item.images && item.images[0].url;
    if (firstImg) {
      Image.getSize(
        firstImg,
        (width, imgHeight) => {
          setHeight((px2dp(375) / width) * imgHeight);
        },
        () => {},
      );
    }
  }, [item.images]);

  return (
    <HomeModule hideSpace>
      <Title name={item.name} />
      <View style={styles_swiper.container}>
        {item.images && (
          <Swiper
            autoplay
            autoplayInterval={3000}
            showsPagination
            sliderWidth={px2dp(375)}
            data={item.images}
            renderItem={renderItem}
            sliderHeight={height}
            loop
            dotView={dotView()}
            activeDotView={activeDotView()}
          />
        )}
      </View>
    </HomeModule>
  );
};

export const PRODUCT_1_1: FC<BaseItemProps> = ({tabId, item}) => {
  const renderItem = (pro: any) => (
    <View key={pro.item.product_id} style={styles_pro_1_1.item_wap}>
      <ProductCardItem data={pro.item} key={pro.product_id} config={item} />
    </View>
  );
  return (
    <HomeComponent
      tabId={tabId}
      item={item}
      styles={item.name ? styles_pro_1_1_title : styles_pro_1_1}
      renderItem={renderItem}
    />
  );
};

export const PRODUCT_1_2: FC<BaseItemProps> = ({tabId, item}) => {
  const renderItem = (pro: any) => (
    <ProductCardItem1_2
      style={{marginLeft: 0, marginRight: 0}}
      data={pro.item}
      key={pro.product_id}
      config={item}
    />
  );

  return (
    <HomeComponent
      columnWrapperStyle={{justifyContent: 'space-between'}}
      numColumns={2}
      tabId={tabId}
      item={item}
      styles={styles_pro_1_2}
      renderItem={renderItem}
    />
  );
};

export const PRODUCT_1_3: FC<BaseItemProps> = ({tabId, item}) => {
  const renderItem = (pro: any) => (
    <ProductCardItem1_3
      key={pro.item.product_id}
      style={[styles_pro_1_3.item_wrap, styleAdapter({marginLeft: 11})]}
      data={pro.item}
      config={item}
    />
  );

  return (
    <HomeComponent
      numColumns={3}
      tabId={tabId}
      item={item}
      styles={styles_pro_1_3}
      renderItem={renderItem}
      columnWrapperStyle={styleAdapter({marginLeft: -11})}
      showSpace={false}
    />
  );
};

export const PRODUCT_1_2_5: FC<BaseItemProps> = ({tabId, item}) => {
  const renderItem = useCallback(
    ({item: itemData}: {item: ProductSimpleBaseItem}) => (
      <ProductCardItem1_2_5
        data={itemData}
        key={itemData.product_id}
        config={item}
      />
    ),
    [item],
  );

  return (
    <HorizontalInfiniteFlatList
      tabId={tabId}
      item={item}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={styles_pro_1_2_5.separator} />}
    />
  );
};

export const PRODUCT_1_3_5: FC<BaseItemProps> = ({tabId, item}) => {
  const renderItem = useCallback(
    ({item: itemData}: {item: ProductSimpleBaseItem}) => (
      <ProductCardItem1_3_5 data={itemData} config={item} />
    ),
    [item],
  );

  return (
    <HorizontalInfiniteFlatList
      tabId={tabId}
      item={item}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={styles_pro_1_3_5.separator} />}
    />
  );
};

export const PRODUCT_2_3: FC<BaseItemProps> = ({tabId, item}) => {
  const [data, setData] = useState<ProductSimpleBaseItem[][]>([]);

  const renderItem = useCallback(
    ({item: itemData}: {item: ProductSimpleBaseItem[]}) => {
      let newArr: ProductSimpleBaseItem[][] = [];
      for (let i = 0, len = itemData.length; i < len; i += 3) {
        newArr.push(itemData.slice(i, i + 3));
      }
      return (
        <View style={styles_pro_2_3.swiper_item_wrap}>
          {newArr.map((val, index) => {
            return (
              <View
                style={[styles_pro_2_3.column_wrap, styles_pro_1_3.item_wrap]}
                key={index}>
                {val.map((valData, valIndex) => {
                  return (
                    <ProductCardItem1_3
                      style={styleAdapter({marginLeft: 10.5})}
                      data={valData}
                      key={valIndex}
                      config={item}
                    />
                  );
                })}
              </View>
            );
          })}
        </View>
      );
    },
    [item],
  );

  const getData = useCallback(() => {
    return CommonApi.newHomePageProductDataUsingPOST({
      id: tabId,
      limit: 120,
      page: 1,
      type_id: item.id,
    }).then((res) => {
      return res.data.list || [];
    });
  }, [tabId, item.id]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getData();
      let newArr: ProductSimpleBaseItem[][] = [];
      for (let i = 0, len = res.length; i < len; i += 6) {
        newArr.push(res.slice(i, i + 6));
      }
      setData(newArr);
    };
    fetchData().catch((e) => {
      Message.toast(e);
    });
  }, [getData]);

  const dotView = useMemo(() => {
    return (
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,0.48)',
          width: 5,
          height: 5,
          borderRadius: 4,
          marginLeft: 3,
          marginRight: 3,
          marginTop: 3,
          marginBottom: 3,
        }}
      />
    );
  }, []);

  const activeDotView = useMemo(() => {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.48)',
          backgroundColor: 'rgba(255,255,255,0)',
          width: 8,
          height: 8,
          borderRadius: 4,
          marginLeft: 3,
          marginRight: 3,
          marginTop: 3,
          marginBottom: 3,
        }}
      />
    );
  }, []);

  if (!data.length) {
    return null;
  }

  return (
    <HomeModule>
      <Title name={item.name} />
      <View style={styles_pro_2_3.container}>
        {!!data.length && (
          <Swiper
            paginationStyle={styleAdapter({bottom: 10})}
            showsPagination
            sliderWidth={px2dp(351)}
            // sliderHeight={px2dp(400)}
            data={data}
            renderItem={renderItem}
            loop
            dotView={dotView}
            activeDotView={activeDotView}
          />
        )}
      </View>
    </HomeModule>
  );
};

const styles_img_1_1 = createStyleSheet({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    overflow: 'hidden',
  },
});

const styles_pro_1_1 = createStyleSheet({
  titleStyle: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  item_wap: {
    paddingVertical: 5,
  },
});

const styles_pro_1_1_title = createStyleSheet({
  titleStyle: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  item_wap: {
    paddingVertical: 5,
  },
});

const styles_pro_1_2 = createStyleSheet({
  container: {
    marginTop: -10,
  },
  item_wrap: {
    marginLeft: 6,
  },
});

const styles_pro_1_2_5 = createStyleSheet({
  container: {
    backgroundColor: '#FFFFFF',
    paddingLeft: 12,
  },
  separator: {
    width: 12,
  },
  moreHeight: {
    height: 120,
  },
});

const styles_pro_1_3 = createStyleSheet({
  item_wrap: {
    marginTop: 10,
  },
  container: {
    marginTop: -10,
  },
});

const styles_pro_1_3_5 = createStyleSheet({
  container: {
    backgroundColor: '#FFFFFF',
    paddingLeft: 12,
  },
  separator: {
    width: 11,
  },
  moreHeight: {
    height: 88,
  },
});

const styles_pro_2_3 = createStyleSheet({
  container: {
    backgroundColor: '#FFFFFF',
  },
  column_wrap: {
    flexDirection: 'row',
    marginLeft: -10.5,
  },
  swiper_item_wrap: {
    width: '100%',
    height: '100%',
    paddingBottom: 32,
  },
  separator: {
    width: 11,
  },
  moreHeight: {
    height: 333,
  },
});

const styles_swiper = createStyleSheet({
  homeModule: {
    marginHorizontal: 0,
  },
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: -12,
  },
  separator: {
    width: 11,
  },
  item_wrap: {
    height: '100%',
  },
  productImage: {
    height: '100%',
  },
});
