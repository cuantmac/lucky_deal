import {ProductSimpleItem} from '@luckydeal/api-common';
import {String} from 'aws-sdk/clients/cloudwatchevents';
import {ProductDiscountProps} from './order.model';

export interface Skuinfo {
  product_id: number;
  sku_key: string;
  sku_value: string[];
}

export interface SKUItem {
  id: number;
  name: string;
  image_url: string;
}
export interface SKU {
  attr_id: number;
  attr_name: string;
  sku_list: SKUItem[];
}
export interface ProductSKU {
  product_id: number;
  sku: SKU[];
}
export interface ProductSKUPrice {
  price_high: number;
  price_low: number;
  stock: number;
  id: number;
}
export interface Newskuinfo {
  sku?: Skuinfo;
  price?: number;
}

// 直购详情 /lucky/goods/detail
export namespace OffersDetail {
  export interface RootObject {
    code: number;
    data: Data;
  }
  export interface ActivityInfo {
    activity_id: number;
    desc: string;
  }
  export interface Data {
    bag_id: number;
    product_id: number;
    original_price: number;
    mark_price: number;
    title: string;
    desc: string;
    image: string[];
    expenses: number;
    tax: number;
    is_like: number;
    share_url: string;
    begin_time: number;
    first_order_remission_fee?: number;
    is_can_first_order_discounts: number;
    sku_info?: Skuinfo;
    new_sku_info: Newskuinfo[] | Newskuinfo;
    max_purchases_num: number;
    expect_delivery_day: string;
    like_num: number;
    order_num: number;
    scores: number;
    coupon_info?: any;
    min_purchases_num: number;
    force_min_purchases_num: number;
    product_can_get: number;
    product_type: number;
    vip_product_desc: string;
    product_status: number;
    is_vip: boolean;
    product_category_router: string;
    fast_expenses: number;
    cant_buy_tips: string;
    product_sku: ProductSKU;
    activity_info: ActivityInfo[];
  }
}

// 福袋详情 /lucky/bag/detail
export namespace BagDetail {
  export interface RootObject {
    code: number;
    data: Data;
  }

  export interface Data {
    product_id: number;
    bag_id: number;
    original_price: number;
    mark_price: number;
    title: string;
    desc: string;
    image: string[];
    expenses: number;
    tax: number;
    is_like: number;
    share_url: string;
    begin_time: number;
    first_order_remission_fee?: number;
    is_can_first_order_discounts: number;
    sku_info: Skuinfo[];
    new_sku_info?: Newskuinfo;
    max_purchases_num: number;
    expect_delivery_day: string;
    like_num: number;
    order_num: number;
    scores: number;
    coupon_info?: any;
    min_purchases_num: number;
    force_min_purchases_num: number;
    product_category_router: string;
    is_vip: boolean;
    fast_expenses: number;
  }
}

// 产品分类一级
export namespace CategoryTopList {
  export interface RootObject {
    code: number;
    data?: Data;
  }

  export interface Data {
    list: List[];
  }
  export interface List {
    top_item_id: number;
    top_item_name: string;
  }
}
// 产品二三级分类
export namespace CategoryTwoList {
  export interface RootObject {
    code: number;
    data?: Data;
  }

  export interface Data {
    list: List[];
  }
  export interface threeDataProps {
    three_item_id: number;
    three_item_name: string;
    picture: string;
  }
  export interface List {
    two_item_id: number;
    two_item_name: string;
    picture: string;
    child_item: threeDataProps[];
  }
}

// 搜索结果 /product/search
export namespace SearchResult {
  export interface RootObject {
    code: number;
    data?: Data;
  }

  export interface Data {
    list: List[];
  }

  export interface List extends ProductSimpleItem {}
}

/**
 * add items
 */
export namespace ProductList {
  export interface RootObject {
    code: number;
    data?: Data;
  }

  export interface Data {
    list: List[];
  }

  export interface List {
    product_id: number;
    bag_id?: number;
    original_price: number;
    mark_price: number;
    title: string;
    image: string;
    base_tag: any[];
    activity_tag: string;
    product_category: number;
    order_num: number;
    activity_tag_color: string;
  }
}

/**
 * 购物车列表
 */
export namespace CartList {
  export interface RootObject {
    code: number;
    data?: Data;
  }
  export interface Data {
    list: List[];
    total_num: number;
    total_price: number;
    max_price: number;
    product_sku: Sku[];
    free_shipping_fee: FreeFee;
    free_tax_fee: FreeFee;
    product_discount: ProductDiscountProps;
  }

  export interface FreeFee {
    is_free: boolean;
    free_low_amt: number;
    free_need_amt: number;
    after_free_amt: number;
  }

  export interface Sku {
    sku_key: string;
    sku_value: string;
  }
  export interface List {
    id: number;
    product_id?: number;
    product_type: number;
    status: number;
    qty: string;
    title: string;
    image: string;
    price: number;
    original_price: number;
    min_purchases_num: number;
    max_purchases_num: number;
    category_id: number;
    standard_shipping_fee: number;
    tax_fee: number;
    tax: number;
    super_box_reward_product: number;
    sku_no: string;
    item_id: number;
    free_shipping_fee: number;
  }
}
/**
 * 添加购物车
 */
export namespace AddToCart {
  export interface RootObject {
    code: number;
    data?: Data;
  }
  export interface Data {
    id: number;
    image: string;
    is_success: true;
    title: string;
    total_num: number;
  }
}

//首页navList
export namespace NavList {
  export interface RootObject {
    code: number;
    data: Data;
  }

  export interface Data {
    list: List[];
    only_one_category: OneDollerCategory;
  }
  export interface OneDollerCategory {
    parent_index: number;
    index: number;
    new_user_expire_time: number;
    lucky_bag_index: number;
    lucky_bag_parent_index: number;
  }
  export interface List {
    category_id: number;
    category_router: string;
    from_page: number;
    name: string;
    parent_category_id: number;
    parent_category_name: string;
    route: string;
    siblings_category_items: Items[];
    product_category: number;
    tag: string;
    url: string;
    weight: string;
  }
  export interface Items {
    category_id: number;
    category_name: string;
    category_router: string;
  }
}

export namespace MysteryGame {
  export interface RootObject {
    code: number;
    data: Data;
  }

  export interface Data {
    id: number;
    title: string;
    image: string;
    min_price: number;
    max_price: number;
    scores: number; //消耗积分
    user_scores: number;
    list: Goods[];
    description: string;
    faq_list: Faqs[];
    grade: number;
    order_num: number;
    score_rate: number;
    max_score: number;
    min_score: number;
  }

  export interface Goods {
    product_id: number;
    show_percent: number;
    image: string;
    title: string;
    price: number;
  }

  export interface Faqs {
    title: string;
    content: string;
  }
}

export namespace MysteryGameRewardList {
  export interface RootObject {
    code: number;
    data: Data;
  }

  export interface Data {
    list: Goods[];
  }

  export interface Goods {
    product_id: number;
    create_time: string;
    image: string;
    title: string;
    status: number;
    gift_id: number;
  }

  export interface Faqs {
    title: string;
    content: string;
  }
}

export namespace AddPurchaseList {
  export interface RootObject {
    code: number;
    data: Data;
  }
  export interface Data {
    list: ProductItem[];
  }
  export interface ProductItem {
    image: string;
    min_price: number;
    product_id: number;
    product_type: number;
    title: String;
  }
}
export namespace AddPurchaseDetail {
  export interface RootObject {
    code: number;
    data: ProductItem;
  }
  export interface ProductItem {
    expenses: number;
    image: string;
    is_like: number;
    like_num: number;
    max_purchases_num: number;
    min_price: number;
    min_purchases_num: number;
    order_num: number;
    product_id: number;
    product_type: number;
    scores: number;
    tax: number;
    title: string;
  }
}

// 活动商品列表
export namespace ActivityProductList {
  export interface RootObject {
    code: number;
    data: Data;
  }
  export interface CouponInfo {
    discount: number;
    number: number;
  }
  export interface Data {
    activity_id: number;
    activity_picture: string;
    coupon_info: CouponInfo;
    list: ProductItem[];
  }
  export interface ProductItem {
    title: string;
    status: number;
    product_type: number;
    product_id: number;
    product_category: number;
    original_price: number;
    order_num: number;
    mark_price: number;
    image: string;
    base_tag: [];
    bag_id: number;
    activity_tag_color: string;
    activity_tag: string;
  }
}

export namespace PolicyConfig {
  export interface RootObject {
    code: number;
    data: Data;
  }
  export interface PolicyItem {
    id: number;
    title: string;
  }
  export interface Data {
    list: PolicyItem[];
  }
}

export namespace PolicyContentData {
  export interface RootObject {
    code: number;
    data: Data;
  }
  export interface Data {
    content: string;
    title: string;
  }
}
