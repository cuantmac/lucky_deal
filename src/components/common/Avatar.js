import {Image} from 'react-native';
import React from 'react';
import Utils from '../../utils/Utils';

export default function ({profile: {avatar, nick_name}, style}) {
  // const letter = nick_name ? nick_name.charAt(0).toUpperCase() : 'U';

  return avatar ? (
    <Image source={Utils.getImageUri(avatar)} style={style} />
  ) : (
    <Image source={require('../../assets/moren.png')} style={style} />
  );
}
