import {
  Platform,
  Dimensions,
  ImageStyle,
  TextStyle,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import {compile, pathToRegexp, Key} from 'path-to-regexp';
import queryString, {StringifiableRecord} from 'query-string';
import React, {ComponentType, lazy, ReactNode, Suspense} from 'react';
import {ProductSkuInfo} from '@luckydeal/api-common';
import {PRODUCT_CATEGPRY_TYPE} from '@src/constants/enum';
import {PagePlaceHolder} from '@src/widgets/pagePlaceholder';

export function isWeb() {
  return Platform.OS === 'web';
}

export function isAndroid() {
  return Platform.OS === 'android';
}

export function isIOS() {
  return Platform.OS === 'ios';
}

const SCREEN_WIDTH = Dimensions.get('window').width;
export const px2dp = (px: number) => (px * SCREEN_WIDTH) / 375;

/**
 * @deprecated 尽量不用使用
 */
export const px2dpOld = (px: number) => (px * SCREEN_WIDTH) / 1080;

/**
 * 向url后面拼接参数
 */
export function urlAddQuery(url: string, query: StringifiableRecord) {
  const {url: urlStr, query: queryParams} = queryString.parseUrl(url);
  return queryString.stringifyUrl({
    url: urlStr,
    query: {
      ...queryParams,
      ...query,
    },
  });
}

/**
 * 将请求参数转换成query字符串
 * 并且会根据字符串是否为空自动拼接？号
 *
 * @param params 键是string, 值是 string 或 string数组的对象
 * @returns string
 */
export function queryParams2String(params?: StringifiableRecord): string {
  if (!params) {
    return '';
  }
  const str = queryString.stringify(params);
  return str && `?${str}`;
}

/**
 *
 * 根据参数补全路径， 同时返回剩余的参数
 * compilePath('/api/:id', {id:'10', name:'jason'}) =>  {path:'/api/10', {name:'jason'}}
 *
 * @param path api地址或者路由地址
 * @param params StringifiableRecord
 * @returns 返回路径和剩余参数
 */
export function compilePath(
  path: string,
  params: StringifiableRecord = {},
): {path: string; params: StringifiableRecord; search: string} {
  const paramsCopy = {...params};
  const toPath = compile(path, {encode: encodeURIComponent});
  const keys: Key[] = [];
  pathToRegexp(path, keys);
  keys.forEach(({name}) => {
    const valType = typeof paramsCopy[name];
    if (!['string', 'number'].includes(valType)) {
      throw new Error(
        `${path} 无法匹配参数， 请确认参数${name}的类型是string或number值`,
      );
    }
    delete paramsCopy[name];
  });
  return {
    path: toPath(params),
    search: queryParams2String(paramsCopy),
    params: paramsCopy,
  };
}

/**
 * 等待一定时间返回传入的数据
 * @param result 需要返回的数据
 * @param time 需要等待的时间
 */
export function wait<T>(result?: T, time = 2000): Promise<T | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(result);
    }, time);
  });
}

/**
 * 转换金额
 * @param {number} amount
 * @returns number
 */
export function convertAmount(amount: number) {
  return amount / 100;
}
/**
 * 转换金额
 * @param {number} amount
 * @param {boolean} isminus
 * @returns string
 */
export function convertAmountUS(amount: number, isminus = false) {
  return `${isminus ? '-' : ''}US $` + (amount / 100).toFixed(2);
}

type StyleType = ViewStyle | TextStyle | ImageStyle;
type Size2dpParams =
  | Record<string, string | number>
  | Record<string, Record<string, string | number>>
  | Record<string, Record<string, string | number>[]>;

function size2dp(content: Size2dpParams, old?: boolean) {
  const ignores = [/^flex/, /^zIndex$/, /^opacity$/];
  Object.keys(content).forEach((key) => {
    const item = content[key];
    if (Array.isArray(item)) {
      item.forEach((element) => {
        size2dp(element, old);
      });
      return;
    }
    if (typeof item === 'object') {
      size2dp(item, old);
      return;
    }
    if (typeof item === 'number' && !ignores.find((val) => val.test(key))) {
      content[key] = old ? px2dpOld(item) : px2dp(item);
    }
  });
}

/**
 * 自动转换尺寸适配屏幕大小
 */
export function styleAdapter<T extends Record<string, StyleType> | StyleType>(
  style: T,
  old?: boolean,
): T {
  const clone = JSON.parse(JSON.stringify(style));
  size2dp(clone, old);
  return clone;
}

type NamedStyles<T> = {[P in keyof T]: ViewStyle | TextStyle | ImageStyle};
/**
 * 方便创建styleSheet
 */
export function createStyleSheet<T extends NamedStyles<T> | NamedStyles<any>>(
  styles: T | NamedStyles<T>,
  old?: boolean,
): T {
  return StyleSheet.create(styleAdapter(styles, old));
}

/**
 * 创建 context
 *
 * @param defaultValue
 */
export function createCtx<A>(defaultValue: A) {
  type UpdateType = React.Dispatch<React.SetStateAction<typeof defaultValue>>;
  const defaultUpdate: UpdateType = () => defaultValue;
  const ctx = React.createContext({
    state: defaultValue,
    update: defaultUpdate,
  });
  // eslint-disable-next-line @typescript-eslint/ban-types
  const Provider = ({
    children,
    providerValue,
  }: React.PropsWithChildren<{providerValue?: A}>) => {
    const [state, update] = React.useState(providerValue || defaultValue);
    return <ctx.Provider value={{state, update}}>{children}</ctx.Provider>;
  };
  return [ctx, Provider] as const;
}

export const createLazyPage = (
  factory: () => Promise<{default: ComponentType<any>}>,
  fallback: ReactNode = <PagePlaceHolder />,
) => {
  const LazyComponent = lazy(factory);
  return (props: any) => {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
};

/**
 * 判断是否是直购
 */
export const isOffers = (productType: PRODUCT_CATEGPRY_TYPE) => {
  return (
    productType === PRODUCT_CATEGPRY_TYPE.OFFERS ||
    productType === PRODUCT_CATEGPRY_TYPE.VIP
  );
};

/**
 * 判断是否是福袋
 */
export const isMystery = (productType: PRODUCT_CATEGPRY_TYPE) => {
  return (
    productType === PRODUCT_CATEGPRY_TYPE.MYSTERY ||
    productType === PRODUCT_CATEGPRY_TYPE.SUPRE_BOX
  );
};

/**
 *  将选中的sku转成形如 【skuName1，sku2Name】的数组
 */
export const flatSku = (sku?: ProductSkuInfo[][]) => {
  const arr: string[] = [];
  sku?.forEach((item) => {
    item?.forEach(({sku_list}) => {
      sku_list.forEach(({name}) => {
        arr.push(name);
      });
    });
  });
  return arr;
};

type GetProductStatusparams = {
  qty: number;
  stock?: number;
  status?: number;
};

// 获取当前商品的状态
export const getProductStatus = (params: GetProductStatusparams) => {
  const stock = params.stock ?? 0;
  // 无库存
  const soldOut = stock <= 0;
  // 下架
  const offTheShelf = params.status !== 0;
  // 库存不足
  const stockOut = stock > 0 && stock < params.qty;
  // 少量库存
  const stockLess = stock <= 10;

  return {
    disabled: soldOut || offTheShelf || stockOut,
    soldOut,
    offTheShelf,
    stockOut,
    stock,
    stockLess,
  };
};
