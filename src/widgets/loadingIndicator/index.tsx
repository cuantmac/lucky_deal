import {PRIMARY} from '@src/constants/colors';
import {px2dp} from '@src/helper/helper';
import React, {FC} from 'react';
import {ActivityIndicator, ActivityIndicatorProps} from 'react-native';

interface LoadingIndicatorProps extends ActivityIndicatorProps {}

export const LoadingIndicator: FC<LoadingIndicatorProps> = ({
  color = PRIMARY,
  style,
  size = px2dp(30),
  ...props
}) => {
  return (
    <ActivityIndicator color={color} style={style} size={size} {...props} />
  );
};
