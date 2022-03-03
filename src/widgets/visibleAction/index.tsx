import React, {
  FC,
  ImgHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import uniqueId from 'lodash.uniqueid';
import 'intersection-observer';
import styles from './index.module.scss';

type VisibleActionProps = ImgHTMLAttributes<HTMLDivElement> & {
  onVisible?: () => void;
};

const options = {
  root: null,
  rootMargin: '100px 0px',
  threshold: 0,
};

type VisibleActionCacheType = {
  [key: string]: () => void;
};

const visibleActionCache: VisibleActionCacheType = {};

const intersectionObserverCallback: IntersectionObserverCallback = (
  entries,
  observer,
) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const uId = entry.target.getAttribute('data-lazy') as string;
      const fun = visibleActionCache[uId];
      fun && fun();
      observer.unobserve(entry.target);
      delete visibleActionCache[uId];
    }
  });
};

// eslint-disable-next-line no-undef
const observer = new IntersectionObserver(
  intersectionObserverCallback,
  options,
);

export const VisibleAction: FC<VisibleActionProps> = ({
  onVisible,
  ...props
}) => {
  const containerRef = useRef<HTMLImageElement>(null);
  const uId = useRef(uniqueId('lazy'));
  const loadFnRef = useRef<() => void>();

  const handleOnVisible = useCallback(() => {
    onVisible && onVisible();
  }, [onVisible]);

  loadFnRef.current = handleOnVisible;

  useEffect(() => {
    visibleActionCache[uId.current] = () =>
      loadFnRef.current && loadFnRef.current();
    containerRef.current && observer.observe(containerRef.current);
    const containerTarget = containerRef.current;
    const uIdCurrent = uId.current;
    return () => {
      containerTarget && observer.unobserve(containerTarget);
      delete visibleActionCache[uIdCurrent];
    };
  }, []);

  return (
    // @ts-ignore
    <div
      className={styles.container}
      ref={containerRef}
      data-lazy={uId.current}
      {...props}
    />
  );
};
