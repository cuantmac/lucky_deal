import {
  BagProductDetailResponse,
  OfferProductDetailResponse,
} from '@luckydeal/api-common';
import {
  convertAmountUS,
  createStyleSheet,
  isWeb,
  styleAdapter,
} from '@src/helper/helper';
import {ShareDialog, ShareDialogRef} from '@src/widgets/dialogs/shareDialog';
import {GlideImage, GlideImageProps} from '@src/widgets/glideImage';
import {StarRating} from '@src/widgets/starRating';
import React, {FC, memo, useRef} from 'react';
import {ImageStyle, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {OnSkuChangePrams} from '../skuSelect/skuSelectModal';
import {ProductDetailModule} from '../widgets';

interface ProductInfoProps {
  data: BagProductDetailResponse | OfferProductDetailResponse;
  price?: OnSkuChangePrams['price'];
  onLovePress: () => void;
}

export const ProductInfo: FC<ProductInfoProps> = memo(
  ({data, onLovePress, price}) => {
    const shareRef = useRef<ShareDialogRef>(null);
    const showLinePrice = !!price?.originalPrice || !!data.original_price;
    return (
      <ProductDetailModule addSpace={false} style={ProductInfoStyles.container}>
        <View style={ProductInfoStyles.topContainer}>
          <Text
            style={[
              ProductInfoStyles.marketPrice,
              showLinePrice && {color: '#D0011A'},
            ]}>
            {convertAmountUS(price ? price.marketPrice : data.mark_price)}
          </Text>
          <View style={ProductInfoStyles.iconContainer}>
            <ProductInfoIcon
              style={styleAdapter({marginRight: isWeb() ? 0 : 20})}
              onPress={onLovePress}
              source={
                data.is_like
                  ? require('@src/assets/love_active_icon.png')
                  : require('@src/assets/love_icon.png')
              }
            />
            {!isWeb() && (
              <ProductInfoIcon
                onPress={() => {
                  shareRef.current?.share({url: data.share_url});
                }}
                source={require('@src/assets/share_icon.png')}
              />
            )}
          </View>
        </View>
        {showLinePrice && (
          <Text style={ProductInfoStyles.orginPrice}>
            {convertAmountUS(price ? price.originalPrice : data.original_price)}
          </Text>
        )}
        <Text numberOfLines={3} style={ProductInfoStyles.title}>
          {data.title}
        </Text>
        <View style={ProductInfoStyles.bottomContainer}>
          <Text style={ProductInfoStyles.totalScore}>
            <Text style={ProductInfoStyles.score}>{data.scores}</Text>/5
          </Text>
          <StarRating
            containerStyle={ProductInfoStyles.ratingContainer}
            disabled
            rating={data.scores}
            maxStars={5}
          />
          {/* <Text style={ProductInfoStyles.orderText}>
            {data.order_num} orders
          </Text> */}
        </View>
        <ShareDialog ref={shareRef} />
      </ProductDetailModule>
    );
  },
);

interface ProductInfoIconProps {
  source: GlideImageProps['source'];
  onPress?: () => void;
  style?: ImageStyle;
}

const ProductInfoIcon: FC<ProductInfoIconProps> = ({
  source,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <GlideImage
        defaultSource={false}
        style={[ProductInfoStyles.productInfoIcon, style]}
        source={source}
      />
    </TouchableOpacity>
  );
};

const ProductInfoStyles = createStyleSheet({
  container: {
    backgroundColor: 'white',
    paddingTop: 12,
    paddingBottom: 14,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  marketPrice: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  orginPrice: {
    marginTop: 4,
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  productInfoIcon: {
    width: 18,
    height: 18,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    color: '#222',
    marginTop: 12,
  },
  bottomContainer: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
  },
  score: {
    color: '#222222',
    fontSize: 12,
    lineHeight: 17,
  },
  totalScore: {
    fontSize: 10,
    color: '#666',
  },
  ratingContainer: {
    paddingLeft: 5,
    paddingRight: 10,
  },
  orderText: {
    fontSize: 10,
    lineHeight: 14,
    color: '#666',
  },
});
