const fs = require('fs');

const CONTENT_PATH = './node_modules/react-native-web/dist/index.js';

writeContent('export const ViewPropTypes = { style: null };');
writeContent('export const requireNativeComponent = () => {};');
fixReactNavigation();
fixReactNativeWebEnterkeyhintWran();
fixReactNativeTabViewWebIndicatorPosition();
fixSpringScrollView();

function writeContent(wirteContent) {
  let content = fs.readFileSync(CONTENT_PATH).toString();
  if (content.indexOf(wirteContent) !== -1) {
    console.log(wirteContent + ' fixed already!');
  } else {
    fs.writeFileSync(CONTENT_PATH, content + wirteContent);
  }
  console.log('【writeContent】(' + wirteContent + '): success;');
}

// 修复react navigation 在web中 返回出现路由错误问题
function fixReactNavigation() {
  const content = fs.readFileSync('./scripts/patch/useLinking.tsx').toString();
  let packageObj = JSON.parse(
    fs
      .readFileSync('./node_modules/@react-navigation/native/package.json')
      .toString(),
  );
  packageObj.main = 'src/index.tsx';
  delete packageObj['react-native'];
  delete packageObj.source;
  delete packageObj.module;
  fs.writeFileSync(
    './node_modules/@react-navigation/native/src/useLinking.tsx',
    content,
  );
  fs.writeFileSync(
    './node_modules/@react-navigation/native/package.json',
    JSON.stringify(packageObj),
  );
  console.log('【fixReactNavigation】: success;');
}

// 修复react native web enterkeyhint warn
function fixReactNativeWebEnterkeyhintWran() {
  const textInputPath =
    './node_modules/react-native-web/dist/exports/TextInput/index.js';
  const content = fs.readFileSync(textInputPath).toString();
  fs.writeFileSync(
    textInputPath,
    content.replace('enterKeyHint', 'enterkeyhint'),
  );
  console.log('【fixReactNativeWebEnterkeyhintWran】: success;');
}

// 修复react native tab view 在web上 出现滚动后 indicator 位置问题
function fixReactNativeTabViewWebIndicatorPosition() {
  const PACKAGE_JSON_PATH = './node_modules/react-native-tab-view/package.json';
  const content = fs.readFileSync('./scripts/patch/TabBar.tsx').toString();
  let packageObj = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH).toString());
  packageObj.main = 'src/index.tsx';
  packageObj['react-native'] = 'src/index.tsx';
  packageObj.module = 'src/index.tsx';
  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageObj));
  fs.writeFileSync(
    './node_modules/react-native-tab-view/src/TabBar.tsx',
    content,
  );
  console.log('【fixReactNativeTabViewWebIndicatorPosition】: success;');
}

function fixSpringScrollView() {
  var rootDir = process.cwd();

  var file = `${rootDir}/node_modules/react-native-spring-scrollview/SpringScrollView.js`;
  var data = fs.readFileSync(file, 'utf8');
  var dataFix = 'react-native/Libraries/Components/TextInput/TextInputState';

  if (data.indexOf(dataFix) === -1) {
    var result = data.replace(/react-native\/lib\/TextInputState/g, dataFix);
    fs.writeFileSync(file, result, 'utf8');
  }

  var file = `${rootDir}/node_modules/react-native-spring-scrollview/ios/SpringScrollView/STSpringScrollContentViewManager.h`;
  var dataFix = `#import <UIKit/UIKit.h>
#import <React/RCTScrollContentViewManager.h>

NS_ASSUME_NONNULL_BEGIN

@interface STSpringScrollContentViewManager : RCTScrollContentViewManager

@end

NS_ASSUME_NONNULL_END
`;

  fs.writeFileSync(file, dataFix, 'utf8');

  var file = `${rootDir}/node_modules/react-native-spring-scrollview/ios/SpringScrollView/STSpringScrollView.m`;
  var data = fs.readFileSync(file, 'utf8');

  var result = data.replace(
    '[self.scrollView addObserver:self forKeyPath:@"contentSize" options:NSKeyValueObservingOptionNew context:nil];',
    '',
  );
  fs.writeFileSync(file, result, 'utf8');
  console.log('【fixSpringScrollView】: success;');
}
