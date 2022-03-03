import {
  AddressItem,
  AisaBillPayInfo,
  CommentUploadResponse,
} from '@luckydeal/api-common';
import {NativeModules, Platform} from 'react-native';
import {isWeb} from './helper';

const appModule = NativeModules.AppModule;
const logEnabled = !appModule?.isLogEnabled || appModule?.isLogEnabled();

// 是否是开发模式
export const DEV_MODE = isWeb()
  ? process.env.NODE_ENV === 'development'
  : !!appModule?.devMode;

// 获取版本号
export const VERSION_CODE = isWeb() ? 999 : appModule?.versionCode;

export const VERSION_NAME: string = isWeb() ? '1.0.0' : appModule.versionName;

export const BUILD_ID: string = isWeb() ? '1' : appModule.buildId;
// bundle code
export const BUNDLE_CODE = isWeb() ? 999 : appModule?.getActiveBundleVersion();
export const PLATFORM = Platform.OS;

interface GetDeviceInfoReturn {
  tk?: string;
  android_version?: string;
}
export const getDeviceInfo = async (): Promise<GetDeviceInfoReturn> => {
  if (isWeb()) {
    return {tk: window.tk, android_version: '1'};
  }
  if (!appModule.getDeviceInfo) {
    return {};
  }
  return await appModule.getDeviceInfo();
};

// 打开paypal 支付地址
export const openPayPalUrl = (url: string, address: AddressItem) => {
  const obj: Record<string, string> = {};
  Object.keys(address).forEach((key) => {
    obj[key] = (address as any)[key] + '';
  });
  appModule.openPayPalUrl &&
    appModule.openPayPalUrl(url, {
      ...obj,
      bundle_code: appModule?.getActiveBundleVersion() + '',
    });
};

// 打开 AisaBill 支付地址
export const openAisaBillPay = (
  payInfo: AisaBillPayInfo,
  callBack: (status: boolean) => void,
) => {
  const payInfoMap: Record<string, string> = {};
  Object.keys(payInfo).forEach((key) => {
    payInfoMap[key] = (payInfo as any)[key] + '';
  });
  appModule.aisaBillPay && appModule.aisaBillPay(payInfoMap, callBack);
};

export const showPop = (
  type: string,
  title: string,
  note: string,
  url: string,
  platform: string,
) => {
  appModule.showPop && appModule.showPop(type, title, note, url, platform);
};

//ios 文件上传
export const iosFileUpload = (
  url: string,
  files: string[],
): Promise<ResponseData<CommentUploadResponse>> => {
  return appModule.upload(url, files).then((res: string) => {
    let json = JSON.parse(res);
    if (json.code === 0) {
      return json;
    }
    throw new Error('file upload error');
  });
};

export const getActiveBundleVersion = () => {
  if (appModule?.getActiveBundleVersion) {
    return appModule.getActiveBundleVersion() as string;
  }
  return '';
};
