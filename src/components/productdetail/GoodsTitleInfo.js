import {
  ActivityIndicator,
  Image,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {px} from '../../constants/constants';
import React, {useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {navigationRef} from '../../utils/refs';
import Api from '../../Api';
import AppModule from '../../../AppModule';
import StarRating from 'react-native-star-rating';
import {categoryDetailPath} from '../../analysis/report';
import {
  MartketPriceText,
  OriginPriceText,
} from '../../widgets/productItem/widgets/PriceText';
import Utils from '../../utils/Utils';
export default ({way, goodsDetail, style}) => {
  const token = useSelector((state) => state.deprecatedPersist.token);

  const [liking, setLiking] = useState(false);
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(goodsDetail.is_like);
  const [likeNum, setLikedNum] = useState(goodsDetail.like_num);

  const [pressCount, setPressCount] = useState(0);

  const onPressTitle = () => {
    setPressCount((old) => old + 1);
  };

  const LikeButton = useMemo(
    () => (
      <TouchableOpacity
        style={{
          height: 60 * px,
          width: 80 * px,
          justifyContent: 'center',
        }}
        onPress={() => {
          if (goodsDetail.goods_type === 2) {
            AppModule.reportShow('13', '123', {
              CategoryId: goodsDetail.category_id,
              CateStation: goodsDetail.cate_station,
              SuperboxId: goodsDetail.bag_id,
              LikeState: liked ? '1' : '0',
            });
          } else {
            AppModule.reportClick('3', '22', {
              ProductId: goodsDetail.product_id || goodsDetail.bag_id,
              CategoryId: goodsDetail.category_id,
              CateStation: goodsDetail.cate_station,
              LikeState: liked ? '1' : '0',
              ProductCat: categoryDetailPath.getData().ProductCat,
            });
          }
          if (!token) {
            navigationRef.current?.navigate('FBLogin');
            return;
          }
          if (liking) {
            return;
          }
          setLiking(true);
          Api.like(
            goodsDetail.product_id || goodsDetail.bag_id,
            goodsDetail.goods_type === 0 ? 0 : 1,
          ).then((res) => {
            setLiking(false);
            if (res.code === 0) {
              setLikedNum((old) => {
                return !liked ? old + 1 : old - 1;
              });
              setLiked(!liked);
            }
          });
        }}>
        {liking ? (
          <View
            style={{
              alignSelf: 'center',
              width: 30 * px,
              height: 30 * px,
              borderRadius: 25 * px,
            }}>
            <ActivityIndicator color={'red'} style={{flex: 1}} />
          </View>
        ) : (
          <Image
            source={
              liked
                ? require('../../assets/new_liked.png')
                : require('../../assets/new_like.png')
            }
            style={{
              width: 53 * px,
              height: 48 * px,
              alignSelf: 'center',
            }}
          />
        )}
      </TouchableOpacity>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      goodsDetail.product_id,
      dispatch,
      liked,
      liking,
      token,
      way,
      goodsDetail.like_num,
    ],
  );

  /**
   * 普通商品价格显示模版
   */
  const CommonProductPriceModule = useMemo(() => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {goodsDetail?.free_shipping?.is_free_shipping_fee && (
          <Image
            style={{
              width: 74 * px,
              height: 50 * px,
              marginRight: 14 * px,
            }}
            source={require('../../assets/free_ship_highlight.png')}
          />
        )}
        <MartketPriceText
          style={{fontSize: 50 * px}}
          value={goodsDetail.mark_price}
          isActivity={goodsDetail?.flash_sales?.is_discount}
        />
        <OriginPriceText
          style={{fontSize: 30 * px, marginLeft: 16 * px}}
          value={goodsDetail.mark_price}
          isActivity={goodsDetail?.flash_sales?.is_discount}
        />
        {goodsDetail.discount_fee > 0 && (
          <Text
            style={{
              marginLeft: 20 * px,
              paddingHorizontal: 10 * px,
              fontSize: 24 * px,
              borderRadius: 8 * px,
              color: 'white',
              backgroundColor: '#ff4d50',
            }}>
            Discount: {Utils.convertAmountUS(goodsDetail.discount_fee)}
          </Text>
        )}
      </View>
    );
  }, [goodsDetail]);

  return (
    <View
      style={[
        {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10,
          paddingHorizontal: 10,
          paddingBottom: 30 * px,
          backgroundColor: '#fff',
        },
        style,
      ]}>
      <View style={{flex: 1}}>
        <View style={styles.flexRow}>
          {CommonProductPriceModule}
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 80 * px,
              height: 80 * px,
              flexDirection: 'column',
              position: 'absolute',
              right: 0,
            }}>
            {LikeButton}
            <Text style={{color: '#828282', fontSize: 26 * px}}>{likeNum}</Text>
          </View>
        </View>
        <TouchableOpacity activeOpacity={1.0} onPress={onPressTitle}>
          <Text style={styles.title}>
            {goodsDetail.title +
              (AppModule.devMode || pressCount >= 2
                ? `(${goodsDetail.product_id || goodsDetail.bag_id})`
                : '')}
          </Text>
        </TouchableOpacity>

        <View style={styles.flexRow}>
          <StarRating
            disabled={false}
            maxStars={5}
            starSize={12}
            halfStarColor={'#E0A800'}
            fullStarColor={'#898989'}
            containerStyle={{marginVertical: 5}}
            halfStarEnabled={true}
            halfStar={require('../../assets/half_star_rating.png')}
            fullStar={require('../../assets/star_normal_new.png')}
            emptyStar={require('../../assets/star_active_new.png')}
            rating={goodsDetail.scores}
          />
          <Text
            style={{
              color: '#000000',
              marginLeft: 4 * px,
              fontSize: 34 * px,
              alignSelf: 'center',
            }}>
            {goodsDetail.scores}
          </Text>
          <Text
            style={{
              color: '#515151',
              marginHorizontal: 10 * px,
            }}>
            |
          </Text>
          <Text
            style={{
              color: '#515151',
              fontSize: 32 * px,
              alignSelf: 'center',
            }}>
            {goodsDetail.order_num} orders
          </Text>
        </View>
      </View>
    </View>
  );
};
const styles = {
  flexRow: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 36 * px,
    marginTop: 6,
    marginBottom: 6,
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
};
