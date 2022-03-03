import {Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import React, {useEffect, useState} from 'react';
import {px} from '../../constants/constants';

export interface INumberProps {
  style: ViewStyle;
  number: number;
  min: number;
  max: number;
  onChangeNumber: (n: number) => void;
}

export default (props: INumberProps) => {
  const [number, setNumber] = useState(props.number);
  const minus = () => {
    setNumber(n => (props.min ? Math.max(--n, props.min) : --n));
  };
  const plus = () => {
    setNumber(n => (props.max ? Math.min(++n, props.max) : ++n));
  };

  useEffect(() => {
    props.onChangeNumber(number);
  }, [number, props]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 55 * px,
        ...props.style,
      }}>
      <TouchableOpacity onPress={minus}>
        <Text
          style={{
            color: '#CFCFCF',
            fontSize: 33 * px,
            width: 55 * px,
            borderColor: '#CFCFCF',
            borderWidth: 2 * px,
            textAlign: 'center',
          }}>
          -
        </Text>
      </TouchableOpacity>
      <Text
        style={{
          color: '#727272',
          fontSize: 33 * px,
          width: 88 * px,
          borderTopColor: '#CFCFCF',
          borderTopWidth: 2 * px,
          borderBottomColor: '#CFCFCF',
          borderBottomWidth: 2 * px,
          textAlign: 'center',
        }}>
        {number}
      </Text>
      <TouchableOpacity onPress={plus}>
        <Text
          style={{
            color: '#CFCFCF',
            fontSize: 33 * px,
            width: 55 * px,
            borderColor: '#CFCFCF',
            borderWidth: 2 * px,
            textAlign: 'center',
          }}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
};
