import {useEffect, useMemo} from 'react';
import Api from '../Api';
import {useFetching} from '../utils/hooks';

export interface PayMethodResponse {
  code: number;
  data: Data;
}

export interface Data {
  list?: PayMethodList[];
}

export interface PayMethodList {
  name: string;
  pay_type: number;
  icon: string;
  btnBg: string;
}

const PAYPAL_BTN_BG = require('../assets/pro/wheel_btn1.png');
const CREDIT_CARD_BTN_BG = require('../assets/pro/wheel_btn2.png');

export const usePaymethod = (source: number) => {
  const [loading, fetchFunc, data, error] = useFetching(() =>
    Api.getPayMethod<PayMethodResponse>(source),
  );
  useEffect(() => {
    fetchFunc();
  }, [fetchFunc]);
  const dataMap = useMemo(() => {
    return data?.data.list?.map((item, index) => ({
      ...item,
      btnBg: index % 2 === 0 ? PAYPAL_BTN_BG : CREDIT_CARD_BTN_BG,
    }));
  }, [data]);
  return [loading, fetchFunc, dataMap, error] as const;
};
