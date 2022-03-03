import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  View,
  ActivityIndicator,
} from 'react-native';
import ShmVideo, {LoadEvent, PlayMode, ProgressEvent} from '@shm/app-video';
import Slider from '@react-native-community/slider';
import {PRIMARY} from '../../constants/colors';
import {useIsFocused} from '@react-navigation/core';
import {GlideImage} from '../glideImage';
import {px2dp} from '@src/helper/helper';

interface VideoHandler {
  seek: (time: number) => void;
}
interface VideoProps {
  width: number;
  height: number;
  src: string;
  poster: string;
}

type VideoState = {
  showPoster: boolean;
  pause: boolean;
  mute: boolean;
  buffer: boolean;
  progress: number;
  vedioDuration: number;
};

export const Video: FC<VideoProps> = ({
  width = 300,
  height = 300,
  src,
  poster,
}) => {
  const focus = useIsFocused();
  const [videoProp, setVideoProp] = useState<VideoState>({
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
        showPoster: false,
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
        showPoster: true,
        pause: true,
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
    <View style={[VideoStyles.container, {width: width, height: height}]}>
      <TouchableWithoutFeedback onPress={videoPauseOrPlay}>
        <ShmVideo
          ref={videoRef}
          source={{uri: src, playMode: PlayMode.COMMON}}
          resizeMode="contain"
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
        <GlideImage
          source={{uri: poster}}
          defaultSource={require('../../assets/lucky_deal_default_large.jpg')}
          resizeMode={'contain'}
          style={[
            VideoStyles.posterImg,
            {
              width: width,
              height: height,
            },
          ]}
        />
      )}

      {videoProp.pause && (
        <TouchableOpacity
          onPress={videoPauseOrPlay}
          style={VideoStyles.playBtnContainer}>
          <Image
            style={VideoStyles.playBtn}
            source={require('../../assets/play_btn.png')}
          />
        </TouchableOpacity>
      )}

      {!videoProp.showPoster && (
        <>
          <View style={VideoStyles.progressContainer}>
            <Slider
              style={{
                width: width - 20,
                left: 5,
                height: 20,
              }}
              step={0.05}
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
            <Text style={VideoStyles.reminedTime}>
              -{countDown(videoProp.vedioDuration - videoProp.progress)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleMute}
            activeOpacity={0.8}
            style={{
              position: 'absolute',
              right: px2dp(16),
              bottom: px2dp(36),
            }}>
            <Image
              style={{width: px2dp(30), height: px2dp(30)}}
              source={
                videoProp.mute
                  ? require('../../assets/mute.png')
                  : require('../../assets/audio.png')
              }
            />
          </TouchableOpacity>
        </>
      )}

      {(videoProp.vedioDuration <= 0 || videoProp.buffer) && (
        <ActivityIndicator
          color={PRIMARY}
          size={'large'}
          style={VideoStyles.activityIndicator}
        />
      )}
    </View>
  );
};

const VideoStyles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: 'black',
  },
  posterImg: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  playBtnContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    height: px2dp(57),
    width: px2dp(47),
    marginLeft: px2dp(-28.5),
    marginTop: px2dp(-37.5),
  },
  playBtn: {
    width: px2dp(42),
    height: px2dp(42),
  },
  progressContainer: {
    flexDirection: 'row',
    display: 'flex',
    position: 'absolute',
    bottom: px2dp(4),
    alignItems: 'center',
  },
  reminedTime: {color: '#ffffff', fontSize: px2dp(8)},
  activityIndicator: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    height: px2dp(42),
    width: px2dp(42),
    marginLeft: px2dp(-21),
    marginTop: px2dp(-21),
  },
});

const countDown = (seconds: number) => {
  if (seconds <= 0) {
    return '0:00';
  }
  // eslint-disable-next-line no-bitwise
  let m = (seconds / 60) | 0;
  // eslint-disable-next-line no-bitwise
  let s: string | number = seconds % 60 | 0;
  s = s < 10 ? '0' + s : s;
  return m + ':' + s;
};
