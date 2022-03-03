/* eslint-disable no-bitwise */
import {createRef} from 'react';
import {Linking, Platform, ToastAndroid} from 'react-native';
import {EMAIL} from '../constants/constants';
import AsyncStorage from '@react-native-community/async-storage';
import Api from '../Api';
import {navigationRef} from './refs';
import {ACTIVITY_TAG_ENUM, PAY_METHOD_ENUM} from '../constants/enum';
import AppModule from '../../AppModule';

export const toast = createRef();

const Utils = {
  /**
   * 转换金额
   * @param {number} amount
   * @returns number
   */
  convertAmount(amount) {
    return amount / 100;
  },
  /**
   * 转换金额
   * @param {number} amount
   * @param {boolean} isminus
   * @returns string
   */
  convertAmountUS(amount, isminus = false) {
    return `${isminus ? '-' : ''}US $` + amount / 100;
  },
  /**
   *
   * 判断是否是活动商品
   *
   * @param data ActivityTagListItem[]
   * @returns
   */
  isActivityProduct(data) {
    console.log(AppModule);
    return !!data?.find(
      ({act_type}) => act_type === ACTIVITY_TAG_ENUM.FLASH_SALE,
    );
  },
  endTimeShow(time) {
    if (time <= 0) {
      return '00:00:00';
    }
    let h = (time / 3600) | 0;
    let m = ((time % 3600) / 60) | 0;
    let s = time % 60 | 0;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    return h + ':' + m + ':' + s;
  },
  formatDate(time, type) {
    let now = new Date(time * 1000);
    var year = now.getFullYear(); //取得4位数的年份
    var month = now.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月
    var date = now.getDate(); //返回日期月份中的天数（1到31）
    var hour = now.getHours(); //返回日期中的小时数（0到23）
    var minute = now.getMinutes(); //返回日期中的分钟数（0到59）
    var second = now.getSeconds(); //返回日期中的秒数（0到59）
    let returnTime =
      (date > 9 ? date : '0' + date) +
      '/' +
      (month > 9 ? month : '0' + month) +
      (now.getFullYear() === new Date().getFullYear() ? '' : '/' + year) +
      ' ' +
      (hour > 9 ? hour : '0' + hour) +
      ':' +
      (minute > 9 ? minute : '0' + minute) +
      ':' +
      (second > 9 ? second : '0' + second);
    if (type) {
      if (hour > 12) {
        hour = hour - 12;
      }
      if (hour === 0) {
        hour = 12;
      }
      let a = hour > 12 ? 'pm' : 'am';
      returnTime =
        (hour > 9 ? hour : '0' + hour) +
        ':' +
        (minute > 9 ? minute : '0' + minute) +
        ':' +
        (second > 9 ? second : '0' + second) +
        ' ' +
        a;
    }
    if (type === 'HH:MM') {
      returnTime =
        (hour > 9 ? hour : '0' + hour) +
        ':' +
        (minute > 9 ? minute : '0' + minute);
    }
    return returnTime;
  },
  formatDate2(time, type) {
    let now = new Date(time * 1000);
    var year = now.getFullYear(); //取得4位数的年份
    var month = now.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月
    var date = now.getDate(); //返回日期月份中的天数（1到31）
    var hour = now.getHours(); //返回日期中的小时数（0到23）
    var minute = now.getMinutes(); //返回日期中的分钟数（0到59）
    var second = now.getSeconds(); //返回日期中的秒数（0到59）
    let returnTime =
      (date > 9 ? date : '0' + date) +
      '/' +
      (month > 9 ? month : '0' + month) +
      ('/' + year);
    if (type) {
      returnTime =
        returnTime +
        ' ' +
        (hour > 9 ? hour : '0' + hour) +
        ':' +
        (minute > 9 ? minute : '0' + minute);
    }

    return returnTime;
  },
  formatDate3(time) {
    let now = new Date(time * 1000);
    var year = now.getFullYear(); //取得4位数的年份
    var month = now.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月
    var date = now.getDate(); //返回日期月份中的天数（1到31）
    // var hour = now.getHours(); //返回日期中的小时数（0到23）
    // var minute = now.getMinutes(); //返回日期中的分钟数（0到59）
    // var second = now.getSeconds(); //返回日期中的秒数（0到59）
    let returnTime =
      year +
      '/' +
      (month > 9 ? month : '0' + month) +
      '/' +
      (date > 9 ? date : '0' + date);

    return returnTime;
  },
  countDown(seconds) {
    if (seconds <= 0) {
      return '0:00';
    }
    let m = (seconds / 60) | 0;
    let s = seconds % 60 | 0;
    s = s < 10 ? '0' + s : s;
    return m + ':' + s;
  },
  toastFun(title) {
    if (title) {
      if (Platform.OS === 'android') {
        ToastAndroid.show(title.toString(), 3000);
      } else {
        toast.current?.show(title.toString(), 3000);
      }
    }
  },
  async contactUs(title, body) {
    const userID = parseInt(await AsyncStorage.getItem('user_id')) || 0;
    const version =
      AppModule.versionName + '.' + AppModule.getActiveBundleVersion();
    const emailSubject = title ? ':' + title : '';
    Linking.openURL(
      `mailto:${EMAIL}?subject=Lucky Deal${emailSubject} &body=` +
        (body ? encodeURIComponent(body) : '') +
        '%0D%0A' +
        '%0D%0A' +
        '%0D%0A' +
        'User ID: ' +
        userID +
        '%0D%0A' +
        'Version:' +
        version +
        '%0D%0A',
    ).catch(console.error);
  },
  emailCheck(mail) {
    return /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>().,;\s@"]+\.?)+([^<>().,;:\s@"]{2,}|[\d.]+))$/.test(
      mail,
    );
  },
  orderStateText(status, shipping_method) {
    switch (status) {
      case -1:
        return 'Time Out';
      case 0:
        return 'Waiting for payout';
      case 1:
        return shipping_method === 2
          ? 'Your order should arrive within 7-16 days'
          : 'Your order should arrive within 15-35 Days';
      case 2:
        return shipping_method === 2
          ? 'Your order should arrive within 7-16 days'
          : 'Your order should arrive within 15-35 Days';
      case 3:
      case 13:
        return 'Delivery successful';
      case 4:
        return 'Deal Finished';
      case 5:
      case 14:
        return 'Canceled';
      case 6:
        return 'Return Applying';
      case 7:
        return 'Returning';
      case 8:
        return 'Returned';
      case 9:
        return 'Refunding';
      case 10:
        return 'Refunded';
      case 11:
        return 'Refund Failed';
      case 12:
        return 'Return Complete';
    }
    return 'N/A';
  },
  refundStateText(status) {
    switch (status) {
      case -1: //未退款
        return '';
      case 0: //退单申请中
        return 'Refund: reviewing';
      case 1: //订单取消成功,退款已完成
        return 'Refund: completed';

      case 2: //退单申请失败，订单已发货
        return 'Refund: failed';

      case 3: //退款申请中
        return 'Refund: submitted';
      case 4: //退款已完成
        return 'Refund: completed';
      case 5: //退款申请失败
        return 'Refund: rejected';
    }
    return 'N/A';
  },
  getImageUri(url) {
    return url && url.startsWith('http')
      ? {uri: url}
      : require('../assets/ph.png');
  },
  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
  isToday(date) {
    const today = new Date();
    return (
      date.getDay() === today.getDay() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  },
  timeString(time) {
    const date = new Date(time * 1000);
    if (this.isToday(date)) {
      return date.toLocaleTimeString();
    } else {
      return this.formatDate(time);
    }
  },
  skuFilter(list) {
    if (list.length === 0 || !list) {
      return [];
    }
    let first = list[0];
    const {price_high, price_low, ...items} = list[0];
    let keys = Object.keys(items);
    let _newItem = {};
    list.forEach((item, j) => {
      const {price_high, price_low, ...items} = item;
      let values = Object.values(items);
      keys.forEach((key, i) => {
        if (!j) {
          _newItem[key] = [];
        }
        _newItem[key].push({value: values[i], selected: j ? false : true});
      });
    });
    return _newItem;
  },
  priceFilter(data) {
    if (!data) {
      return 0;
    } else {
      return parseFloat(data / 100.0);
    }
  },

  filterSpecialWords(source) {
    return source?.replace(/[\r\n]/g, '');
  },
};

/**
 * 根据传入的 category别名 获取详细数据
 */
export const getCategoryItemData = async (categoryId) => {
  if (!categoryId) {
    Utils.toastFun('Please enter category id');
    return;
  }
  const res = await Api.commonParams();
  if (res.data) {
    const data = res.data;
    const category = data[categoryId];
    if (!category) {
      const msg = 'can not find category id';
      Utils.toastFun(msg);
      throw new Error(msg);
    }
    const detailData = await Api.productRoute(category);
    if (detailData.data) {
      return detailData.data.detail;
    }
    throw new Error(detailData.error);
  } else {
    throw new Error(res.error);
  }
};

/**
 *
 * 根据支付方式订单类型 返回支付跳转的数据
 *
 * {
 *  url: 根据支付方式 获取支付的地址
 * }
 *
 * @param {*} payMethod 支付方式
 * @param {*} orderId 订单id
 * @param {*} orderType 订单类型 ORDER_TYPE_ENUM
 */
export const orderPay = async (payMethod, orderId) => {
  const error = new Error('order error');
  const returnData = {
    payMethod,
    url: null,
    orderId,
    body: null,
  };

  if (
    payMethod === PAY_METHOD_ENUM.PAYPAL ||
    payMethod === PAY_METHOD_ENUM.PAY_BOARD
  ) {
    const charge = await Api.charge({
      charge_type: 7,
      order_id: orderId,
    });
    if (!(charge && charge.data)) {
      throw error;
    }
    if (payMethod === PAY_METHOD_ENUM.PAYPAL) {
      returnData.url = charge.data.pay_url;
      return returnData;
    }
    if (payMethod === PAY_METHOD_ENUM.PAY_BOARD) {
      returnData.url = charge.data.pay_board_url;
      return returnData;
    }
  } else if (payMethod === PAY_METHOD_ENUM.PAY_PACY) {
    const charge = await Api.pacypayCharge({
      charge_type: 7,
      order_id: orderId,
    });
    if (!(charge && charge.data)) {
      throw error;
    }
    returnData.url = charge.data.pay_url;
    returnData.orderId = orderId;
    returnData.body = charge.data.pay_info;
    return returnData;
  } else if (payMethod === PAY_METHOD_ENUM.ASIA_BILL) {
    const charge = await Api.asiaBillCharge({
      charge_type: 7,
      order_id: orderId,
    });
    returnData.url = charge.data.pay_url;
    returnData.orderId = orderId;
    returnData.body = charge.data.pay_info;
    return returnData;
  }
};

export const fetchOrderAddItemsConfig = async (
  token,
  buttonAction,
  fromPage,
  needLowPrice,
) => {
  const configRes = await Api.cartAddItemsConfig(token);
  if (!(configRes && configRes.data)) {
    return;
  }
  let lowPrice = needLowPrice;
  const configs = configRes.data.list;
  if (needLowPrice < 0) {
    if (token) {
      const cartRes = await Api.cartList();
      if (cartRes.code === 0) {
        const cart = cartRes.data;
        const freeShipNeedAmt = cart?.free_shipping_fee?.free_need_amt;
        const freeTaxNeedAmt = cart?.free_tax_fee?.free_need_amt;
        lowPrice = freeShipNeedAmt > 0 ? freeShipNeedAmt : freeTaxNeedAmt;
      }
    } else {
      lowPrice = 0;
    }
  }
  navigationRef.current?.navigate('CartAddItems', {
    tabConfigs: configs,
    buttonAction: buttonAction,
    fromPage: fromPage,
    needLowPrice: lowPrice,
  });
};

export const productCoupon = async (product_id, product_type) => {
  const res = await Api.productCoupon(product_id, product_type);
  if (res.code === 0) {
    return res.data?.coupon_info;
  }
  return null;
};
//防抖函数
export const debounce = (fn, wait) => {
  let timer = null;
  return (...args) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.Apply(this, args);
    }, wait);
  };
};

//节流函数
export const throttle = (fn, wait) => {
  let timer = null;
  return (...args) => {
    if (!timer) {
      timer = setTimeout(() => {
        fn.Apply(this, args);
        timer = null;
      }, wait);
    }
  };
};
export const arrTrans = (num, arr) => {
  // 一维数组转换为二维数组
  const iconsArr = []; // 声明数组
  arr.forEach((item, index) => {
    const page = Math.floor(index / num); // 计算该元素为第几个素组内
    if (!iconsArr[page]) {
      // 判断是否存在
      iconsArr[page] = [];
    }
    iconsArr[page].push(item);
  });
  return iconsArr;
};
export default Utils;
