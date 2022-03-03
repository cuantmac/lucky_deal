import {PRIMARY} from '@src/constants/colors';
import {BUTTON_TYPE_ENUM} from '@src/widgets/button';
import {AlertManager, AlertParams} from '@src/widgets/modal/alert';
import {ToastManager} from '@src/widgets/modal/toast';
import {ReactNode} from 'react';

export type ErrorMessage = string;
export type Code = string | number;
/**
 * 接口异常错误信息
 * 用于项目中接口异常提示部分
 */
export class ErrorMsg extends Error {
  public message: ErrorMessage;

  public code?: Code;

  /**
   * 生成错误信息和代码
   *
   * @param message 错误信息
   * @param code 错误代码
   */
  constructor(message: ErrorMessage, code?: Code) {
    super(message);
    this.message = message;
    this.code = code;
  }
}

/**
 * 处理异常信息、提示信息、loading
 */
export class Message {
  /**
   * 显示确认选择弹窗
   *
   * @param title 标题
   * @param msg 确认信息
   */
  public static confirm(params: AlertParams) {
    AlertManager.alert(params);
  }

  /**
   * 弹出toast提示
   *
   * @param msg ErrorMsg | string
   */
  public static toast(msg: ErrorMsg | string | undefined | unknown) {
    if (!msg) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      let message = '';

      if (msg instanceof ErrorMsg) {
        message = msg.message;
      } else if (typeof msg === 'string') {
        message = msg;
      } else {
        ToastManager.hide();
        throw msg;
      }

      if (message) {
        ToastManager.toast(message).then(() => {
          resolve();
        });
      } else {
        ToastManager.hide();
      }
    });
  }

  /**
   * 显示加载指示器
   */
  public static loading() {
    ToastManager.loading();
  }

  /**
   * 关闭加载指示器或者loading
   */
  public static hide() {
    ToastManager.hide();
  }
}
