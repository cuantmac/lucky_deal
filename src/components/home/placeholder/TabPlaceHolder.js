import React from 'react';
import {View} from 'react-native';
import {
  Placeholder,
  PlaceholderMedia,
  Fade,
  PlaceholderLine,
} from 'rn-placeholder';
import {px} from '../../../constants/constants';

export const TopTabPlaceHolder = () => {
  <View style={{marginRight: 10 * px}}>
    <PlaceholderMedia style={{width: 200 * px, height: 60 * px}} />
    <PlaceholderLine width={200 * px} />
  </View>;
};
export const BottomTabPlaceHolder = () => {
  <View style={{marginHorizontal: 30 * px}}>
    <PlaceholderMedia style={{width: 60 * px, height: 60 * px}} />
    <PlaceholderLine width={60 * px} />
  </View>;
};
