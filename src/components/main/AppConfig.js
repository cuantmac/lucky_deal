import {useEffect, useState} from 'react';
import Api from '../../Api';
import {useDispatch} from 'react-redux';

export default function AppConfig({app_id}) {
  const dispatch = useDispatch();
  const [appId, setAppId] = useState(app_id);
  useEffect(() => {
    Api.appConfig(appId).then((res) => {
      let data = res.data;
      if (data) {
        dispatch({type: 'updateConfig', payload: data});
      }
    });
  }, [dispatch, appId]);

  return [setAppId];
}
