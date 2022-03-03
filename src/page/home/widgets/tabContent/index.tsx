import React, {FC, useCallback, useEffect, useState} from 'react';
import {Message} from '@src/helper/message';
import {FlatList} from 'react-native';
import {useLoading} from '@src/utils/hooks';
import {CommonApi} from '@src/apis';
import {
  NewHomePageDataItem,
  PromoCodeInfoItem,
  ResponseDataNewHomePageDataResponse,
} from '@luckydeal/api-common/lib/api';
import {
  IMG_1_1,
  IMG_1_2,
  PRODUCT_1_1,
  PRODUCT_1_2,
  PRODUCT_1_2_5,
  PRODUCT_1_3,
  PRODUCT_1_3_5,
  PRODUCT_2_3,
  SWIPER,
} from '../RenderItem';
import {HOME_COMPONENT_TYPE} from '@src/constants/enum';
import {ProductPolicy} from '@src/widgets/productDetail/productPolicy';
import {PageStatusControl} from '@src/widgets/pageStatusControl';
import Empty from '../empty';
import {CouponContent} from '../couponContent';

interface TabContentProp {
  tabId: number;
  coupon?: PromoCodeInfoItem;
}

interface ItemProps {
  item: NewHomePageDataItem;
}

const TabContent: FC<TabContentProp> = ({tabId, coupon}) => {
  const [tabData, setTabData] = useState<NewHomePageDataItem[]>();
  const [loading, withLoading] = useLoading();

  const renderItem: FC<ItemProps> = ({item}) => {
    switch (item.type) {
      case HOME_COMPONENT_TYPE.IMG_1_1:
        return <IMG_1_1 tabId={tabId} item={item} onPress={() => {}} />;
      case HOME_COMPONENT_TYPE.IMG_1_2:
        return <IMG_1_2 tabId={tabId} item={item} onPress={() => {}} />;
      case HOME_COMPONENT_TYPE.PRODUCT_1_1:
        return <PRODUCT_1_1 tabId={tabId} item={item} onPress={() => {}} />;
      case HOME_COMPONENT_TYPE.PRODUCT_1_2:
        return <PRODUCT_1_2 tabId={tabId} item={item} onPress={() => {}} />;
      case HOME_COMPONENT_TYPE.PRODUCT_1_3:
        return <PRODUCT_1_3 tabId={tabId} item={item} onPress={() => {}} />;
      case HOME_COMPONENT_TYPE.PRODUCT_1_2_5:
        return <PRODUCT_1_2_5 tabId={tabId} item={item} onPress={() => {}} />;
      case HOME_COMPONENT_TYPE.PRODUCT_1_3_5:
        return <PRODUCT_1_3_5 tabId={tabId} item={item} onPress={() => {}} />;
      case HOME_COMPONENT_TYPE.PRODUCT_2_3:
        return <PRODUCT_2_3 tabId={tabId} item={item} onPress={() => {}} />;
      case HOME_COMPONENT_TYPE.PRODUCT_SWIPPER:
        return <SWIPER tabId={tabId} item={item} onPress={() => {}} />;
      default:
        return null;
    }
  };

  const getTabData = useCallback(() => {
    withLoading(CommonApi.newHomePageDataUsingPOST({id: tabId}))
      .then((res: ResponseDataNewHomePageDataResponse) => {
        setTabData(res.data.list);
      })
      .catch((e) => {
        Message.toast(e);
      });
  }, [tabId, withLoading]);

  useEffect(() => {
    getTabData();
  }, [getTabData]);

  return (
    <PageStatusControl
      hasData={!!tabData}
      showEmpty
      emptyComponent={<Empty />}
      loading={loading}>
      <FlatList
        keyExtractor={(item) => {
          return item.id + '';
        }}
        data={tabData}
        renderItem={renderItem}
        ListHeaderComponent={
          coupon && coupon?.id !== 0 ? <CouponContent data={coupon} /> : null
        }
        ListFooterComponent={<ProductPolicy />}
      />
    </PageStatusControl>
  );
};

export default TabContent;
