import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {Text, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {Image, View, ActivityIndicator} from 'react-native';
import Video, {LoadEvent, PlayMode, ProgressEvent} from '@shm/app-video';
import {px} from '../../constants/constants';
import Utils from '../../utils/Utils';
import GlideImage from '../native/GlideImage';
import Slider from '@react-native-community/slider';
import {PRIMARY} from '../../constants/colors';
import {useIsFocused} from '@react-navigation/core';
const GlideImageEle = GlideImage as any;

interface VideoHandler {
  seek: (time: number) => void;
}
interface GoodsVideoProps {
  width: number;
  height: number;
  uri: string;
  poster: string;
}

type VideoProps = {
  showPoster: boolean;
  pause: boolean;
  mute: boolean;
  buffer: boolean;
  progress: number;
  vedioDuration: number;
};
export const GoodsVideo: FC<GoodsVideoProps> = ({
  width,
  height,
  uri,
  poster,
}) => {
  const focus = useIsFocused();
  const [videoProp, setVideoProp] = useState<VideoProps>({
    showPoster: true,
    pause: false,
    mute: true,
    buffer: true,
    progress: 0,
    vedioDuration: 0,
  });
  const videoRef = useRef<VideoHandler>(null);
  const videoPauseOrPlay = useCallback(() => {
    setVideoProp((oldValue) => {
      return {
        ...oldValue,
        pause: !oldValue.pause,
      };
    });
    if (videoProp.progress === 0) {
      videoRef.current?.seek(0);
    }
  }, [videoProp.progress]);

  const handleMute = useCallback(() => {
    setVideoProp((oldValue) => {
      return {
        ...oldValue,
        mute: !oldValue.mute,
      };
    });
  }, []);

  const handleEnd = useCallback(() => {
    setVideoProp((oldValue) => {
      return {
        ...oldValue,
        pause: true,
        progress: 0,
      };
    });
  }, []);

  const onProgress = (data: ProgressEvent) => {
    setVideoProp((oldValue) => {
      return {
        ...oldValue,
        progress: data.currentTime,
      };
    });
  };

  const onLoad = useCallback((data: LoadEvent) => {
    setVideoProp((oldValue) => {
      return {
        ...oldValue,
        showPoster: false,
        pause: false,
        buffer: false,
        vedioDuration: data.duration,
      };
    });
  }, []);

  const handleSlideValueChanged = useCallback((slideValue) => {
    videoRef.current?.seek(slideValue);
  }, []);

  useEffect(() => {
    if (focus) {
      setVideoProp((oldValue) => {
        return {
          ...oldValue,
          pause: false,
        };
      });
    } else {
      setVideoProp((oldValue) => {
        return {
          ...oldValue,
          pause: true,
        };
      });
    }
  }, [focus]);
  return (
    <View style={{position: 'relative', width: width, height: height}}>
      <TouchableWithoutFeedback onPress={videoPauseOrPlay}>
        <Video
          ref={videoRef}
          source={{uri: uri, playMode: PlayMode.COMMON}}
          resizeMode="cover"
          style={{
            width: width,
            height: height,
          }}
          paused={videoProp.pause}
          onProgress={onProgress}
          repeat={false}
          onEnd={handleEnd}
          onLoad={onLoad}
          muted={videoProp.mute}
        />
      </TouchableWithoutFeedback>

      {videoProp.showPoster && (
        <GlideImageEle
          source={Utils.getImageUri(poster)}
          defaultSource={require('../../assets/lucky_deal_default_large.jpg')}
          resizeMode={'cover'}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: width,
            height: height,
          }}
        />
      )}
      {videoProp.pause && (
        <TouchableOpacity
          onPress={videoPauseOrPlay}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            height: 120 * px,
            width: 120 * px,
            marginLeft: -60 * px,
            marginTop: -60 * px,
          }}>
          <Image
            style={{
              height: 120 * px,
              width: 120 * px,
            }}
            source={require('../../assets/icon_play.png')}
          />
        </TouchableOpacity>
      )}

      {!videoProp.showPoster && (
        <>
          <View
            style={{
              flexDirection: 'row',
              display: 'flex',
              position: 'absolute',
              bottom: 10 * px,
              alignItems: 'center',
            }}>
            <Slider
              style={{
                width: width - 20,
                left: 5,
                height: 20,
              }}
              step={1}
              minimumValue={0}
              maximumValue={videoProp.vedioDuration}
              value={videoProp.progress}
              minimumTrackTintColor="#ffffff"
              maximumTrackTintColor="#e6e6e6"
              thumbTintColor="#ffffff"
              disabled={false}
              onValueChange={(slideValue) => {
                handleSlideValueChanged(slideValue);
              }}
            />
            <Text style={{color: '#ffffff', fontSize: 24 * px}}>
              {Utils.countDown(videoProp.vedioDuration - videoProp.progress)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              handleMute();
            }}
            style={{
              position: 'absolute',
              right: 20 * px,
              bottom: 100 * px,
            }}>
            <Image
              style={{width: 60 * px, height: 60 * px}}
              source={
                videoProp.mute
                  ? require('../../assets/icon_mute.png')
                  : require('../../assets/icon_audio.png')
              }
            />
          </TouchableOpacity>
        </>
      )}

      {(videoProp.vedioDuration <= 0 || videoProp.buffer) && (
        <ActivityIndicator
          color={PRIMARY}
          size={'large'}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            height: 120 * px,
            width: 120 * px,
            marginLeft: -60 * px,
            marginTop: -60 * px,
          }}
        />
      )}
    </View>
  );
};
