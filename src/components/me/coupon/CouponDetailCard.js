import React from 'react';
import {View} from 'react-native';
import {pure} from 'recompose';
import {FreeShippingBannerBig} from '../../common/FreeShippingBanner';

/**
 * product_type // 1 --福袋，2--直购，3--超级福袋 4 vip 商品 5 1元购
 */
export default pure(function ({product_type}) {
  return (
    <>
      {product_type && product_type === 5 ? null : (
        <FreeShippingBannerBig from={'detail'} />
      )}
    </>
  );
});
