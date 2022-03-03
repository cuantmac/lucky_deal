import React, {FC, RefCallback} from 'react';
import {
  NavigationContainer as NavigationContainerCom,
  NavigationContainerRef,
} from '@react-navigation/native';
import {navigationRef} from '@src/utils/refs';
import {linkingConfig} from '@src/routes';
import {useCallback} from 'react';

export const NavigationContainer: FC = ({children}) => {
  const refCallBack = useCallback<RefCallback<NavigationContainerRef>>(
    (navigator) => {
      //@ts-ignore
      navigationRef.current = navigator;
    },
    [],
  );
  return (
    <NavigationContainerCom
      documentTitle={{
        formatter: () => {
          return 'Gesleben';
        },
      }}
      ref={refCallBack}
      linking={linkingConfig}>
      {children}
    </NavigationContainerCom>
  );
};
