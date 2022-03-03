import React from 'react';
import {View, Dimensions} from 'react-native';
import {pure} from 'recompose';
import BarrageItem from './BarrageItem';
import {px, StatusBarHeight} from '../../constants/constants';
const {width} = Dimensions.get('window');
export default pure(({barrage, navigation}) => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 100 * px + StatusBarHeight,
        left: 0,
        right: 0,
        height: 80,
        width: width,
      }}>
      {barrage.length > 0
        ? barrage.map((item, index) => {
            return (
              <BarrageItem
                item={item}
                index={index}
                navigation={navigation}
                key={index}
              />
            );
          })
        : null}
    </View>
  );
});
