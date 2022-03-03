import {useEffect} from 'react';
import {BackHandler} from 'react-native';
import {useIsFocused} from '@react-navigation/core';
/**
 * @return {null}
 */

export default function ListenPayBackPress({onGoBack, interrupt}) {
  const focus = useIsFocused();

  useEffect(() => {
    let listener = () => {
      if (focus && interrupt) {
        onGoBack();
        return true;
      } else {
        return false;
      }
    };
    BackHandler.addEventListener('hardwareBackPress', listener);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', listener);
    };
  }, [focus, interrupt, onGoBack]);

  return null;
}
