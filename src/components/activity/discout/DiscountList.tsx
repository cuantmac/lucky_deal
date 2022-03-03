import React, {useLayoutEffect, useEffect, FC} from 'react';
import {View} from 'react-native';
import ListenPayBackPress from '../../common/ListenPayBackPress';
import ListComponent from './ListComponent';
// import {dialogs} from '../../utils/refs';
import BadgeCartButton from '../../cart/BadgeCartButton';
// import {productWithTabsViewReportPath} from '../../../analysis/report';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
const BadgeCartButtonRef = BadgeCartButton as any;
import AppModule from '../../../../AppModule';
import {APPLY_COUPON_PAGE_ENUM} from '../../../constants/enum';
import {useMarketCouponCheck} from '../../home/CheckCouponDialog';
import {useState} from 'react';
import {useCallback} from 'react';
interface DataParams {
  activity_id: number;
}

type MainNavigationPrams = {
  screen: string;
  params: {screen: string};
};
type NavigationParams = {
  DiscountList: DataParams;
  Main: MainNavigationPrams;
};
const DiscountList: FC = () => {
  useMarketCouponCheck(APPLY_COUPON_PAGE_ENUM.ACTIVITY);
  const navigation = useNavigation<StackNavigationProp<NavigationParams>>();
  const {params} = useRoute<RouteProp<NavigationParams, 'DiscountList'>>();
  const [title, setTitle] = useState<string>('');
  const {activity_id} = params;

  const handleTitleChange = useCallback((t: string) => {
    setTitle(t);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: '#fff'},
      headerTitleAlign: 'center',
      title,
      headerRight: () => {
        return <BadgeCartButtonRef sourceType={4} headerRight={true} />;
      },
    });
  }, [navigation, title]);

  useEffect(() => {
    AppModule.reportShow('15', '500');
  }, []);

  return (
    <View style={{flex: 1}}>
      <ListenPayBackPress
        onGoBack={() => navigation.goBack()}
        interrupt={true}
      />

      <ListComponent
        activity_id={activity_id}
        onTitleChange={handleTitleChange}
      />
    </View>
  );
};

export default DiscountList;
