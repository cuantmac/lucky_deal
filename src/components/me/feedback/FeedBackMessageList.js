import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {ActivityIndicator, FlatList, RefreshControl} from 'react-native';
import MessageItem from './MessageItem';
import Api from '../../../Api';
import Empty from '../../common/Empty';
import {PRIMARY} from '../../../constants/colors';
import {useDispatch} from 'react-redux';
import AppModule from '../../../../AppModule';

export default function ({navigation}) {
  const [messageList, setMessageList] = useState([]);
  const [isRefreshing, setRefreshing] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    AppModule.reportPv('FeedbackMessage');
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: 'Messages',
    });
  }, [navigation]);
  useEffect(() => {
    dispatch({
      type: 'setFeedBackMessageCount',
      payload: 0,
    });
  }, [dispatch]);

  const fetchDataList = useCallback(() => {
    // let page = pageRef.current;
    Api.feedBackList().then((res) => {
      // console.log('backList', res);
      let list = res.data?.list || [];
      const showList = list.filter((item) => {
        return item.back.content;
      });
      setMessageList(showList.reverse());
      // dispatch({
      //   type: 'setFeedBackMessageCount',
      //   payload: 0,
      // });

      setRefreshing(false);
      setLoading(false);
    });
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    fetchDataList();
  }, [fetchDataList]);

  useEffect(() => {
    if (!navigation.isFocused()) {
      return;
    }
    onRefresh();
  }, [onRefresh, navigation]);

  const loadMore = () => {
    if (isLoading) {
      return;
    }
    setLoading(true);
    // pageRef.current = pageRef.current + 1;
    fetchDataList();
    // console.log('loadMore...');
  };

  if (messageList.length === 0) {
    return isRefreshing ? (
      <ActivityIndicator color={PRIMARY} style={{flex: 1}} />
    ) : (
      <Empty
        image={require('../../../assets/empty.png')}
        title={'Nothing at all'}
      />
    );
  }
  const renderItem = ({item}) => <MessageItem data={item} />;
  return (
    <FlatList
      data={messageList}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
      onEndReachedThreshold={0.4}
      onEndReached={loadMore}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}
