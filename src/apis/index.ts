import {
  CommentUploadResponse,
  DefaultApi,
  RegisterRequest,
} from '@luckydeal/api-common';
import nb64 from '@antispam/nb64';
import {ErrorMsg} from '../helper/message';
import {store} from '../redux/reducers';
import {
  BUNDLE_CODE,
  getDeviceInfo,
  iosFileUpload,
  VERSION_CODE,
} from '@src/helper/nativeBridge';
import {Platform} from 'react-native';
import {SERVER_URL} from '@src/constants/constants';
import {standardAction} from '@src/redux';
import {isIOS, isWeb} from '@src/helper/helper';
import {signOut} from '@src/redux/actions/standardAction';
import {navigate2Login} from '@src/routes';

const commonFetch = commonApiFetch;

export type ImageFile = {
  uri: string;
  [key: string]: string;
};

/**
 *
 * @param url 上传文件
 * @param options
 */
export const uploadFile = (files: ImageFile[]) => {
  const formdata = new FormData();
  files.forEach((file) => {
    formdata.append('file', file as any);
  });
  if (isIOS()) {
    return iosFileUpload(
      'comment/upload',
      files.map(({uri}) => uri),
    );
  }

  return commonApiFetch(`${SERVER_URL}/comment/upload`, {
    method: 'POST',
    body: formdata,
  })
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      return res as ResponseData<CommentUploadResponse>;
    });
};

const platform = Platform.OS === 'web' ? 'h5' : Platform.OS;

// 默认请求头
const DEFAULT_HEADER = {
  encrypt: 'web',
  version_code: VERSION_CODE,
  bundle_code: BUNDLE_CODE,
  platform,
};

// 默认请求体
const DEFAULT_BODY = {
  bundle_code: BUNDLE_CODE,
  platform,
  version_code: VERSION_CODE,
};

/**
 *
 * @param url 地址
 * @param options fetch 配置
 * @returns
 */
function commonApiFetch(url: string, options?: RequestInit) {
  return (async () => {
    let body: RequestInit['body'] = options?.body || '{}';
    const storeData = store.getState().persist.persistAuth;
    let tk = storeData.tk || '';
    if (!tk) {
      const {tk: tkValue} = await getDeviceInfo();
      tk = tkValue || '';
      standardAction.auth({...storeData, tk: tkValue});
    }
    const token = storeData.token || '';
    const headers = {
      tk,
      Authorization: token,
      ...DEFAULT_HEADER,
      ...options?.headers,
    };

    if (typeof body === 'string') {
      const bodyData = {tk, ...DEFAULT_BODY, ...JSON.parse(body)};
      // rlog(`url=${url}`, bodyData);
      // rlog(`url=${url} ---- headers`, headers);
      body = nb64.encode(JSON.stringify(bodyData));
    }

    return fetch(url, {...options, body, headers})
      .then(async (response) => {
        const cloneRes = response.clone();
        if (response.status >= 200 && response.status < 300) {
          const data = await response.json().catch((err) => {
            throw err;
          });
          if (data.code === 9100 || data.code === 9022) {
            if (isWeb()) {
              store.dispatch(signOut());
              navigate2Login();
            }
          }
          // 对于data code非0的， 统一抛出异常
          if (data.code !== 0) {
            throw new ErrorMsg(data.error || '', data.code);
          }
          return cloneRes;
        }

        return cloneRes;
      })
      .catch((err) => {
        throw err;
      });

    // const response = await ;

    // 对于状态码非 200~300 之间的 统一抛出异常
    // throw new ErrorMsg('Request error', -9999);
  })();
}

export interface facebookLoginParams {
  googleId?: string;
  fbId?: string;
  name: string;
  avatar: string;
  googleToken?: string;
  facebookToken?: string;
  email?: string;
}

export const loginApi = async (params: facebookLoginParams) => {
  const res = await CommonApi.registerUsingPOST({
    email: params.email,
    fb_id: params.fbId,
    google_id: params.googleId,
    nick_name: params.name,
    avatar: params.avatar,
    login_type: params.googleToken ? 3 : 1,
    google_user_token: params.googleToken,
    facebook_user_token: params.facebookToken,
    gender: 0,
    diversion_type: 0,
    device_id: '',
    appsflyer_id: '',
    platform: isIOS() ? 2 : 1,
    ld_channel: '',
  } as RegisterRequest);

  if (params.email) {
    try {
      await CommonApi.updateUserInfoUsingPOST(
        {
          email: params.email,
        },
        {headers: {Authorization: res.data.token}},
      );
    } catch (error) {}
  }

  return res;
};

export const CommonApi = new DefaultApi({}, SERVER_URL, commonFetch);
