import React from 'react';
import {View} from 'react-native';
import {
  Placeholder,
  PlaceholderMedia,
  Fade,
  PlaceholderLine,
} from 'rn-placeholder';
import {px} from '../../../constants/constants';
import CardItemHolder from './CardItemHolder';

export const HomePlaceHolder = () => {
  return (
    <Placeholder Animation={Fade}>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10 * px,
          // paddingVertical: 25 * px,
          justifyContent: 'space-around',
        }}>
        <FreeItem />
        <FreeItem />
      </View>
      <View
        style={{
          paddingVertical: 10 * px,
        }}>
        <SwiperBigItem />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <SwiperItem />
        <SwiperItem />
      </View>
      <View style={{marginTop: 10 * px}}>
        <PlaceholderLine width={40} />
        <View style={{flexDirection: 'row'}}>
          <MenuItem />
          <MenuItem />
          <MenuItem />
          <MenuItem />
        </View>
      </View>
      <View style={{marginTop: 10 * px}}>
        <PlaceholderLine width={30} />
        <View style={{flexDirection: 'row'}}>
          <CardItemHolder />
          <CardItemHolder />
        </View>
      </View>
    </Placeholder>
  );
};

const MenuItem = () => (
  <PlaceholderMedia
    style={{width: 280 * px, height: 360 * px, marginRight: 10 * px}}
  />
);

const SwiperItem = () => (
  <PlaceholderMedia
    style={{width: 500 * px, height: 200 * px, borderRadius: 20 * px}}
  />
);
const SwiperBigItem = () => (
  <PlaceholderMedia style={{width: 1080 * px, height: 430 * px}} />
);
const FreeItem = () => (
  <PlaceholderMedia style={{width: 500 * px, height: 80 * px}} />
);
