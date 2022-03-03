import {Image} from 'react-native';
import React from 'react';
import {GlideImageNative} from '@src/widgets/native';

const GlideImageAndroid = ({
  source,
  defaultSource,
  resizeMode,
  tintColor,
  style,
  listener,
  gif,
}) => {
  return (
    <GlideImageNative
      source={Image.resolveAssetSource(source)}
      defaultSource={Image.resolveAssetSource(defaultSource)}
      resizeMode={resizeMode}
      tintColor={tintColor}
      gif={gif}
      onCallBack={(data) => {
        if (listener != null) {
          listener();
        }
      }}
      style={{
        overflow: 'hidden',
        ...style,
      }}
    />
  );
};

export default GlideImageAndroid;
