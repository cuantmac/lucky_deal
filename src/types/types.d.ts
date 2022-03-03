declare module 'react-native-input-spinner';
declare module 'react-native-branch';
declare module 'react-native-autoheight-webview';
declare module '@antispam/nb64';
declare module 'react-native-web';
declare module 'react-native-modals';
declare module 'video-react';

// 将url参数转成string
type ValueString<T> = {
  [P in keyof T]: NonNullable<T[P]> extends any[] ? string[] | string : string;
};

type RlogFunc = {
  (...args: any[]): void;
  d: (name: string, value: any) => void;
};
declare var rlog: RlogFunc;
declare module NodeJS {
  interface Global {
    rlog: RlogFunc;
  }
}

interface Window {
  __POWERED_BY_QIANKUN__?: boolean;
  tk: string;
  URL_CACHE: string;
}

type ResponseData<T> = {
  code: number;
  data: T;
  error?: string;
};
