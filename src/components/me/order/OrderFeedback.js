import React, {useLayoutEffect, useState, useEffect, useRef} from 'react';
import AppModule from '../../../../AppModule';
import {px} from '../../../constants/constants';
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import OrderFeedbackItem from './OrderFeedbackItem';
import Api from '../../../Api';
import {ACCENT} from '../../../constants/colors';
import Utils from '../../../utils/Utils';
export default ({navigation, route}) => {
  const {data, onGoBack} = route.params;
  const [submiting, setSubmited] = useState(false);
  const [feedbacks, setFeedBacks] = useState([]);
  const [reasonId, setReasonId] = useState(-1);
  const feedback = (reasonId) => {
    if (reasonId === -1 || submiting) {
      return;
    }
    AppModule.reportTap('OrderFeedback', 'ld_feedback_submit_click');
    setSubmited(true);
    Api.orderFeedback(reasonId, data.order_id, data.order_type).then((res) => {
      if (res.error) {
        setSubmited(false);
        return;
      }
      setSubmited(false);
      if (res.code === 0) {
        Utils.toastFun('Feedback success');
        onGoBack();
      }
      navigation.goBack();
    });
  };
  const onValueChange = (item, id) => {
    setReasonId(id);
    const newFeedbacks = feedbacks.map((item) => {
      item.selected = id === item.reason_id;
      return item;
    });
    setFeedBacks(newFeedbacks);
  };

  useLayoutEffect(() => {
    AppModule.reportPv('FeedBack');
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: 'Feedback',
    });
  }, [navigation]);

  useEffect(() => {
    Api.orderFeedbackList().then((res) => {
      if (res.error) {
        return;
      }
      const feedLists = [];
      res.data?.list.map((item) => {
        feedLists.push({
          reason_id: item.reason_id,
          reason: item.reason,
          selected: false,
        });
      });
      setFeedBacks(feedLists);
    });
  }, []);
  const renderItem = ({index, item}) => (
    <OrderFeedbackItem
      index={index + 1}
      data={item}
      onSelectedCallBack={() => {
        onValueChange(item, item.reason_id);
      }}
    />
  );
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      {feedbacks.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator color={ACCENT} />
        </View>
      ) : (
        <ScrollView>
          <Text
            style={{
              fontSize: 42 * px,
              color: '#000000',
              marginTop: 30 * px,
              paddingHorizontal: 30 * px,
              textAlign: 'center',
            }}>
            You have the opportunity to receive the bid award by completing the
            following questionnaire
          </Text>
          <View
            style={{
              height: 1,
              marginHorizontal: 30 * px,
              marginTop: 40 * px,
              backgroundColor: '#BCBCBC',
            }}
          />
          <Text
            style={{
              marginLeft: 40 * px,
              marginTop: 50 * px,
              color: 'black',
              fontSize: 44 * px,
              marginBottom: 30 * px,
            }}>
            Reason for payment failure:
          </Text>
          <FlatList
            data={feedbacks}
            getItemLayout={(data, index) => ({
              length: 120 * px,
              offset: 120 * px * index,
              index: index,
            })}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity
            style={{
              marginTop: 200 * px,
              backgroundColor: '#2E9FFF',
              borderRadius: 60 * px,
              height: 120 * px,
              marginHorizontal: 100 * px,
              justifyContent: 'center',
            }}
            activeOpacity={0.8}
            onPress={() => {
              feedback(reasonId);
            }}>
            {submiting ? (
              <ActivityIndicator color={'white'} />
            ) : (
              <Text
                style={{
                  color: 'white',
                  fontSize: 50 * px,
                  textAlign: 'center',
                }}>
                Submit
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};
