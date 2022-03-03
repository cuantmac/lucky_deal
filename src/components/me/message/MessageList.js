import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
} from 'react-native';
import Message from './Message';
import Api from '../../../Api';
import Empty from '../../common/Empty';
import {PRIMARY} from '../../../constants/colors';

export default function ({navigation}) {
  const [messageList, setMessageList] = useState([]);
  const [isRefreshing, setRefreshing] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [isLoadComplete, setLoadComplete] = useState(false);
  const pageRef = useRef(1);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: 'Message Box',
    });
  }, [navigation]);

  const fetchDataList = useCallback(() => {
    let page = pageRef.current;
    Api.userMessage(page).then((res) => {
      let list = res.data?.list || [];
      if (list.length < 10) {
        setLoadComplete(true);
      }
      if (page > 1) {
        setMessageList((old) => old.concat(list));
      } else {
        setMessageList(list);
      }
      setRefreshing(false);
      setLoading(false);
    });
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    pageRef.current = 1;
    fetchDataList();
  }, [fetchDataList]);

  useEffect(() => {
    if (!navigation.isFocused()) {
      return;
    }
    onRefresh();
  }, [onRefresh, navigation]);

  const loadMore = () => {
    if (isLoading || isLoadComplete) {
      return;
    }
    setLoading(true);
    pageRef.current = pageRef.current + 1;
    fetchDataList();
    console.log('loadMore...');
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
  const renderItem = ({item}) => (
    <Message data={item} navigation={navigation} />
  );
  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <FlatList
        data={messageList}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={() => {
          if (isLoadComplete) {
            return null;
          }
          return <ActivityIndicator color={PRIMARY} style={{padding: 10}} />;
        }}
        onEndReachedThreshold={0.4}
        onEndReached={loadMore}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </>
  );
}
