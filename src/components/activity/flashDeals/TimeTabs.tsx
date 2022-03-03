import {useNavigation} from '@react-navigation/core';
import React, {FC} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

import {px} from '../../../constants/constants';
import {SessionInfoItem} from '../../../types/models/activity.model';
import Utils from '../../../utils/Utils';
import Empty from '../../common/Empty';
import {Timer, TimerFormate} from '../../common/Timer';

interface TimeTabsProps {
  tabList: SessionInfoItem[];
  activeIndex: number;
  onPress: (i: number) => void;
}
const TimeTabs: FC<TimeTabsProps> = ({tabList, activeIndex, onPress}) => {
  const navigation = useNavigation();

  if (!tabList || !tabList.length) {
    return (
      <Empty
        title={'Nothing at all'}
        image={require('../../../assets/empty.png')}
      />
    );
  }
  return (
    <View
      style={{
        backgroundColor: '#F13C3C',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingVertical: 20 * px,
      }}>
      {tabList.map((item, i) => {
        return (
          <TouchableOpacity
            style={{alignItems: 'center', flex: 1}}
            key={i}
            onPress={() => onPress(i)}>
            <Text
              style={{
                color: activeIndex === i ? '#fff' : '#F1C8C9',
                fontSize: 40 * px,
                textAlign: 'center',
                marginBottom: -15 * px,
              }}>
              {Utils.formatDate(item.start, 'HH:MM')}
            </Text>
            {item.start > new Date().getTime() / 1000 ? (
              <Text
                style={{
                  color: activeIndex === i ? '#fff' : '#F1C8C9',
                  fontSize: 30 * px,
                  textAlign: 'center',
                  marginTop: 10 * px,
                  // lineHeight: 34 * px,
                }}>
                Coming soon
              </Text>
            ) : (
              <Timer targetTime={item.end}>
                {(time: string, hasEnd: boolean) => {
                  if (hasEnd) {
                    if (tabList.length === 1) {
                      navigation.goBack();
                      return null;
                    }
                    Utils.toastFun('The activity of this time is end');

                    return (
                      <Text
                        style={{
                          fontSize: 30 * px,
                          color: '#fff',
                          textAlign: 'center',
                          marginTop: 10 * px,
                        }}>
                        End
                      </Text>
                    );
                  }
                  return (
                    <TimerFormate
                      time={time}
                      styles={{
                        height: 34 * px,
                        fontSize: 30 * px,
                        textAlign: 'center',
                        color: activeIndex === i ? '#fff' : '#F1C8C9',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      color={activeIndex === i ? '#fff' : '#F1C8C9'}
                    />
                  );
                }}
              </Timer>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
export default TimeTabs;
