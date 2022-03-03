import {
  OfferProductDetailResponse,
  BagProductDetailResponse,
} from '@luckydeal/api-common';
import {createStyleSheet} from '@src/helper/helper';
import {AnchorCollecter} from '@src/widgets/anchor';
import {HtmlRender} from '@src/widgets/htmlRender';
import React, {FC} from 'react';
import {memo} from 'react';
import {ProductDetailModule, ProductDetailModuleTitle} from '../widgets';

interface ProductDescriptionProps {
  data: OfferProductDetailResponse | BagProductDetailResponse;
}

export const ProductDescription: FC<ProductDescriptionProps> = memo(
  ({data}) => {
    if (!data.desc) {
      return null;
    }
    return (
      <AnchorCollecter title={'Description'} id={2}>
        <ProductDetailModule>
          <ProductDetailModuleTitle title={'Product Description'} />
          <HtmlRender html={data.desc} />
        </ProductDetailModule>
      </AnchorCollecter>
    );
  },
);
