import React, {FC, useRef, useCallback, useMemo} from 'react';
import {Text, ScrollView, TouchableOpacity, View} from 'react-native';
import {OrderProduct} from '../usePayData';
import {ProductListDialog, ProductListDialogRef} from '../productListDialog';
import {createStyleSheet, styleAdapter} from '@src/helper/helper';
import {
  PayModuleContainer,
  PayModuleContainerHeader,
} from '../payModuleContainer';
import {PayProductItem} from '../payProductItem';
import {GlideImage} from '@src/widgets/glideImage';

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
  const thumb = productList.length > 1;

  const handleThumbPress = useCallback(() => {
    productListDialogRef.current?.show();
  }, []);

  const itemNum = useMemo(() => {
    let num = 0;
    productList.forEach((item) => {
      num += item.qty;
    });
    return num;
  }, [productList]);

  return (
    <>
      <PayModuleContainer>
        <PayModuleContainerHeader title={'Shopping Bag'}>
          {thumb && (
            <Text style={ProductDisplayStyles.itemNum}>{itemNum} items</Text>
          )}
        </PayModuleContainerHeader>
        {thumb ? (
          <ScrollView
            style={styleAdapter({paddingBottom: 12})}
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
              <PayProductItem
                disableEdit={!enableEditQty}
                onQtyChange={onQtyChange}
                data={product}
                key={pIndex}
              />
            );
          })
        )}

        {children}
      </PayModuleContainer>
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
      <View style={ProductDisplayStyles.thumbContainer}>
        <GlideImage
          style={ProductDisplayStyles.thumbImg}
          source={{uri: data.productImage}}
        />
        <Text style={ProductDisplayStyles.thumbText}>x{data.qty}</Text>
      </View>
    </TouchableOpacity>
  );
};

const ProductDisplayStyles = createStyleSheet({
  itemNum: {
    fontSize: 12,
    color: '#666',
  },
  thumbContainer: {
    width: 80,
    height: 80,
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 8,
    position: 'relative',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  thumbText: {
    width: 24,
    height: 24,
    position: 'absolute',
    right: 4,
    bottom: 4,
    lineHeight: 24,
    textAlign: 'center',
    fontSize: 12,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.50)',
    borderRadius: 24,
  },
});
