import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import Api from '../../../Api';
import Empty from '../../common/Empty';
import {PRIMARY} from '../../../constants/colors';
import {px, SCREEN_WIDTH} from '../../../constants/constants';
import AppModule from '../../../../AppModule';
import ChooseOrderCard from './ChooseOrderCard';
import {useShallowEqualSelector} from '../../../utils/hooks';
import {useIsFocused} from '@react-navigation/core';

export default function ({navigation, route}) {
  const [orderCardInfo, setOrderCardInfo] = useState();
  const {userID, deviceInfo, profile} = useShallowEqualSelector((state) => {
    return state.deprecatedPersist;
  });
  const faqItem = route.params?.faqItem;
  const [orderLit, setOrderList] = useState([]);
  const [isRefreshing, setRefreshing] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [isLoadComplete, setLoadComplete] = useState(false);
  const [orderPushed, setOrderPushed] = useState(false);
  const pageRef = useRef(1);
  const focus = useIsFocused();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: 'Please choose a order',
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            submitTicket(1);
          }}>
          <Text
            style={{
              marginRight: 30 * px,
              color: 'black',
              fontSize: 34 * px,
              textDecorationLine: 'underline',
            }}>
            SKIP
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  useEffect(() => {
    if (focus) {
      AppModule.reportShow('10', '411', {
        FAQid: faqItem.faq_type,
      });
    }
  }, [faqItem, focus]);

  const submitTicket = (btnType) => {
    if (btnType === 2) {
      AppModule.reportClick('10', '412', {
        FAQid: faqItem.faq_type,
      });
      if (orderPushed) return;

      if (orderCardInfo) {
        setOrderPushed(true);
        // eslint-disable-next-line radix
        Api.faqOrderPushServer(parseInt(userID), orderCardInfo.order_id)
          .then()
          .finally(() => {
            setOrderPushed(false);
            goChat();
          });
      } else {
        goChat();
      }
    } else {
      goChat();
    }
  };

  const goChat = () => {
    AppModule.openYFKChat(
      profile?.nick_name || 'LD_user',
      userID || deviceInfo.tk,
      orderCardInfo?.image,
      orderCardInfo?.title,
      null,
      `$${orderCardInfo?.order_price / 100.0}`,
      orderCardInfo?.order_id,
    );
  };
  const fetchOrderList = useCallback(() => {
    let page = pageRef.current;
    Api.orderList(page, -1).then((res) => {
      const list = res.data?.list || [];
      if (list.length < 10) {
        setLoadComplete(true);
      }
      const finalList = list.map((item) => {
        return {...item, selected: false};
      });
      if (page > 1) {
        setOrderList((old) => old.concat(finalList));
      } else {
        setOrderList(finalList);
      }
      setRefreshing(false);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLoadComplete(false);
    pageRef.current = 1;
    fetchOrderList();
  }, [fetchOrderList]);
  useEffect(() => {
    if (!navigation.isFocused()) {
      return;
    }
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRefresh, navigation]);

  const loadMore = () => {
    if (isLoading || isLoadComplete) {
      return;
    }
    setLoading(true);
    pageRef.current = pageRef.current + 1;
    fetchOrderList();
  };
  const onChangeValue = (order) => {
    const orders = orderLit.map((item) => {
      if (item.order_id === order.order_id) {
        item.selected = true;
        setOrderCardInfo(item);
      } else {
        item.selected = false;
      }
      return item;
    });
    setOrderList(orders);
  };
  if (orderLit.length === 0) {
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
    <ChooseOrderCard
      data={item}
      onChangeValue={onChangeValue}
      navigation={navigation}
    />
  );

  const HeaderView = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 32 * px,
          height: 120 * px,
          backgroundColor: '#fff',
          width: SCREEN_WIDTH,
        }}>
        <Text style={{color: '#000', fontSize: 40 * px}}>Select order</Text>
        <Image
          style={{width: 18 * px, height: 34 * px}}
          source={require('../../../assets/i_right.png')}
        />
        <Text style={{color: '#000', fontSize: 36 * px}}>Describe issues</Text>
        <Image
          style={{width: 18 * px, height: 34 * px}}
          source={require('../../../assets/i_right.png')}
        />
        <Text style={{color: '#000', fontSize: 36 * px}}>Get feedback</Text>
      </View>
    );
  };
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor={'transparent'}
      />
      <FlatList
        style={{marginBottom: 150 * px}}
        data={orderLit}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={HeaderView}
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
      <TouchableOpacity
        onPress={() => {
          submitTicket(2);
        }}
        style={{
          backgroundColor: '#F04A33',
          borderRadius: 20 * px,
          height: 136 * px,
          left: 45 * px,
          width: SCREEN_WIDTH - 90 * px,
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'center',
          position: 'absolute',
          bottom: 30 * px,
        }}>
        {orderPushed ? (
          <ActivityIndicator color={'#fff'} style={{flex: 1}} />
        ) : (
          <Text
            style={{
              color: '#fff',
              fontSize: 60 * px,
              textAlign: 'center',
              alignSelf: 'center',
            }}>
            Continue
          </Text>
        )}
      </TouchableOpacity>
    </>
  );
}
