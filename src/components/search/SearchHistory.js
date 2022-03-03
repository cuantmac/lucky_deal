import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {px} from '../../constants/constants';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {dialogs} from '../../utils/refs';
import AppModule from '../../../AppModule';
export default function ({keyWord, tabPress}) {
  const SEARCH_KEY = 'search_key';
  const dispatch = useDispatch();
  const allHistory = useSelector(
    (state) => state.deprecatedPersist.searchHistory,
  );
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (allHistory && allHistory.length > 8) {
      setHistory(allHistory.slice(0, 8));
    } else {
      setHistory(allHistory);
    }
  }, [allHistory]);

  const clearConfirmDialog = () => {
    AppModule.reportClick('16', '151');
    dialogs.clearHistoryRef.current.show(
      () => {
        AppModule.reportShow('16', '153');
        dispatch({type: 'setSearchHistory', payload: []});
        AsyncStorage.setItem(SEARCH_KEY, JSON.stringify([]));
        dialogs.clearHistoryRef.current.hide();
        return true;
      },
      () => {
        AppModule.reportShow('16', '154');
        dialogs.clearHistoryRef.current.hide();
        return false;
      },
    );
  };
  if (history.length <= 0) {
    return null;
  }
  return (
    <View style={{paddingLeft: 58 * px, marginBottom: 60 * px}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 80 * px,
        }}>
        <Text
          style={{
            fontSize: 42 * px,
            color: '#000000',
            height: 80 * px,
            lineHeight: 80 * px,
            textAlign: 'center',
          }}
          numberOfLines={1}>
          Search history
        </Text>
        <TouchableOpacity
          onPress={clearConfirmDialog}
          style={{
            width: 80 * px,
            height: 80 * px,
            justifyContent: 'center',
          }}>
          <Image
            style={{width: 38 * px, height: 38 * px}}
            resizeMode={'contain'}
            source={require('../../assets/icon_search_delete.png')}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10 * px,
          flexWrap: 'wrap',
        }}>
        {history.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                tabPress(item);
              }}
              key={index}
              activeOpacity={0.8}
              style={styles.skuTextBackGround}>
              <Text
                style={{
                  fontSize: 32 * px,
                  color: '#5D5D5D',
                  textAlign: 'center',
                  lineHeight: 66 * px,
                  height: 66 * px,
                }}
                numberOfLines={1}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
        {allHistory.length > 9 && history.length < 9 ? (
          <TouchableOpacity
            onPress={() => {
              setHistory(allHistory);
            }}
            activeOpacity={0.8}
            style={{
              height: 66 * px,
              width: 66 * px,
              justifyContent: 'center',
              backgroundColor: '#F5F5F5',
              alignItems: 'center',
              marginRight: 20 * px,
              marginVertical: 5,
              borderRadius: 33 * px,
            }}>
            <Image
              style={{width: 38 * px, height: 38 * px}}
              resizeMode={'contain'}
              source={require('../../assets/icon_search_pull.png')}
            />
          </TouchableOpacity>
        ) : allHistory.length > 9 && history.length > 9 ? (
          <TouchableOpacity
            onPress={() => {
              setHistory(history.slice(0, 8));
            }}
            activeOpacity={0.8}
            style={{
              height: 66 * px,
              width: 66 * px,
              justifyContent: 'center',
              backgroundColor: '#F5F5F5',
              alignItems: 'center',
              marginRight: 20 * px,
              marginVertical: 5,
              borderRadius: 33 * px,
            }}>
            <Image
              style={{width: 38 * px, height: 38 * px}}
              resizeMode={'contain'}
              source={require('../../assets/icon_search_expand.png')}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  skuTextBackGround: {
    height: 66 * px,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 33 * px,
    paddingHorizontal: 30 * px,
    marginRight: 20 * px,
    marginVertical: 5,
  },
});
