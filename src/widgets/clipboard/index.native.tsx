import NativeClipboard from '@react-native-community/clipboard';

export class Clipboard {
  static setString(str: string) {
    return NativeClipboard.setString(str);
  }
}
