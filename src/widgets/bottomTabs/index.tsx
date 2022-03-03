import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BACKGROUND_BASE_COLOR} from '@src/constants/colors';
import {createStyleSheet} from '@src/helper/helper';
import {ProductsRoute} from '@src/routes';
import {useShallowEqualSelector} from '@src/utils/hooks';
import React, {FC, memo} from 'react';
import {Text, View, Image} from 'react-native';

interface ConfigItem {
  name: string;
  routeName: string;
  icon: number;
  activeIcon: number;
  component: FC;
}

export type BottomTabsProps = {
  config: ConfigItem[];
};

const Tabs = createBottomTabNavigator();

export const BottomTabs: FC<BottomTabsProps> = memo(({config}) => {
  const ProductsRouter = ProductsRoute.useRouteLink();
  return (
    <Tabs.Navigator
      sceneContainerStyle={{
        backgroundColor: BACKGROUND_BASE_COLOR,
      }}
      initialRouteName="Home"
      tabBarOptions={{
        inactiveTintColor: '#9a9a9a',
        activeTintColor: '#222',
        tabStyle: {
          justifyContent: 'center',
        },
        style: BottomTabsStyles.container,
      }}>
      {config.map((item) => {
        return (
          <Tabs.Screen
            key={item.name}
            component={item.component}
            name={item.routeName}
            listeners={{
              tabPress: (e) => {
                if (item.name === ProductsRoute.name) {
                  e.preventDefault();
                  ProductsRouter.navigate({});
                }
              },
            }}
            options={{
              tabBarLabel: (props) => <BarLabel {...props} item={item} />,
            }}
          />
        );
      })}
    </Tabs.Navigator>
  );
});

const BarLabel: FC<{
  item: ConfigItem;
  focused: boolean;
  color: string;
}> = ({item, focused}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {item.icon ? (
        <View>
          <Image
            resizeMode={'contain'}
            style={BottomTabsStyles.iconImage}
            source={focused ? item.activeIcon : item.icon}
          />
          {/* {item.name === 'Bag' && <CartDotNum />}
          {item.name === 'Me' && <MeDotNum />} */}
        </View>
      ) : null}
      <Text numberOfLines={2} style={BottomTabsStyles.labelText}>
        {item.name}
      </Text>
    </View>
  );
};

const MeDotNum = () => {
  const unreadMsgCount = useShallowEqualSelector(
    (state: any) => state.deprecatedPersist.unreadMsgCount,
  );
  return <DotNum count={unreadMsgCount as number} />;
};

const CartDotNum = () => {
  const cartNum = useShallowEqualSelector(
    (state: any) => state.deprecatedPersist.cartNum,
  );
  return <DotNum count={cartNum as number} />;
};

interface DotNumProps {
  count?: number;
}

const DotNum: FC<DotNumProps> = memo(({count}) => {
  return count ? (
    <Text
      style={{
        position: 'absolute',
        right: -8,
        top: -3,
        borderColor: '#FF4A1A',
        borderWidth: 2,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        width: 16,
        height: 16,
        lineHeight: 15,
        color: '#FF4A1A',
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: count > 99 ? 8 : count >= 10 ? 10 : 14,
        padding: 2,
        alignItems: 'center',
      }}>
      {count > 99 ? '99+' : count}
    </Text>
  ) : null;
});

const BottomTabsStyles = createStyleSheet({
  container: {
    height: 50,
  },
  iconImage: {
    width: 18,
    height: 20,
  },
  labelText: {
    color: '#222',
    fontSize: 10,
    lineHeight: 12,
  },
});
