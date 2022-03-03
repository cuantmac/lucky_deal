import {
  BagProductDetailResponse,
  CartPageRecommendResponse,
  CouponMarketReward,
  CouponMarketRewardResponse,
  LuckyActivityProductListResponse,
  OfferProductDetailResponse,
  PolicyConfigDetailResponse,
  PolicyConfigListResponse,
  ProductCartAddItemResponse,
  UserAvailableCouponsRequest,
  UserAvailableCouponsResponse,
  UserCartConfirmRequest,
  UserCartConfirmResponse,
  UserCartListResponse,
  UserOrderConfirmRequest,
  UserOrderConfirmResponse,
  UserUserReceiveCouponsRequest,
  UserUserReceiveCouponsResponse,
} from '@luckydeal/api-common';
import {ResponseError} from './types/models/common.model';
import AppModule from '../AppModule';
import axios from './axiosConfig';
import * as Sentry from '@sentry/react-native';
import Branch from './Branch';
import {Platform} from 'react-native';
import {
  BagOrderData,
  CartOrderConfirm,
  CartOrderData,
  CouponList,
  OfferOrderData,
  OrderDetailData,
  UserAddressList,
  UserOrderConfirm,
} from './types/models/order.model';
import {AisaBill, PacyPay, PayPal} from './types/models/pacypay.model';
import {Address, RegionList} from './types/models/address.model';
import {
  AddToCart,
  CategoryTopList,
  CategoryTwoList,
  NavList,
  SearchResult,
  MysteryGame,
  AddPurchaseList,
  AddPurchaseDetail,
  PolicyConfig,
  PolicyContentData,
} from './types/models/product.model';
import {
  EasterGiftList,
  EasterGiftSubmit,
  FlashConfigApi,
  FlashProductListApi,
} from './types/models/activity.model';

import {
  HomeCategoryListApi,
  MBestGoodsListApi,
  MCategoryProductListApi,
  MGoodsListApi,
  MHomeIndexApi,
  MHomeMysteryBoxesApi,
  MHomeNavApi,
} from './types/models/config.model';
export enum ADDRESS_PREFERRED_NUM {
  DEFAULT,
  PREFERRED,
}

export type AddAddressParams = {
  full_name: string;
  address_line_one: string;
  address_line_two: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone_number: string;
  email: string;
  preferred?: ADDRESS_PREFERRED_NUM;
};

export type EditAddressParams = {
  address_id: number;
  full_name: string;
  address_line_one: string;
  address_line_two: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone_number: string;
  email: string;
  preferred?: ADDRESS_PREFERRED_NUM;
};

export default {
  //后端统计接口，启动App时调用
  login() {
    return axios.post('user/login');
  },
  //竞拍币列表
  chargeConfig(body: object) {
    return axios.post('user/charge/config', {
      ...body,
      plat_from: Platform.OS === 'android' ? 0 : 1,
    });
  },
  //竞拍币预充值，商品预购买
  charge(body: object) {
    return axios.post('user/pre/charge', body);
  },

  //AsiaBill预支付
  asiaBillCharge(body: object): Promise<AisaBill.RootObject> {
    return (axios.post('asiabill/pre/charge', {
      ...body,
      bundle_code: AppModule.getActiveBundleVersion(),
      platform: 'android',
    }) as unknown) as Promise<AisaBill.RootObject>;
  },

  //pacypal预支付
  pacypayCharge(body: object): Promise<PacyPay.RootObject> {
    return (axios.post('pacypal/pre/charge', {
      ...body,
      bundle_code: AppModule.getActiveBundleVersion(),
      platform: 'android',
    }) as unknown) as Promise<PacyPay.RootObject>;
  },

  /**
   * 积分paypal 充值
   */
  scorePayPalCharge(buy_scores: number): Promise<PayPal.RootObject> {
    return (axios.post('scores/preCharge/paypal', {
      buy_scores: buy_scores,
      custom_url: '',
      bundle_code: AppModule.getActiveBundleVersion(),
      platform: 'android',
    }) as unknown) as Promise<PayPal.RootObject>;
  },

  /**
   * 积分pacypal 充值
   * @param buy_scores
   * @returns
   */
  scorePacyPalCharge(buy_scores: number): Promise<PacyPay.RootObject> {
    return (axios.post('pacypal/score/pre/charge', {
      buy_scores: buy_scores,
      bundle_code: AppModule.getActiveBundleVersion(),
      platform: 'android',
    }) as unknown) as Promise<PacyPay.RootObject>;
  },

  stripe_charge(body: object) {
    return axios.post('stripe/pre/charge', body);
  },
  //Google支付
  googlePay(body: object) {
    return axios.post('user/google/pay', body);
  },
  //Apple支付
  applePay(body: object) {
    return axios.post('user/ios/pay', body);
  },
  //facebook登录
  async facebookLogin(
    facebookId: string,
    nickName: string,
    avatar: string,
    fbToken: string,
    gender: number,
    diversion_type: number,
  ) {
    let deviceInfo = await AppModule.getDeviceInfo();
    let res = await axios.post('user/register', {
      fb_id: facebookId,
      nick_name: nickName,
      avatar: avatar,
      login_type: 1,
      facebook_user_token: fbToken,
      device_id: deviceInfo.device_id,
      advertising_id: deviceInfo.advertising_id,
      appsflyer_id: deviceInfo.appsflyer_id,
      tk: deviceInfo.tk,
      platform: Platform.OS === 'android' ? 1 : 2,
      gender: gender,
      diversion_type: diversion_type || 0,
    });
    if (res.data && res.data.token) {
      Sentry.setUser({
        id: res.data.user_id,
        username: nickName,
      });
      AppModule.register(res.data);
      await Branch.reportBranchEvent('sign_up', {
        userId: res.data.user_id.toString(),
      });
    }
    return res.data;
  },
  //google登录, android only
  async googleLogin(
    googleId: string,
    nickName: string,
    avatar: string,
    googleToken: string,
    gender: number,
    diversion_type: number,
  ) {
    let deviceInfo = await AppModule.getDeviceInfo();
    let res = await axios.post('user/register', {
      google_id: googleId,
      nick_name: nickName,
      avatar: avatar,
      login_type: 3,
      google_user_token: googleToken,
      device_id: deviceInfo.device_id,
      advertising_id: deviceInfo.advertising_id,
      appsflyer_id: deviceInfo.appsflyer_id,
      tk: deviceInfo.tk,
      platform: 1,
      gender: gender,
      diversion_type: diversion_type || 0,
    });
    if (res.data && res.data.token) {
      Sentry.setUser({
        id: res.data.user_id,
        username: nickName,
      });
      AppModule.register(res.data);
      await Branch.reportBranchEvent('sign_up', {
        userId: res.data.user_id.toString(),
      });
    }
    return res.data;
  },
  //苹果登录, ios only
  async appleLogin(
    appleId: string,
    nickName: string,
    appleToken: string,
    gender: number,
    diversion_type: number,
  ) {
    let deviceInfo = await AppModule.getDeviceInfo();
    let res = await axios.post('user/register', {
      apple_id: appleId,
      nick_name: nickName,
      login_type: 4,
      apple_token: appleToken,
      device_id: deviceInfo.device_id,
      appsflyer_id: deviceInfo.appsflyer_id,
      tk: deviceInfo.tk,
      platform: 2,
      gender: gender,
      diversion_type: diversion_type,
    });
    if (res.data && res.data.token) {
      Sentry.setUser({
        id: res.data.user_id,
        username: nickName,
      });
      AppModule.register(res.data);
      await Branch.reportBranchEvent('sign_up', {
        userId: res.data.user_id.toString(),
      });
    }
    return res.data;
  },
  //邮箱登录，未使用
  async signUp(email: string, password: string) {
    let deviceInfo = await AppModule.getDeviceInfo();
    let res = await axios.post('user/register', {
      email: email,
      password: password,
      login_type: 2,
      device_id: deviceInfo.device_id,
      advertising_id: deviceInfo.advertising_id,
      appsflyer_id: deviceInfo.appsflyer_id,
      tk: deviceInfo.tk,
    });
    if (res.data && res.data.token) {
      Sentry.setUser({
        id: res.data.user_id,
        email: email,
      });
      AppModule.register(res.data);
    }
    return res.data;
  },
  //个人信息，金币数等
  profile() {
    return axios.post('user/profile');
  },
  // 获取支付方式
  //"source":1 //不传参数为老版本 1:订单支付 2:vip支付
  getPayMethod<T>(source: number): Promise<T> {
    return (axios.post('/pay/method', {
      source: source,
    }) as unknown) as Promise<T>;
  },
  //收货地址
  addressList(): Promise<UserAddressList.RootObject> {
    return (axios.post('user/list/address') as unknown) as Promise<
      UserAddressList.RootObject
    >;
  },
  //添加收货地址
  addAddress(data: AddAddressParams) {
    return (axios.post('user/new/address', data) as unknown) as Promise<
      Address.RootObject & ResponseError
    >;
  },
  //编辑收货地址
  editAddress(data: EditAddressParams) {
    return (axios.post('user/edit/address', data) as unknown) as Promise<
      Address.RootObject & ResponseError
    >;
  },
  //删除收货地址
  delAddress(addressId: number) {
    return axios.post('user/delete/address', {address_id: addressId});
  },
  regionList(region: string) {
    return (axios.post('region/list', {
      region_name: region,
    }) as unknown) as Promise<RegionList.RootObject>;
  },
  /**
   * 订单列表
   * @param page
   * @param type 0 未支付订单， 1 已支付订单， 2 已发货订单, 3 已完成订单, -1 所有订单 -2 最新的未支付
   * @param pageSize
   */
  orderList(page: number, type: number, pageSize = 10) {
    return axios.post('user/order/list/v2', {page, type, page_size: pageSize});
  },
  //创建订单
  newOrder(
    productId: number = 0,
    addressId: number,
    buyType: number,
    auctionId: number,
    wheelReward: number,
    skuInfo: Array<any>,
    qty: number,
    coupon_id: number = 0,
    category_id: number = 0,
    slot_record_id: number = 0,
    use_fast_expenses: number = 0,
    // shipping_method: number = 3,
    order_note: string,
    useScores: number,
    logistics_channel_id: number,
    add_purchase_product_id: number = 0,
  ): Promise<OfferOrderData.RootObject & ResponseError> {
    return (axios.post('user/order/new', {
      product_id: productId,
      user_address_id: addressId,
      buy_type: buyType,
      auction_id: auctionId,
      wheel_reward: wheelReward,
      sku_info: skuInfo,
      qty: qty,
      coupon_id: coupon_id,
      category_id: category_id,
      slot_record_id: slot_record_id,
      use_fast_expenses: use_fast_expenses,
      shipping_method: 4,
      order_note: order_note,
      use_score: useScores,
      logistics_channel_id: logistics_channel_id,
      add_purchase_product_id,
    }) as unknown) as Promise<OfferOrderData.RootObject & ResponseError>;
  },
  // 创建购物车订单
  createCartOrder(
    ids: number[],
    addressId: number,
    couponId: number,
    logistics_channel_id: number,
    // shippingMethod: number,
    useScores: number,
    add_purchase_product_id: number = 0,
    orderNote?: string,
    gift_id?: number,
  ): Promise<CartOrderData.RootObject & ResponseError> {
    return (axios.post('create/cart/order', {
      cart_id_list: ids,
      user_address_id: addressId,
      coupon_id: couponId,
      shipping_method: 4,
      use_score: useScores,
      logistics_channel_id,
      order_note: orderNote,
      gift_id: gift_id,
      add_purchase_product_id,
    }) as unknown) as Promise<CartOrderData.RootObject & ResponseError>;
  },
  //更新订单
  updateOrder(
    orderId: string,
    orderType: number,
    userAddressId: number,
    orderNote?: string,
  ) {
    return axios.post('order/address/update', {
      order_id: orderId,
      order_type: orderType,
      user_address_id: userAddressId,
      order_note: orderNote,
    });
  },
  //竞拍详情页Past Winners接口
  getWinnerList(productId: number, page: number) {
    return axios.post('winner/list', {
      product_id: productId,
      page: page,
    });
  },
  //详情页评论列表
  getCommentList(productId: number, page: number, product_type: number = 0) {
    return axios.post('comment/list', {
      product_id: productId,
      page: page,
      product_type: product_type,
    });
  },
  //评论
  commentSubmit(
    order_no: string,
    content: string,
    scores: number,
    file_list: Array<string>,
    product_type: number = 0,
    product_id: number,
  ) {
    return axios.post('comment/submit', {
      order_no: order_no,
      content: content,
      scores: scores,
      file_list: file_list,
      order_type: product_type,
      product_id: product_id,
    });
  },
  //评论上传图片
  commentUpload(files: Array<any>, cb: (res: object) => {}) {
    axios.postUpload('comment/upload', files, cb);
  },

  // 排行
  allWinner(page: number) {
    return axios.post('winner/all', {
      page: page,
    });
  },
  //竞拍历史
  auctionHistory(page: number) {
    return axios.post('auction/history', {
      page: page,
    });
  },
  //邀请
  getInvite() {
    return axios.post('user/invite/data');
  },
  //填写邀请码
  setInvite(body: object) {
    return axios.post('user/verify/invite', body);
  },
  //消息列表
  userMessage(page: number) {
    return axios.post('user/message', {
      page_name: page,
      page_size: 10,
      version: '1.0',
    });
  },
  //设置推送
  pushSet(auctionId: number, price: number, type: number) {
    return axios.post('push/set', {
      auction_id: auctionId,
      price: price,
      set_type: type,
    });
  },
  //登录状态检查接口,每5秒调用一次
  status() {
    return axios.get('/user/status');
    //1=正常 2=在其他设备登陆了
  },
  //回购
  buyBack(paypal: string, auction_id: number) {
    return axios.post('/auction/buyBack', {
      email: paypal,
      auction_id: auction_id,
    });
  },
  //礼品卡列表
  giftList(page: number) {
    return axios.post('user/gift/list', {
      page: page,
      page_size: 20,
    });
  },
  //领取礼品卡
  getGift(cardId: number) {
    return axios.post('user/gift/get', {
      card_id: cardId,
    });
  },
  //Me页面关注列表
  shareList() {
    return axios.post('auction/share');
  },
  //关注奖励
  shareReward(id: number) {
    return axios.post('auction/share/reward', {
      id: id,
    });
  },
  getFollowList() {
    return axios.post('user/follow/list', {
      version_code: AppModule.versionCode,
    });
  },
  userFollow(id: number) {
    return axios.post('/user/follow', {
      id,
      version_code: AppModule.versionCode,
    });
  },
  orderReceived(orderId: string, orderType: number) {
    return axios.post('user/order/received', {
      order_id: orderId,
      order_type: orderType,
    });
  },
  //订单详情, order_type: 0  竞拍订单， 1 福袋订单
  orderDetail(order_id: string, order_type: number = 0) {
    return axios.post('order/detail', {
      order_id,
      order_type,
    });
  },
  //竞拍提示，每隔一段时间调用一次
  auctionLoop() {
    return axios.post('auction/loop');
  },
  //签到列表
  signin() {
    return axios.post('signin');
  },
  //签到奖励
  signinReward() {
    return axios.post('signin/reward');
  },
  //首页轮播配置接口
  appConfig(app_id: number) {
    return axios.post('user/common/config/v2', {
      app_id: app_id,
      // pkg_ver: AppModule.versionCode,
    });
  },
  //竞拍列表
  auctionList(
    page: number = 1,
    topic_type: number = 0,
    show_model: number = 0,
  ) {
    return axios.post('auction/list', {
      page: page,
      limit: 20,
      topic_type: topic_type,
      show_model: show_model,
    });
  },
  //设置代拍
  autoBid(price: number, auction_id: number, cancel: number = 0) {
    return axios.post('automatic/bid', {
      price: price,
      auction_id: auction_id,
      cancel: cancel,
    });
  },
  //点赞，product type 0  竞拍商品， 1 福袋商品
  like(product_id: number, product_type: number = 0) {
    return axios.post('like/product', {
      product_id,
      product_type,
    });
  },
  likeProductList(page: number) {
    return axios.post('/product/user/like/list', {page, page_size: 10});
  },
  //点赞，product type 0  竞拍商品， 1 福袋商品
  defaultConfig() {
    return axios.post('app/config');
  },
  //反馈
  feedBack(email: string, content: string, images: string, type_id: number) {
    return axios.post('user/feed/back', {
      email: email,
      content: content,
      images: images,
      type_id: type_id,
    });
  },
  //反馈列表
  feedBackList() {
    return axios.post('user/feed/back/list');
  },
  //放弃提示标签
  productTag() {
    return axios.post('product/tag');
  },
  //新用户领取竞拍币
  newUserFrame() {
    return axios.post('new/user/guide/frame');
  },
  //新用户竞拍币领取
  newUserReward() {
    return axios.post('new/user/guide/reward');
  },
  //订阅列表
  subscriptionList() {
    return axios.post('subscript/list');
  },
  //Google订阅
  googleSubscribe(
    product_id: string,
    purchase_token: string,
    order_id: string,
  ) {
    return axios.post('google/subscript', {
      product_id: product_id,
      purchase_token: purchase_token,
      order_id: order_id,
    });
  },
  //Apple订阅
  appleSubscribe(product_id: string, receipt_data: string) {
    return axios.post('ios/subscript', {
      product_id: product_id,
      receipt_data: receipt_data,
    });
  },
  //google订阅状态更新
  googleSubNotify(
    product_id: string,
    purchase_token: string,
    order_id: string,
  ) {
    return axios.post('client/subscript/notify', {
      product_id: product_id,
      purchase_token: purchase_token,
      order_id: order_id,
    });
  },
  //paypal订阅
  paypalSubscribe(product_id: string) {
    return axios.post('paypal/subscription/create', {
      product_id: product_id,
    });
  },
  //会员每日领取竞拍币
  memberReward() {
    return axios.post('member/login/reward');
  },
  //商品问卷
  addProduct(email: string, content: string, token: string) {
    return axios.post('user/want/product', {
      email: email,
      content: content,
      token: token,
    });
  },
  //大转盘
  wheelConfig(auction_id: number, product_id: number) {
    return axios.post('wheel/config', {auction_id, product_id});
  },
  //大转盘
  wheelPlay(auction_id: number) {
    return axios.post('wheel/play', {auction_id});
  },
  //大转盘奖励
  wheelReward(auction_id: number, product_id: number) {
    return axios.post('wheel/reward', {auction_id, product_id});
  },
  //福袋列表
  luckyBagList(page: number = 1, bag_type: number = 0) {
    return axios.post('lucky/bag/list', {
      page: page,
      limit: 20,
      bag_type: bag_type,
    });
  },
  //福袋转盘停的位置
  luckyBagWheelSpin(bag_id: number) {
    return axios.post('lucky/bag/wheel/spin', {bag_id});
  },
  //福袋转盘提示卡使用
  tipsCardConsume(use_tips_card_num: number) {
    return axios.post('user/tips/card/consume', {use_tips_card_num});
  },
  //福袋转盘跑马灯
  luckyBagWheelLoop() {
    return axios.post('lucky/bag/wheel/loop');
  },
  //福袋详情
  luckyBagDetail(bag_id: number) {
    return (axios.post('lucky/bag/detail', {bag_id}) as unknown) as Promise<
      ResponseData<BagProductDetailResponse>
    >;
  },
  //福袋商品信息选择
  luckyBagSku(bag_id: number) {
    return axios.post('lucky/bag/sku', {bag_id});
  },
  //福袋创建订单
  luckyBagOrder(
    bag_id: number,
    user_address_id: number,
    sku_info: OrderDetailData.Skuinfo[] | undefined,
    qty: number,
    coupon_id: number = 0,
    category_id: number = 0,
    slot_record_id: number = 0,
    use_fast_expenses: number = 0,
    // shipping_method: number = 1,
    logistics_channel_id: number,
    order_note: string,
    gift_id: number = 0,
    useScores: number = 0,
    add_purchase_product_id: number = 0,
  ): Promise<BagOrderData.RootObject & ResponseError> {
    return (axios.post('lucky/bag/order', {
      bag_id,
      user_address_id,
      sku_info,
      qty,
      coupon_id,
      category_id,
      slot_record_id,
      use_fast_expenses,
      shipping_method: 4,
      logistics_channel_id,
      order_note,
      gift_id,
      use_score: useScores,
      add_purchase_product_id,
    }) as unknown) as Promise<BagOrderData.RootObject & ResponseError>;
  },
  //福袋预支付
  luckyBagPreCharge(order_id: string) {
    return axios.post('/lucky/bag/pre/charge', {order_id});
  },
  //获取新竞拍数量
  newAuctionCount(topic_type: number) {
    return axios.post('new/auction/count', {topic_type});
  },
  //审核开关，启动APP时调用
  appCheck(version_string: string) {
    return axios.post('app/check/switch', {version_string});
  },
  homeList(page: number, only_one: number) {
    return axios.post('lucky/home/list', {page, only_one});
  },
  homeList2() {
    return axios.post('index/product/list/v2');
  },
  homeProductList(page: number, page_size: number) {
    return axios.post('home/page/data', {
      page,
      version_code: AppModule.versionCode,
      page_size: page_size || 2,
    });
  },

  homeNavBar(): Promise<NavList.RootObject & ResponseError> {
    return (axios.post('home/nav/bar', {
      version_code: AppModule.versionCode,
    }) as unknown) as Promise<NavList.RootObject & ResponseError>;
  },

  productList(category_id: number, page: number = 1, page_size: number) {
    return axios.post('product/list/v2', {
      category_id: category_id,
      limit: 20,
      page: page,
      page_size: page_size,
    });
  },

  //一元购
  onlyOneList(page: number = 1, one_more: number = 0, gender: number) {
    return axios.post('lucky/goods/list', {
      page: page,
      limit: 20,
      goods_type: 1,
      one_more: one_more,
      gender: gender,
      version_code: AppModule.versionCode,
    });
  },

  offersList(page: number = 1, gender: number, goodsType: number) {
    return axios.post('lucky/goods/list/v2', {
      page: page,
      limit: 20,
      goods_type: goodsType,
      gender: gender,
      version_code: AppModule.versionCode,
    });
  },

  //一元购详情
  onlyOneDetail(product_id: number) {
    return (axios.post('lucky/goods/detail', {
      product_id,
    }) as unknown) as Promise<ResponseData<OfferProductDetailResponse>>;
  },

  orderFeedbackList() {
    return axios.post('user/payfail/feedback/list');
  },

  orderFeedback(reason_id: number, order_no: string, order_type: number) {
    return axios.post('user/payfail/feedback', {
      reason_id: reason_id,
      order_no: order_no,
      order_type: order_type,
    });
  },

  //取消订单 0-竞拍，直购订单； 1-福袋订单
  cancelOrder(order_id: string, order_type: number = 0) {
    return axios.post('order/cancel', {
      order_id: order_id,
      order_type: order_type,
    });
  },
  // 获取新手专区商品列表
  newList(bag_mystery_ids: string) {
    return axios.post('lucky/novice/bag/list ', {
      bag_mystery_ids: bag_mystery_ids,
    });
  },

  // 优惠券列表。
  //coupon_status     0:未使用, 1:已使用, 2 : 已过期
  //coupon_type_id    1-6：注册券，7：公码券, 8: 注册折扣券，9：only one
  couponList(
    coupon_status: number,
    coupon_type_id: number,
  ): Promise<CouponList.RootObject> {
    return (axios.post('user/coupon/list', {
      coupon_status: coupon_status,
      coupon_type_id: coupon_type_id,
    }) as unknown) as Promise<CouponList.RootObject & ResponseError>;
  },

  couponCenterList(coupon_status: number) {
    return axios.post('user/coupon/group/list', {
      coupon_status: coupon_status,
    });
  },

  //直购配置
  offerConfig() {
    return axios.post('lucky/offers/config');
  },

  //搜索关键字
  searchKeys() {
    return axios.post('product/search/keyword');
  },

  searchLenovoWord(key_word: string) {
    return axios.post('search/lenovo/word', {
      key_word: key_word,
    });
  },
  //搜索结果
  searchResult(
    page: number,
    key_word: string,
    token: string,
    sort: number,
    one_item_id: number,
    twoItemId: number,
    threeItemId: number,
  ) {
    return (axios.post('product/search', {
      page: page,
      limit: 20,
      version_code: AppModule.versionCode,
      token: token,
      key_word: key_word,
      one_item_id: one_item_id,
      two_item_id: twoItemId,
      three_item_id: threeItemId,
      sort: sort,
    }) as unknown) as Promise<SearchResult.RootObject & ResponseError>;
  },
  /**
   * 搜索排行榜
   * @param page
   * @param page_size  10/20
   * @param token
   */
  searchRankList(page: number, page_size: number, token: string) {
    return axios.post('search/rank/product/list', {
      page: page,
      page_size: page_size,
      version_code: AppModule.versionCode,
      token: token,
    });
  },

  //老虎机描述
  slotConfig() {
    return axios.post('slot/config');
  },
  //老虎机转动接口
  slotPlay() {
    return axios.post('slot/play');
  },
  //老虎机中奖列表
  slotList(page: number) {
    return axios.post('slot/record/list', {
      page: page,
      page_size: 20,
    });
  },

  //黑色惊喜
  blackSurprise(token: string) {
    return axios.post('black/friday/surprise/list', {
      token: token,
    });
  },
  //黑色弹窗
  blackSurpriseShare(type: number) {
    return axios.post('black/friday/surprise/share', {
      type: type,
    });
  },
  // 获取剩余抽奖次数
  getLotteryTimes() {
    return axios.post('lottery/coupon/times', {
      version_code: AppModule.versionCode,
    });
  },
  // 抽奖
  submitLottery() {
    return axios.post('lottery/coupon/submit', {
      version_code: AppModule.versionCode,
    });
  },
  // 会员首页
  vipPage() {
    return axios.post('vip/page');
  },
  //获取大转盘抽奖价格与次数
  vipWheelTimes() {
    return axios.post('add/vip/wheel/times');
  },
  //创建VIP订单
  vipOrderCreate(wheel_id: number, payment_method: number) {
    return axios.post('create/vip/order', {
      wheel_id: wheel_id,
      payment_method: payment_method,
    });
  },
  //paypal回调
  vipOrderNotify(transaction_id: string, success: string) {
    return axios.post('vip/order/paypal/notify', {
      transaction_id: transaction_id,
      success: success,
    });
  },
  //会员优惠券列表
  vipList() {
    return axios.post('vip/coupons/center');
  },
  //领取会员优惠券
  getCounpons(config_id: number) {
    return axios.post('vip/receive/coupons', {config_id: config_id});
  },
  //会员订单详情
  vipOrderDetail(order_no: string) {
    return axios.post('vip/order/detail', {order_no: order_no});
  },

  //推荐列表
  recommendList(page: number, product_id: number, limit: number) {
    return axios.post('recommend/product', {
      page: page,
      limit: limit,
      version_code: AppModule.versionCode,
      product_id: product_id,
    });
  },
  /**
   * 福袋推荐列表
   * @param page
   * @param bag_id
   * @param limit
   */
  recommendBagList(page: number, bag_id: number, limit: number) {
    return axios.post('recommend/bag', {
      page: page,
      limit: limit,
      version_code: AppModule.versionCode,
      bag_id: bag_id,
    });
  },
  //获取一元购路由
  productRoute(category_id: number) {
    return axios.post('product/category/item', {
      category_id: category_id,
    });
  },

  //app 进入前后台
  //opt_type  0 进入， 1 退出
  appActiveState(opt_type: number) {
    return axios.post('quit/app', {
      opt_type: opt_type,
    });
  },
  //获取vip商品
  vipProduct() {
    return axios.post('lucky/vip/product');
  },
  //vip 商品提交
  vipProductSubmit(id: number) {
    return axios.post('lucky/vip/product/submit', {product_id: id});
  },
  //销量最高的产品分页列表
  fetchBestSellList(page: number, pageSize: number) {
    return axios.post('best/sell/list', {
      page: page,
      page_size: pageSize || 20,
    });
  },

  /**
   * 获取公共信息
   * {
    "code": 0,
    "data": {
        "vip_product_category_id": 123,
        "is_in_bucket":true  //是否在桶里 true 是 false 否
    }
}
   */
  commonParams() {
    return axios.post('common/page');
  },
  // 订单确认页 更新商品价格
  updateOrderConfirmInfo(
    product_id: number,
    product_type: number,
    qty: number,
    sku_info: any,
    use_fast_expenses: number,
    gift_id: number,
    use_score: number = 0,
    coupon_id: number = 0,
    // shipping_method: number,
    logistics_channel_id: number = 0, //物流方式，默认为0
    add_purchase_product_id: number,
    pub_code?: string,
  ): Promise<UserOrderConfirm.RootObject> {
    return (axios.post('user/order/confirm', {
      product_id,
      product_type,
      qty,
      sku_info,
      use_fast_expenses,
      gift_id,
      use_score,
      coupon_id,
      shipping_method: 4,
      logistics_channel_id,
      add_purchase_product_id,
      pub_code,
    }) as unknown) as Promise<UserOrderConfirm.RootObject>;
  },

  // 订单确认页 更新商品价格
  updateOrderConfirmInfo1(params: UserOrderConfirmRequest) {
    return (axios.post('user/order/confirm', params) as unknown) as Promise<
      ResponseData<UserOrderConfirmResponse>
    >;
  },

  // 更新订单确认页购物车拆单结果
  updateCartConfirmInfo(
    cart_id_list: number[],
    coupon_id: number,
    logistics_channel_id: number = 0,
    // shipping_method: number,
    gift_id: number,
    use_score: number = 0,
    add_purchase_product_id: number,
    pub_code: string | undefined,
  ): Promise<CartOrderConfirm.RootObject> {
    return (axios.post('user/cart/confirm', {
      cart_id_list,
      coupon_id,
      logistics_channel_id,
      shipping_method: 4,
      gift_id,
      use_score,
      add_purchase_product_id,
      pub_code,
    }) as unknown) as Promise<CartOrderConfirm.RootObject>;
  },

  updateCartConfirmInfo1(params: UserCartConfirmRequest) {
    return (axios.post('user/cart/confirm', params) as unknown) as Promise<
      ResponseData<UserCartConfirmResponse>
    >;
  },
  // 获取  新人优惠券
  newsCouponList(come_from: string) {
    return axios.post('register/coupon/list', {come_from: come_from || ''});
  },
  // 获取  优惠券弹框列表
  dialogCouponList() {
    return (axios.post('coupon/market/config') as unknown) as Promise<
      ResponseData<CouponMarketRewardResponse>
    >;
  },
  // 领取  优惠券弹框列表
  getCouponList(params: CouponMarketReward) {
    return (axios.post('coupon/market/reward', params) as unknown) as Promise<
      ResponseData<CouponMarketRewardResponse>
    >;
  },

  /**
   * faq 列表
   */
  helpQuestionList(page: number, page_size: number = 20) {
    return axios.post('faq/list', {
      page,
      page_size,
    });
  },

  /**
   * faq 答案
   * @param id  问题ID
   */
  helpAnswer(id: number) {
    return axios.post('faq/answer', {
      id: id,
    });
  },
  /**
   * 领券
   * @param public_code 公码
   */
  submitCodeCoupon(public_code: string) {
    return axios.post('apply/coupon', {
      public_code: public_code,
      version_code: AppModule.versionCode,
      bundle_code: AppModule.getActiveBundleVersion(),
    });
  },

  /**
   * 公码优惠券 配置信息
   */
  codeCouponConfig() {
    return axios.post('apply/coupon/config', {
      version_code: AppModule.versionCode,
      bundle_code: AppModule.getActiveBundleVersion(),
    });
  },

  // 商品默认获取一条可用优惠券
  productCoupon(product_id: number, product_type: number) {
    return axios.post('available/max/coupons', {
      product_id,
      product_type,
    });
  },

  /**
   * 根据优惠码 领取优惠券
   * @param coupon_code 优惠码
   */
  rewardCouponByCode(coupon_code: string) {
    return axios.post('coupon/by/code', {
      code: coupon_code,
    });
  },

  /**
   * 根据优惠码获取详情
   * @param coupon_code
   */
  couponDetail(coupon_code: string) {
    return axios.post('coupon/config/detail', {
      code: coupon_code,
    });
  },
  /**
   * 修改用户信息
   */
  updateUserInfo(user_name: string, email: string, gender: number) {
    return axios.post('update/user/info', {
      user_name: user_name,
      email: email,
      gender: gender,
    });
  },
  /**
   * 订单详情v2
   */
  orderDetailV2(order_no: string): Promise<OrderDetailData.RootObject> {
    return (axios.post('order/detail/v2', {
      order_no: order_no,
    }) as unknown) as Promise<OrderDetailData.RootObject>;
  },

  /**
   * 订单详情商品加入购物车
   */
  buyAgain(parent_order_no: number, sub_order_no: number) {
    return axios.post('buy/again', {
      sub_order_no: sub_order_no,
      parent_order_no: parent_order_no,
    });
  },
  /**
   * 退款初始化
   */
  refundConfig(order_no: string) {
    return axios.post('refund/reason/config', {
      order_no: order_no,
    });
  },
  /**
   * 执行退款
   */
  refundOrder(
    order_no: string,
    type: number,
    refund_type: number,
    refund_reason_id: number,
    refund_other_reason: string,
  ) {
    return axios.post('order/refund', {
      order_no: order_no,
      type: type,
      refund_type: refund_type,
      refund_reason_id: refund_reason_id,
      refund_other_reason: refund_other_reason,
    });
  },
  /**
   * 购物车列表
   */
  cartList() {
    return (axios.post('user/cart/list', {
      page: 1,
    }) as unknown) as Promise<ResponseData<UserCartListResponse>>;
  },

  /**
   * @param product_id int    商品id
   * @param product_type nt
   //0 竞拍, 1 福袋商品, 2 直购商品, 3 超级福袋,4会员商品
   * @param product_sku array    [{"sku_key":"color","sku_value":"type 1 Grey"}]
   * @param price_key  string sku价格key
   * @param qty int    数量
   * @param category_id  int    分类
   * @param price
   * @param itemId 当前商品在分类中的三级id
   */
  addToCart(
    product_id: number,
    product_type: number,
    product_sku: any,
    price_key: string,
    qty: number,
    category_id: number,
    price: number,
    itemId: number,
  ) {
    return (axios.post('user/cart/add', {
      product_id,
      product_type,
      product_sku,
      price_key,
      qty,
      category_id,
      price,
      item_id: itemId,
    }) as unknown) as Promise<AddToCart.RootObject & ResponseError>;
  },

  /**
   * @param cart_id  购物车id
   * @param operation_type 操作类型 0 ：修改数量， 1：删除单个商品， 2：删除所有过期， 3：清空购物车
   * @param qty 操作数量， 正数=加、负数=减
   */
  cartEdit(cart_id: number, operation_type: number, qty: number) {
    return axios.post('user/cart/edit', {
      cart_id,
      operation_type,
      qty,
    });
  },

  /**
   * 购物车商品数量，登陆后调用才可以
   */
  cartNum() {
    return axios.post('user/cart/num');
  },

  /**
   * 批量增加心愿单
   * @param list
   */
  cartMoveToWishList(list: any) {
    return axios.post('like/product/more', {
      list,
    });
  },

  /**
   * 反馈原因列表
   */
  feedBackTypeList() {
    return axios.post('user/feed/back/type');
  },

  faqList(version_string: string, faq_type: number) {
    return axios.post('customer/faq/list', {
      version_string,
      faq_type,
    });
  },

  faqTypes() {
    return axios.post('customer/faq/type');
  },

  homeNoticeList() {
    return axios.post('home/page/notice');
  },
  /**
   * 商品分类接口---一级目录接口
   * @param list
   */
  categoryTopList() {
    return (axios.post('commodity/category/top') as unknown) as Promise<
      CategoryTopList.RootObject & ResponseError
    >;
  },
  /**
   * 商品分类接口---二级目录接口
   * @param list
   */
  categoryInfo(top_item_id: number) {
    return (axios.post('commodity/category/info', {
      top_item_id: top_item_id,
    }) as unknown) as Promise<CategoryTwoList.RootObject & ResponseError>;
  },
  newBagGiftList(page: number) {
    return axios.post('free/gift/list', {page: page});
  },
  /**
   * 凑单API 配置
   * @param token
   */
  cartAddItemsConfig(token: string) {
    return axios.post('add/items/config', {
      token: token,
    });
  },

  /**
   * 凑单API 列表
   * @param id
   * @param token
   * @param page
   */
  cartAddItemsList(id: number, token: string, page: number) {
    return (axios.post('add/items/list', {
      id: id,
      token: token,
      page: page,
      limit: 20,
    }) as unknown) as Promise<ResponseData<ProductCartAddItemResponse>>;
  },

  faqOrderPushServer(userId: number, orderNo: string) {
    return axios.post('customer/user/info', {
      version_string: AppModule.versionName,
      select_type: 1,
      user_id: userId,
      order_no: orderNo,
    });
  },

  /**
   * 返回退款列表
   * @param sub_order_no order no of sub order
   */
  refundChooseProduct(orderNo: string) {
    return axios.post('refund/choose/products', {sub_order_no: orderNo});
  },

  /**
   * 退款初始化v2
   * @param lucky_order_product_id product id
   */
  refundReasonConfigV2(product_id: number) {
    return axios.post('refund/reason/config/v2', {
      lucky_order_product_id: product_id,
    });
  },

  /**
   * 发起退款v2
   * @param lucky_order_product_id product id
   */
  refundOrderV2(
    product_ids: string,
    action: number,
    refund_type: number,
    reason_id: number,
    other_reason: string,
  ) {
    return axios.post('refund/order/v2', {
      lucky_order_product_id: product_ids,
      type: action,
      refund_type: refund_type,
      refund_reason_id: reason_id,
      refund_other_reason: other_reason,
    });
  },

  /**
   * 复活节赠品 列表
   * @param activity_id
   */
  activityGiftList(activity_id: number) {
    return (axios.post('activity/gift/list', {
      activity_id: activity_id,
    }) as unknown) as Promise<EasterGiftList.RootObject & ResponseError>;
  },
  /**
   * 复活节砸蛋提交
   * @param activity_id
   */
  activityEggSubmit(activity_id: number) {
    return (axios.post('activity/egg/submit', {
      activity_id: activity_id,
    }) as unknown) as Promise<EasterGiftSubmit.RootObject & ResponseError>;
  },
  // event list, check event type to determine which event
  activityList() {
    return axios.post('activity/list', {});
  },
  /**
   * 明牌福袋列表
   * @param
   */
  activityBagList() {
    return axios.post('activity/bag/list');
  },
  /**
   * 明牌福袋详情
   * @param
   */
  activityBagDetail(id: number) {
    return (axios.post('activity/bag/detail', {id: id}) as unknown) as Promise<
      MysteryGame.RootObject & ResponseError
    >;
  },

  /**
   * 明牌福袋加入购物车
   * @param
   */
  activityBagCart(gift_id: number, product_sku: []) {
    return axios.post('activity/bag/cart', {
      gift_id: gift_id,
      product_sku: product_sku,
    });
  },
  /**
   * 明牌福袋中奖列表
   * @param
   */
  activityBagReward(id: number) {
    return (axios.post('activity/bag/reward', {id: id}) as unknown) as Promise<
      MysteryGame.RootObject & ResponseError
    >;
  },
  /**
   *明牌福袋抽奖
   * @param
   */
  activityBagSubmit(id: number) {
    return axios.post('activity/bag/submit', {id: id});
  },
  /**
   *加价购商品列表
   * @param
   */
  addPurchaseProductList(page: number) {
    return (axios.post('add/purchase/product/list', {
      page: page,
      page_size: 10,
    }) as unknown) as Promise<AddPurchaseList.RootObject & ResponseError>;
  },
  /**
   *加价购商品想去
   * @param
   */
  addPurchaseProductDetail(product_id: number) {
    return (axios.post('add/purchase/product/detail', {
      product_id: product_id,
    }) as unknown) as Promise<AddPurchaseDetail.RootObject & ResponseError>;
  },
  /**
   *email 登录
   * @param
   */
  emailLogin(email: string, pass_word: string) {
    return axios.post('user/login/email', {
      email: email,
      pass_word: pass_word,
    });
  },
  /**
   *活动商品列表
   * @param
   */
  activityProductList(activity_id: number, page: number) {
    return (axios.post('activity/product/list', {
      activity_id,
      page,
      page_size: 20,
    }) as unknown) as Promise<ResponseData<LuckyActivityProductListResponse>>;
  },

  /**
   *
   *  policy 配置列表
   */
  policyList() {
    return (axios.post('policy/config/list') as unknown) as Promise<
      PolicyConfig.RootObject & ResponseError
    >;
  },

  /**
   *
   *  policy 配置详情
   */
  policyDetail(id: number) {
    return (axios.post('policy/config/detail', {id: id}) as unknown) as Promise<
      PolicyContentData.RootObject & ResponseError
    >;
  },

  ////新首页4.2接口
  //首页导航
  mHomeNav() {
    return (axios.post('app/nav') as unknown) as Promise<
      MHomeNavApi.RootObject & ResponseError
    >;
  },
  //首页 活动配置、banner、推荐商品
  mHomeIndex() {
    return (axios.post('app/home/index') as unknown) as Promise<
      MHomeIndexApi.RootObject & ResponseError
    >;
  },
  //首页 盲盒福袋配置列表
  mHomemySteryBoxes() {
    return (axios.post('app/home/mystery/boxes') as unknown) as Promise<
      MHomeMysteryBoxesApi.RootObject & ResponseError
    >;
  },
  //首页 热销配置列表
  mBestGoodsList(page: number) {
    return (axios.post('app/best/goods/list', {
      page,
      page_size: 10,
    }) as unknown) as Promise<MBestGoodsListApi.RootObject & ResponseError>;
  },
  //首页 商品列表
  mGoodsList(id: number, page: number) {
    return (axios.post('app/goods/list', {
      id,
      page,
      page_size: 10,
    }) as unknown) as Promise<MGoodsListApi.RootObject & ResponseError>;
  },
  // 商品列表
  mCategoryProductList(
    item_id: number,
    item_level: number,
    item_type: number,
    page: number,
  ) {
    return (axios.post('app/category/product/list', {
      item_id,
      item_level,
      item_type,
      page,
      page_size: 10,
    }) as unknown) as Promise<
      MCategoryProductListApi.RootObject & ResponseError
    >;
  },
  //首页 商品列表
  mHomeCategoryList() {
    return (axios.post('app/home/category/list') as unknown) as Promise<
      HomeCategoryListApi.RootObject & ResponseError
    >;
  },
  //限时折扣配置
  flashSalesConfig() {
    return (axios.post('flash/sales/config') as unknown) as Promise<
      FlashConfigApi.RootObject & ResponseError
    >;
  },
  //限时折扣商品列表
  flashSalesProductList(cate_id: number, page: number, session_id: number) {
    return (axios.post('flash/sales/product/list', {
      cate_id,
      page,
      session_id,
      page_size: 10,
    }) as unknown) as Promise<FlashProductListApi.RootObject & ResponseError>;
  },
  // policy 配置列表
  policyConfigList() {
    return (axios.post('policy/config/list') as unknown) as Promise<
      ResponseData<PolicyConfigListResponse>
    >;
  },
  // policy 配置详情
  policyConfigDetail(id: number) {
    return (axios.post('policy/config/detail', {id}) as unknown) as Promise<
      ResponseData<PolicyConfigDetailResponse>
    >;
  },
  // 购物车页面推荐列表
  cartPageRecommend(page: number, size: number) {
    return (axios.post('cart/page/recommend', {
      page,
      page_size: size,
    }) as unknown) as Promise<ResponseData<CartPageRecommendResponse>>;
  },
  getAvailableCoupons(params: UserAvailableCouponsRequest) {
    return (axios.post('user/available/coupons', params) as unknown) as Promise<
      ResponseData<UserAvailableCouponsResponse>
    >;
  },
  receiveCoupons(params: UserUserReceiveCouponsRequest) {
    return (axios.post('user/receive/coupon', params) as unknown) as Promise<
      ResponseData<UserUserReceiveCouponsResponse>
    >;
  },
};
