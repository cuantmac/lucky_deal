import Axios from 'axios';
import {SERVER_URL} from './constants/constants';
import {store} from './redux';
import AppModule from '../AppModule';
import nb64 from '@antispam/nb64';
import {Platform} from 'react-native';
import Utils from './utils/Utils';
const axios = Axios.create({
  //baseURL: 'http://10.105.37.34:9001',
  baseURL: SERVER_URL,
  timeout: 15000,
});
const disableLogs = ['/user/status', 'auction/loop', 'auction/list'];

axios.interceptors.request.use(async (config) => {
  if (config.headers.retry) {
    return config;
  }
  let {token, deviceInfo} = store.getState().deprecatedPersist;
  if (!deviceInfo.tk) {
    deviceInfo = await AppModule.getDeviceInfo();
    store.dispatch({type: 'setDeviceInfo', payload: deviceInfo});
  }
  let reqHeaders = config.headers;

  // });
  config.headers = {
    Authorization: token,
    platform: Platform.OS,
    encrypt: 'web',
    tk: deviceInfo.tk,
    version_code: AppModule.versionCode,
    bundle_code: AppModule.getActiveBundleVersion(),
    ...reqHeaders,
  };
  if (config.method === 'post') {
    let reqData = config.data;
    if (config.headers['Content-Type'] !== 'multipart/form-data') {
      let finalBody = {
        token: token,
        version_code: AppModule.versionCode,
        bundle_code: AppModule.getActiveBundleVersion(),
        platform: Platform.OS,
        tk: deviceInfo.tk,
        ...reqData,
      };
      if (!disableLogs.includes(config.url)) {
        // console.log('axios request', config.url, finalBody);
      }
      console.log('axios request', config.url, finalBody);
      // console.log('axios request', config.url, config);
      config.data = nb64.encode(JSON.stringify(finalBody));
      // console.log('axios request', config.url, config.data);
    }
  } else if (!disableLogs.includes(config.url)) {
    // console.log('axios request', config.method, config.url, config.headers);
  }
  // console.log('axios enc', config);
  return config;
});

axios.interceptors.response.use((response) => {
  // console.log('axios response', response.config.url, response);
  if (!disableLogs.includes(response.config.url)) {
    console.log('axios response', response.config.url, response.data);
  }
  if (response.data && response.status === 200) {
    return response.data;
  } else {
    Utils.toastFun(response.data?.toString() || 'unknown error');
    return Promise.reject(new Error(response.config.url + ' error'));
  }
});

export default {
  async post(url, body, headers) {
    try {
      return await axios.post(url, body, {
        headers: headers,
      });
    } catch (err) {
      Utils.toastFun(err?.toString() || 'unknown error');
      if (!disableLogs.includes(url)) {
        console.log('axios response error', url, err.response?.data || err);
      }
      return {
        code: 500,
        error: err,
        data: null,
      };
    }
  },
  async get(url, headers) {
    try {
      return await axios.get(url, {
        headers: headers,
      });
    } catch (err) {
      Utils.toastFun(err?.toString() || 'unknown error');
      if (!disableLogs.includes(url)) {
        console.log('axios response error', url, err);
      }
      return {
        code: 500,
        error: err,
        data: null,
      };
    }
  },
  postUpload(url, files, cb) {
    // return new Promise(resolve => {
    if (Platform.OS === 'android') {
      let formdata = new FormData();
      files.forEach((item) => {
        formdata.append('file', item);
      });
      return axios
        .post(
          url,
          formdata,
          {headers: {'Content-Type': 'multipart/form-data'}},
          // res => {
          //   console.log('url-res', res);
          //   resolve(JSON.parse(res));
          // },
        )
        .then((res) => {
          if (res.code === 0) {
            cb(res.data);
          }
        });
    } else {
      AppModule.upload(
        url,
        files.map((item) => item.uri),
      ).then((res) => {
        console.log(res);
        let json = JSON.parse(res);
        if (json.code === 0) {
          cb(json.data);
        }
      });
    }
  },
};
