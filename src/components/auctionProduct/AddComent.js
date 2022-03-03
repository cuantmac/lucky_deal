import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  View,
  PermissionsAndroid,
} from 'react-native';

import * as ImagePicker from 'react-native-image-picker';
import GlideImage from '../native/GlideImage';
import StarRating from 'react-native-star-rating';
import Api from '../../Api';
import {px} from '../../constants/constants';
import Utils from '../../utils/Utils';
import AppModule from '../../../AppModule';
import {PRIMARY} from '../../constants/colors';

let textVal = '';

export default function AddComment({route, navigation}) {
  const {data, onGoBack, order_id} = route.params;
  const [avatarSource, setAvatarSource] = useState([]);
  const [comentVal, setComentVal] = useState('');
  const [starCount, setStarCount] = useState(0);
  const [dataReady, setDataReady] = useState(false);
  const [submit, setSubmited] = useState(false);

  const createFun = useCallback(
    (list) => {
      Api.commentSubmit(
        order_id,
        textVal,
        starCount,
        list,
        data.order_type,
        data.product_id,
      ).then((res) => {
        setSubmited(false);
        if (res.code === 0) {
          AppModule.reportTap('WriteReview', 'ld_save_review_success', {
            value: textVal,
          });
          Utils.toastFun('Success!');
          setTimeout(() => {
            onGoBack();
            navigation.goBack();
          });
        }
      });
    },
    [
      order_id,
      data.order_type,
      navigation,
      onGoBack,
      starCount,
      data.product_id,
    ],
  );

  const uploadImg = useCallback(() => {
    AppModule.reportTap('WriteReview', 'ld_save_review');
    if (!dataReady) {
      Utils.toastFun('Please add comment');
      return;
    }
    if (submit) {
      return;
    }
    setSubmited(true);
    if (avatarSource.length === 0) {
      createFun();
      return;
    }
    Api.commentUpload(avatarSource, (res) => {
      const list = res.url_list;
      createFun(list);
    });
  }, [avatarSource, createFun, dataReady, submit]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: 'Review',
      headerRight: (props) => (
        <TouchableOpacity onPress={uploadImg}>
          {submit ? (
            <ActivityIndicator color={PRIMARY} style={{marginRight: 20}} />
          ) : (
            <Text
              style={{
                fontSize: 40 * px,
                color: dataReady ? '#fff' : 'rgba(255, 74, 26, 1)',
                paddingHorizontal: 40 * px,
                paddingVertical: 10 * px,
                borderColor: '#fff',
                borderWidth: dataReady ? 0 : 1,
                borderRadius: 40 * px,
                backgroundColor: dataReady ? '#FF6936' : 'transparent',
              }}>
              Create
            </Text>
          )}
        </TouchableOpacity>
      ),
    });
  }, [submit, dataReady, navigation, uploadImg]);

  useEffect(() => {
    if (comentVal && starCount) {
      setDataReady(true);
    } else {
      setDataReady(false);
    }
  }, [comentVal, starCount]);

  const comentValChange = (val) => {
    setComentVal(val);
    textVal = val;
  };

  const productRender = () => {
    const {image, title, product_price, order_delivery_fee} = data;
    return (
      <View style={styles.flexRowBetween}>
        <GlideImage
          showDefaultImage={true}
          source={Utils.getImageUri(image)}
          defaultSource={require('../../assets/lucky_deal_default_middle.png')}
          resizeMode={'contain'}
          style={styles.productImg}
        />
        <View style={{flex: 1}}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.des}>
            Buy it Now price: ${product_price / 100}
          </Text>
          <Text style={styles.des}>
            Shipping price:${order_delivery_fee / 100}
          </Text>
        </View>
      </View>
    );
  };

  const starRender = () => {
    return (
      <View style={[styles.flexRowBetween, styles.starContainer]}>
        <Text style={styles.title}>Product evaluation:</Text>
        <StarRating
          disabled={false}
          maxStars={5}
          rating={starCount}
          starSize={25}
          halfStarColor={'#E0A800'}
          fullStarColor={'#898989'}
          halfStarEnabled={false}
          containerStyle={{marginVertical: 10, marginLeft: 10}}
          halfStar={require('../../assets/half_star_rating.png')}
          fullStar={require('../../assets/star_normal_new.png')}
          emptyStar={require('../../assets/star_active_new.png')}
          selectedStar={(rating) => setStarCount(rating)}
        />
      </View>
    );
  };
  const comentRender = () => {
    return (
      <View>
        <View style={[styles.flexRowBetween, styles.starContainer]}>
          <Image
            source={require('../../assets/edit.png')}
            style={styles.star}
          />
          <Text style={styles.title}>Creat post</Text>
        </View>
        <View
          style={{
            borderBottomColor: '#000000',
            borderBottomWidth: 1,
          }}>
          <TextInput
            multiline={true}
            onChangeText={(text) => comentValChange(text)}
            placeholder="Posting your shopping feelings can help more people who want to buy"
            value={comentVal}
            editable
            maxLength={2000}
            numberOfLines={4}
          />
        </View>
      </View>
    );
  };

  const options = {
    maxWidth: 500,
    maxHeight: 500,
    mediaType: 'photo',
    includeBase64: false,
    saveToPhotos: true,
  };
  const openCamera = async () => {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
    for (let key in granted) {
      if (granted[key] !== PermissionsAndroid.RESULTS.GRANTED) {
        return;
      }
    }
    ImagePicker.launchCamera(options, (response) => {
      if (!response.errorCode) {
        setAvatarSource([
          ...avatarSource,
          ...(response?.assets || []).map((res) => {
            return {
              uri: res.uri,
              type: res.type,
              name: res.fileName,
            };
          }),
        ]);
      }
    });
  };
  const selectImage = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePicker.launchImageLibrary(options, (response) => {
          if (!response.errorCode) {
            setAvatarSource([
              ...avatarSource,
              ...(response?.assets || []).map((res) => {
                return {
                  uri: res.uri,
                  type: res.type,
                  name: res.fileName,
                };
              }),
            ]);
          }
        });
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const deleteImg = (index) => {
    console.log('index', index);
    index
      ? setAvatarSource(avatarSource.splice(index, 1))
      : setAvatarSource([]);
  };
  const uploadRender = () => {
    return (
      <View style={[styles.flexRowBetween, styles.uploadContainer]}>
        {avatarSource.map((photo, index) => {
          return (
            <View
              style={[
                styles.pickContaner,
                {
                  borderWidth: 0,
                  backgroundColor: 'transparent',
                  position: 'relative',
                },
              ]}
              key={`image-${index}`}>
              <Image
                style={{width: 100, height: 100}}
                source={{uri: photo.uri}}
              />
              <TouchableOpacity
                onPress={() => deleteImg(index)}
                style={{position: 'absolute', top: 1, right: 1, padding: 10}}>
                <Image
                  source={require('../../assets/circle_close.png')}
                  style={{
                    width: 50 * px,
                    height: 50 * px,
                    position: 'absolute',
                    top: 5,
                    right: 5,
                  }}
                />
              </TouchableOpacity>
            </View>
          );
        })}
        <TouchableOpacity
          onPress={openCamera}
          style={[styles.flexColumn, styles.pickContaner]}>
          <Image
            source={require('../../assets/camrow.png')}
            style={styles.uploadAvatar}
          />
          <Text>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={selectImage}
          style={[styles.flexColumn, styles.pickContaner]}>
          <Image
            source={require('../../assets/camrow.png')}
            style={styles.uploadAvatar}
          />
          <Text>Select Photo</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderRadius: 20 * px,
        marginHorizontal: 20 * px,
        marginVertical: 20 * px,
        overflow: 'hidden',
      }}>
      {/* <Text>test</Text> */}
      {productRender()}
      {starRender()}
      {comentRender()}
      {uploadRender()}
    </View>
  );
}
const styles = StyleSheet.create({
  flexRowCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  flexRowBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImg: {
    width: 104,
    height: 104,
    marginRight: 20,
    borderRadius: 20 * px,
  },
  title: {
    fontSize: 36 * px,
    fontWeight: 'bold',
  },
  des: {
    fontSize: 36 * px,
  },
  starContainer: {
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  star: {
    width: 50 * px,
    height: 50 * px,
    marginHorizontal: 10 * px,
    marginVertical: 30 * px,
  },
  uploadAvatar: {
    width: 101 * px,
    height: 90 * px,
    margin: 6,
  },
  uploadContainer: {
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 15,
  },
  pickContaner: {
    borderRadius: 25 * px,
    borderWidth: 2 * px,
    borderColor: '#A4A4A4',
    borderStyle: 'dashed',
    backgroundColor: '#ddd',
    width: 100,
    height: 100,
    overflow: 'hidden',
    marginHorizontal: 5,
    marginVertical: 5,
    // paddingVertical: 10,
    // paddingHorizontal: 20,
  },
});
