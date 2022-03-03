import React, {FC, useCallback, useEffect, useState} from 'react';
import {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {px, SCREEN_WIDTH} from '../../constants/constants';
import InputSpinner from 'react-native-input-spinner';
import {
  ProductSKU,
  SKU,
  SKUItem,
  OffersDetail,
  ProductSKUPrice,
} from '../../types/models/product.model';
import Utils from '../../utils/Utils';
import GlideImage from '../native/GlideImage';
import AppModule from '../../../AppModule';
import BottomSheet from '../dialog/BottomSheet';
import GoodsBottomButtons from './GoodsBottomButtons';
const GlideImageEle = GlideImage as any;

interface ProductSkuCompenentProps {
  product: OffersDetail.Data;
  productSkus: ProductSKU;
  productSKUPrice: Map<string, ProductSKUPrice>;
}
interface ClickSkuItem {
  attrId: number;
  clickSku: SKUItem;
}

interface SelecteSkuProductInfo {
  image: string;
  price: ProductSKUPrice;
}

export const ProductSkuSelecteCompoment: FC<ProductSkuCompenentProps> = ({
  product,
  productSkus,
  productSKUPrice,
}) => {
  const inputSpinnerRef = useRef();
  const [addCount, setAddCount] = useState(
    product.min_purchases_num === 0 ? 1 : product.min_purchases_num,
  );
  const [selectedSkus, setSelectedSkus] = useState<ClickSkuItem[]>(() => {
    return productSkus?.sku?.map((sku) => {
      const attrId = sku.attr_id;
      const clickSku = sku.sku_list && sku.sku_list[0];
      return {attrId, clickSku};
    });
  });
  const updateClickSku = useCallback((sku: ClickSkuItem) => {
    const index = selectedSkus.findIndex((item) => item.attrId === sku.attrId);
    if (index !== -1) {
      selectedSkus[index] = sku;
      setSelectedSkus(selectedSkus.slice());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedProductInfo, setSelectedProductInfo] = useState<
    SelecteSkuProductInfo
  >();

  useEffect(() => {
    const imageSku = selectedSkus.find(
      (item) => item.clickSku?.image_url.length > 0,
    );
    const image = imageSku ? imageSku.clickSku.image_url : product.image[0];
    const selectedSkuKey = selectedSkus.map((item) => {
      return '-' + item.clickSku.id;
    });
    const selectedPriceSkuKey = productSkus.product_id + '-' + selectedSkuKey;
    const price: ProductSKUPrice = {
      price_high: productSKUPrice
        ? productSKUPrice.get(selectedPriceSkuKey)?.price_high || 0
        : product.original_price,
      price_low: productSKUPrice
        ? productSKUPrice.get(selectedPriceSkuKey)?.price_low || 0
        : product.mark_price,
      stock: 0,
      id: 0,
    };
    // console.log('setSelectedProductInfo====' + JSON.stringify({image, price}));
    setSelectedProductInfo({image, price});
  }, [
    product.image,
    product.mark_price,
    product.original_price,
    productSKUPrice,
    productSkus.product_id,
    selectedSkus,
  ]);

  const addToBag = () => {};
  const goBuy = () => {};

  return (
    <>
      <View style={{maxHeight: 1700 * px}}>
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 36 * px,
            marginTop: 30 * px,
            borderBottomWidth: 1,
            paddingBottom: 30 * px,
            borderColor: '#F2F2F2',
          }}>
          <View
            style={{
              width: 300 * px,
              height: 300 * px,
              backgroundColor: '#F5F5F5',
              borderRadius: 20 * px,
              justifyContent: 'center',
            }}>
            <GlideImageEle
              source={Utils.getImageUri(selectedProductInfo?.image || '')}
              resizeMode={'contain'}
              style={{
                width: 280 * px,
                height: 280 * px,
                alignSelf: 'center',
              }}
            />
          </View>
          {selectedProductInfo && (
            <View
              style={{
                flexDirection: 'column',
                alignSelf: 'center',
                marginLeft: 62 * px,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#EA574D',
                    fontSize: 50 * px,
                  }}>
                  US $
                  {selectedProductInfo.price?.price_low > 0
                    ? (selectedProductInfo.price?.price_low / 100).toFixed(2)
                    : 0}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
      {selectedSkus && (
        <ScrollView style={{maxHeight: 800 * px, minHeight: 400 * px}}>
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
                Select {productSku.attr_name}:
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 20 * px,
                  flexWrap: 'wrap',
                }}>
                {productSku.sku_list?.map((item: SKUItem) => (
                  <TouchableOpacity
                    onPress={() => {
                      updateClickSku({
                        attrId: productSku.attr_id,
                        clickSku: item,
                      });
                    }}>
                    {item.image_url ? (
                      <View
                        style={
                          item.id === selectedSkus[position].clickSku.id
                            ? styles.skuGroundSelected
                            : styles.skuImageBackGround
                        }>
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
                        style={
                          item.id === selectedSkus[position].clickSku.id
                            ? styles.skuTextSelected
                            : styles.skuTextBackGround
                        }>
                        {item.name}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginTop: 20 * px,
              marginLeft: 36 * px,
              paddingBottom: 40 * px,
              height: 130 * px,
            }}>
            <Text style={{color: 'black', fontSize: 40 * px}}>Quantity</Text>
            <InputSpinner
              ref={inputSpinnerRef}
              max={
                product.max_purchases_num === 0 ? 1 : product.max_purchases_num
              }
              onMax={(max: number) => {
                Utils.toastFun(`Sorry, you can only buy ${max} piece`);
              }}
              min={
                product.force_min_purchases_num === 1
                  ? product.min_purchases_num === 0
                    ? 1
                    : product.min_purchases_num
                  : 1
              }
              initialValue={
                product.min_purchases_num === 0 ? 1 : product.min_purchases_num
              }
              step={1}
              colorMax={'#7A7A7A'}
              colorMin={'#7A7A7A'}
              value={addCount}
              rounded={false}
              editable={false}
              showBorder={false}
              style={{
                width: 300 * px,
                height: 100 * px,
                position: 'absolute',
                right: 26 * px,
                alignItems: 'center',
              }}
              inputStyle={{
                width: 100 * px,
                height: 96 * px,
                borderTopWidth: 2 * px,
                borderBottomWidth: 2 * px,
                borderColor: '#656565',
                textAlign: 'center',
              }}
              buttonStyle={{
                width: 100 * px,
                height: 96 * px,
                borderWidth: 2 * px,
                borderRadius: 12 * px,
                borderColor: '#656565',
                backgroundColor: '#fff',
              }}
              buttonLeftImage={
                <Image
                  style={{
                    width: 60 * px,
                    height: 60 * px,
                    alignSelf: 'center',
                    tintColor:
                      addCount ===
                      (product.force_min_purchases_num === 1
                        ? product.min_purchases_num === 0
                          ? 1
                          : product.min_purchases_num
                        : 1)
                        ? '#A5A5A5'
                        : 'black',
                  }}
                  source={require('../../assets/cart_decrease_icon.png')}
                />
              }
              buttonTextColor={'#000'}
              buttonRightImage={
                <Image
                  style={{
                    width: 40 * px,
                    height: 40 * px,
                    alignSelf: 'center',
                    tintColor:
                      addCount ===
                      (product.max_purchases_num === 0
                        ? 1
                        : product.max_purchases_num)
                        ? '#A5A5A5'
                        : 'black',
                  }}
                  source={require('../../assets/cart_increase_icon.png')}
                />
              }
              onChange={(num: number) => {
                // if (from === 'offers') {
                //   AppModule.reportClick('3', '29', {
                //     ProductId: detail.product_id,
                //     CategoryId: detail.category_id,
                //     CateStation: detail.cate_station,
                //   });
                // }
                // if (recordId) {
                //   AppModule.reportClick(reportData.slot, '171', {
                //     ProductId: detail.product_id,
                //     ProductType: detail.product_type,
                //   });
                // }
                setAddCount(num);
                // showFinalPrice(num);
              }}
            />
          </View>
        </ScrollView>
      )}
      <View style={{height: 200 * px}} />
      <GoodsBottomButtons
        style={{
          position: 'absolute',
          bottom: 40 * px,
          alignSelf: 'center',
          width: SCREEN_WIDTH,
        }}
        goodsDetail={product}
        leftOnPress={addToBag}
        rightOnPress={goBuy}
        buttonContent={'Buy Now'}
      />
      <TouchableOpacity
        onPress={() => {
          AppModule.reportClose('3', '31', {
            ProductId: product.product_id,
          });
          BottomSheet.hide();
        }}
        style={{position: 'absolute', right: 20 * px, top: 20 * px}}>
        <Image
          style={{width: 60 * px, height: 60 * px}}
          resizeMode={'contain'}
          source={require('../../assets/ic_sku_close.png')}
        />
      </TouchableOpacity>
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
  skuGroundSelected: {
    width: 180 * px,
    height: 180 * px,
    borderRadius: 10 * px,
    borderWidth: 1,
    marginRight: 20 * px,
    alignItems: 'center',
    padding: 1,
    justifyContent: 'center',
    marginVertical: 5,
    backgroundColor: '#FCDADA',
    borderColor: '#FF7070',
  },
  skuTextSelected: {
    height: 90 * px,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 160 * px,
    borderRadius: 10 * px,
    paddingHorizontal: 64 * px,
    marginRight: 20 * px,
    marginVertical: 5,
    fontSize: 50 * px,
    color: 'black',
    backgroundColor: '#FCDADA',
    borderColor: '#FF7070',
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
    fontSize: 50 * px,
    color: 'black',
  },
});
