import {convertAmountUS, createStyleSheet} from '@src/helper/helper';
import {BUTTON_TYPE_ENUM, StandardButton} from '@src/widgets/button';
import {TimerConsumer} from '@src/widgets/timer';
import React, {FC} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

interface PayBottomActionProps {
  total?: number;
  expireTime?: number;
  onCancelPress?: () => void;
  onPayPress?: () => void;
}

export const PayBottomAction: FC<PayBottomActionProps> = ({
  total = 0,
  expireTime = 0,
  onCancelPress,
  onPayPress,
}) => {
  return (
    <TimerConsumer targetTime={expireTime * 1000}>
      {({hasEnd}) => {
        return (
          <View style={PayBottomActionStyles.container}>
            <Text style={PayBottomActionStyles.totalText}>
              Total: {convertAmountUS(total)}
            </Text>
            <View style={PayBottomActionStyles.buttonContainer}>
              {expireTime !== 0 && !hasEnd && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onCancelPress}
                  style={PayBottomActionStyles.cancelButton}>
                  <Text style={PayBottomActionStyles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              )}
              <StandardButton
                onPress={onPayPress}
                disabled={expireTime !== 0 && hasEnd}
                containerStyle={PayBottomActionStyles.placeOrderButton}
                title={expireTime !== 0 ? 'CONTINUE' : 'PLACE ORDER'}
                type={BUTTON_TYPE_ENUM.HIGH_LIGHT}
              />
            </View>
          </View>
        );
      }}
    </TimerConsumer>
  );
};

const PayBottomActionStyles = createStyleSheet({
  container: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 10,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 14,
    color: '#222',
    fontWeight: '700',
  },
  cancelButton: {
    marginRight: 10,
  },
  cancelText: {
    color: '#666',
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeOrderButton: {
    width: 120,
  },
});
