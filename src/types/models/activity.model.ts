//复活节赠品list
export namespace EasterGiftList {
  export interface RootObject {
    code: number;
    data: Data;
  }

  export interface Data {
    list: List[];
    activity_status: number;
  }

  export interface List {
    gift_id: number;
    title: string;
    image: string;
    original_url: string;
    stock: number;
    use_stock: number;
    price: number;
    sold_price: number;
  }
}
//复活节砸蛋提交
export namespace EasterGiftSubmit {
  export interface RootObject {
    code: number;
    data: Data;
  }

  export interface Data {
    user_gift_id: number;
    gift_id: number;
    title: string;
    image: string;
    original_url: string;
    stock: number;
    use_stock: number;
    price: number;
  }
}

//限时折扣
export interface SessionInfoItem {
  /**
   * 结束时间戳
   * @type {number}
   * @memberof SessionInfoItem
   */
  end: number;
  /**
   * 分类列表
   * @type {Array<SalesCateInfoItem>}
   * @memberof SessionInfoItem
   */
  sales_cate_info: Array<SalesCateInfoItem>;
  /**
   * 场次id
   * @type {number}
   * @memberof SessionInfoItem
   */
  session_id: number;
  /**
   * 开始时间戳
   * @type {number}
   * @memberof SessionInfoItem
   */
  start: number;
}

export interface SalesCateInfoItem {
  /**
   * 分类id
   * @type {number}
   * @memberof SalesCateInfoItem
   */
  cate_id: number;
  /**
   * 图片
   * @type {string}
   * @memberof SalesCateInfoItem
   */
  image: string;
  /**
   * 标题
   * @type {string}
   * @memberof SalesCateInfoItem
   */
  title: string;
}
export namespace FlashConfigApi {
  export interface RootObject {
    code: number;
    data: Data;
  }

  export interface Data {
    session_info: SessionInfoItem[];
  }
}
export namespace FlashProductListApi {
  export interface RootObject {
    code: number;
    data: Data;
  }

  export interface Data {
    list: ProductItem[];
  }
  export interface ProductItem {
    activity_tag: string;
    activity_tag_color: string;
    base_tag: string;
    image: string;
    mark_price: number;
    order_num: number;
    original_price: number;
    product_category: number;
    product_id: number;
    product_type: number;
    status: number;
    title: string;
    stock: number;
  }
}
