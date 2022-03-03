import {useEffect} from 'react';
import Utils from '../../utils/Utils';
import {dialogs} from '../../utils/refs';
import AppModule from '../../../AppModule';
import {BackHandler} from 'react-native';
import {useIsFocused} from '@react-navigation/core';
import {useDispatch, useSelector} from 'react-redux';

export default function ListenBackPress() {
  const focus = useIsFocused();
  const dispatch = useDispatch();
  const exitAppShownTime = useSelector(
    (state) => state.deprecatedPersist.exitAppShownTime,
  );
  useEffect(() => {
    let listener = () => {
      if (focus) {
        if (!Utils.isToday(new Date(exitAppShownTime))) {
          dialogs.exitAppRef.current.show(
            () => {
              AppModule.reportTap('exitapppop', 'ld__app_browse');
              dialogs.exitAppRef.current.hide();
              return true;
            },
            () => {
              AppModule.reportTap('exitapppop', 'ld_exit_app_click');
              BackHandler.exitApp();
              return false;
            },
          );
          dispatch({type: 'exitAppShown'});
          return true;
        } else {
          BackHandler.exitApp();
          return false;
        }
      } else {
        return false;
      }
    };
    BackHandler.addEventListener('hardwareBackPress', listener);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', listener);
    };
  }, [focus, dispatch, exitAppShownTime]);

  return null;
}
