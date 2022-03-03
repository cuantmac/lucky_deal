import {String} from 'aws-sdk/clients/cloudwatchevents';
import * as React from 'react';
import {View, useWindowDimensions} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';

interface sceneConfigProps {
  routes: any[];
  scene: any;
}
interface TabViewProps {
  sceneConfig: sceneConfigProps;
}

const TabViewComponent: React.FC<TabViewProps> = ({sceneConfig}) => {
  const renderScene = SceneMap(sceneConfig.scene);
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState(sceneConfig.routes);

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
    />
  );
};
export default TabViewComponent;
