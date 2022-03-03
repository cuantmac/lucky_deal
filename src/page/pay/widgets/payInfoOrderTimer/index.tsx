import {createStyleSheet} from '@src/helper/helper';
import {TimerConsumer} from '@src/widgets/timer';
import React, {FC} from 'react';
import {View, Text} from 'react-native';
import {PayModuleContainer} from '../payModuleContainer';

interface PayInfoOrderTimerProps {
  expireTime?: number;
}

/**
 * 如果是订单列表进入， 显示当前的订单有效期倒计时
 */
export const PayInfoOrderTimer: FC<PayInfoOrderTimerProps> = ({expireTime}) => {
  if (!expireTime) {
    return null;
  }
  return (
    <TimerConsumer targetTime={expireTime * 1000}>
      {({value}) => {
        return (
          <PayModuleContainer>
            <View style={PayInfoOrderTimerStyles.container}>
              <Text style={PayInfoOrderTimerStyles.leftText}>
                Remaining Payment Time:
              </Text>
              <Text style={PayInfoOrderTimerStyles.rightText}>{value}</Text>
            </View>
          </PayModuleContainer>
        );
      }}
    </TimerConsumer>
  );
};

const PayInfoOrderTimerStyles = createStyleSheet({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
    alignItems: 'center',
  },
  leftText: {
    width: 125,
    textAlign: 'center',
    fontSize: 14,
    color: '#222',
  },
  rightText: {
    color: '#FF1C20',
    fontSize: 14,
  },
});
