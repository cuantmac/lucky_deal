import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from 'react';
import {useDispatch, useSelector} from 'react-redux';

// import {useIsFocused} from '@react-navigation/core';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
// import PropTypes from 'prop-types';
import {px} from '../../../constants/constants';
// import AppModule from '../../../../AppModule';
// import {reportData} from '../../../constants/reportData';
import BestSellHead from './BestSellHead';
import BestSellItem from './BestSellItem';
import {PRIMARY} from '../../../constants/colors';

const BestSellList = forwardRef(
  (
    {isRefreshing, onRefresh, bestList, getBestList, loading, showEmpty, end},
    ref,
  ) => {
    useImperativeHandle(
      ref,
      () => {
        return {
          refresh() {},
        };
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [end],
    );

    const getMore = () => {
      getBestList();
    };

    if (showEmpty) {
      return null;
    }

    return (
      <FlatList
        numColumns={2}
        data={bestList}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        renderItem={({item, index, separators}) => {
          return (
            <View
              style={{
                marginLeft: index % 2 ? 10 * px : 20 * px,
                marginRight: index % 2 ? 20 * px : 10 * px,
                marginVertical: 10 * px,
                backgroundColor: '#fff',
                borderRadius: 20 * px,
                width: 510 * px,
                elevation: 2,
              }}>
              <BestSellItem data={item} index={index} key={index} />
            </View>
          );
        }}
        onEndReachedThreshold={0.1}
        style={{backgroundColor: '#fff', paddingVertical: 30 * px}}
        columnWrapperStyle={{
          // marginHorizontal: 15 * px,
          justifyContent: 'space-between',
          alignItems: 'center',
          // paddingVertical: 30 * px,
        }}
        ListHeaderComponent={
          <View
            style={{
              height: 30 * px,
              backgroundColor: '#F6F6F6',
              flex: 1,
              marginBottom: 20 * px,
              // marginHorizontal: 15 * px,
            }}
          />
        }
        keyExtractor={(item, index) => index + ''}
        ListFooterComponent={() => {
          return end ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 50 * px,
                flexDirection: 'row',
              }}>
              <View
                style={{
                  width: 300 * px,
                  height: 2 * px,
                  marginRight: 15 * px,
                  backgroundColor: '#9C9C9C',
                }}
              />

              <Text style={{fontSize: 40 * px, color: '#4E4E4E'}}>END</Text>
              <View
                style={{
                  backgroundColor: '#9C9C9C',
                  width: 300 * px,
                  height: 2 * px,
                  marginLeft: 15 * px,
                }}
              />
            </View>
          ) : loading ? (
            <View
              style={{
                paddingVertical: 50 * px,
                justContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size={'small'} color={'#F04A33'} />
            </View>
          ) : (
            <TouchableOpacity
              onPress={getMore}
              style={{
                justContent: 'center',
                alignItems: 'center',
                paddingVertical: 50 * px,
              }}>
              <Text
                style={{
                  width: 260 * px,
                  height: 70 * px,
                  borderRadius: 35 * px,
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: PRIMARY,
                  color: PRIMARY,
                  fontSize: 30 * px,
                  lineHeight: 68 * px,
                  textAlign: 'center',
                }}>
                View More
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  },
);

export default BestSellList;
