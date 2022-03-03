import Axios from 'axios';
import {Buffer} from 'buffer';
const axios = Axios.create({
  baseURL: 'https://openapis.7moor.com',
});

const md5 = require('md5');

Date.prototype.Format = function (fmt) {
  const o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length),
    );
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
      );
    }
  }
  return fmt;
};

export default {
  queryUnReadMessageCount() {
    const account = 'T00000020567'; //  替换为您的账户
    const secret = '182dd200-7cab-11eb-b4d2-03935450edd6'; // 替换为您的api密码
    const time = new Date().Format('yyyyMMddhhmmss');
    const auth = new Buffer(account + ':' + time).toString('base64');
    const sign = md5(account + secret + time).toUpperCase();
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: auth,
    };
    return axios.post(
      `/v20170418/webChat/queryWebchatSession/${account}?sig=${sign}`,
      {pageSize: 10},
      {
        headers: headers,
      },
    );
  },
};
