import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import React, {useLayoutEffect, useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {px, SCREEN_WIDTH} from '../../../constants/constants';
import Utils from '../../../utils/Utils';
import Api from '../../../Api';
import AppModule from '../../../../AppModule';
import {ACCENT, PRIMARY} from '../../../constants/colors';
import UploadImg from '../../common/UploadImg';
import {updateBackMessageCount} from '../../../redux/persistReducers';
import {navigationRef} from '../../../utils/refs';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {useIsFocused} from '@react-navigation/core';

export default ({navigation}) => {
  const {feedBackMessageCount, feedBackList} = useSelector(
    (state) => state.deprecatedPersist,
  );
  const token = useSelector((state) => state.deprecatedPersist.token);
  const dispatch = useDispatch();
  const imgUploadRef = useRef();
  const focus = useIsFocused();
  const [feedBackTitles, setFeedBackTitles] = useState([]);
  const [isLoadComplete, setLoadComplete] = useState(false);
  const [expand, setExpand] = useState(false);
  const [feedTypeItem, setFeedTypeItem] = useState();
  useEffect(() => {
    if (focus) {
      Api.feedBackTypeList().then((res) => {
        setLoadComplete(true);
        if (res.code === 0) {
          let feedBackReasons = res.data?.list.map((item) => {
            return {
              label: item.content,
              value: item.id,
            };
          });
          setFeedBackTitles(feedBackReasons);
        }
      });
    }
  }, [focus]);

  useLayoutEffect(() => {
    AppModule.reportPv('FeedBack');
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: 'Feedback',
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            AppModule.reportTap('Feedback', 'ld_feedback_message_click');
            if (!token) {
              navigation.navigate('FBLogin');
              return;
            }
            // navigation.navigate('MessageList');
            navigation.navigate('FeedBackMessageList');
          }}>
          <Image
            style={{
              width: 102 * px,
              height: 72 * px,
              marginHorizontal: 20 * px,
            }}
            source={require('../../../assets/feedbackmessage.png')}
          />
          {feedBackMessageCount > 0 && (
            <View
              style={{
                position: 'absolute',
                right: 5,
                top: 0,
                backgroundColor: 'red',
                borderRadius: 6,
                width: 12,
                height: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 9,
                  fontWeight: 'bold',
                }}>
                {feedBackMessageCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, feedBackMessageCount, token]);

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [logging, setLogging] = useState('');
  const [imgList, setImgList] = useState([]);
  const timer = useRef();

  useEffect(() => {
    if (token && focus) {
      if (timer.current) {
        clearInterval(timer.current);
      }
      timer.current = setInterval(() => {
        AppModule.log('-----feedback');
        dispatch(updateBackMessageCount(feedBackList.length));
      }, 60 * 1000);
    } else {
      clearInterval(timer.current);
    }

    return () => {
      clearInterval(timer.current);
    };
  }, [token, dispatch, feedBackList.length, focus]);

  const submit = async () => {
    if (logging) {
      return;
    }
    if (!Utils.emailCheck(email)) {
      Utils.toastFun('please fill in correct email address.');
      return;
    }
    if (message.length < 1) {
      Utils.toastFun('please fill in question or advice.');
      return;
    }
    setLogging(true);
    uploadImg();
  };

  const uploadImg = () => {
    if (imgList.length === 0) {
      sendData('');
      return;
    }
    Api.commentUpload(imgList, (res) => {
      const list = res.url_list.toString();
      sendData(list);
    });
  };
  const sendData = (images) => {
    const content = message;
    Api.feedBack(email, content, images, feedTypeItem?.value)
      .then((res) => {
        if (res.code === 0) {
          Utils.toastFun(res.data.message);
          reset();
          navigationRef.current.goBack();
        } else {
          setTimeout(() => setLogging(false), 3 * 1000);
        }
      })
      .finally(() => {
        setLogging(false);
      });
  };
  const reset = () => {
    setEmail('');
    setMessage('');
    imgUploadRef.current.resetList();
    setImgList([]);
    setLogging(false);
  };

  const onChangeValue = (value) => {
    let feedBackReason = feedBackTitles.find((item) => item.value === value);
    setFeedTypeItem(feedBackReason);
    changeFeedListStatus();
  };
  const changeFeedListStatus = () => {
    setExpand((old) => !old);
  };
  const FeedBackReasonList = () => {
    return (
      <View
        style={{
          width: SCREEN_WIDTH - 110 * px,
          zIndex: 9,
          backgroundColor: '#eeeeee',
          borderBottomLeftRadius: 20 * px,
          borderBottomRightRadius: 20 * px,
          marginLeft: 55 * px,
          marginRight: 55 * px,
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingHorizontal: 10 * px,
          paddingTop: 10 * px,
        }}>
        <RadioForm initial={0} buttonColor={'#F36A36'}>
          {feedBackTitles.map((obj, i) => (
            <RadioButton
              labelHorizontal={true}
              key={i}
              style={{
                minHeight: 90 * px,
                width: SCREEN_WIDTH - 130 * px,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                alignContent: 'center',
                borderBottomColor: '#D8D8D8',
                borderBottomWidth: 2 * px,
              }}>
              <RadioButtonLabel
                onPress={onChangeValue}
                obj={obj}
                index={i}
                labelHorizontal={true}
                labelStyle={{
                  width: SCREEN_WIDTH - 240 * px,
                  minHeight: 90 * px,
                  fontSize: 36 * px,
                  color: '#000',
                }}
                labelWrapStyle={{}}
              />
              <RadioButtonInput
                obj={obj}
                index={i}
                isSelected={feedTypeItem?.value === obj.value}
                buttonInnerColor={'#F36A36'}
                buttonOuterColor={
                  feedTypeItem?.value === obj.value ? '#F36A36' : '#F36A36'
                }
                buttonSize={10}
                buttonOuterSize={20}
                buttonStyle={{
                  alignItems: 'center',
                  borderWidth: 4 * px,
                  alignSelf: 'center',
                }}
                buttonWrapStyle={{marginLeft: 10}}
                onPress={onChangeValue}
              />
            </RadioButton>
          ))}
        </RadioForm>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={64}
      style={{flex: 1}}>
      {!isLoadComplete ? (
        <ActivityIndicator
          color={PRIMARY}
          style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
          size="large"
        />
      ) : (
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={{
            minHeight: '100%',
          }}
          style={{
            backgroundColor: 'white',
            flex: 1,
          }}>
          {feedBackTitles?.length > 0 && (
            <TouchableOpacity
              onPress={changeFeedListStatus}
              style={{
                borderColor: '#EEEEEE',
                borderWidth: 3 * px,
                minHeight: 90 * px,
                borderTopLeftRadius: 20 * px,
                borderTopRightRadius: 20 * px,
                borderBottomLeftRadius: expand ? 0 : 20 * px,
                borderBottomRightRadius: expand ? 0 : 20 * px,
                marginLeft: 55 * px,
                marginRight: 55 * px,
                marginTop: 60 * px,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingHorizontal: 10 * px,
              }}>
              <TextInput
                placeholder={'Please select your question type'}
                editable={false}
                value={feedTypeItem?.label}
                style={{
                  minHeight: 90 * px,
                  color: 'black',
                  fontSize: 40 * px,
                  maxWidth: SCREEN_WIDTH - 200 * px,
                }}
              />
              <Image
                style={{width: 38 * px, height: 38 * px}}
                source={
                  expand
                    ? require('../../../assets/icon_search_expand.png')
                    : require('../../../assets/icon_search_pull.png')
                }
              />
            </TouchableOpacity>
          )}
          {expand && <FeedBackReasonList />}
          <View
            style={{
              borderColor: '#EEEEEE',
              borderWidth: 3 * px,
              height: 151.8 * px,
              borderRadius: 20 * px,
              marginLeft: 55 * px,
              marginRight: 55 * px,
              marginTop: 30 * px,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <TextInput
              textContentType={'emailAddress'}
              placeholder={'Contact Email'}
              style={{marginLeft: 30 * px, flex: 1}}
              onChangeText={(value) => {
                setEmail(value);
              }}
              value={email}
            />
          </View>
          <View
            style={{
              borderRadius: 20 * px,
              borderColor: '#EEEEEE',
              borderWidth: 3 * px,
              height: 569 * px,
              marginLeft: 55 * px,
              marginRight: 55 * px,
              marginTop: 30 * px,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <TextInput
              multiline={true}
              numberOfLines={10}
              maxLength={2000}
              autoCapitalize={'sentences'}
              // textContentType={'message'}
              placeholder={'Questions or advice'}
              style={{textAlignVertical: 'top', marginLeft: 30 * px, flex: 1}}
              onChangeText={(value) => {
                setMessage(value);
              }}
              value={message}
            />
          </View>
          <UploadImg
            ref={imgUploadRef}
            callback={(list) => {
              setImgList([...list]);
            }}
            uploadIcon={require('../../../assets/plus.png')}
          />
          <TouchableOpacity
            onPress={submit}
            style={{
              backgroundColor: ACCENT,
              height: 151.8 * px,
              marginLeft: 55 * px,
              marginRight: 55 * px,
              marginTop: 60 * px,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            {logging ? (
              <ActivityIndicator style={{flex: 1}} color={'white'} />
            ) : (
              <Text
                style={{
                  fontSize: 60 * px,
                  color: '#fff',
                  fontWeight: 'bold',
                }}>
                Submit
              </Text>
            )}
          </TouchableOpacity>
          <View style={{flex: 1}} />
          <Text
            style={{
              color: '#999999',
              fontSize: 40 * px,
              textAlign: 'center',
              marginBottom: 36 * px,
              marginLeft: 72 * px,
              marginRight: 72 * px,
            }}>
            You can also contact us by the email:
            <Text
              style={{
                color: '#33A7F0',
                textDecorationLine: 'underline',
                textDecorationStyle: 'solid',
              }}
              onPress={() => {
                Utils.contactUs(feedTypeItem?.label);
              }}>
              service@luckydeal.vip
            </Text>
          </Text>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
};
