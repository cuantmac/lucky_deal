import {PRIMARY} from '@src/constants/colors';
import React, {FC} from 'react';
import {RefreshControl, RefreshControlProps} from 'react-native';

interface ThemeRefreshControlProps extends RefreshControlProps {}

export const ThemeRefreshControl: FC<ThemeRefreshControlProps> = ({
  colors = [PRIMARY],
  ...props
}) => {
  return <RefreshControl colors={colors} {...props} />;
};
