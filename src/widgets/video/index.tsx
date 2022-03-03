import {px2dp} from '@src/helper/helper';
import classNames from 'classnames';
import React, {FC, useRef} from 'react';
import {useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  Player,
  ControlBar,
  ProgressControl,
  RemainingTimeDisplay,
} from 'video-react';
import 'video-react/dist/video-react.css';
import styles from './index.module.scss';

interface VideoProps {
  src: string;
  poster?: string;
  width?: number;
  height?: number;
}

export const Video: FC<VideoProps> = ({
  width = 300,
  height = 300,
  src,
  poster,
}) => {
  const playerRef = useRef(null);
  return (
    <View>
      <Player
        className={styles.player}
        fluid={false}
        width={width}
        height={height}
        ref={playerRef}
        src={src}
        poster={poster}>
        <PlayButton />
        <MuteButton />
        <ControlBar autoHide={false} disableDefaultControls>
          <ProgressControl order={1} />
          <RemainingTimeDisplay />
        </ControlBar>
      </Player>
    </View>
  );
};

interface PlayBtnProps {
  player?: any;
  actions?: any;
}

// 控制播放的按钮
const PlayButton: FC<PlayBtnProps> = ({player, actions}) => {
  const handleClick = useCallback(() => {
    actions?.play();
  }, [actions]);
  return (
    <div
      onClick={handleClick}
      className={classNames(styles.playBtn, {
        [styles.playBtnHide]: !player?.paused,
      })}>
      <img
        style={{width: px2dp(47), height: px2dp(57)}}
        src={require('../../assets/play_btn.png')}
      />
    </div>
  );
};

// 控制是否静音
const MuteButton: FC<PlayBtnProps> = ({player, actions}) => {
  const handleOnPress = useCallback(() => {
    if (player?.muted) {
      actions.mute(false);
      return;
    }
    actions?.mute(true);
  }, [actions, player]);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleOnPress}
      style={[
        VideoStyles.muteButtonContainer,
        {display: !player?.hasStarted ? 'none' : 'flex'},
      ]}>
      <img
        style={{width: px2dp(30), height: px2dp(30)}}
        src={
          player?.muted
            ? require('../../assets/mute.png')
            : require('../../assets/audio.png')
        }
      />
    </TouchableOpacity>
  );
};

const VideoStyles = StyleSheet.create({
  muteButtonContainer: {
    position: 'absolute',
    right: px2dp(16),
    bottom: px2dp(36),
    zIndex: 1,
  },
});
