import {TouchableOpacity, Text} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {BoxShadow} from 'react-native-shadow';

import {px} from '../../constants/constants';
import {useIsFocused} from '@react-navigation/core';
import Api from '../../Api';

export default ({top, onPress, topic_type}) => {
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(false);
  const {configV2} = useSelector((state) => state.deprecatedPersist);
  const focus = useIsFocused();
  const shadowOpt = {
    height: 40,
    width: 340 * px,
    color: '#000',
    border: 8,
    radius: 20,
    opacity: 0.7,
    x: 0,
    y: 0,
    style: {
      backgroundColor: loading ? 'rgba(0,0,0,0.7)' : '#fff',
      height: 40,
      width: 340 * px,
      position: 'absolute',
      borderRadius: 20,
      top: 8,
      left: '50%',
      marginLeft: -170 * px,
    },
  };
  // console.log('appConfig', configV2);
  useEffect(() => {
    if (!focus) {
      return;
    }
    let interval = setInterval(() => {
      Api.newAuctionCount(topic_type).then((res) => {
        if (res.code === 0) {
          setLoading(false);
          // setShow(res.data?.new_auction_count);
        }
      });
    }, configV2.refresh_new_auction_count_time * 1000 || 1000 * 15);
    // }, 1000 * 15);
    return () => {
      clearInterval(interval);
    };
  }, [configV2.refresh_new_auction_count_time, topic_type, focus]);

  return show ? (
    <BoxShadow setting={shadowOpt}>
      <TouchableOpacity
        onPress={() => {
          if (loading) {
            return;
          }
          setLoading(true);
          // ;
          setTimeout(() => {
            // setShow(false);
            setLoading(false);
          }, 3000);
          onPress();
        }}
        style={{
          backgroundColor: loading ? 'rgba(0,0,0,0.7)' : '#fff',
          height: 40,
          width: 340 * px,
          // position: 'absolute',
          // top: 8,
          // left: '50%',
          // marginLeft: -170 * px,
          flexDirection: 'row',
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          // elevation: 30,
          // shadowColor: '#000',
          // shadowOffset: {h: 500, w: 500},
          // shadowRadius: 30,
          // shadowOpacity: 1,
        }}>
        <Text
          style={{
            color: loading ? '#fff' : '#000',
            fontWeight: 'bold',
            fontSize: 40 * px,
          }}>
          New Products
        </Text>
      </TouchableOpacity>
    </BoxShadow>
  ) : null;
};
