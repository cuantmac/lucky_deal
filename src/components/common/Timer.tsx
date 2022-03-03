import {string1To255} from 'aws-sdk/clients/customerprofiles';
import React, {FC, memo} from 'react';
import {ReactNode} from 'react';
import {Text, TextProps, View} from 'react-native';
import {useSelector} from 'react-redux';
import {px} from '../../constants/constants';
import Utils from '../../utils/Utils';

interface TimerProps extends Pick<TimerChildrenMemoProps, 'children'> {
  targetTime: number;
}
/**
 * 计时器
 * 依赖 useTimer hook
 *
 * @param props TimerProps
 * @example
 *  ```
 *  <Timer targetTime={1707331633}>
 *       {(time, hasEnd) => {
 *           return (
 *               <Text style={{color: hasEnd ? 'gray' : 'red'}}>{time}</Text>
 *           );
 *       }}
 *   </Timer>
 *
 *  ```
 */
export const Timer: FC<TimerProps> = ({targetTime, children}) => {
  const [time, hasEnd] = useTimer(targetTime);
  return (
    <TimerChildrenMemo time={time} hasEnd={hasEnd}>
      {children}
    </TimerChildrenMemo>
  );
};

interface TimerFormateProps {
  time: string1To255;
  styles: TextProps['style'];
  color: string;
}
export const TimerFormate: FC<TimerFormateProps> = ({time, styles, color}) => {
  let timeArr = time.split(':');
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20 * px,
      }}>
      {timeArr.map((item, i) => {
        return (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            key={i}>
            <Text style={styles}>{item}</Text>
            {i !== 2 ? (
              <Text
                style={{
                  paddingHorizontal: 8 * px,
                  color: color,
                }}>
                :
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
};

interface TimerChildrenMemoProps {
  time: string;
  hasEnd: boolean;
  children: (time: string, hasEnd: boolean) => ReactNode;
}

/**
 * 页面渲染优化
 * 当倒计时结束后 不再重新渲染子组件
 */
const TimerChildrenMemo = memo<TimerChildrenMemoProps>(
  ({time, hasEnd, children}) => {
    return <>{children(time, hasEnd)}</>;
  },
);

type useTimerFn = (targetTime: number) => [string, boolean];

/**
 *倒计时hook
 依赖 redux 中的当前时间now
 *
 * @param targetTime 倒计时的目标时间
 *
 * @example
 * ```
 *  const [time, hasEnd] = useTimer(props.targetTime);
 * ```
 */
export const useTimer: useTimerFn = (targetTime) => {
  const now = useSelector((state: any) => state.memory.now);
  const time = Utils.endTimeShow(targetTime - now);
  return [time, time === '00:00:00'];
};
