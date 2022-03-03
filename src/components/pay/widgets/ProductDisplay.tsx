import React, {FC, useRef} from 'react';
import {useCallback} from 'react';
import {
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {px} from '../../../constants/constants';
import {globalModalQueue} from '../../../utils/modalQueue';
import Utils from '../../../utils/Utils';
import {OrderProduct} from '../Pay';
import {PayInfoContainer, PayInfoHeader} from '../PayComponent';
import {ProductListDialog, ProductListDialogRef} from './ProductListDialog';

interface ProductDisplayProps {
  enableEditQty: boolean;
  onQtyChange: (val: number) => void;
  productList: OrderProduct[];
}

export const ProductDisplay: FC<ProductDisplayProps> = ({
  children,
  enableEditQty,
  onQtyChange,
  productList,
}) => {
  const productListDialogRef = useRef<ProductListDialogRef>(null);
  // productList = productList[0] ? [productList[0]] : productList;
  const thumb = productList.length > 1;

  const handleThumbPress = useCallback(() => {
    globalModalQueue.add(productListDialogRef);
  }, []);

  return (
    <>
      <PayInfoContainer title={'Shopping Bag'}>
        {thumb ? (
          <ScrollView
            style={{marginBottom: 20 * px}}
            horizontal
            showsHorizontalScrollIndicator={false}>
            {productList.map((val, index) => {
              return (
                <ThumbProduct
                  onPress={handleThumbPress}
                  data={val}
                  key={index}
                />
              );
            })}
          </ScrollView>
        ) : (
          productList.map((product, pIndex) => {
            return (
              <PayInfoHeader
                containerStyle={{marginBottom: 20 * px}}
                key={pIndex}
                isVip={false}
                img={Utils.getImageUri(product.productImage) as any}
                title={product.title}
                sku={product.skuInfo}
                price={Utils.convertAmount(product.orderPrice)}
                priceBefore={Utils.convertAmount(product.productPrice)}
                editCount={enableEditQty}
                max={product.maxQty}
                min={product.minQty}
                onCountChange={onQtyChange}
                count={product.qty}
                hideBeforePrice
                showSaved={false}
              />
            );
          })
        )}

        {children}
      </PayInfoContainer>
      <ProductListDialog ref={productListDialogRef} productList={productList} />
    </>
  );
};

interface ThumbProductProps {
  data: OrderProduct;
  onPress?: () => void;
}
export const ThumbProduct: FC<ThumbProductProps> = ({data, onPress}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <ImageBackground
        style={{
          width: 208 * px,
          height: 208 * px,
          borderRadius: 10 * px,
          overflow: 'hidden',
          marginHorizontal: 21 * px,
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
        source={Utils.getImageUri(data.productImage) as any}>
        <Text
          style={{
            marginBottom: 20 * px,
            paddingHorizontal: 20 * px,
            backgroundColor: '#F6F6F6',
            fontSize: 30 * px,
            borderRadius: 20 * px,
            height: 40 * px,
            lineHeight: 30 * px,
            paddingVertical: 5 * px,
            color: '#676767',
          }}>
          x{data.qty}
        </Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};
