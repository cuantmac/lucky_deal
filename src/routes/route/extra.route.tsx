import {createExtraRoute, CreateExtraRouteOriginType} from '../helper';

const extraPrefix = () => {
  if (window.__POWERED_BY_QIANKUN__) {
    return '/bridge';
  }
  return '/child/bridge';
};

const createExtraPath = (path: string) => {
  return extraPrefix() + path;
};

const createExtraRouteOrigin = createExtraRoute.bind(
  null,
  'http://localhost:3002',
) as CreateExtraRouteOriginType;

export type ExtraLoginRouteParams = {
  redirectUrl?: string;
};

// 登陆页
export const ExtraLoginRoute = createExtraRouteOrigin<ExtraLoginRouteParams>(
  createExtraPath('/login'),
);

// 地址列表
export const ExtraAddressListRoute = createExtraRouteOrigin(
  createExtraPath('/addressList'),
);

export type OrderStatusCheckParams = {
  orderId: string;
};

// 订单检查
export const OrderStatusCheckRoute = createExtraRouteOrigin<
  OrderStatusCheckParams
>(createExtraPath('/orderStatusCheck'));

export type ExtraOrderListRouteParams = {
  type: number;
};

// 订单列表
export const ExtraOrderListRoute = createExtraRouteOrigin<
  ExtraOrderListRouteParams
>(createExtraPath('/orderList'));

// 帮助页面
export const ExtraHelpRoute = createExtraRouteOrigin(
  createExtraPath('/contact'),
);
