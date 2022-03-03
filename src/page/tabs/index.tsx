import {createLazyPage} from '@src/helper/helper';
import {HomeRoute, ProductsRoute, ShopRoute} from '@src/routes';
import {BottomTabs, BottomTabsProps} from '@src/widgets/bottomTabs';
import React, {FC, useState} from 'react';

const Tabs: FC = () => {
  const [config] = useState<BottomTabsProps['config']>(() => {
    return [
      {
        name: 'Home',
        routeName: HomeRoute.name,
        icon: require('../../assets/b_home_icon.png'),
        activeIcon: require('../../assets/b_home_icon_active.png'),
        component: HomeRoute.component,
      },
      {
        name: 'Products',
        routeName: ProductsRoute.name,
        icon: require('../../assets/b_category_icon.png'),
        activeIcon: require('../../assets/b_category_icon_active.png'),
        component: ProductsRoute.component,
      },
      {
        name: 'Bag',
        routeName: ShopRoute.name,
        icon: require('../../assets/b_cart_icon.png'),
        activeIcon: require('../../assets/b_cart_icon_active.png'),
        component: ShopRoute.component,
      },
      {
        name: 'Me',
        routeName: 'Me',
        icon: require('../../assets/b_user_icon.png'),
        activeIcon: require('../../assets/b_user_icon_active.png'),
        component: createLazyPage(() => import('@src/page/me')),
      },
    ];
  });
  return <BottomTabs config={config} />;
};

export default Tabs;
