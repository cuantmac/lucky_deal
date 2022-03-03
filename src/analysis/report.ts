import {BranchEvent} from 'react-native-branch';
import {analysis} from './analysis';
import {
  REPORT_FROM_PAGE_ENUM,
  REPORT_PAY_METHOD_ENUM,
  REPORT_BRANCH_PAY_STATUS_ENUM,
  REPORT_PAY_ORDER_SOURCE_ENUM,
  REPORT_RECOMMEND_TYPE_ENUM,
  REPORT_PAY_STATUS_ENUM,
} from './reportEnum';

interface DealProPagePathParams {
  Frompage: REPORT_FROM_PAGE_ENUM;
}

type DealProBase = DealProPagePathParams;

export const dealProPath = analysis.createPath<DealProPagePathParams>();
// DealPro 会员页-曝光
export const dealProShow = analysis.createShowReporter<DealProBase>(
  '21',
  '197',
);

// DealPro 会员页购买按钮-点击
export const dealProBuyProClick = analysis.createClickReporter<DealProBase>(
  '21',
  '198',
);

// DealPro 会员价格抽奖页面-曝光
export const dealProWheelShow = analysis.createShowReporter<DealProBase>(
  '21',
  '199',
);

// DealPro 会员价格抽奖转动按钮-点击
export const dealProWheelBtnClick = analysis.createClickReporter<DealProBase>(
  '21',
  '200',
);

// DealPro 会员价格抽奖结果弹窗-曝光
export const dealProWheelResultShow = analysis.createShowReporter<DealProBase>(
  '21',
  '201',
);

type DealProPayBtnClickParams = DealProBase & {
  PayMethod: REPORT_PAY_METHOD_ENUM;
};
// DealPro 会员价格抽奖结果弹窗付费按钮-点击
export const dealProPayBtnClick = analysis.createClickReporter<
  DealProPayBtnClickParams
>('21', '202');

// DealPro 会员价格抽奖结果弹窗-关闭
export const dealProWheelResultClose = analysis.createCloseReporter<
  DealProBase
>('21', '203');

// DealPro 会员购买成功弹窗-曝光
export const dealProBuySuccessModalShow = analysis.createShowReporter<
  DealProBase
>('21', '204');

// DealPro 会员购买成功弹窗-关闭
export const dealProBuySuccessModalClose = analysis.createCloseReporter<
  DealProBase
>('21', '205');

// DealPro 会员购买成功页面-曝光
export const dealProSuccessPageShow = analysis.createShowReporter<DealProBase>(
  '21',
  '206',
);

// 	DealPro 会员购买成功页面再次购买按钮-点击
export const dealProBuyAgainClick = analysis.createClickReporter<DealProBase>(
  '21',
  '207',
);

// DealPro 会员购买成功页面优惠券-点击
type DealProSuccessCouponsClickParmas = DealProBase & {ProCoupon: string};
export const dealProSuccessCouponsClick = analysis.createClickReporter<
  DealProSuccessCouponsClickParmas
>('21', '208');

// 点击获得免费会员
export const dealProGetFreeVipClick = analysis.createClickReporter<DealProBase>(
  '21',
  '251',
);
// 免费获得2天会员弹窗展示
export const dealProFreeModalShow = analysis.createShowReporter<DealProBase>(
  '21',
  '252',
);
// 免费获得2天会员弹窗展购买1单按钮点击
export const dealProFreeModalBuyClick = analysis.createClickReporter<
  DealProBase
>('21', '253');
//免费获得2天会员弹窗直接购买会员按钮点击
export const dealProModalBuyClick = analysis.createClickReporter<DealProBase>(
  '21',
  '254',
);
// 免费获得2天会员弹窗关闭
export const dealProFreeModalClose = analysis.createCloseReporter<DealProBase>(
  '21',
  '255',
);

type DealProProductParams = DealProBase & {
  CategoryId: number;
  ProductId: number;
  PageStation: number;
  ProdStation: number;
  ShowType: string;
};
// 会员页商品列表曝光
export const dealProProductShow = analysis.createShowReporter<
  DealProProductParams
>('21', '256');

// 会员页商品列表商品点击
export const dealProProductClick = analysis.createClickReporter<
  DealProProductParams
>('21', '257');

// DealPro 会员独立页顶部返回按钮-点击
export const dealProBackClick = analysis.createClickReporter<DealProBase>(
  '21',
  '264',
);

/**
 * 首页新人优惠券弹窗
 */
// home 新人优惠券弹框-曝光
export const newsDiaShow = analysis.createShowReporter('2', '265');
// home 新人优惠券弹框点击领取-点击
export const newsDiaClick = analysis.createClickReporter('2', '266');
// home 新人优惠券弹框点击关闭-点击
export const newsDiaClose = analysis.createCloseReporter('2', '267');

/**
 * 首页优惠券弹窗
 */
// home 优惠券弹框-曝光
export const homeCouponDiaShow = analysis.createShowReporter('2', '270');
// home 优惠券弹框点击领取-点击
export const homeCouponDiaClick = analysis.createClickReporter('2', '272');
// home 新人优惠券弹框点击关闭-点击
export const homeCouponDiaClose = analysis.createCloseReporter('2', '271');

/**
 * 订单确认页
 */
type DeliverParams = {
  CategoryId: number;
  ProductId: number;
  CateStation: number;
  AuctionId: number;
};

type PayPathParams = {
  CategoryId: number;
  CateStation: number;
  ProductId: string;
  RecommendType: REPORT_RECOMMEND_TYPE_ENUM;
  FromPage: string;
  PayMethod: number;
  OrderId: string;
  ChildOrderID: string;
  OrderSource: REPORT_PAY_ORDER_SOURCE_ENUM;
  PayState: REPORT_PAY_STATUS_ENUM;
  ProductCat: number | string;
  UseCredit: number;
  ShippingId: number;
  Version: string;
  AddProductId: number; //加价购商品id
};
// 记录订单确认页打点数据
export const payPath = analysis.createPath<PayPathParams>();

// 订单确认页-曝光
export const payShow = analysis.createShowReporterWithPath<PayPathParams>(
  '5',
  '55',
  payPath,
  [
    'CategoryId',
    'CateStation',
    'ProductId',
    'RecommendType',
    'FromPage',
    'ProductCat',
  ],
);

// 添加地址点击
export const payAddAddressClick = analysis.createClickReporterWithPath<
  PayPathParams
>('5', '56', payPath, ['CategoryId', 'CateStation', 'ProductId', 'ProductCat']);

// 编辑地址点击
export const payEditAddressClick = analysis.createClickReporterWithPath<
  PayPathParams
>('5', '57', payPath, ['CateStation', 'CategoryId', 'ProductId', 'ProductCat']);

// 购买会员模块点击
export const payBuyVipClick = analysis.createClickReporterWithPath<
  PayPathParams
>('5', '58', payPath, ['CategoryId', 'CateStation', 'ProductId', 'ProductCat']);

// 支付按钮点击
export const payContinueClick = analysis.createClickReporterWithPath(
  '5',
  '59',
  payPath,
  [
    'CategoryId',
    'CateStation',
    'ProductId',
    'PayMethod',
    'FromPage',
    'RecommendType',
    'ProductCat',
    'Version',
  ],
);

// 退出确认弹窗-展现
export const payBackTipModalShow = analysis.createShowReporterWithPath<
  PayPathParams
>('5', '60', payPath, ['CategoryId', 'CateStation', 'ProductId', 'ProductCat']);

// 退出确认弹窗关闭
export const payBackTipModalClose = analysis.createCloseReporterWithPath<
  PayPathParams
>('5', '62', payPath, ['CateStation', 'CategoryId', 'ProductId', 'ProductCat']);

// 商品数量点击修改
export const payProductCountClick = analysis.createClickReporterWithPath<
  PayPathParams
>('3', '29', payPath, ['CategoryId', 'CateStation', 'ProductId', 'ProductCat']);

// 支付方式选择点击
export const paySelectPayMethodClick = analysis.createClickReporterWithPath<
  PayPathParams
>('5', '136', payPath, [
  'CategoryId',
  'CateStation',
  'ProductId',
  'PayMethod',
  'ProductCat',
]);

// 订单支付， 编辑地址按钮点击
export const payOrderEditAddressClick = analysis.createClickReporterWithPath<
  PayPathParams
>('14', '138', payPath, [
  'CategoryId',
  'CateStation',
  'ProductId',
  'ProductCat',
]);

// 点击申请优惠券
export const payApplyCouponClick = analysis.createClickReporterWithPath<
  PayPathParams
>('6', '283', payPath, [
  'CategoryId',
  'CateStation',
  'ProductId',
  'ProductCat',
]);

// 订单支付状态
export const payStatusGeneral = analysis.createGeneralReporterWithPath<
  PayPathParams
>('5', '156', payPath, [
  'CategoryId',
  'CateStation',
  'FromPage',
  'PayMethod',
  'PayState',
  'RecommendType',
  'ChildOrderID',
  'OrderSource',
  'OrderId',
  'ProductCat',
  'UseCredit',
  'ProductId',
  'Version',
]);

// pay 选择物流-点击-点击
export const payDeliverClick = analysis.createClickReporterWithPath<
  PayPathParams
>('5', '476', payPath, [
  'CategoryId',
  'CateStation',
  'ProductId',
  'ProductCat',
  'Version',
  'ProductCat',
  'ShippingId',
]);
// pay 选择加价购商品-点击
export const payAddBuyClick = analysis.createClickReporterWithPath<
  PayPathParams
>('5', '477', payPath, [
  'CategoryId',
  'CateStation',
  'ProductId',
  'Version',
  'ProductCat',
  'AddProductId',
]);
// pay 加价购商品点击更多-点击
export const payAddBuyMoreClick = analysis.createClickReporterWithPath<
  PayPathParams
>('5', '478', payPath, ['ProductId', 'Version']);
// pay 加价购商品列表-显示
export const payAddBuyListShow = analysis.createShowReporterWithPath<
  PayPathParams
>('5', '479', payPath, ['ProductId', 'Version']);
// pay 加价购商品列表选择加购点击-点击
export const payAddBuyListClick = analysis.createClickReporterWithPath<
  PayPathParams
>('5', '480', payPath, ['ProductId', 'Version', 'AddProductId']);

// pay 选择敏感货物流-点击-点击
// export const payFreeDeliverClick = analysis.createClickReporterWithPath<
//   PayPathParams
// >('5', '345', payPath, [
//   'CategoryId',
//   'CateStation',
//   'ProductId',
//   'ProductCat',
// ]);

// // pay 选择快速物流-点击-点击
// export const payFastDeliverClick = analysis.createShowReporterWithPath<
//   PayPathParams
// >('5', '269', payPath, [
//   'CategoryId',
//   'CateStation',
//   'ProductId',
//   'ProductCat',
// ]);

// 点击code coupon
export const paySelectCouponClick = analysis.createClickReporterWithPath<
  PayPathParams
>('6', '284', payPath, [
  'CategoryId',
  'CateStation',
  'ProductId',
  'ProductCat',
]);

// pay 选择普通物流-点击-点击
export const commonDeliverClick = analysis.createClickReporter<DeliverParams>(
  '5',
  '268',
);
// pay 选择快速物流-点击-点击
export const fastDeliverClick = analysis.createClickReporter<DeliverParams>(
  '5',
  '269',
);

/**
 * me 页面打点
 */
// me 点击编辑Profile-点击
export const meProfileClick = analysis.createClickReporter('10', '285');
// me 点击编辑Profile-展示
export const meProfileShow = analysis.createShowReporter('10', '286');
// me 点击添加邮箱信息-点击
export const meEmailEdit = analysis.createClickReporter('10', '287');
// me 点击Profile保存-点击
export const meProfileSave = analysis.createClickReporter('10', '288');
// me 领取填写邮箱优惠券奖励弹窗展示-展示
export const meCouponShow = analysis.createShowReporter('10', '289');
// me 点击领取优惠券-点击
export const meCouponGet = analysis.createClickReporter('10', '290');
// me 点击领取优惠券-关闭
export const meCouponClose = analysis.createCloseReporter('10', '291');

/**
 * branch 营销 打点
 */
type BranchMarketType = {H5PageID: string; H5ProductID: string};
export const branchMarketPath = analysis.createPath<BranchMarketType>();

// 通过branch 链接打开 app
export const branchAppShow = analysis.createBranchRepoter<BranchMarketType>(
  'APP_Open',
);

// 商品详购买按钮曝光
export const branchProductDetailBuyNowShow = analysis.createBranchRepoter<
  BranchMarketType
>('APP_ProductDetail_BuyNow_Show');

// 商品详情页Buy now按钮点击
export const branchProductDetailBuyNowClick = analysis.createBranchRepoter<
  BranchMarketType
>('APP_ProductDetail_BuyNow_Click');

// 订单确认页曝光
export const branchOrderConfirmShow = analysis.createBranchRepoter<
  BranchMarketType
>('APP_PayNow_Show');

// 订单确认页-支付按钮Continue点击
export const branchOrderConfirmContinueClick = analysis.createBranchRepoter<
  BranchMarketType
>('APP_PayNow_ContinueButton_Click');

// 订单确认页-支付状态
type BranchOrderConfirmStatusGeneralParams = {
  OrderID: string;
  PayState: REPORT_BRANCH_PAY_STATUS_ENUM;
} & BranchMarketType;
export const branchOrderConfirmStatusGeneral = analysis.createBranchRepoter<
  BranchOrderConfirmStatusGeneralParams
>('APP_Order_Status');

// 订单确认页-支付状态 成功
export const branchOrderConfirmStatusGeneralSuccess = analysis.createBranchRepoter<
  BranchOrderConfirmStatusGeneralParams
>('APP_Order_Status_Success');

// 订单确认页-支付状态 失败
export const branchOrderConfirmStatusGeneralFail = analysis.createBranchRepoter<
  BranchOrderConfirmStatusGeneralParams
>('APP_Order_Status_Failure');

// 购买完成打点
type BranchPaySuccessStatusParams = {
  transaction_id: string; // 订单id
  currency: string; //币种
  revenue: number; // 收益
  shipping: number; // 运费
  tax: number; // 税费
  coupon: string; // 优惠券
  affiliation: string;
  description: string;
  purchase_loc: string;
  store_pickup: string;
};
export const branchPaySuccessStatus = analysis.createBranchRepoter<
  BranchPaySuccessStatusParams
>(BranchEvent.Purchase);

/**
 * 商品分类列表页详情页
 */
interface CategoryDetailParams {
  ProductCat: number;
  ProductId: number;
  PageStation: number;
  ShowType: number;
  ProdStation: number;
}

// 记录商品分类详情页打点
export const categoryDetailPath = analysis.createPath<CategoryDetailParams>();
// 商品分类详情页 展示
export const categoryDetailShow = analysis.createShowReporterWithPath<
  CategoryDetailParams
>('25', '373', categoryDetailPath, ['ProductCat']);
// 商品分类详情页滑动
export const categoryDetailSlide = analysis.createClickReporterWithPath<
  CategoryDetailParams
>('25', '374', categoryDetailPath, ['ProductCat']);
// 商品分类详情页 商品展示
export const categoryDetailProductShow = analysis.createShowReporterWithPath<
  CategoryDetailParams
>('25', '375', categoryDetailPath, [
  'ProductCat',
  'ProductId',
  'ShowType',
  'PageStation',
  'ProdStation',
]);
// 商品分类详情页 商品点击
export const categoryDetailProductClick = analysis.createClickReporterWithPath<
  CategoryDetailParams
>('25', '376', categoryDetailPath, [
  'ProductCat',
  'ProductId',
  'PageStation',
  'ProdStation',
]);
// 商品分类详情页滑动
export const categoryDetailSortClick = analysis.createClickReporterWithPath<
  CategoryDetailParams
>('25', '377', categoryDetailPath, ['ProductCat']);
// 商品分类详情页滑动
export const categoryDetailSortItemClick = analysis.createClickReporterWithPath<
  CategoryDetailParams
>('25', '378', categoryDetailPath, ['ProductCat']);
// 商品分类详情页滑动
export const categoryDetailThiredCategorySlide = analysis.createClickReporterWithPath<
  CategoryDetailParams
>('25', '379', categoryDetailPath, ['ProductCat']);
// 商品分类详情页滑动
export const categoryDetailThiredCategoryClick = analysis.createClickReporterWithPath<
  CategoryDetailParams
>('25', '380', categoryDetailPath, ['ProductCat']);

interface bagGiftReportPathParam {
  parent_category_id: number;
  page_from: string;
}
export const bagGiftReportPath = analysis.createPath<bagGiftReportPathParam>();
interface oneDollerReportPathParam {
  product_from_page: string;
}
export const oneDollerReportPath = analysis.createPath<
  oneDollerReportPathParam
>();

//带tabs的商品列表ProductWithTabsView
interface productWithTabsViewParam {
  category_id: number;
  parent_category_id: number;
}
export const productWithTabsViewReportPath = analysis.createPath<
  productWithTabsViewParam
>();
