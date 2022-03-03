import {NativeModules} from 'react-native';

const appModule = NativeModules.AppModule;
const logEnabled = !appModule.isLogEnabled || appModule.isLogEnabled();

export default {
  devMode: appModule.devMode,
  versionCode: appModule.versionCode,
  versionName: appModule.versionName,
  buildId: appModule.buildId,
  updateServerUrl: appModule.updateServerUrl,
  hideSplash() {
    if (!appModule.hideSplash) {
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    }
    return appModule.hideSplash();
  },
  register({token, user_id}) {
    appModule.register && appModule.register(token, user_id.toString());
  },
  async charge(chargeType) {
    return JSON.parse(await appModule.charge(chargeType));
  },
  async getDeviceInfo() {
    if (!appModule.getDeviceInfo) {
      return {};
    }
    return await appModule.getDeviceInfo();
  },
  getTargetItemId() {
    if (!appModule.getTargetItemId) {
      return {};
    }
    return appModule.getTargetItemId();
  },
  getTargetItemType() {
    if (!appModule.getTargetItemType) {
      return {};
    }
    return appModule.getTargetItemType();
  },
  get(url) {
    return new Promise((resolve, reject) => {
      if (!appModule.fetch) {
        reject();
      }
      appModule.fetch('GET', url, null, (res) => {
        this.log(res);
        resolve(JSON.parse(res));
      });
    });
  },
  post(url, body) {
    if (body) {
      this.log('request', url, body);
    }
    return new Promise((resolve, reject) => {
      if (!appModule.fetch) {
        reject();
      }
      appModule.fetch('POST', url, JSON.stringify(body), (res) => {
        this.log(res);
        resolve(JSON.parse(res));
      });
    });
  },
  report(category, action, args) {
    this.log('report', category, action, args);
    appModule.report && appModule.report(category, action, args);
  },
  reportPv(pv, args) {
    this.log('pv', pv, args);
    const uploadArgs = {};
    if (args) {
      Object.keys(args).forEach((key) => {
        let value = args[key];
        uploadArgs[key] = value + '';
      });
    }
    uploadArgs.bundle_code = appModule.getActiveBundleVersion() + '';
    uploadArgs.Version = appModule.versionCode + '';
    appModule.report &&
      appModule.report(pv, 'ld_pv', {type: 'pv', ...uploadArgs});
  },
  reportTap(category, action, args) {
    this.log('tap', category, action, args);
    const uploadArgs = {};
    if (args) {
      Object.keys(args).forEach((key) => {
        let value = args[key];
        uploadArgs[key] = value + '';
      });
    }
    uploadArgs.bundle_code = appModule.getActiveBundleVersion() + '';
    uploadArgs.Version = appModule.versionCode + '';
    appModule.report &&
      appModule.report(category, action, {type: 'tap', ...uploadArgs});
  },

  reportShow(category, action, args) {
    this.log('show', category, action, args);
    const uploadArgs = {};
    if (args) {
      Object.keys(args).forEach((key) => {
        let value = args[key];
        uploadArgs[key] = value + '';
      });
    }
    uploadArgs.bundle_code = appModule.getActiveBundleVersion() + '';
    uploadArgs.Version = appModule.versionCode + '';
    appModule.report &&
      appModule.report(category, action, {type: 'show', ...uploadArgs});
  },

  reportClick(category, action, args) {
    this.log('click', category, action, args);
    const uploadArgs = {};
    if (args) {
      Object.keys(args).forEach((key) => {
        let value = args[key];
        uploadArgs[key] = value + '';
      });
    }
    uploadArgs.bundle_code = appModule.getActiveBundleVersion() + '';
    uploadArgs.Version = appModule.versionCode + '';
    appModule.report &&
      appModule.report(category, action, {type: 'click', ...uploadArgs});
  },
  reportClose(category, action, args) {
    this.log('Close', category, action, args);
    const uploadArgs = {};
    if (args) {
      Object.keys(args).forEach((key) => {
        let value = args[key];
        uploadArgs[key] = value + '';
      });
    }
    uploadArgs.bundle_code = appModule.getActiveBundleVersion() + '';
    uploadArgs.Version = appModule.versionCode + '';
    appModule.report &&
      appModule.report(category, action, {type: 'close', ...uploadArgs});
  },
  reportGeneral(category, action, args) {
    this.log('general', category, action, args);
    const uploadArgs = {};
    if (args) {
      Object.keys(args).forEach((key) => {
        let value = args[key];
        uploadArgs[key] = value + '';
      });
    }
    uploadArgs.bundle_code = appModule.getActiveBundleVersion() + '';
    uploadArgs.Version = appModule.versionCode + '';
    appModule.report &&
      appModule.report(category, action, {type: 'general', ...uploadArgs});
  },
  reportValue(category, action, args) {
    this.log('value', category, action, args);
    const uploadArgs = {};
    if (args) {
      Object.keys(args).forEach((key) => {
        let value = args[key];
        uploadArgs[key] = value + '';
      });
    }
    uploadArgs.bundle_code = appModule.getActiveBundleVersion() + '';
    uploadArgs.Version = appModule.versionCode + '';
    appModule.report &&
      appModule.report(category, action, {type: 'value', ...uploadArgs});
  },
  requestNotify() {
    appModule.requestNotify && appModule.requestNotify();
  },

  showPop(type, title, note, url, platform) {
    appModule.showPop && appModule.showPop(type, title, note, url, platform);
  },

  //单位秒
  async addToCalendar(beginTime, endTime, title, desc) {
    return await (appModule.addToCalendar &&
      appModule.addToCalendar(beginTime, endTime, title, desc));
  },

  //android only
  isResourceExist(source) {
    return appModule.isResourceExist && appModule.isResourceExist(source);
  },

  //ios only
  internalAssetPath(asset) {
    return appModule.internalAssetPath && appModule.internalAssetPath(asset);
  },

  async checkUpdate() {
    if (appModule.checkUpdate) {
      return appModule.checkUpdate();
    }
  },

  installBundle() {
    appModule.installBundle && appModule.installBundle();
  },

  getActiveBundleVersion() {
    if (appModule.getActiveBundleVersion) {
      return appModule.getActiveBundleVersion();
    }
  },

  //ios only
  async upload(url, file) {
    if (appModule.upload) {
      return appModule.upload(url, file);
    }
  },

  openPayPalUrl(url, address) {
    const uploadArgs = {};
    this.log('url:' + url);
    this.log('address:' + JSON.stringify(address));
    Object.keys(address).forEach((key) => {
      let value = address[key];
      uploadArgs[key] = value + '';
    });
    uploadArgs.bundle_code = appModule.getActiveBundleVersion() + '';
    appModule.openPayPalUrl && appModule.openPayPalUrl(url, uploadArgs);
  },

  aisaBillPay(payInfo, callBack) {
    const payInfoMap = {};
    Object.keys(payInfo).forEach((key) => {
      let value = payInfo[key];
      payInfoMap[key] = value + '';
    });
    appModule.aisaBillPay && appModule.aisaBillPay(payInfoMap, callBack);
  },

  openYFKChat(nickName, clientId, imgUrl, title, subTitle, price, orderId) {
    appModule.openYFKChat &&
      appModule.openYFKChat(
        nickName,
        clientId + '',
        imgUrl || '',
        title || '',
        subTitle || '',
        price,
        orderId,
      );
  },

  getGooglePlayReferrer() {
    if (appModule.getGooglePlayReferrer) {
      return appModule.getGooglePlayReferrer();
    }
  },

  async unreadMsgCount() {
    if (!appModule.unreadMsgCount) {
      return 0;
    }
    return await appModule.unreadMsgCount();
  },

  log(message, ...args) {
    if (logEnabled) {
      console.log(message, args);
    }
  },
};
