import React, {ComponentType, FC, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
  ViewStyle,
} from 'react-native';
import {Space} from '@src/widgets/space';
import {createStyleSheet, isWeb, styleAdapter} from '@src/helper/helper';
import {
  NewHomePageDataItem,
  ProductSimpleBaseItem,
  ResponseDataNewHomePageProductResponse,
} from '@luckydeal/api-common/lib/api';
import {CommonApi} from '@src/apis';
import {Message} from '@src/helper/message';
import {HomeModule, Title} from './widgets';

interface LoadMoreViewProp {
  data?: ProductSimpleBaseItem[];
  haveMore: boolean;
  loadMoreData: (from: string) => void;
  horizontal?: boolean;
  styles?: ComStyle;
  isMergedFlat?: boolean;
}

export const renderLoadMoreView: FC<LoadMoreViewProp> = ({
  haveMore,
  loadMoreData,
}) => {
  return (
    <>
      {haveMore ? (
        <View style={loadmore_style.wrap}>
          <TouchableOpacity
            onPress={() => loadMoreData('bottom_click')}
            style={loadmore_style.btn_wrap}>
            <Text style={loadmore_style.btn}>view more</Text>
            <Image
              source={require('../../../assets/home_viewmore.png')}
              style={loadmore_style.more}
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );
};

// export const needShowMore = (
//   haveMore: boolean,
//   isMergedFlat: boolean,
//   data?: ProductSimpleBaseItem[],
//   horizontal?: boolean,
// ) => {
//   if (isMergedFlat) {
//     return horizontal && haveMore && data && data.length >= 5;
//   } else {
//     return horizontal && haveMore && data && data.length >= 10;
//   }
// };

// export const renderLoadMoreHorizontal: FC<LoadMoreViewProp> = ({
//   data,
//   haveMore,
//   loadMoreData,
//   horizontal,
//   styles,
//   isMergedFlat = false,
// }) => {
//   return (
//     <>
//       {needShowMore(haveMore, isMergedFlat, data, horizontal) ? (
//         <View style={[loadmore_horizontal_style.wrap, styles?.moreHeight]}>
//           <TouchableOpacity
//             onPress={loadMoreData}
//             style={loadmore_horizontal_style.btn_wrap}>
//             <Text>MORE {'>'}</Text>
//           </TouchableOpacity>
//         </View>
//       ) : null}
//     </>
//   );
// };

interface ComStyle {
  titleStyle?: ViewStyle;
  container?: ViewStyle;
  separator?: ViewStyle;
  moreHeight?: ViewStyle;
}

interface BaseItemProps {
  isMergedFlat?: boolean;
  horizontal?: boolean;
  tabId: number;
  item: NewHomePageDataItem;
  onPress?: () => void;
  styles?: ComStyle;
  renderItem: any;
  numColumns?: number;
  showsHorizontalScrollIndicator?: boolean;
  ItemSeparatorComponent?: ComponentType;
  showSpace?: boolean;
  columnWrapperStyle?: ViewStyle;
}

interface mergedObjProp {
  top?: ProductSimpleBaseItem;
  bottom?: ProductSimpleBaseItem;
  product_id?: number;
}

export const HomeComponent: FC<BaseItemProps> = ({
  isMergedFlat = false,
  horizontal = false,
  tabId,
  item,
  styles,
  renderItem,
  numColumns,
  showsHorizontalScrollIndicator = false,
  ItemSeparatorComponent,
  showSpace,
  columnWrapperStyle,
}) => {
  const [data, setData] = useState<any>([]);
  const [pageNo, setPageNo] = useState<number>(1);
  const [haveMore, setHaveMore] = useState<boolean>(true);

  const getData = (
    tabId: number,
    item: NewHomePageDataItem,
    pageNo?: number,
  ): Promise<ProductSimpleBaseItem[]> => {
    return new Promise((ros) => {
      CommonApi.newHomePageProductDataUsingPOST({
        id: tabId,
        limit: 10,
        page: pageNo || 1,
        type_id: item.id,
      })
        .then((res: ResponseDataNewHomePageProductResponse) => {
          if (res.data.list?.length) {
            ros(res.data.list);
          } else {
            ros([]);
          }
        })
        .catch((e) => {
          Message.toast(e);
        });
    });
  };

  const loadMoreData = (from?: string) => {
    if (horizontal || from === 'bottom_click') {
      setPageNo(() => {
        return pageNo + 1;
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await getData(tabId, item, pageNo);
      if (res.length) {
        if (isMergedFlat) {
          const mergedRes: mergedObjProp[] = [];
          for (let i = 0; i < res.length; i++) {
            const obj: mergedObjProp = {};
            if (i % 2 === 1) {
              obj.top = res[i - 1];
              obj.bottom = res[i];
              obj.product_id = res[i].product_id;
              mergedRes.push(obj);
            } else {
              if (i === res.length - 1) {
                obj.top = res[i];
                obj.product_id = res[i].product_id;
                mergedRes.push(obj);
              }
            }
          }
          setData((old: any) => old.concat(mergedRes));
        } else {
          setData((old: any) => old.concat(res));
        }
      } else {
        setHaveMore(false);
      }
    };
    fetchData();
  }, [isMergedFlat, tabId, item, pageNo]);

  return (
    <HomeModule>
      <Title name={item.name} style={styles?.titleStyle} />
      <View style={styles?.container}>
        <FlatList
          initialNumToRender={1000}
          removeClippedSubviews={false}
          columnWrapperStyle={columnWrapperStyle}
          numColumns={numColumns}
          horizontal={horizontal}
          data={data}
          renderItem={renderItem}
          keyExtractor={(pro) => pro.product_id + item.id + ''}
          ItemSeparatorComponent={ItemSeparatorComponent}
          onEndReached={() => loadMoreData()}
          onEndReachedThreshold={0.9}
          showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
          ListFooterComponent={
            !horizontal ? renderLoadMoreView({haveMore, loadMoreData}) : null
          }
        />
      </View>
    </HomeModule>
  );
};

const loadmore_style = createStyleSheet({
  wrap: {
    backgroundColor:
      'linear-gradient(180deg,rgba(255,255,255,0.00), #ffffff 100%)',
    flexDirection: 'column-reverse',
    alignItems: 'center',
  },
  btn_wrap: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    width: 100,
    height: 30,
    borderWidth: 1,
    borderColor: '#222222',
  },
  btn: {
    fontSize: 14,
    color: '#222222',
    marginTop: 4,
  },
  more: {
    width: 11,
    height: 6,
    marginLeft: 4,
    marginTop: 12,
  },
});
