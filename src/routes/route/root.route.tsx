import {LinkingOptions} from '@react-navigation/native';
import Main from '@src/page/tabs';
import {createPath, createRoute} from '../helper';
import {createLazyPage, isWeb} from '@src/helper/helper';
import {navigationRef} from '@src/utils/refs';
import {ExtraLoginRoute} from './extra.route';
import {store} from '@src/redux';
import {PacyPayInfo} from '@luckydeal/api-common';

/**
 * 创建路由步骤
 *
 * 1、使用 createRoute 方法创建路由对象
 * 2、在 linkingConfig 中 添加 link信息
 */

// tab页路由
// Main 不可以懒加载 会造成 Main下的路由未注册， 其他页面无法跳转的问题
export const MainRoute = createRoute('Main', '', Main);

// 首页路由
export const HomeRoute = createRoute(
  'Home',
  createPath('/home'),
  createLazyPage(() => import('@src/page/home')),
  {
    isTab: true,
  },
);

export type ProductListRouteParams = {
  topCategoryId?: number;
  secondCategoryId?: number;
  threeCategoryId?: number;
  keyword?: string;
  behavior?: 'back';
};

// 分类
export const ProductsRoute = createRoute<ProductListRouteParams>(
  'products',
  createPath('/products'),
  createLazyPage(() => import('@src/page/productList')),
  {
    isTab: true,
  },
);

// 购物车
export const ShopRoute = createRoute(
  'Shop',
  createPath('/shop'),
  createLazyPage(() => import('@src/page/shop')),
  {
    isTab: true,
  },
);

// Me
export const MeRoute = createRoute(
  'Me',
  createPath('/me'),
  createLazyPage(() => import('@src/page/me')),
  {
    isTab: true,
  },
);

export type ShopPushRouteParams = {
  behavior?: 'back';
};

// 购物车 push
export const ShopPushRoute = createRoute<ShopPushRouteParams>(
  'shopPush',
  createPath('/shopPush'),
  createLazyPage(() => import('@src/page/shop')),
);

export const SearchRoute = createRoute(
  'Search',
  createPath('/search'),
  createLazyPage(() => import('@src/page/search')),
);

export const SearchRankingRoute = createRoute(
  'SearchRanking',
  createPath('/searchRanking'),
  createLazyPage(() => import('@src/page/searchRanking')),
);

export const ProductListRoute = createRoute<ProductListRouteParams>(
  'ProductList',
  createPath('/productList'),
  createLazyPage(() => import('@src/page/productList')),
);

export type ProductRouteParams = {
  productId: number;
  sku?: string;
};

// 普通商品路由
export const ProductRoute = createRoute<ProductRouteParams>(
  'Product',
  createPath('/product'),
  createLazyPage(() => import('@src/page/product')),
);

// 福袋路由
export const MysteryRoute = createRoute<ProductRouteParams>(
  'Mystery',
  createPath('/mystery'),
  createLazyPage(() => import('@src/page/mystery')),
);

// 最近浏览
export const RecentViewRoute = createRoute(
  'RecentView',
  createPath('/recentView'),
  createLazyPage(() => import('@src/page/recentView')),
);

// 心愿单
export const WishListRoute = createRoute(
  'WishList',
  createPath('/wishList'),
  createLazyPage(() => import('@src/page/wishList')),
);

// 订单确认页
export type PayRouteParams = {
  // 福袋、超级福袋、直购 需要传递 sku productId productType qty渲染成 下单页面
  sku?: string;
  productId?: number;
  productType?: number;
  qty?: number;
  // 购物车传递购物id， 多个使用 使用 - 分割
  cartIds?: string;
  // 订单id - 根据订单id渲染成待支付页面
  orderId?: string;
};

export const PayRoute = createRoute<PayRouteParams>(
  'Pay',
  createPath('/pay'),
  createLazyPage(() => import('@src/page/pay')),
);

export type PacypayRouteParams = PacyPayInfo & {
  pay_url: string;
  [key: string]: string;
};

export const PacypayRoute = createRoute<PacypayRouteParams>(
  'pacypay',
  createPath('/pacypay'),
  createLazyPage(() => import('@src/page/pacypay')),
);

export type PolicyRouteParams = {
  id: number;
};
// Policy
export const PolicyRoute = createRoute<PolicyRouteParams>(
  'Policy',
  createPath('/policy'),
  createLazyPage(() => import('@src/page/me/policy')),
);

export type ProductReviewsRouteParams = {
  productId: number;
  productType: number;
};
//评论列
export const ProductReviewsRoute = createRoute<ProductReviewsRouteParams>(
  'ProductReviews',
  createPath('/reviews'),
  createLazyPage(() => import('@src/page/productReviews')),
);

//优惠券中心
export const CouponCenterRoute = createRoute(
  'CouponCenter',
  createPath('/couponCenter'),
  createLazyPage(() => import('@src/page/couponCenter')),
);

export const AboutListRoute = createRoute(
  'AboutList',
  createPath('/aboutList'),
  createLazyPage(() => import('@src/page/me/aboutList')),
);

// user Profile
export const UserProfileRoute = createRoute(
  'Profile',
  createPath('/profile'),
  createLazyPage(() => import('@src/page/me/userProfile')),
);

export type ChangeProfileEmailRouteParams = {
  value: string;
};

export const ChangeProfileEmailRoute = createRoute<
  ChangeProfileEmailRouteParams
>(
  'ChangeProfileEmail',
  createPath('/changeEmail'),
  createLazyPage(() => import('@src/page/me/userProfile/changeProfileEmail')),
);

export type ChangeProfileNameRouteParams = {
  value: string;
};

export const ChangeProfileNameRoute = createRoute<ChangeProfileNameRouteParams>(
  'ChangeProfileName',
  createPath('/changeName'),
  createLazyPage(() => import('@src/page/me/userProfile/changeProfileName')),
);

// 设置
export const SettingsRoute = createRoute(
  'Settings',
  createPath('/settings'),
  createLazyPage(() => import('@src/page/me/settings')),
);

// 关注我们
export const FollowUsRoute = createRoute(
  'FollowUs',
  createPath('/followUs'),
  createLazyPage(() => import('@src/page/me/followUs')),
);

export enum ADDRESS_LIST_TYPE_ENUM {
  MANAGE = '0',
  SELECT = '1',
}

export type AddressListRouteParams = {
  type: ADDRESS_LIST_TYPE_ENUM;
};

// 地址列表
export const AddressListRoute = createRoute<AddressListRouteParams>(
  'AddressList',
  createPath('/addressList'),
  createLazyPage(() => import('@src/page/address/addressList')),
);

export enum EDIT_ADDRESS_TYPE_ENUM {
  NORMAL = '0',
  UPDATE_ORDER = '1',
}

export type EditAddressRouteParams = {
  id?: number;
  // 是否更新Order Detail 地址
  type?: EDIT_ADDRESS_TYPE_ENUM;
};

// 编辑地址
export const EditAddressRoute = createRoute<EditAddressRouteParams>(
  'EditAddress',
  createPath('/address'),
  createLazyPage(() => import('@src/page/address/editAddress')),
);

export type LoginRouteParams = {
  redirectUrl?: string;
};

// 登陆
export const LoginRoute = createRoute(
  'Login',
  createPath('/login'),
  createLazyPage(() => import('@src/page/auth/login')),
);

// 协议
export const TermsOfServiceRoute = createRoute(
  'TermsOfService',
  createPath('/termsOfService'),
  createLazyPage(() => import('@src/page/auth/login/termsOfService')),
);

// 登陆
export const PrivacyPolicyRoute = createRoute(
  'PrivacyPolicy',
  createPath('/privacyPolicy'),
  createLazyPage(() => import('@src/page/auth/login/privacyPolicy')),
);
// deeplink 配置
export const linkingConfig: LinkingOptions = {
  prefixes: [],
  config: {
    screens: {
      [MainRoute.name]: {
        path: '',
        screens: {
          [HomeRoute.name]: {
            path: HomeRoute.path,
          },
          [ProductsRoute.name]: {
            path: ProductsRoute.path,
          },
          [ShopRoute.name]: {
            path: ShopRoute.path,
          },
          [MeRoute.name]: {
            path: MeRoute.path,
          },
        },
      },
      [ProductRoute.name]: {
        path: ProductRoute.path,
      },
      [MysteryRoute.name]: {
        path: MysteryRoute.path,
      },
      [RecentViewRoute.name]: {
        path: RecentViewRoute.path,
      },
      [WishListRoute.name]: {
        path: WishListRoute.path,
      },
      [AboutListRoute.name]: {
        path: AboutListRoute.path,
      },
      [PolicyRoute.name]: {
        path: PolicyRoute.path,
      },
      [PayRoute.name]: {
        path: PayRoute.path,
      },
      [PacypayRoute.name]: {
        path: PacypayRoute.path,
      },
      [ProductListRoute.name]: {
        path: ProductListRoute.path,
      },
      [SearchRoute.name]: {
        path: SearchRoute.path,
      },
      [ProductReviewsRoute.name]: {
        path: ProductReviewsRoute.path,
      },
      [CouponCenterRoute.name]: {
        path: CouponCenterRoute.path,
      },
      [ShopPushRoute.name]: {
        path: ShopPushRoute.path,
      },
      [SearchRankingRoute.name]: {
        path: SearchRankingRoute.path,
      },
      [UserProfileRoute.name]: {
        path: UserProfileRoute.path,
      },
      [ChangeProfileEmailRoute.name]: {
        path: ChangeProfileEmailRoute.path,
      },
      [ChangeProfileNameRoute.name]: {
        path: ChangeProfileNameRoute.path,
      },
      [SettingsRoute.name]: {
        path: SettingsRoute.path,
      },
      [FollowUsRoute.name]: {
        path: FollowUsRoute.path,
      },
      [AddressListRoute.name]: {
        path: AddressListRoute.path,
      },
      [EditAddressRoute.name]: {
        path: EditAddressRoute.path,
      },
      [LoginRoute.name]: {
        path: LoginRoute.path,
      },
      [TermsOfServiceRoute.name]: {
        path: TermsOfServiceRoute.path,
      },
      [PrivacyPolicyRoute.name]: {
        path: PrivacyPolicyRoute.path,
      },
    },
  },
};

export const goback = () => {
  if (isWeb()) {
    if (navigationRef.current && navigationRef.current.canGoBack()) {
      navigationRef.current.goBack();
    } else {
      window.history.back();
    }
    return;
  }
  navigationRef.current && navigationRef.current.goBack();
};

export const navigate2Login = () => {
  if (isWeb()) {
    // 防止出现多个接口错误调用navigate2Login跳转登录页
    const path = window.location.pathname;
    if (path === LoginRoute.path) {
      return;
    }
    navigationRef.current.navigate('Login', {
      redirectUrl: encodeURIComponent(window.location.href),
    });
  } else {
    navigationRef.current.navigate('Login');
  }
};

export const requireAuth = () => {
  return new Promise<void>((resove, reject) => {
    const auth = store.getState().persist.persistAuth;
    if (auth.token) {
      resove();
      return;
    }
    navigate2Login();
    reject();
  });
};
