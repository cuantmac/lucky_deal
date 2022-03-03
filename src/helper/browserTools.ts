/* eslint-disable require-jsdoc */
export class BrowserTools {
  static isTiktok() {
    return navigator.userAgent.indexOf('ByteLocale') !== -1;
  }

  static isSafariBrowser() {
    return (
      /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
    );
  }
}
