import React, {
  FC,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';

dayjs.extend(duration);
dayjs.extend(utc);

const {Consumer, Provider} = React.createContext<number>(Date.now());

interface TimerProviderProps {
  // 控制倒计时速度
  schedule?: number;
}

export const TimerProvider: FC<TimerProviderProps> = ({
  children,
  schedule = 1000,
}) => {
  const [time, setTime] = useState(dayjs().utc().valueOf());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(dayjs().utc().valueOf());
    }, schedule);
    return () => {
      clearInterval(timer);
    };
  }, [schedule, setTime]);

  return <Provider value={time}>{children}</Provider>;
};

// 判断倒计时是否已经结束
export const countDownTime = (time: number, targetTime: number) => {
  const diff = targetTime - time;
  const hasEnd = diff <= 0;
  return {
    hasEnd,
    diff: hasEnd ? 0 : diff,
  };
};

export type TimerConsumerChildrenParams = {
  // 格式化后值
  value: string;
  hasEnd: boolean;
};

export interface TimerConsumerProps {
  // 目标时间
  targetTime?: number;
  children: (params: TimerConsumerChildrenParams) => ReactNode;
}

/**
 * 
 *  years:   Y or y
    months:  M
    weeks:   W or w
    days:    D or d
    hours:   H or h
    minutes: m
    seconds: s
    ms:      S
 * 
 */
export const TimerConsumer: FC<TimerConsumerProps> = ({
  children,
  targetTime = 0,
}) => {
  const formatCountDownTime = useCallback(
    (now: number) => {
      const dur = dayjs.duration(countDownTime(now, targetTime).diff);
      const h = dur.asHours();
      const m = dur.minutes();
      const s = dur.seconds();
      return `${parseInt(`${h < 10 ? `0${h}` : h}`, 10)}:${
        m < 10 ? `0${m}` : m
      }:${s < 10 ? `0${s}` : s}`;
    },
    [targetTime],
  );

  const RenderChild = useMemo(() => {
    return memo(function TimerRender({
      value,
      hasEnd,
    }: TimerConsumerChildrenParams) {
      return (
        <>
          {children({
            value,
            hasEnd,
          })}
        </>
      );
    });
  }, [children]);

  return (
    <Consumer>
      {(time) => {
        return (
          <RenderChild
            value={formatCountDownTime(time)}
            hasEnd={countDownTime(time, targetTime).hasEnd}
          />
        );
      }}
    </Consumer>
  );
};
