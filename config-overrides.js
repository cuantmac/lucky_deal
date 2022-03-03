const {
  override,
  overrideDevServer,
  disableEsLint,
  babelInclude,
  babelExclude,
  addWebpackPlugin,
  addWebpackExternals,
} = require('customize-cra');
const path = require('path');
const {alias, configPaths} = require('react-app-rewire-alias');
const {DefinePlugin} = require('webpack');
const {name} = require('./package.json');

const APP_SRC = path.resolve(__dirname, 'src');

module.exports = {
  webpack: override(
    (config) => {
      config.output.library = `${name}-[name]`;
      config.output.libraryTarget = 'umd';
      config.output.jsonpFunction = `webpackJsonp_${name}`;
      config.output.globalObject = 'window';
      return config;
    },
    alias(configPaths('./tsconfig.paths.json')),
    disableEsLint(),

    babelInclude([
      path.resolve(APP_SRC),
      path.resolve('node_modules/react-native-gesture-handler'),
      path.resolve('node_modules/@sentry/react-native'),
      path.resolve('node_modules/react-native-reanimated'),
      path.resolve('node_modules/react-native-animatable'),
      path.resolve('node_modules/react-native-swiper'),
      path.resolve('node_modules/@react-navigation/native'),
      path.resolve('node_modules/react-native-webview'),
      path.resolve('node_modules/react-native-largelist-v3'),
      path.resolve('node_modules/react-native-spring-scrollview'),
      path.resolve('node_modules/react-native-branch'),
      path.resolve('node_modules/react-native-vector-icons'),
      path.resolve('node_modules/react-native-tab-view'),
      path.resolve('node_modules/react-native-image-picker'),
      path.resolve('node_modules/@react-native-picker'),
      path.resolve('node_modules/react-native-web'),
      path.resolve('node_modules/react-native-switch'),
    ]),
    babelExclude([path.resolve(APP_SRC, 'components')]),

    process.env.NODE_ENV === 'production' &&
      addWebpackExternals({
        react: 'React',
        'react-dom': 'ReactDOM',
        'redux-persist': 'ReduxPersist',
        redux: 'Redux',
        'react-redux': 'ReactRedux',
        'redux-thunk': 'ReduxThunk',
        '@innotechx/innoreport-js-sdk': 'innoReportSdk',
        'react-router-dom': 'ReactRouterDOM',
      }),
    addWebpackPlugin(
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development',
        ),

        __DEV__: process.env.NODE_ENV === 'development' || false,
      }),
    ),
  ),
  devServer: overrideDevServer((_) => {
    const config = _;
    config.headers = {
      'Access-Control-Allow-Origin': '*',
    };
    // config.historyApiFallback = true;
    // config.hot = false;
    // config.watchContentBase = false;
    // config.liveReload = false;
    return config;
  }),
};
