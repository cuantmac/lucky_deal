// 支付方式
export enum PAY_METHOD_ENUM {
  PAYPAL = 1,
  CREDIT_CARD = 2, //暂时不用了
  PAY_BOARD = 3, //paypal 信用卡
  PAY_PACY = 4,
  ASIA_BILL = 5,
}

//支付UI 样式
export enum PAY_STYLE_ENUM {
  CHECK_LEFT,
  CHECK_RIGHT,
}

// 页面编号， 主要用于deeplink跳转
export enum APP_PAGE_TYPE_NUM {
  ONE_DOLLAR_PRODUCT = '1',
}

// 优惠券种类 主要用于区分折扣券和其他
export enum COUPON_DISCOUNT_TYPE_ENUM {
  NORMAL = 0, // 普通优惠券
  DISCOUNT = 1, // 折扣券
}

// 优惠券状态
export enum COUPON_STATUS_ENUM {
  NOT_USE = 0, // 未使用
  HAS_USED = 1, // 已使用
  HAS_EXPIRED = 2, // 已过期
}

// 活动优惠券弹窗可以弹出的页面
export enum APPLY_COUPON_PAGE_ENUM {
  HOME = '1', // 首页
  PRODUCT_DETAIL = '2', // 商品详情
  SHOPPING_BAG = '3', // 购物车
  PRODUCT_LIST = '4', // 商品列表：从分类导航进入后的页面
  ACTIVITY = '5', // 活动专题页：多件多折活动、限时折扣、单品免邮活动进入后的页面
}

// 活动标签类型
export enum ACTIVITY_TAG_ENUM {
  BUNDLE_SALE = 1, // 多件多折
  FLASH_SALE = 2, // 限时折扣
  FREE_SHIPPING = 3, // 免邮活动
}

// 活动id
export enum ACTIVITY_ID_ENUM {
  BUNDLE_SALE = 10001, // 多件多折
  FREE_SHIPPING = 10002, // 免邮活动
}

export enum AVILIABLE_COUPON_FROM_ENUM {
  PRODUCT_DETAIL = 1, // 详情页
  SHOP_CART = 2, // 购物车
}

// 优惠券使用限制类型
export enum COUPON_USE_CONDITION_TYPE_ENUM {
  ANY = 1, // 无限制
  AMOUNT = 2, // 消费金额
  NUMBER = 3, // 消费件数
}

// 商品类型
export enum PRODUCT_CATEGPRY_TYPE {
  AUCTION = 0, // 竞拍商品（非竞拍币）
  MYSTERY = 1, // 福袋
  OFFERS = 2, // 直购
  SUPRE_BOX = 3, // 超级福袋
  VIP = 4, // vip 商品
  FEATURES = 5, // 专题
  SPECIAL = 6, // 特殊板块
}

// 物流方式
export enum SHIPPING_METHOD_ENUM {
  NORMAL = 1, // 普通快递
  FAST = 2, // 速递
  FREE = 3, // 免费
  NEW_SHIP = 4, // 新版物流选择
}

// 购物车操作类型
export enum CART_ITEM_ACTION_ENUM {
  // 编辑数量
  CHANGE_QTY = 0,
  // 删除商品
  REMOVE_ITEM = 1,
  // 删除所有过期商品
  REMOVE_ALL_EXPIRE = 2,
  // 清空购物车
  CLEAR_CART = 3,
}

// 首页组件类型
export enum HOME_COMPONENT_TYPE {
  IMG_1_1 = 1, // 图片1行1(平铺)
  IMG_1_2 = 2, // 图片1行2(平铺)
  PRODUCT_1_2 = 3, // 商品1行2(平铺)
  PRODUCT_1_3 = 4, // 商品1行3(平铺)
  PRODUCT_1_2_5 = 5, // 商品1行2.5(左右滑动)
  PRODUCT_1_3_5 = 6, // 商品1行3.5(左右滑动)
  PRODUCT_1_1 = 7, // 商品1行1(左图右文)
  PRODUCT_SWIPPER = 8, // 轮播图
  PRODUCT_2_3 = 9, // 商品2行3
}

// 是够使用快速物流
export enum USE_FAST_EXPENSES_ENUM {
  USE = 1, // 使用
  NOT_USE = 0, // 不使用
}

// 是否使用优惠券
export enum USE_COUPON_ENUM {
  // 使用默认优惠券
  DEFAULT = 0,
  // 不使用
  NOT_USE = -1,
}

// 订单类型 订单类型， 0-未支付订单、1-已支付订单、2-已发货订单、3-已收货、-1-所有订单、-2-最新的未支付
export enum ORDER_TYPE_ENUM {
  UN_PAID = 0,
  TO_BE_SHIPPED = 1,
  SHIPPED = 2,
  RECIVED = 3,
  ALL = -1,
  NEW_ALL = -2,
}

// '订单状态: 0：待付款，1：已付款，2:已发货，3：已收货，4：已完成, 5: 系统取消超时订单, 6:退货申请中, 7 : 退货中, 8 :退货完成, 9: 退款中, 10 :退款完成, 11:退款失败, 12:订单退货完成, 13: 物流完成, 14:用户取消订单',
// 订单状态
export enum ORDER_STATUS_ENUM {
  UN_PAID = 0,
  TO_BE_SHIPPED = 1,
  SHIPPED = 2,
  RECIVED = 3,
  SUCCESS = 4,
  SYSTEM_TIMEOUT_CANCEL = 5,
  SALES_RETURN_START = 6,
  SALES_RETURN_PROGRESS = 7,
  SALES_RETURN_COMPLETE = 8,
  REFUND_PROGRESS = 9,
  REFUND_COMPLETE = 10,
  REFUND_FAIL = 11,
  ORDER_SALES_RETURN_COMPLETE = 12,
  LOGISTICS_COMPLETE = 13,
  USER_CANCEL = 14,
}
