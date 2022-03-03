import {MRecommendProduct, ProductSimpleBaseItem} from '@luckydeal/api-common';

/**
 *
 * @export
 * @interface HomeBannerListItem
 */
export interface HomeBannerListItem {
  /**
   * banner 类型， 1-商品， 2-分类， 3-专题
   * @type {number}
   * @memberof HomeBannerListItem
   */
  banner_type: number;
  /**
   * banner 图
   * @type {string}
   * @memberof HomeBannerListItem
   */
  image: string;
  /**
   * 一级分类id
   * @type {number}
   * @memberof HomeBannerListItem
   */
  one_category_id: number;
  /**
   * 商品id
   * @type {number}
   * @memberof HomeBannerListItem
   */
  product_id: number;
  /**
   * 商品类型
   * @type {number}
   * @memberof HomeBannerListItem
   */
  product_type: number;
  /**
   * 专题id
   * @type {number}
   * @memberof HomeBannerListItem
   */
  subject_id: number;
  /**
   * 三级分类id
   * @type {number}
   * @memberof HomeBannerListItem
   */
  three_category_id: number;
  /**
   * 二级分类id
   * @type {number}
   * @memberof HomeBannerListItem
   */
  two_category_id: number;
}
/**
 *
 * @export
 * @interface CodeCouponItem
 */
export interface CodeCouponItem {
  /**
   * 金额
   * @type {number}
   * @memberof CodeCouponItem
   */
  amount: number;
  /**
   * 券码
   * @type {string}
   * @memberof CodeCouponItem
   */
  code: string;
  /**
   * 优惠券描述
   * @type {string}
   * @memberof CodeCouponItem
   */
  use_product_desc: string;
}

//二级分类
export interface CategoryTwoItem {
  /**
   * 三级分类列表
   * @type {Array<CategoryThreeItem>}
   * @memberof CategoryTwoItem
   */
  child_item: Array<CategoryThreeItem>;
  /**
   * 二级分类图片
   * @type {string}
   * @memberof CategoryTwoItem
   */
  picture: string;
  /**
   * 二级分类id
   * @type {number}
   * @memberof CategoryTwoItem
   */
  two_item_id: number;
  /**
   * 二级分类名称
   * @type {string}
   * @memberof CategoryTwoItem
   */
  two_item_name: string;
}
//三级分类
/**
 *
 * @export
 * @interface CategoryThreeItem
 */
export interface CategoryThreeItem {
  /**
   * 三级分类图片
   * @type {string}
   * @memberof CategoryThreeItem
   */
  picture: string;
  /**
   * 三级分类id
   * @type {number}
   * @memberof CategoryThreeItem
   */
  three_item_id: number;
  /**
   * 三级分类名称
   * @type {string}
   * @memberof CategoryThreeItem
   */
  three_item_name: string;
}

//首页导航4.2
export namespace MHomeNavApi {
  export interface RootObject {
    code: number;
    data: MHomeNavResponse;
  }
  /**
   *
   * @export
   * @interface MHomeNavResponse
   */
  export interface MHomeNavResponse {
    /**
     * 首页分类导航列表
     * @type {Array<MHomeNavItem>}
     * @memberof MHomeNavResponse
     */
    list: Array<MHomeNavItem>;
  }
  /**
   *
   * @export
   * @interface MHomeNavItem
   */
  export interface MHomeNavItem {
    /**
     * banner 列表
     * @type {Array<HomeBannerListItem>}
     * @memberof MHomeNavItem
     */
    banner_list?: Array<HomeBannerListItem>;
    /**
     * 专题id
     * @type {number}
     * @memberof MHomeNavItem
     */
    item_id: number;
    /**
     * 分类级别
     * @type {number}
     * @memberof MHomeNavItem
     */
    item_level: number;
    /**
     * nav 名称
     * @type {string}
     * @memberof MHomeNavItem
     */
    item_name: string;
    /**
     * nav 类型 1-专题 2-分类 3-首页
     * @type {number}
     * @memberof MHomeNavItem
     */
    item_type: number;
    /**
     * 一级分类id
     * @type {number}
     * @memberof MHomeNavItem
     */
    one_category_id?: number;
    /**
     * 三级分类id
     * @type {number}
     * @memberof MHomeNavItem
     */
    three_category_id?: number;
    /**
     * 二级分类id
     * @type {number}
     * @memberof MHomeNavItem
     */
    two_category_id?: number;
  }
}
//首页 活动配置、banner、推荐商品
export namespace MHomeIndexApi {
  export interface RootObject {
    code: number;
    data: MHomeIndexResponse;
  }
  /**
   *
   * @export
   * @interface MHomeIndexResponse
   */
  export interface MHomeIndexResponse {
    /**
     * 免邮金额
     * @type {number}
     * @memberof MHomeIndexResponse
     */
    free_shipping_fee_amt: number;
    /**
     * 免税金额
     * @type {number}
     * @memberof MHomeIndexResponse
     */
    free_tax_fee_amt: number;
    /**
     * 推荐商品
     * @type {MRecommendProduct}
     * @memberof MHomeIndexResponse
     */
    recommend_product_list: MRecommendProduct;
    flash_sales_list: MRecommendProduct;
    /**
     * 中部banner列表
     * @type {Array<HomeBannerListItem>}
     * @memberof MHomeIndexResponse
     */
    middle_banner: Array<HomeBannerListItem>;
    /**
     * 优惠券列表
     * @type {Array<CodeCouponItem>}
     * @memberof MHomeIndexResponse
     */
    public_code_coupon_list: Array<CodeCouponItem>;
    /**
     * 顶部banner列表
     * @type {Array<HomeBannerListItem>}
     * @memberof MHomeIndexResponse
     */
    top_banner: Array<HomeBannerListItem>;
  }
}

//首页 福袋配置列表
export namespace MHomeMysteryBoxesApi {
  export interface RootObject {
    code: number;
    data: MHomeMysteryBoxesResponse;
  }
  /**
   *
   * @export
   * @interface MHomeMysteryBoxesResponse
   */
  export interface MHomeMysteryBoxesResponse {
    /**
     * 福袋列表
     * @type {Array<MysteryBoxItem>}
     * @memberof MHomeMysteryBoxesResponse
     */
    list: Array<MysteryBoxItem>;
    /**
     * 模块名称
     * @type {string}
     * @memberof MHomeMysteryBoxesResponse
     */
    module_name: string;
  }
  /**
   *
   * @export
   * @interface MysteryBoxItem
   */
  export interface MysteryBoxItem {
    /**
     * 图片
     * @type {string}
     * @memberof MysteryBoxItem
     */
    image: string;
    /**
     * 二级分类id
     * @type {number}
     * @memberof MysteryBoxItem
     */
    item_id: number;
    /**
     * 分类级别
     * @type {number}
     * @memberof MysteryBoxItem
     */
    item_level: number;
    /**
     * 专题类型
     * @type {number}
     * @memberof MysteryBoxItem
     */
    item_type: number;
    /**
     * 名称
     * @type {string}
     * @memberof MysteryBoxItem
     */
    name: string;
    /**
     * 一级分类id
     * @type {string}
     * @memberof MysteryBoxItem
     */
    one_category_id: string;
    /**
     * 三级分类id
     * @type {string}
     * @memberof MysteryBoxItem
     */
    three_category_id: string;
    /**
     * 二级分类id
     * @type {string}
     * @memberof MysteryBoxItem
     */
    two_category_id: string;
  }
}
//首页 热销商品列表
export namespace MBestGoodsListApi {
  export interface RootObject {
    code: number;
    data: MRecommendProduct;
  }
}
//首页 商品列表
export namespace MGoodsListApi {
  export interface RootObject {
    code: number;
    data: HomeGoodsListResponse;
  }
  /**
   *
   * @export
   * @interface HomeGoodsListResponse
   */
  export interface HomeGoodsListResponse {
    /**
     * 商品列表
     * @type {Array<ProductSimpleBaseItem>}
     * @memberof HomeGoodsListResponse
     */
    list: Array<ProductSimpleBaseItem>;
  }
}
//商品列表
export namespace MCategoryProductListApi {
  export interface RootObject {
    code: number;
    data: MCategoryProductListResponse;
  }
  /**
   *
   * @export
   * @interface MCategoryProductListResponse
   */
  export interface MCategoryProductListResponse {
    /**
     * 分类名称 只在专题页返回
     * @type {string}
     * @memberof MCategoryProductListResponse
     */
    item_name?: string;
    /**
     * 商品列表
     * @type {Array<ProductSimpleBaseItem>}
     * @memberof MCategoryProductListResponse
     */
    list: Array<ProductSimpleBaseItem>;
  }
}
//首页 商品列表
export namespace HomeCategoryListApi {
  export interface RootObject {
    code: number;
    data: HomeCategoryListResponse;
  }
  /**
   *
   * @export
   * @interface HomeCategoryListResponse
   */
  export interface HomeCategoryListResponse {
    /**
     * 分类列表
     * @type {Array<HomeCategoryListItem>}
     * @memberof HomeCategoryListResponse
     */
    list: Array<HomeCategoryListItem>;
  }
  /**
   *
   * @export
   * @interface HomeCategoryListItem
   */
  export interface HomeCategoryListItem {
    /**
     * 分类banner列表
     * @type {Array<HomeBannerListItem>}
     * @memberof HomeCategoryListItem
     */
    banner_list: Array<HomeBannerListItem>;
    /**
     * 分类专题id
     * @type {number}
     * @memberof HomeCategoryListItem
     */
    id: number;
    /**
     * 分类名称
     * @type {string}
     * @memberof HomeCategoryListItem
     */
    name: string;
  }
}
