import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl,
  StatusBar,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import {HELP, px} from '../../constants/constants';
import Utils from '../../utils/Utils';
import Api from '../../Api';
import GlideImage from '../native/GlideImage';
import ImageScroll from '../common/ImageScroll';
import AppModule from '../../../AppModule';
import {PRIMARY} from '../../constants/colors';

const {width: screenWidth} = Dimensions.get('window');
export default function ProductAllReview({navigation, route}) {
  const {detail, goodsType} = route.params;
  const [commentList, setCommentList] = useState({});
  const pageRef = useRef(1);
  const [isRefreshing, setRefreshing] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [isLoadComplete, setLoadComplete] = useState(false);
  const [scaleImg, setScaleImg] = useState({show: false, index: 0, list: []});
  useLayoutEffect(() => {
    navigation.setOptions(
      {
        headerShown: true,
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: '#fff',
          borderBottomWidth: 0,
          elevation: 0,
        },
        headerTitleAlign: 'center',
        title: 'Reviews',
      },
      [navigation],
    );
  });
  useEffect(() => {
    if (!navigation.isFocused()) {
      return;
    }
    pageRef.current = 1;
  }, [navigation]);

  useEffect(() => {
    AppModule.reportShow('3', '217', {
      CategoryId: detail.category_id,
      CateStation: detail.cate_station,
      ProductId: detail.product_id || detail.bag_id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!navigation.isFocused()) {
      return;
    }
    fetchDataList();
  }, [navigation, fetchDataList]);

  const loadMore = () => {
    if (isLoading || isLoadComplete) {
      return;
    }
    setLoading(true);
    pageRef.current++;
    fetchDataList();
  };

  const fetchDataList = useCallback(() => {
    Api.getCommentList(
      detail.product_id || detail.bag_id,
      pageRef.current,
      goodsType,
    ).then((res) => {
      let list = res.data?.list || [];
      if (list.length < 10) {
        setLoadComplete(true);
      }
      if (pageRef.current > 1) {
        setCommentList((old) => {
          old.list = old.list.concat(list);
          return old;
        });
      } else {
        if (res.data) {
          setCommentList(res.data);
        }
      }
      setRefreshing(false);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);
  const scaleImgFun = (j, i) => {
    let list = commentList.list;
    const images = list[i].images.map((item) => {
      return {url: item.replace('small.', 'big.'), freeHeight: true};
    });
    setScaleImg({show: true, index: j, list: images});
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    pageRef.current = 1;
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <View style={[styles.flexRowBetween, styles.listBody]}>
        <Image
          source={
            item.avatar ? {uri: item.avatar} : require('../../assets/ph.png')
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
          <Text style={styles.bodyText}>{item.content}</Text>
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
                          ProductId: detail.product_id || detail.bag_id,
                          CategoryId: detail.category_id,
                          CateStation: detail.cate_station,
                        });
                        scaleImgFun(j, index);
                      }}
                      key={`${index}+${j}+img`}
                      style={{
                        paddingRight: 20 * px,
                        alignSelf: 'center',
                        justifyContent: 'flex-start',
                      }}>
                      <GlideImage
                        key={`${index}+${j}+img`}
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
    );
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <StatusBar backgroundColor={'transparent'} barStyle={'dark-content'} />
      <View>
        <View
          style={{
            width: screenWidth,
            position: 'relative',
          }}>
          <FlatList
            data={commentList.list}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            ListFooterComponent={() => {
              if (isLoadComplete) {
                return null;
              }
              if (!commentList.list || commentList.list.length === 0) {
                return null;
              }
              return (
                <ActivityIndicator color={PRIMARY} style={{padding: 10}} />
              );
            }}
            onEndReachedThreshold={0.4}
            onEndReached={loadMore}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>

      <ImageScroll
        data={scaleImg}
        callback={() => {
          setScaleImg({show: false, index: 0, list: []});
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  flexRowCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // width: '100%',
  },

  flexRowBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});
