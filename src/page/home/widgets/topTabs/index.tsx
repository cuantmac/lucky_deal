import React, {FC, useMemo, useState} from 'react';
import {Dimensions} from 'react-native';
import {
  Route,
  SceneRendererProps,
  TabBar,
  TabView,
} from 'react-native-tab-view';
import TabContent from '@src/page/home/widgets/tabContent';
import {
  NewHomePageNavBarItem,
  PromoCodeInfoItem,
} from '@luckydeal/api-common/lib/api';

interface TopTabsProps {
  config: NewHomePageNavBarItem[];
  couponData?: PromoCodeInfoItem;
}

interface TopTabsRouteProps {
  title: string;
  key: string;
  id: number;
}

const {width: screenWidth} = Dimensions.get('window');

export const TopTabs: FC<TopTabsProps> = ({config, couponData}) => {
  const [index, setIndex] = useState(0);
  const routes = useMemo(() => {
    return config.map((item) => {
      return {
        title: item.name,
        id: item.id,
        key: item.id + '',
      };
    });
  }, [config]);

  const renderScene: FC<
    SceneRendererProps & {route: Route & TopTabsRouteProps}
  > = ({route}) => {
    return (
      <>
        <TabContent tabId={route.id} key={route.id} coupon={couponData} />
      </>
    );
  };
  const renderTabBar = (props: any) => {
    return (
      <TabBar
        {...props}
        indicatorStyle={{
          backgroundColor: '#000',
          height: 3,
          marginBottom: 9,
          opacity: 1,
        }}
        style={{
          backgroundColor: '#fff',
          display: props.navigationState.routes.length === 1 ? 'none' : 'flex',
        }}
        activeColor={'#000'}
        inactiveColor={'#757575'}
        labelStyle={{
          fontSize: 13,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
        scrollEnabled={true}
        tabStyle={{width: 'auto'}}
      />
    );
  };

  return (
    <TabView
      lazy
      renderTabBar={renderTabBar}
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: screenWidth}}
      swipeEnabled={false}
    />
  );
};
