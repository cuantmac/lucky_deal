import React, {FC} from 'react';
import {View} from 'react-native';
import {px} from '../../constants/constants';

interface SpaceProps {
  height?: number;
  backgroundColor?: string;
  marginTop?: number;
  marginLeft?: number;
  marginRight?: number;
}

/**
 * @deprecated
 */
export const Space: FC<SpaceProps> = ({
  height = 1,
  backgroundColor = '#d6d6d6',
  marginTop = 0,
  marginLeft = 0,
  marginRight = 0,
}) => {
  return (
    <View
      style={{
        height: height * px,
        backgroundColor,
        marginTop: marginTop * px,
        marginLeft: marginLeft * px,
        marginRight: marginRight * px,
      }}
    />
  );
};
