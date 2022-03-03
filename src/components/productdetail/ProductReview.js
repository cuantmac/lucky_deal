import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import {px} from '../../constants/constants';
import Utils from '../../utils/Utils';
import Api from '../../Api';
import GlideImage from '../native/GlideImage';
import ImageScroll from '../common/ImageScroll';
import AppModule from '../../../AppModule';
import {Space} from '../common/Space';

const {width: screenWidth} = Dimensions.get('window');
/**
 *
 * @param navigation
 * @param detail
 * @param goodsType  0--直购，1--福袋
 * @returns {*}
 * @constructor
 */
export default ({navigation, detail, goodsType, showNums = 1}) => {
  const [commentList, setCommentList] = useState({});
  const [page, setPage] = useState(1);

  const [scaleImg, setScaleImg] = useState({show: false, index: 0, list: []});
  const [showComment, setShowComment] = useState();
  useEffect(() => {
    if (!navigation.isFocused()) {
      return;
    }
    setPage(1);
  }, [navigation]);

  useEffect(() => {
    if (!navigation.isFocused()) {
      return;
    }
    Api.getCommentList(
      detail.product_id || detail.bag_id,
      page,
      goodsType,
    ).then((res) => {
      let list = res.data?.list || [];
      if (res.data) {
        setCommentList(res.data);
      }
      if (list && list.length > 0) {
        setShowComment(list.slice(0, showNums));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail, goodsType, navigation]);

  const scaleImgFun = (j, i) => {
    let list = commentList.list;
    const images = list[i].images.map((item) => {
      return {url: item.replace('small.', 'big.'), freeHeight: true};
    });
    setScaleImg({show: true, index: j, list: images});
  };
  const goAllReviews = () => {
    if (showComment) {
      AppModule.reportClick('3', '216', {
        CategoryId: detail.category_id,
        CateStation: detail.cate_station,
        ProductId: detail.product_id || detail.bag_id,
      });
    }
  };
  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
        }}>
        <View>
          <View style={[styles.flexRowBetween, styles.reviewHead]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}>
              <Text style={styles.headText1}>
                Reviews({commentList.comment_total})
              </Text>
              <View style={[styles.flexRowCenter]}>
                <Text style={styles.blackText}>{commentList.scores}</Text>
                <Text style={styles.aText}> / 5</Text>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  starSize={20}
                  halfStarColor={'#E0A800'}
                  fullStarColor={'#898989'}
                  halfStarEnabled={true}
                  containerStyle={{
                    marginVertical: 10,
                  }}
                  halfStar={require('../../assets/half_star_rating.png')}
                  fullStar={require('../../assets/star_normal_new.png')}
                  emptyStar={require('../../assets/star_active_new.png')}
                  rating={commentList.scores}
                />
              </View>
            </View>
          </View>
          {showComment?.map((item, i) => {
            return (
              <View
                key={item.scores + i}
                style={{
                  width: screenWidth,
                  position: 'relative',
                  paddingBottom: 40 * px,
                }}>
                <View
                  style={{
                    marginHorizontal: 10,
                    borderTopWidth: 2 * px,
                    borderTopColor: '#dddddd66',
                    marginBottom: 20 * px,
                  }}
                />
                <View style={[styles.flexRowBetween, styles.listBody]}>
                  <Image
                    source={
                      item.avatar
                        ? {uri: item.avatar}
                        : require('../../assets/ph.png')
                    }
                    style={styles.nav}
                  />
                  <View style={[styles.listRight]}>
                    <View style={[styles.flexRowBetween, styles.rightTop]}>
                      <View>
                        <Text style={styles.nameText}>{item.user_name}</Text>
                        <Text style={styles.dateText}>
                          {Utils.formatDate(item.create_time)}
                        </Text>
                      </View>
                      <View style={{flex: 1}} />
                      <StarRating
                        disabled={false}
                        maxStars={5}
                        rating={item.scores}
                        starSize={20}
                        halfStarColor={'#E0A800'}
                        fullStarColor={'#898989'}
                        halfStarEnabled={true}
                        containerStyle={{
                          marginVertical: 10,
                        }}
                        halfStar={require('../../assets/half_star_rating.png')}
                        fullStar={require('../../assets/star_normal_new.png')}
                        emptyStar={require('../../assets/star_active_new.png')}
                      />
                    </View>
                    <Text style={styles.bodyText} numberOfLines={4}>
                      {item.content}
                    </Text>
                    <ScrollView
                      scrollEventThrottle={60}
                      horizontal={true} // 横向
                      showsHorizontalScrollIndicator={false}>
                      <View
                        style={[
                          styles.flexRowCenter,
                          {marginTop: 10, justifyContent: 'flex-start'},
                        ]}>
                        {item.images &&
                          item.images.map((imgItem, j) => {
                            return (
                              <TouchableOpacity
                                onPress={() => {
                                  AppModule.reportClick('3', '32', {
                                    ProductId:
                                      detail.product_id || detail.bag_id,
                                    CategoryId: detail.category_id,
                                    CateStation: detail.cate_station,
                                  });
                                  scaleImgFun(j, 0);
                                }}
                                key={`0+${j}+img`}
                                style={{
                                  paddingRight: 20 * px,
                                  alignSelf: 'center',
                                  justifyContent: 'flex-start',
                                }}>
                                <GlideImage
                                  key={`0+${j}+img`}
                                  resizeMode={'contain'}
                                  source={Utils.getImageUri(imgItem)}
                                  style={styles.img}
                                  defaultSource={require('../../assets/error_small_comment.png')}
                                />
                              </TouchableOpacity>
                            );
                          })}
                      </View>
                    </ScrollView>
                  </View>
                </View>
              </View>
            );
          })}
          {commentList.list && commentList.list.length > showNums ? (
            <TouchableOpacity
              onPress={goAllReviews}
              activeOpacity={0.6}
              style={{
                alignSelf: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: 40 * px,
                marginBottom: 40 * px,
              }}>
              <Text
                style={{
                  fontSize: 40 * px,
                  color: '#8A8A8A',
                  includeFontPadding: false,
                }}>
                View more
              </Text>
              <Image
                style={{width: 22 * px, height: 32 * px, marginLeft: 20 * px}}
                source={require('../../assets/icon_right_more.png')}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <ImageScroll
          data={scaleImg}
          callback={() => {
            setScaleImg({show: false, index: 0, list: []});
          }}
        />
      </View>
      <Space height={20} backgroundColor={'#eee'} />
    </>
  );
};
const styles = StyleSheet.create({
  flexRowCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRowBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewHead: {
    marginVertical: 30 * px,
    marginHorizontal: 10,
    borderStyle: 'solid',
  },
  underline: {
    height: 2 * px,
    color: '#eeeeee11',
    width: '100%',
  },
  headLeft: {
    paddingVertical: 10 * px,
    paddingHorizontal: 60 * px,
  },
  headText1: {
    color: 'black',
    fontSize: 50 * px,
    fontWeight: 'bold',
  },
  headText2: {
    color: '#000',
    fontSize: 80 * px,
    marginVertical: 2,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headText3: {
    color: 'black',
    fontSize: 40 * px,
    fontWeight: '500',
  },
  aText: {
    color: '#A0A0A0',
    fontSize: 50 * px,
    fontWeight: 'bold',
    textAlign: 'right',
    marginRight: 10,
  },
  blackText: {
    color: '#000000',
    fontSize: 50 * px,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  headText: {
    fontSize: 36 * px,
    color: '#000',
    textAlign: 'right',
  },
  star: {
    width: 50 * px,
    height: 50 * px,
    marginHorizontal: 10 * px,
    marginVertical: 30 * px,
  },
  listBody: {
    marginBottom: 30 * px,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  listRight: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'flex-start',
  },
  rightTop: {
    flex: 1,
    alignSelf: 'flex-end',
  },
  nameText: {
    fontSize: 45 * px,
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: 38 * px,
  },
  dateText: {
    fontSize: 30 * px,
    color: '#5C5C5C',
  },
  nav: {
    width: 80 * px,
    height: 80 * px,
    marginRight: 20 * px,
    borderRadius: 40 * px,
  },
  img: {
    width: 200 * px,
    height: 200 * px,
  },
  buyInContainer: {
    marginVertical: 30 * px,
    paddingHorizontal: 10,
  },
  leftText1: {
    color: 'black',
    fontSize: 30 * px,
  },
  text_a: {
    fontSize: 36 * px,
    textDecorationColor: '#555',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
});
