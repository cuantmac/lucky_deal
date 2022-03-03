import App from './App.web';
import {AppRegistry} from 'react-native';
import ReactDOM from 'react-dom';

function render(props) {
  const {container} = props;
  AppRegistry.registerComponent('App', () => App);
  AppRegistry.runApplication('App', {
    rootTag: container
      ? container.querySelector('#root')
      : document.querySelector('#root'),
  });
}

if (!window.__POWERED_BY_QIANKUN__) {
  // 修复 移动端点击穿透问题
  var FastClick = require('fastclick');
  FastClick.attach(document.body);

  render({});
}

export async function bootstrap() {
  console.log('[react16] react app bootstraped');
}

export async function mount(props) {
  console.log('[react16] props from main framework', props);
  render(props);
}

export async function unmount(props) {
  const {container} = props;
  ReactDOM.unmountComponentAtNode(
    container
      ? container.querySelector('#root')
      : document.querySelector('#root'),
  );
}

window.rlog = console.log;
