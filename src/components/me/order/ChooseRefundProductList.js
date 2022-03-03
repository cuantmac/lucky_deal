import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import Api from '../../../Api';
import {px, SCREEN_WIDTH} from '../../../constants/constants';
import ChooseRefundProductItem from './ChooseRefundProductItem';
import {useShallowEqualSelector} from '../../../utils/hooks';
import {useIsFocused} from '@react-navigation/core';
import {navigationRef} from '../../../utils/refs';
import AppModule from '../../../../AppModule';

export default function ({navigation, route}) {
  const {product_list, orderCancel} = route.params;
  const [isSelectAll, setSelectAll] = useState(false);
  const {userID, deviceInfo, profile} = useShallowEqualSelector((state) => {
    return state.deprecatedPersist;
  });
  const [productList, setProductList] = useState([]);
  const focus = useIsFocused();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: 'Select Refund Product',
    });
  }, [navigation]);
  const submitTicket = () => {
    AppModule.reportClick('14', '453');
    const products = productList.filter((item) => {
      return item.selected;
    });
    navigationRef.current.goBack();
    orderCancel(products);
  };

  useEffect(() => {
    if (!navigation.isFocused()) {
      return;
    }

    setProductList(product_list);
    AppModule.reportShow('14', '452');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const onChangeValue = (product) => {
    let selAll = true;
    const products = productList.map((item) => {
      if (item.id === product.id) {
        item.selected = !item.selected;
      }
      if (!item.selected) {
        selAll = false;
      }
      return item;
    });
    setSelectAll(selAll);
    setProductList(products);
  };

  const selectAll = () => {
    setSelectAll(!isSelectAll);
    const products = productList.map((item) => {
      item.selected = !isSelectAll;
      return item;
    });
    setProductList(products);
  };

  const renderItem = ({item}) => (
    <ChooseRefundProductItem
      data={item}
      onChangeValue={onChangeValue}
      navigation={navigation}
    />
  );

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor={'transparent'}
      />
      <FlatList
        style={{marginBottom: 150 * px}}
        data={productList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          bottom: 30 * px,
          height: 136 * px,
          width: '100%',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          style={{flexDirection: 'row', marginStart: 30 * px}}
          onPress={selectAll}>
          <Image
            style={{
              justifyContent: 'center',
              width: 70 * px,
              height: 70 * px,
              marginRight: 10 * px,
              alignSelf: 'center',
            }}
            source={
              isSelectAll
                ? require('../../../assets/select.png')
                : require('../../../assets/unselect.png')
            }
          />
          <Text
            style={{
              color: 'black',
              fontSize: 50 * px,
              textAlign: 'center',
              alignSelf: 'center',
            }}>
            Select All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={submitTicket}
          style={{
            backgroundColor: '#3C7DE3',
            borderRadius: 20 * px,
            height: 126 * px,
            width: 460 * px,
            alignItems: 'center',
            marginEnd: 30 * px,
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 50 * px,
              textAlign: 'center',
              alignSelf: 'center',
            }}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
