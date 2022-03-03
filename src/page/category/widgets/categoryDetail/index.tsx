import {
  CategoryTopItem,
  CategoryTwoItem,
  CategoryThreeItem,
} from '@luckydeal/api-common';
import {CommonApi} from '@src/apis';
import {createCtx, createStyleSheet} from '@src/helper/helper';
import {ProductListRoute} from '@src/routes';
import {useLoading} from '@src/utils/hooks';
import {Empty} from '@src/widgets/empty';
import {GlideImage} from '@src/widgets/glideImage';
import {PageStatusControl} from '@src/widgets/pageStatusControl';
import React, {FC, useCallback, useContext, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatListProps,
  FlatList,
} from 'react-native';

interface CategoryDetailProps {
  topItem: CategoryTopItem;
}

type CategoryData = {data: CategoryTwoItem[]; active?: CategoryTwoItem};

export const [CategoryCtx, CategoryProvider] = createCtx<
  Record<number, CategoryData>
>({});

export const CategoryDetail: FC<CategoryDetailProps> = ({topItem}) => {
  const {state, update} = useContext(CategoryCtx);
  const [loading, withLoading] = useLoading();
  const topItemId = topItem.top_item_id;
  const categoryData = state[topItemId];
  const flatListRef = useRef<FlatList>(null);

  const getCategorySecondData = useCallback(() => {
    return withLoading(
      CommonApi.categoryInfoUsingPOST({
        top_item_id: topItemId,
      }),
    ).then((res) => {
      const list = res?.data?.list || [];
      update((old) => {
        return {
          ...old,
          [topItemId]: {
            data: list,
            active: list[0],
          },
        };
      });
    });
  }, [topItemId, update, withLoading]);

  const renderItem = useCallback<
    NonNullable<FlatListProps<CategoryTwoItem>['renderItem']>
  >(({item}) => {
    return (
      <>
        <Text style={CategoryDetailStyles.categoryTitle}>
          {item.two_item_name}
        </Text>
        <View style={CategoryDetailStyles.threeCategoryContainer}>
          {item.child_item.map((val) => {
            return <ThreeCategoryItem key={val.three_item_id} data={val} />;
          })}
        </View>
      </>
    );
  }, []);

  useEffect(() => {
    if (!categoryData?.data) {
      getCategorySecondData();
    }
  }, [categoryData, getCategorySecondData, state, topItemId]);

  return (
    <View style={CategoryDetailStyles.container}>
      <PageStatusControl
        loading={loading}
        hasData={!!categoryData?.data?.length}
        emptyComponent={
          <Empty
            title="No commodity data is available"
            image={require('@src/assets/home_empty.png')}
          />
        }
        showEmpty>
        <>
          <FlatList
            showsVerticalScrollIndicator={false}
            ref={flatListRef}
            keyExtractor={(item) => item.two_item_id + ''}
            data={categoryData?.data}
            renderItem={renderItem}
          />
        </>
      </PageStatusControl>
    </View>
  );
};

interface ThreeCategoryItemProps {
  data: CategoryThreeItem;
}

const ThreeCategoryItem: FC<ThreeCategoryItemProps> = ({data}) => {
  const productListRouter = ProductListRoute.useRouteLink();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={CategoryDetailStyles.threeItem}
      onPress={() =>
        productListRouter.navigate({
          threeCategoryId: data.three_item_id,
          behavior: 'back',
        })
      }>
      <GlideImage
        style={CategoryDetailStyles.image}
        source={{uri: data.picture}}
      />
      <Text style={CategoryDetailStyles.name}>{data.three_item_name}</Text>
    </TouchableOpacity>
  );
};

const CategoryDetailStyles = createStyleSheet({
  container: {
    flex: 1,
  },
  categoryTitle: {
    color: '#222222',
    height: 52,
    lineHeight: 52,
    fontSize: 12,
    paddingLeft: 20,
  },
  threeCategoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    flexWrap: 'wrap',
  },
  threeItem: {
    marginHorizontal: 10,
  },
  image: {
    width: 65,
    height: 65,
    marginBottom: 6,
  },
  name: {
    width: '70%',
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 14,
  },
});
