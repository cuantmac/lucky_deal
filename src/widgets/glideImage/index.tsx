import {
  Image,
  ImagePropsBase,
  ImageStyle,
  StyleProp,
  ImageURISource,
  ImageProps,
} from 'react-native';
import React, {FC} from 'react';
import FastImage, {FastImageProps, ResizeMode} from 'react-native-fast-image2';
import {isWeb} from '@src/helper/helper';

export interface GlideImageProps {
  source: Omit<FastImageProps['source'], 'cache'>;
  defaultSource?: ImageProps['defaultSource'] | boolean;
  resizeMode?: ImagePropsBase['resizeMode'];
  tintColor?: string;
  style?: StyleProp<ImageStyle>;
  useNative?: boolean;
}

/**
 * debug模式下android不显示占位图
 */
export const GlideImage: FC<GlideImageProps> = ({
  useNative = true,
  source,
  defaultSource = require('../../assets/ph.png'),
  resizeMode = 'contain',
  tintColor,
  style,
}) => {
  const imageSource = handleSource(source, defaultSource);
  if (!isWeb() && useNative) {
    return (
      <FastImage
        defaultSource={defaultSource === false ? undefined : defaultSource}
        resizeMode={resizeMode as ResizeMode}
        tintColor={tintColor}
        source={imageSource}
        style={style}
      />
    );
  }
  return (
    <Image
      source={imageSource}
      resizeMode={resizeMode}
      defaultSource={defaultSource === false ? undefined : defaultSource}
      style={[{tintColor}, style]}
    />
  );
};

const handleSource = (
  source: GlideImageProps['source'],
  defaultSource: GlideImageProps['defaultSource'],
): GlideImageProps['source'] => {
  if (Array.isArray(source)) {
    return source.map((s) => {
      return {...s, uri: s.uri || ''};
    });
  }

  if (typeof source === 'object') {
    if (!(source as ImageURISource).uri && defaultSource !== false) {
      return defaultSource as GlideImageProps['source'];
    }
    return {...source, uri: (source as ImageURISource).uri || ''};
  }

  return source;
};
