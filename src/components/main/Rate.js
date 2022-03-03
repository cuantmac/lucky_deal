import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {AppState} from 'react-native';
import {APP_ID, PACKAGE_NAME} from '../../constants/constants';
import Utils from '../../utils/Utils';
import {RateModal} from '../rate/Components/RateModal';
import {useDispatch, useSelector} from 'react-redux';
import {globalModalQueue} from '../../utils/modalQueue';

export default function Rate() {
  const {bidSucceedOnce, ratedOnce} = useSelector(
    (state) => state.deprecatedPersist,
  );
  const dispatch = useDispatch();
  const rateRef = useRef();

  useEffect(() => {
    let listener = (nextAppState) => {
      if (nextAppState === 'active' && bidSucceedOnce && !ratedOnce) {
        globalModalQueue.add(rateRef);
        dispatch({type: 'ratedOnce', payload: true});
      }
    };
    AppState.addEventListener('change', listener);
    return () => {
      AppState.removeEventListener('change', listener);
    };
  }, [bidSucceedOnce, dispatch, ratedOnce]);

  return <RateDialog ref={rateRef} />;
}

export const RateDialog = forwardRef((props, ref) => {
  const [showRate, setShowRate] = useState(false);
  useImperativeHandle(
    ref,
    () => {
      return {
        show() {
          setShowRate(true);
        },
        hide() {
          setShowRate(false);
        },
        isShowing() {
          return showRate;
        },
      };
    },
    [showRate],
  );
  return (
    <RateModal
      playStoreUrl={`market://details?id=${PACKAGE_NAME}`}
      iTunesStoreUrl={`itms-apps://itunes.apple.com/app/${APP_ID}`}
      isModalOpen={showRate}
      style={{
        paddingHorizontal: 30,
      }}
      onClosed={() => {
        setShowRate(false);
      }}
      sendContactUsForm={(state) => {
        Utils.contactUs(state.review);
      }}
      onSendReview={() => {
        console.log('on send review');
      }}
      onStarSelected={(star) => {
        console.log('on star selected', star);
      }}
    />
  );
});
