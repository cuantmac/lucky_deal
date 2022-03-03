import {styleAdapter} from '@src/helper/helper';
import React, {FC} from 'react';
import {View} from 'react-native';

interface SpaceProps {
  height?: number;
  backgroundColor?: string;
  marginTop?: number;
  marginLeft?: number;
  marginRight?: number;
}

export const Space: FC<SpaceProps> = ({
  height = 1,
  backgroundColor = 'rgba(242,242,242)',
  marginTop = 0,
  marginLeft = 0,
  marginRight = 0,
}) => {
  return (
    <View
      style={styleAdapter({
        height: height,
        backgroundColor,
        marginTop: marginTop,
        marginLeft: marginLeft,
        marginRight: marginRight,
      })}
    />
  );
};
