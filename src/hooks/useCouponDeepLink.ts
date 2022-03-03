import {useEffect, useState} from 'react';
import {Linking} from 'react-native';
import queryString from 'query-string';
import AppModule from '../../AppModule';
import {useDispatch} from 'react-redux';
import {useShallowEqualSelector} from '../utils/hooks';

enum DEEPLINK_TYPE_ENUM {
  COUPON = 'coupon',
}

interface CouponDeeplinkParams {
  query: {
    couponid: string;
    utm_source: string;
  };
  type: string;
}

export function useCouponDeeplink() {
  const [coupon, setCoupon] = useState<String | null>();
  const dispatch = useDispatch();
  const {token} = useShallowEqualSelector(
    (state: {deprecatedPersist: any}) => state.deprecatedPersist,
  );
  useEffect(() => {
    const listener = ({url}: {url: string}) => {
      if (!url) {
        return;
      }
      // console.log('----url', url);
      const result = parseDeeplink<CouponDeeplinkParams>(url);
      if (result.type === DEEPLINK_TYPE_ENUM.COUPON && result.query.couponid) {
        setCoupon(result.query.couponid);
      }
    };
    Linking.getInitialURL().then((url) => {
      url && listener({url});
    });
    Linking.addEventListener('url', listener);
    return () => {
      return Linking.removeEventListener('url', listener);
    };
  }, []);
  useEffect(() => {
    const referrer = decodeURIComponent(AppModule.getGooglePlayReferrer());
    if (!referrer) {
      return;
    }
    const result = parseReferrer<CouponDeeplinkParams>(referrer);
    if (result.type === DEEPLINK_TYPE_ENUM.COUPON && result.query.couponid) {
      setCoupon(result.query.couponid);
    }
  }, [dispatch, token]);
  useEffect(() => {
    if (coupon) {
      coupon &&
        dispatch({
          type: 'updatePushCouponCode',
          payload: coupon,
        });
      setCoupon(undefined);
    }
  }, [coupon, dispatch]);
}

function parseDeeplink<T>(dp: string) {
  const dpType = getDeepLinkType(dp);
  const query = queryString.parseUrl(dp).query;
  return ({query, type: dpType} as unknown) as T;
}

function parseReferrer<T>(referrer: string) {
  const match = referrer.match(/utm_content=(.*)/);
  const content = match ? match[1] : '';
  const query = queryString.parseUrl(content).query;
  const dpType = getUrlType(content);
  return ({query, type: dpType} as unknown) as T;
}

function getDeepLinkType(dp: string) {
  const match = dp.match(/^.*:\/\/([a-zA-Z0-9:.-]*)/);
  return match && match[1];
}

function getUrlType(url: string) {
  const match = url.match(/^.*:\/\/[a-zA-Z0-9:.-]*\/([a-zA-Z0-9.]*)/);
  return match && match[1];
}
