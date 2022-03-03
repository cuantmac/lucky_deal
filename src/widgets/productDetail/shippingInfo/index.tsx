import {
  BagProductDetailResponse,
  OfferProductDetailResponse,
} from '@luckydeal/api-common';
import {createStyleSheet} from '@src/helper/helper';
import React, {FC} from 'react';
import {Text} from 'react-native';
import {ProductDetailModule, ProductDetailModuleTitle} from '../widgets';

interface ShippingInfoProps {
  data?: OfferProductDetailResponse | BagProductDetailResponse;
}

export const ShippingInfo: FC<ShippingInfoProps> = ({data}) => {
  if (!data?.logistics_channel) {
    return null;
  }
  const {preparing_time, send_time} = data.logistics_channel;
  return (
    <ProductDetailModule style={ShippingInfoStyles.container}>
      <ProductDetailModuleTitle title={'Shipping to UNITED STATES'} />
      <Text style={ShippingInfoStyles.text}>
        Estimated to preparing time {preparing_time} days
      </Text>
      <Text style={ShippingInfoStyles.text2}>
        Estimated to be delivered within {send_time} days
      </Text>
    </ProductDetailModule>
  );
};

const ShippingInfoStyles = createStyleSheet({
  container: {
    paddingBottom: 12,
  },
  text: {
    lineHeight: 17,
    fontSize: 12,
    color: '#666',
  },
  text2: {
    lineHeight: 17,
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
