import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-community/async-storage';

Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure()
  .useReactNative({
    overlay: false,
  })
  .connect();

global.rlog = Reactotron.log;
global.rlog.d = (name, value) => {
  Reactotron.display({
    name,
    value,
  });
};
