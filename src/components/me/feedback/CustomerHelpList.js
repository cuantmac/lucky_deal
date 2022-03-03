import {
  FlatList,
  TouchableOpacity,
  View,
  Image,
  Text,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import AppModule from '../../../../AppModule';
import {px, SCREEN_WIDTH} from '../../../constants/constants';
import Api from '../../../Api';
import {PRIMARY} from '../../../constants/colors';
import {useIsFocused} from '@react-navigation/core';
export default function CustomerHelpList({route, navigation}) {
  const faqItem = route.params?.faqItem;
  const [questionList, setQuestionList] = useState([]);
  const [isRefreshing, setRefreshing] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isLoadComplete, setLoadComplete] = useState(false);
  const pageRef = useRef(1);
  const focus = useIsFocused();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white', elevation: 0},
      headerTitleAlign: 'center',
      title: faqItem.title,
    });
  }, [faqItem, navigation]);
  useEffect(() => {
    if (focus) {
      AppModule.reportShow('10', '408', {
        FAQid: faqItem.faq_type,
      });
    }
  }, [faqItem, focus]);

  useEffect(() => {
    fetchDataList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchDataList = useCallback(() => {
    let page = pageRef.current;
    Api.faqList(AppModule.versionName, faqItem.faq_type).then((res) => {
      let list = res.data?.list || [];
      if (list.length < 20) {
        setLoadComplete(true);
      }
      if (page > 1) {
        setQuestionList((old) => old.concat(list));
      } else {
        setQuestionList(list);
      }
      setRefreshing(false);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    pageRef.current = 1;
    setLoadComplete(false);
    fetchDataList();
  }, [fetchDataList]);

  const loadMore = () => {
    if (isLoading || isLoadComplete) {
      return;
    }
    setLoading(true);
    pageRef.current = pageRef.current + 1;
    fetchDataList();
  };

  const fetchContent = (item) => {
    navigation.navigate('CustomerHelpContent', {
      content: item.content,
      faqItem: faqItem,
    });
  };
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          fetchContent(item);
        }}
        style={{
          height: 160 * px,
          width: SCREEN_WIDTH - 58 * px,
          paddingRight: 6 * px,
          borderBottomColor: '#D8D8D8',
          borderBottomWidth: 2 * px,
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{color: '#000000', fontSize: 40 * px, marginRight: 100 * px}}
          numberOfLines={1}>
          {index + 1}. {item.title}
        </Text>
        <Image
          style={{marginLeft: 'auto', width: 18 * px, height: 32 * px}}
          source={require('../../../assets/me/me_arrow_icon.png')}
        />
      </TouchableOpacity>
    );
  };
  return (
    <View style={{backgroundColor: '#fff', flex: 1, position: 'relative'}}>
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor={'transparent'}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          borderTopColor: '#D8D8D8',
          borderTopWidth: 2 * px,
        }}>
        <FlatList
          style={{
            marginBottom: 20 * px,
          }}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          data={questionList}
          onEndReachedThreshold={0.4}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={loadMore}
          ListFooterComponent={() => {
            if (isLoadComplete) {
              return <View style={{height: 20 * px}} />;
            }
            return <ActivityIndicator color={PRIMARY} style={{padding: 10}} />;
          }}
        />
      </View>
    </View>
  );
}
