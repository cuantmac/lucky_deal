import React, {FC, useEffect} from 'react';
import {Dimensions} from 'react-native';
import {px} from '../../../constants/constants';
import {
  SalesCateInfoItem,
  SessionInfoItem,
} from '../../../types/models/activity.model';
import Empty from '../../common/Empty';

import ItemTabList from './ItemTabList';
import {
  TabView,
  TabBar,
  Route,
  SceneRendererProps,
} from 'react-native-tab-view';

const {width: screenWidth} = Dimensions.get('window');

interface TimeItemTabsProps {
  tabConfig: SalesCateInfoItem[];
  timeTabData: SessionInfoItem;
}
export type TimeItemTabsConfigProps = {
  cate_id: number;
  image: string;
  title: string;
  key: string;
  session_id: number;
  i: number;
};
const TimeItemTabs: FC<TimeItemTabsProps> = ({tabConfig, timeTabData}) => {
  const [index, setIndex] = React.useState(0);
  const [routes, setRoutes] = React.useState<TimeItemTabsConfigProps[]>(
    [] as TimeItemTabsConfigProps[],
  );

  const renderScene: FC<
    SceneRendererProps & {route: Route & TimeItemTabsConfigProps}
  > = ({route}) => {
    return (
      <ItemTabList route={route} timeTabData={timeTabData} activeTab={index} />
    );
  };
  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: '#000'}}
      style={{backgroundColor: '#fff'}}
      activeColor={'#000'}
      inactiveColor={'#999'}
      labelStyle={{fontSize: 26 * px}}
      scrollEnabled={true}
      tabStyle={{with: screenWidth}}
    />
  );
  useEffect(() => {
    if (!tabConfig || !tabConfig.length) {
      return;
    }
    setIndex(0);
    let _routes = tabConfig.map((item, i) => {
      return {
        i: i,
        key: item.cate_id.toString(),
        session_id: timeTabData.session_id,
        ...item,
      };
    });
    setRoutes(_routes);
  }, [timeTabData.session_id, tabConfig]);
  if (!tabConfig || !tabConfig.length) {
    return <Empty title={'Nothing at all'} />;
  }
  return (
    <TabView
      renderTabBar={renderTabBar}
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: screenWidth}}
      swipeEnabled={false}
    />
  );
};

export default TimeItemTabs;
