import {Image, Platform} from 'react-native';
import React from 'react';
import GlideImageAndroid from './GlideImageAndroid';

const GlideImage = ({
  source,
  defaultSource,
  resizeMode,
  tintColor,
  style,
  showDefaultImage = true,
  gifPlayCompleted,
  gif = false,
}) => {
  const defaultSrc = defaultSource
    ? defaultSource
    : require('../../assets/ph.png');
  return Platform.OS === 'ios' ? (
    <Image
      source={source.uri ? source : defaultSrc}
      defaultSource={defaultSrc}
      resizeMode={resizeMode}
      tintColor={tintColor}
      style={style}
    />
  ) : (
    <GlideImageAndroid
      source={source}
      defaultSource={showDefaultImage ? defaultSrc : ''}
      tintColor={tintColor}
      resizeMode={resizeMode}
      style={style}
      listener={gifPlayCompleted}
      gif={gif}
    />
  );
};

export default GlideImage;
