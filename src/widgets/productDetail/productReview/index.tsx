import React, {FC, memo, useEffect, useState} from 'react';
import {ProductDetailModule, ProductDetailModuleTitle} from '../widgets';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import {
  BagProductDetailResponse,
  CommentItem,
  CommentListResponse,
  OfferProductDetailResponse,
} from '@luckydeal/api-common';
import {CommonApi} from '@src/apis';
import {GlideImage} from '@src/widgets/glideImage';
import {createStyleSheet} from '@src/helper/helper';
import {StarRating} from '@src/widgets/starRating';
import {AnchorCollecter} from '@src/widgets/anchor';
import {ProductReviewsRoute} from '@src/routes';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);
interface ProductReviewProps {
  data: OfferProductDetailResponse | BagProductDetailResponse;
}

export const ProductReview: FC<ProductReviewProps> = memo(({data}) => {
  const [reviewData, setReviewData] = useState<CommentListResponse>();
  const ProductReviewsRouter = ProductReviewsRoute.useRouteLink();
  const productId =
    (data as OfferProductDetailResponse).product_id ||
    (data as BagProductDetailResponse).bag_id;
  useEffect(() => {
    CommonApi.commitListUsingPOST({
      page: 1,
      product_type: data.product_type,
      product_id: productId,
    }).then((res) => {
      res.data.list = (res.data.list || []).slice(0, 2);
      setReviewData(res.data);
    });
  }, [data, productId]);

  if (!reviewData || !reviewData?.list?.length) {
    return null;
  }

  return (
    <AnchorCollecter title={'Reviews'} id={3}>
      <ProductDetailModule>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            ProductReviewsRouter.navigate({
              productId,
              productType: data.product_type,
            })
          }>
          <View style={ProductReviewStyles.productReviewHeaderContainer}>
            <ProductDetailModuleTitle
              title={`Reviews (${reviewData.comment_total})`}
            />
            <GlideImage
              style={ProductReviewStyles.reviewArrow}
              source={require('@src/assets/me_arrow.png')}
            />
          </View>
          <View style={ProductReviewStyles.scoresContainer}>
            <Text style={ProductReviewStyles.productScores}>
              {reviewData.scores}
              <Text style={ProductReviewStyles.productScoresTotal}>/5</Text>
            </Text>
            <StarRating disabled rating={reviewData.scores} />
          </View>
        </TouchableOpacity>

        {reviewData.list.map((item, index) => {
          return <ReviewItem data={item} key={index} />;
        })}
        <TouchableOpacity
          style={ProductReviewStyles.viewMoreContainer}
          activeOpacity={0.8}
          onPress={() => {
            ProductReviewsRouter.navigate({
              productId,
              productType: data.product_type,
            });
          }}>
          <Text style={ProductReviewStyles.moreText}>View More</Text>
          <GlideImage
            style={ProductReviewStyles.moreIcon}
            source={require('@src/assets/me_arrow.png')}
          />
        </TouchableOpacity>
      </ProductDetailModule>
    </AnchorCollecter>
  );
});

interface ReviewItemData {
  data: CommentItem;
  isAllReviews?: boolean;
}

export const ReviewItem: FC<ReviewItemData> = ({data, isAllReviews}) => {
  return (
    <View style={ProductReviewStyles.reviewItemContainer}>
      <View style={ProductReviewStyles.avatarContainer}>
        <GlideImage
          resizeMode={'cover'}
          style={ProductReviewStyles.avatar}
          source={{uri: data.avatar}}
        />
        <View style={ProductReviewStyles.avatarContainerRight}>
          <Text style={ProductReviewStyles.userName}>{data.user_name}</Text>
          {isAllReviews ? (
            <Text style={ProductReviewStyles.time}>
              {dayjs.unix(data.create_time).format('L LT')}
            </Text>
          ) : (
            <StarRating disabled rating={data.scores} />
          )}
        </View>
        {isAllReviews && (
          <StarRating
            containerStyle={{marginLeft: 'auto'}}
            disabled
            rating={data.scores}
          />
        )}
      </View>
      <View style={ProductReviewStyles.content}>
        <Text
          style={ProductReviewStyles.contentText}
          numberOfLines={isAllReviews ? undefined : 3}>
          {data.content}
        </Text>
        {!!data.images && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={ProductReviewStyles.contentImageContainer}>
            {data.images?.map((img, index) => {
              return (
                <GlideImage
                  style={ProductReviewStyles.contentImage}
                  resizeMode={'cover'}
                  source={{uri: img}}
                  key={index}
                />
              );
            })}
          </ScrollView>
        )}
        {!!data.sku_info && (
          <Text style={ProductReviewStyles.skuInfo}>{data.sku_info}</Text>
        )}
      </View>
    </View>
  );
};

const ProductReviewStyles = createStyleSheet({
  productReviewHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewArrow: {
    width: 10,
    height: 10,
  },
  scoresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5e5',
    paddingBottom: 10,
  },
  productScores: {
    fontSize: 12,
    lineHeight: 17,
    color: '#222',
    marginRight: 5,
  },
  productScoresTotal: {
    fontSize: 10,
  },
  reviewItemContainer: {
    paddingTop: 12,
    overflow: 'hidden',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  avatarContainerRight: {
    marginLeft: 7,
  },
  userName: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '700',
    color: '#666',
  },
  time: {
    color: '#999',
    fontSize: 10,
    lineHeight: 12,
  },
  content: {
    paddingLeft: 37,
    paddingBottom: 10,
  },
  contentText: {
    fontSize: 12,
    lineHeight: 14,
    color: '#222',
    paddingTop: 9,
  },
  contentImageContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  contentImage: {
    width: 60,
    height: 60,
    marginRight: 8,
    borderRadius: 2,
  },
  skuInfo: {
    marginTop: 10,
    fontSize: 10,
    color: '#999',
    lineHeight: 14,
  },
  viewMoreContainer: {
    borderTopWidth: 1,
    borderColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
  },
  moreText: {
    color: 'rgb(136,136,136)',
    fontWeight: '700',
    fontSize: 12,
  },
  moreIcon: {
    width: 10,
    height: 10,
    marginLeft: 5,
  },
});
