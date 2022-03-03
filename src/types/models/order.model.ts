import {CouponDetail, ProductLogistics} from '@luckydeal/api-common';

// 用户地址列表 /user/list/address
export namespace UserAddressList {
  export interface RootObject {
    code: number;
    data?: Data;
  }

  export interface Data {
    list: List[];
  }
  export interface List {
    address_id: number;
    full_name: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone_numer: string;
    preferred?: number;
    email: string;
  }
}
// 物流方式字段
export interface LogisticsChannelItemProps extends ProductLogistics {}

//订单确认页Packagelist
export interface Packagelist {
  cart_list: Cartlist[];
  tax_fee: number;
  standard_shipping_fee: number;
  express_shipping_fee: number;
  remission_fee: number;
  sub_total_price: number;
}

export interface Cartlist {
  id: number;
  product_id: number;
  image: string;
  title: string;
  price: number;
  original_price: number;
  qty: number;
  sku_info?: Skuinfo[];
  product_type: number;
  tax_fee: number;
  standard_shipping_fee: number;
  express_shipping_fee: number;
  remission_fee: number;
  sub_total_price: number;
  category_id: number;
  item_id: number;
}

export interface Skuinfo {
  sku_key: string;
  sku_value: string;
  product_id?: number;
}
export interface SelectedSkuList {
  attr_id: number;
  attr_name: string;
  sku_list: SkuList[];
}
export interface SkuList {
  id: number;
  name: string;
  image_url: string;
}
// 订单确认接口 /user/order/confirm
export namespace UserOrderConfirm {
  export interface RootObject {
    code: number;
    data: Data;
  }
  export interface Data {
    product_price: number;
    tax_price: number;
    expenses_price: number;
    coupon_info: CouponDetail[];
    free_shipping_fee: FreeFeeProps;
    free_tax_fee: FreeFeeProps;
    new_user_coupon_value: number;
    free_gift_detail: FreeGiftProps;
    can_user_score: number;
    score_rate: number;
    selected_coupon: CouponDetail;
    not_available_coupon_list?: Array<CouponDetail>;
    logistics_channel: LogisticsChannelItemProps[];
    need_pay_price: number;
    product_discount: ProductDiscountProps;
    package_list: Packagelist[];
    selected_sku_list: SelectedSkuList[][];
  }
}
export interface FreeGiftProps {
  gift_id: number;
  title: string;
  image: string;
}

export interface FreeFeeProps {
  is_free: boolean;
  free_low_amt: number;
  free_need_amt: number;
  after_free_amt: number;
}
//折扣banner信息
export interface ProductDiscountProps {
  is_discount: boolean;
  discount: number;
  discount_price: number;
  next_discount: number;
  next_more_discount_number: number;
}

// 购物车订单数据确认 /user/cart/confirm
export namespace CartOrderConfirm {
  export interface RootObject {
    code: number;
    data: Data;
  }

  export interface Data {
    is_split_order: number;
    express_shipping_total_fee: number;
    standard_shipping_total_fee: number;
    total_price: number;
    total_tax_fee: number;
    total_remission_fee: number;
    selected_coupon?: CouponDetail;
    package_list: Packagelist[];
    coupon_info_list?: CouponDetail[];
    pub_code_coupon_info_list?: CouponDetail[];
    not_available_coupon_list?: Array<CouponDetail>;
    free_shipping_fee: FreeFeeProps;
    free_tax_fee: FreeFeeProps;
    free_gift_detail: FreeGiftProps;
    can_user_score: number;
    score_rate: number;
    logistics_channel: LogisticsChannelItemProps[];
    need_pay_price: number;
    product_discount: ProductDiscountProps;
  }
}

export namespace OrderDetailData {
  export interface RootObject {
    code: number;
    data: Data;
  }

  export interface Data {
    order_no: string;
    subtotal: number;
    order_tax_fee: number;
    order_delivery_fee: number;
    coupon: number;
    total: number;
    items: number;
    expire_time: number;
    use_fast_expenses: number;
    address: Address;
    order_status: number;
    is_pop_vip_copy_writer: number;
    order_items: Orderitem[];
    order_note: string;
    new_user_coupon_value: number;
    score_rate: number;
    can_user_score: number;
    order_discount_price: number;
  }

  export interface Orderitem {
    buy_again: number;
    order_id: string;
    order_status: number;
    logistic: Logistic[];
    detail: Detail[];
  }

  export interface Detail {
    order_tax_fee: number;
    order_delivery_fee: number;
    auction_id: number;
    product_id: number;
    image: string;
    title: string;
    product_price: number;
    order_price: number;
    product_type: number;
    coupon: number;
    qty: number;
    product_image: string;
    sku_info?: Skuinfo[];
    category_id: number;
    product_status: number;
    item_id: number;
  }

  export interface Logistic {
    tracking_number: string;
    list: List[];
  }

  export interface List {
    detail: string;
    create_time: string;
  }

  export interface Address {
    user_address_id: number;
    nick_name: string;
    address: string;
    phone_number: string;
    address_line_one: string;
    address_line_two: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    email: string;
  }

  export interface Skuinfo {
    product_id?: number;
    sku_key: string;
    sku_value: string;
  }
}

// newOrder
export namespace OfferOrderData {
  export interface RootObject {
    code: number;
    data: Data;
  }

  export interface Data {
    success: number;
    product_info: Productinfo;
    order_info: Orderinfo;
    address: Address;
  }

  export interface Address {
    user_address: Useraddress;
  }

  export interface Useraddress {
    address_id: number;
    full_name: string;
    address_line_one: string;
    address_line_two: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone_number: string;
    preferred: number;
  }

  export interface Orderinfo {
    order_id: string;
    tax_fee: number;
    deliveery_fee: number;
    product_price: number;
    pay_price: number;
    coupon: number;
    only_one_order_has: number;
    order_type: number;
    product_type: number;
    qty: number;
    coupon_id: number;
    category_id: number;
    fast_delivery: number;
    product_id: number;
    super_box_reward_product: number;
  }

  export interface Productinfo {
    image: string;
    title: string;
    desc: string;
  }
}

export namespace BagOrderData {
  export interface RootObject {
    code: number;
    data: Data;
  }

  export interface Data {
    success: number;
    product_info: Productinfo;
    order_info: Orderinfo;
    address: Address;
  }

  export interface Address {
    user_address: Useraddress;
  }

  export interface Useraddress {
    address_id: number;
    full_name: string;
    address_line_one: string;
    address_line_two: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone_number: string;
    preferred: number;
  }

  export interface Orderinfo {
    order_id: string;
    tax_fee: number;
    deliveery_fee: number;
    product_price: number;
    pay_price: number;
    coupon: number;
    only_one_order_has: number;
    order_type: number;
    product_type: number;
    qty: number;
    coupon_id: number;
    category_id: number;
    fast_delivery: number;
    product_id: number;
    super_box_reward_product: number;
  }

  export interface Productinfo {
    image: string;
    title: string;
    desc: string;
  }
}

export namespace CartOrderData {
  export interface RootObject {
    code: number;
    data: Data;
  }

  export interface Data {
    success: number;
    order_no: string;
  }
}

export namespace CouponList {
  export interface RootObject {
    code: number;
    data?: Data;
  }

  export interface Data {
    list: List[];
  }
  export interface List {
    coupon_id: number;
    amount: number;
    title: string;
    coupon_type: number;
    expire_date: number;
    use_product: string;
    use_condition: number;
    begin_time: string;
    end_time: string;
    route: number;
    route_id: number;
  }
}
