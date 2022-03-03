/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry, Platform} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {setCustomSourceTransformer} from 'react-native/Libraries/Image/resolveAssetSource';
import {getAndroidResourceIdentifier} from 'react-native/Libraries/Image/assetPathUtils';
import AppModule from './AppModule';

// 调试配置
global.rlog = () => {};
global.rlog.d = () => {};
console.log = () => {};
if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}
//重载图片资源获取方式，存在本地资源使用本地资源，否则使用在线资源
setCustomSourceTransformer((resolver) => {
  if (__DEV__) {
    return resolver.defaultAsset();
  }
  if (Platform.OS === 'android') {
    const source = getAndroidResourceIdentifier(resolver.asset);
    if (AppModule.isResourceExist(source)) {
      return resolver.resourceIdentifierWithoutScale();
    }
  }
  if (Platform.OS === 'ios') {
    const assetPath = resolver.scaledAssetPath().uri.replace(/\.\.\//g, '_');
    const assetUrl = AppModule.internalAssetPath(assetPath);
    if (assetUrl) {
      return assetUrl;
    }
  }

  if (AppModule.updateServerUrl) {
    resolver.serverUrl = AppModule.updateServerUrl;
    return resolver.assetServerURL();
  }
});

AppRegistry.registerComponent(appName, () => App);
