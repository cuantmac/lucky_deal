export const initialState = {
  token: '',
  userID: '',
  deviceInfo: {},
  mainAddress: {},
  isReview: false, //是否回购
  profile: {
    nick_name: 'user', //昵称
    avatar: '', //头像
    bids_balance: 0, //竞拍币余额
    bids_rate: 0.0, //竞拍币汇率
    is_vip: false,
  },
  meOrderCount: {
    un_pay_num: 0,
    pay_num: 0,
    shipped_num: 0,
    received_num: 0,
    coupon_num: 0,
  },
  pay_fail_feed: 0, //是否显示订单+99bids  1 有反馈的订单， 0 无反馈的订单
  message_count: 0, //是否有未读消息
  red_point: 0, //gift未读消息
  order_count: 0, //订单状态未读消息
  bidSucceedOnce: false,
  ratedOnce: false,
  exitAppShownTime: '0',
  appConfig: {
    home_banner: [],
  },
  leftBanner: {},
  configV2: {},
  topicList: [
    {
      topic_title: 'All',
      play_type: 0,
      topic_type: 0,
      banner_img: null,
    },
  ],
  feedBackMessageCount: 0,
  feedBackList: [],
  // 是否为审核状态，//0: 开启，1:关闭
  appCheck: 0,
  gender: 0,
  order_user: 0, //order_user"` // 1 是老用户， 0 不是
  deeplinkData: {},
  searchHistory: [],
  searchKeyWords: [],
  searchIndex: 0,
  openAppTime: 0,
  latestUnpaidOrder: {preShowTime: -1, orderData: null},
  userInBucket: false,
  codeCoupon: [],
  pushCouponCode: null, //推送优惠券码
  cartNum: 0,
  // 首页是否默认跳转onedoller
  homeGoOneDoller: true,
  pageFromReport: 0,
  unreadMsgCount: 0,
  // 新用户优惠ondoller
  oneDollerCategory: null,
  activityInfo: {
    activity_id: 1,
    title: '',
    activity_type: 2,
    icon: '',
    dialog_bg: '',
    animation_elem: '',
    greeting_title: '',
  },
  productDiscountInfo: {
    discount: 0,
    discount_price: 0,
    is_discount: false,
    next_discount: 0,
    next_more_discount_number: 0,
  },
};

/**
 * @deprecated 已经过时 将逐步移除
 */
export default (state = initialState, action) => {
  try {
    switch (action.type) {
      case 'setToken': {
        // gobal.token = action.payload.token;
        return {
          ...state,
          token: action.payload.token,
          userID: action.payload.user_id.toString(),
        };
      }
      case 'setDeviceInfo': {
        return {
          ...state,
          deviceInfo: action.payload,
        };
      }
      case 'setMainAddress': {
        return {
          ...state,
          mainAddress: action.payload,
        };
      }
      case 'setProfile': {
        return {
          ...state,
          profile: action.payload,
        };
      }
      case 'setMeOrderCount': {
        return {
          ...state,
          meOrderCount: action.payload,
        };
      }
      case 'bidSucceedOnce': {
        return {
          ...state,
          bidSucceedOnce: action.payload,
        };
      }
      case 'ratedOnce': {
        return {
          ...state,
          ratedOnce: action.payload,
        };
      }
      case 'setMessageCount': {
        return {
          ...state,
          message_count: action.payload,
        };
      }
      case 'setRedPoint': {
        return {
          ...state,
          red_point: action.payload,
        };
      }
      case 'setOrderCount': {
        return {
          ...state,
          order_count: action.payload,
        };
      }
      case 'setReview': {
        return {
          ...state,
          isReview: action.payload,
        };
      }
      case 'exitAppShown': {
        return {
          ...state,
          exitAppShownTime: new Date().toString(),
        };
      }
      case 'updateConfig': {
        return {
          ...state,
          appConfig: action.payload.app_config || initialState.appConfig,
          topicList: action.payload.topic_list || initialState.topicList,
          configV2: action.payload,
          leftBanner:
            action.payload.app_config?.left_banner || state.leftBanner,
        };
      }
      case 'setFeedBackMessageCount': {
        return {
          ...state,
          feedBackMessageCount: action.payload,
        };
      }
      case 'setFeedBackList': {
        return {
          ...state,
          feedBackList: action.payload,
        };
      }
      case 'setAppCheck': {
        return {
          ...state,
          appCheck: action.payload,
        };
      }
      case 'setOrderFeedBack': {
        return {
          ...state,
          pay_fail_feed: action.payload,
        };
      }
      case 'updataGender': {
        return {
          ...state,
          gender: action.payload,
        };
      }
      case 'updateOlderUserStatus': {
        return {
          ...state,
          order_user: action.payload,
        };
      }
      case 'setDeeplink': {
        return {
          ...state,
          deeplinkData: action.payload,
        };
      }
      case 'setOneDollerCategory': {
        return {
          ...state,
          oneDollerCategory: action.payload
            ? {...state.oneDollerCategory, ...action.payload}
            : null,
        };
      }
      case 'setSearchHistory': {
        return {
          ...state,
          searchHistory: action.payload,
        };
      }
      case 'setSearchKeyWords': {
        return {
          ...state,
          searchKeyWords: action.payload,
        };
      }
      case 'setSearchIndex': {
        return {
          ...state,
          searchIndex: action.payload,
        };
      }
      case 'updateUnreadMsgCount': {
        return {
          ...state,
          unreadMsgCount: action.payload,
        };
      }
      case 'updateOpenAppTime': {
        return {
          ...state,
          openAppTime: action.payload,
        };
      }
      case 'updateLatestUnpaidOrder': {
        return {
          ...state,
          latestUnpaidOrder: {
            ...state.latestUnpaidOrder,
            orderData: action.payload,
          },
        };
      }
      case 'updateLatestUnpaidOrderShowTime': {
        return {
          ...state,
          latestUnpaidOrder: {
            ...state.latestUnpaidOrder,
            preShowTime: action.payload,
          },
        };
      }
      case 'updateCodeCoupon': {
        return {
          ...state,
          codeCoupon: action.payload,
        };
      }
      case 'updateUserInBucket': {
        return {
          ...state,
          userInBucket: action.payload,
        };
      }
      case 'updatePushCouponCode': {
        return {
          ...state,
          pushCouponCode: action.payload,
        };
      }
      case 'updateCartNum': {
        return {
          ...state,
          cartNum: action.payload,
        };
      }
      case 'setHomeGoOneDoller': {
        return {
          ...state,
          homeGoOneDoller: action.payload,
        };
      }
      case 'setPageFromReport': {
        return {
          ...state,
          pageFromReport: action.payload,
        };
      }
      case 'setActivityInfo': {
        return {
          ...state,
          activityInfo: action.payload,
        };
      }
      case 'setProductDiscountInfo': {
        return {
          ...state,
          productDiscountInfo: action.payload,
        };
      }
      default:
        return state;
    }
  } catch (error) {}
};
