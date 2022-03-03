import {createExtraProxyRoute} from '../helper';
import {
  ExtraAddressListRoute,
  ExtraOrderListRoute,
  ExtraOrderListRouteParams,
  ExtraHelpRoute,
} from './extra.route';

export type ProxyAddressListRouteParams = {
  mode: 'manage' | 'select';
};

export const ProxyAddressListRoute = createExtraProxyRoute<
  ProxyAddressListRouteParams
>('AddressList', ExtraAddressListRoute);

export type ProxyOrderListRouteParams = {
  orderStatus?: number;
};

export const ProxyOrderListRoute = createExtraProxyRoute<
  ProxyOrderListRouteParams,
  ExtraOrderListRouteParams
>('Orders', ExtraOrderListRoute);

export const ProxyHelpRoute = createExtraProxyRoute(
  'CustomerHelp',
  ExtraHelpRoute,
);
