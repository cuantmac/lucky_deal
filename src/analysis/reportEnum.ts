// ProductFrom：0-首页；1-福袋页；2-优惠专区页；3-其他
// FromPage：0-首页；1-商品列表页；2-搜索列表页；3-搜索排行榜；10-首页best selling items，11-Best Selling items 列表页，12-会员页面，13-会员专题页，14-会员独立页 15-多件多折列表页
export enum REPORT_FROM_PAGE_ENUM {
  HOME = 0,
  PRODUCT_LIST = 1,
  SEARCH_LIST = 2,
  SEARCH_RANKING = 3,
  ME = 4,
  ORDER_LIST = 5,
  ORDER_DETAIL = 6,
  HOME_NO_PAY_MODAL = 7,
  ORDER_DETAIL_BUY_AGAIN = 8,
  HOME_BEST_SELLING_ITEM = 10,
  BEST_SELLING_ITEM_LIST = 11,
  VIP_PAGE = 12,
  VIP_SPECIAL_PAGE = 13,
  VIP_PAGE_OWN = 14,
  ORDER_CONFIRM = 15,
  NEW_ARRIVALS = 16,
  SHOPPING_BAG = 18,
}

export enum REPORT_PRODUCT_FROM_ENUM {
  HOME = 0,
  MYSTERY = 1,
  PREFERENTIAL = 2,
  OTHER = 3,
}

export enum REPORT_PAY_METHOD_ENUM {
  PAYPAL = 0,
  CREDIT_CARD = 1,
}

// branch 订单支付状态打点
export enum REPORT_BRANCH_PAY_STATUS_ENUM {
  SUCCESS = '1',
  FAIL = '0',
}

// 订单来源
export enum REPORT_PAY_ORDER_SOURCE_ENUM {
  BUY_NOW = 0, // 直接购买
  SHOPPING_BAG = 1, // 购物车
}

// 坑位推荐类型
export enum REPORT_RECOMMEND_TYPE_ENUM {
  OFFER = 1, // 直购
  MYSTERY = 2, // 福袋
  PROJECT = 3, // 专题
  OTHER = 4, // 特定界面
}

// 订单支付状态打点
export enum REPORT_PAY_STATUS_ENUM {
  SUCCESS = 0,
  FAIL = 1,
}
