import React, {FC, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {px, SCREEN_WIDTH} from '../../constants/constants';
import {ProductSKU, SKU, SKUItem} from '../../types/models/product.model';
import Utils from '../../utils/Utils';
import GlideImage from '../native/GlideImage';
const GlideImageEle = GlideImage as any;

interface ProductSkuCompenentProps {
  productSkus: ProductSKU;
}
export const ProductSkuComponent: FC<ProductSkuCompenentProps> = ({
  productSkus,
}) => {
  const [selectedSkuIds, setSelectedSkuIds] = useState<number[]>();
  return (
    <>
      {productSkus?.sku && (
        <View
          style={{width: SCREEN_WIDTH, height: 8, backgroundColor: '#F7F7F7'}}
        />
      )}
      {productSkus?.sku?.map((productSku: SKU, position: number) => (
        <View
          key={position}
          style={{
            borderBottomWidth: 1,
            paddingBottom: 30 * px,
            marginLeft: 36 * px,
            borderColor: '#F2F2F2',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 50 * px,
              marginTop: 40 * px,
            }}>
            {productSku.attr_name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20 * px,
              flexWrap: 'wrap',
            }}>
            {productSku.sku_list?.map((item: SKUItem) =>
              item.image_url ? (
                <View style={styles.skuImageBackGround} key={item.id}>
                  <GlideImageEle
                    source={Utils.getImageUri(item.image_url)}
                    showDefaultImage={true}
                    defaultSource={require('../../assets/lucky_deal_default_small.png')}
                    resizeMode="contain"
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </View>
              ) : (
                <Text
                  style={[
                    {
                      fontSize: 50 * px,
                      color: 'black',
                    },
                    styles.skuTextBackGround,
                  ]}>
                  {item.name}
                </Text>
              ),
            )}
          </View>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  skuImageBackGround: {
    width: 180 * px,
    height: 180 * px,
    borderRadius: 10 * px,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#F5F5F5',
    marginRight: 20 * px,
    alignItems: 'center',
    padding: 1,
    justifyContent: 'center',
    marginVertical: 5,
  },
  skuTextBackGround: {
    height: 90 * px,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 160 * px,
    backgroundColor: '#F5F5F5',
    borderRadius: 10 * px,
    paddingHorizontal: 64 * px,
    marginRight: 20 * px,
    marginVertical: 5,
  },
});
