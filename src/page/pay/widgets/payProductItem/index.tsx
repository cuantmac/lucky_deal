import {
  ShopItemContent,
  ShopItemContentProps,
} from '@src/page/shop/widgets/shopItemContent';
import React, {FC} from 'react';
import {useMemo} from 'react';
import {OrderProduct} from '../usePayData';

interface PayProductItemProps
  extends Omit<
    ShopItemContentProps<ReturnType<typeof convertData>>,
    'data' | 'rightContainerStyle'
  > {
  data: OrderProduct;
}

export const PayProductItem: FC<PayProductItemProps> = ({data, ...props}) => {
  const productData = useMemo(() => {
    return convertData(data);
  }, [data]);

  return (
    <ShopItemContent
      data={productData}
      rightContainerStyle={{paddingRight: 0}}
      {...props}
    />
  );
};

export const convertData = (data: OrderProduct) => {
  return {
    status: data.status,
    title: data.title,
    min_purchases_num: data.minQty,
    max_purchases_num: data.maxQty,
    image: data.productImage,
    price: data.orderPrice,
    origin_price: data.orderPrice,
    qty: data.qty,
    skuStr: data.skuInfo,
    product_id: data.productId,
    product_type: data.productType,
    stock: data.stock,
  };
};
