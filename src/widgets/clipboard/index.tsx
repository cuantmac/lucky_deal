import {Clipboard as WebClipboard} from 'react-native';

export class Clipboard {
  static setString(str: string) {
    return WebClipboard.setString(str);
  }
}
