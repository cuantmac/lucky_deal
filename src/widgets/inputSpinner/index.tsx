import {createStyleSheet} from '@src/helper/helper';
import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, ViewStyle, TextStyle} from 'react-native';
import {GlideImage} from '../glideImage';

interface InputSpinnerProps {
  max?: number;
  min?: number;
  onChange: (value: number, actionType?: SpinnerAction) => void;
  onReachedMax?: () => void;
  onReachedMin?: () => void;
  value: number;
  style?: ViewStyle;
  actionStyle?: ViewStyle;
  valueStyle?: ViewStyle;
  valueTextStyle?: TextStyle;
  disabledAdd?: boolean;
  disabledMinus?: boolean;
}

export enum SpinnerAction {
  ADD,
  MINUS,
}

export const InputSpinner: FC<InputSpinnerProps> = ({
  max = Infinity,
  min = 1,
  onChange,
  onReachedMax,
  onReachedMin,
  value = 1,
  style,
  actionStyle,
  valueStyle,
  valueTextStyle,
  disabledAdd,
  disabledMinus,
}) => {
  const [canAdd, setCanAdd] = useState(true);
  const [canMinus, setCanMinus] = useState(true);
  const onChangeRef = useRef<InputSpinnerProps['onChange']>();
  onChangeRef.current = onChange;
  const onValueChange = useCallback(
    (action: SpinnerAction) => {
      if (action === SpinnerAction.MINUS) {
        const nowValue = value - 1;
        if (nowValue < min) {
          onReachedMin && onReachedMin();
        } else {
          onChange && onChange(nowValue, SpinnerAction.MINUS);
        }
      } else if (action === SpinnerAction.ADD) {
        const nowValue = value + 1;
        if (nowValue > max) {
          onReachedMax && onReachedMax();
        } else {
          onChange && onChange(nowValue, SpinnerAction.ADD);
        }
      }
    },
    [max, min, onChange, onReachedMax, onReachedMin, value],
  );

  // 根据qty值设置按钮状态
  useEffect(() => {
    if (value <= min) {
      setCanMinus(false);
    } else {
      setCanMinus(true);
    }
    if (value >= max) {
      setCanAdd(false);
    } else {
      setCanAdd(true);
    }
    if (disabledAdd) {
      setCanAdd(false);
    }
    if (disabledMinus) {
      setCanMinus(false);
    }
  }, [disabledAdd, disabledMinus, max, min, setCanAdd, setCanMinus, value]);

  // 如果qty值小于min， 则强制设置成min
  // 如果qty值大于max， 则强制设置成max1
  useEffect(() => {
    if (value < min) {
      onChangeRef.current && onChangeRef.current(min);
    }
    if (value > max) {
      onChangeRef.current && onChangeRef.current(max);
    }
  }, [max, min, value]);

  return (
    <View style={[InputSpinnerStyles.container, style]}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={{flexDirection: 'row'}}
        onPress={(e) => {
          e.stopPropagation();
          if (!canMinus) {
            return;
          }
          onValueChange(SpinnerAction.MINUS);
        }}>
        <View
          style={[
            InputSpinnerStyles.actionItem,
            actionStyle,
            {opacity: canMinus ? 1 : 0.5},
          ]}>
          <GlideImage
            defaultSource={false}
            style={InputSpinnerStyles.actionImage}
            source={require('@src/assets/minus_icon.png')}
          />
        </View>
      </TouchableOpacity>
      <View style={[InputSpinnerStyles.valueContainer, valueStyle]}>
        <Text style={[InputSpinnerStyles.value, valueTextStyle]}>{value}</Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.5}
        style={{flexDirection: 'row'}}
        onPress={(e) => {
          e.stopPropagation();
          if (!canAdd) {
            return;
          }
          onValueChange(SpinnerAction.ADD);
        }}>
        <View
          style={[
            InputSpinnerStyles.actionItem,
            actionStyle,
            {opacity: canAdd ? 1 : 0.5},
          ]}>
          <GlideImage
            defaultSource={false}
            style={InputSpinnerStyles.actionImage}
            source={require('@src/assets/add_icon.png')}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const InputSpinnerStyles = createStyleSheet({
  container: {
    flexDirection: 'row',
    height: 30,
  },
  actionItem: {
    width: 32,
    backgroundColor: '#f6f6f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  valueContainer: {
    paddingHorizontal: 10,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionImage: {
    width: 11,
    height: 11,
  },
});
