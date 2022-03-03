import {Fade, Placeholder, PlaceholderMedia} from 'rn-placeholder';
import {px} from '../../../constants/constants';
import {View} from 'react-native';
import CardItemHolder from './CardItemHolder';
import React from 'react';

export default ({headerShown}) => (
  <Placeholder Animation={Fade} style={{flex: 1, padding: 5}}>
    {headerShown ? (
      <PlaceholderMedia
        style={{
          width: '100%',
          height: 340 * px,
          marginVertical: 5,
        }}
      />
    ) : null}
    <View style={{flexDirection: 'row'}}>
      <CardItemHolder />
      <CardItemHolder />
    </View>
    <View style={{flexDirection: 'row'}}>
      <CardItemHolder />
      <CardItemHolder />
    </View>
  </Placeholder>
);
