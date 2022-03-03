import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  DeviceEventEmitter,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {px, SCREEN_WIDTH} from '../../constants/constants';
import {navigationRef} from '../../utils/refs';
import AppModule from '../../../AppModule';
import BottomSheet from '../dialog/BottomSheet';
import GlideImage from '../native/GlideImage';
import Utils from '../../utils/Utils';
import InputSpinner from 'react-native-input-spinner';
import {reportData} from '../../constants/reportData';
import GoodsBottomButtons from '../productdetail/GoodsBottomButtons';
import Api from '../../Api';
import {useDispatch} from 'react-redux';
import {categoryDetailPath} from '../../analysis/report';
import {useShallowEqualSelector} from '../../utils/hooks';

export default function MysterySkuSelector({
  detail,
  skuList,
  showItem,
  path,
  wheelIndex,
  from,
  way,
  recordId,
  nextAction,
}) {
  const {oneDollerCategory} = useShallowEqualSelector(
    (state) => state.deprecatedPersist,
  );
  const [loading, setLoading] = useState(false);
  const [addCount, setAddCount] = useState(
    detail.min_purchases_num === 0 ? 1 : detail.min_purchases_num,
  );
  const dispatch = useDispatch();
  const [finalPrice, setFinalPrice] = useState(detail.mark_price);
  const [skuInfo, setSkuInfo] = useState(
    skuList?.map((item) => ({
      product_id: item.product_id,
      sku_key: item.sku_key,
      sku_value: item.sku_value[0],
    })),
  );
  useEffect(() => {
    if (recordId) {
      AppModule.reportShow(reportData.slot, '169', {
        ProductId: detail.product_id,
        ProductType: detail.product_type,
      });
    }
  }, [recordId, detail.product_id, detail.product_type]);
  const isSkuSelected = (sku, value) => {
    const found = skuInfo.find(
      (item) =>
        item.sku_key === sku.sku_key && item.product_id === sku.product_id,
    );
    if (found) {
      return found.sku_value === value;
    }
  };

  const updateSkuSelected = (sku, value) => {
    const found = skuInfo.find(
      (item) =>
        item.sku_key === sku.sku_key && item.product_id === sku.product_id,
    );
    if (found) {
      found.sku_value = value;
      setSkuInfo((old) => [...old]);
    }
  };

  const products = [...new Set(skuList?.map((item) => item.product_id))];
  let _percent = (
    (1 - detail.mark_price / detail.original_price) *
    100
  ).toFixed(0);
  _percent = _percent < 0 ? '0' : _percent > 99 ? 99 : _percent;

  const showFinalPrice = (num) => {
    let _price = detail.mark_price * num;
    setFinalPrice(_price);
  };
  const goBuy = async () => {
    if (recordId) {
      AppModule.reportClick(reportData.slot, '172', {
        ProductId: detail.product_id,
        ProductType: detail.product_type,
      });
    }
    BottomSheet.hideWithOutAnimation();
    if (from === 'mysterySuperbox') {
      AppModule.reportClick('13', '130', {
        SuperBoxId: detail.bag_id,
        CategoryId: detail.category_id,
        CateStation: detail.cate_station,
      });
    } else {
      AppModule.reportClick('3', '30', {
        ProductId: detail.bag_id,
        CategoryId: detail.category_id,
        CateStation: detail.cate_station,
        ProductCat: categoryDetailPath.getData().ProductCat,
      });
    }
  };

  const addToBag = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    Api.addToCart(
      detail.bag_id || detail.product_id,
      detail.product_type,
      skuInfo,
      null,
      addCount,
      detail.category_id,
      detail.mark_price,
      categoryDetailPath.getData().ProductCat || 0,
    ).then((res) => {
      setLoading(false);
      if (res.code === 0 && res.data?.is_success === true) {
        BottomSheet.hideWithOutAnimation();
        //加入购物车成功。
        dispatch({type: 'updateCartNum', payload: res.data?.total_num});
        DeviceEventEmitter.emit('showCartDialog', res.data);
        DeviceEventEmitter.emit('updateCartList', {needToast: true, type: ''});
      } else {
        Utils.toastFun(res.error);
      }
    });
  };

  return (
    <ScrollView style={{maxHeight: 1800 * px}}>
      <View>
        <View
          style={{
            marginLeft: 36 * px,
            marginTop: 30 * px,
            borderBottomWidth: 1,
            paddingBottom: 30 * px,
            borderColor: '#F2F2F2',
          }}>
          <View
            style={{
              justifyContent: 'center',
            }}>
            <GlideImage
              source={Utils.getImageUri(
                detail.image != null && detail.image.length > 0
                  ? detail.image[0]
                  : '',
              )}
              resizeMode={'contain'}
              style={{
                width: 600 * px,
                height: 600 * px,
                alignSelf: 'center',
              }}
            />
          </View>
          <View
            style={{
              alignSelf: 'center',
              marginLeft: 62 * px,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: '#EA574D',
                  fontSize: 50 * px,
                }}>
                US ${(detail.mark_price / 100.0).toFixed(2)}
              </Text>
            </View>
            {/*<View
              style={{
                marginTop: 15 * px,
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 35 * px,
                  alignSelf: 'center',
                  textDecorationLine: 'line-through',
                }}>
                ${detail.original_price / 100.0}
              </Text>
              <Text
                style={{
                  color: '#F34A31',
                  fontSize: 26 * px,
                  marginLeft: 15 * px,
                  alignSelf: 'center',
                  padding: 1,
                  backgroundColor: '#FFC9C1',
                }}>
                {_percent}% off
              </Text>
              </View>*/}
          </View>
        </View>
        <ScrollView style={{height: 600 * px}}>
          {products.map((product, productIndex) => (
            <View
              key={productIndex}
              style={{
                paddingBottom: 30 * px,
                marginLeft: 36 * px,
              }}>
              {showItem ? (
                <Text
                  style={{
                    color: 'black',
                    fontSize: 40 * px,
                    marginTop: 20 * px,
                    fontWeight: 'bold',
                  }}>
                  Item {productIndex + 1}
                </Text>
              ) : null}
              {skuList
                .filter((item) => item.product_id === product)
                .map((item, i) => (
                  <View
                    key={i}
                    style={{
                      borderColor: '#F2F2F2',
                      borderBottomWidth: 1,
                      paddingBottom: 30 * px,
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 50 * px,
                        marginTop: 40 * px,
                      }}>
                      {item.sku_key}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 30 * px,
                        flexWrap: 'wrap',
                      }}>
                      {item.sku_value.map((value, j) => (
                        <TouchableOpacity
                          key={j}
                          activeOpacity={0.8}
                          onPress={() => {
                            if (from === 'mysterySuperbox') {
                              AppModule.reportClick('13', '128', {
                                SuperBoxId: detail.bag_id,
                                CategoryId: detail.category_id,
                                CateStation: detail.cate_station,
                              });
                            } else {
                              AppModule.reportClick('3', '28', {
                                ProductId: detail.product_id,
                                CategoryId: detail.category_id,
                                CateStation: detail.cate_station,
                              });
                            }
                            if (recordId) {
                              AppModule.reportClick(reportData.slot, '170', {
                                ProductId: detail.product_id,
                                ProductType: detail.product_type,
                              });
                            }
                            updateSkuSelected(item, value);
                          }}
                          style={[
                            styles.skuTextBackGround,
                            isSkuSelected(item, value)
                              ? styles.skuGroundSelected
                              : styles.skuGroundUnSelected,
                          ]}>
                          <Text
                            style={{
                              fontSize: 50 * px,
                              color: isSkuSelected(item, value)
                                ? '#FF7070'
                                : 'black',
                            }}>
                            {value}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
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
              max={detail.max_purchases_num}
              min={
                detail.force_min_purchases_num === 1
                  ? detail.min_purchases_num === 0
                    ? 1
                    : detail.min_purchases_num
                  : 1
              }
              initialValue={
                detail.min_purchases_num === 0 ? 1 : detail.min_purchases_num
              }
              step={1}
              colorMax={'#7A7A7A'}
              colorMin={'#7A7A7A'}
              value={addCount}
              rounded={false}
              editable={false}
              showBorder={true}
              style={{
                width: 300 * px,
                height: 100 * px,
                position: 'absolute',
                right: 26 * px,
              }}
              inputStyle={{
                width: 100 * px,
                borderTopWidth: 2 * px,
                borderBottomWidth: 2 * px,
                height: 93 * px,
                borderStyle: 'solid',
                borderColor: '#656565',
                textAlign: 'center',
              }}
              buttonStyle={{
                width: 100 * px,
                height: 100 * px,
                borderColor: '#656565',
                backgroundColor: '#fff',
              }}
              onChange={(num) => {
                if (path === 'MysteryBox') {
                  AppModule.reportClick('13', '129', {
                    SuperBoxId: detail.bag_id || detail.product_id,
                    CategoryId: detail.category_id,
                    CateStation: detail.cate_station,
                  });
                } else {
                  AppModule.reportClick('3', '29', {
                    ProductId: detail.bag_id || detail.product_id,
                    CategoryId: detail.category_id,
                    CateStation: detail.cate_station,
                  });
                }
                if (recordId) {
                  AppModule.reportClick(reportData.slot, '171', {
                    ProductId: detail.product_id,
                    ProductType: detail.product_type,
                  });
                }
                setAddCount(num);
                showFinalPrice(num);
              }}
            />
          </View>
        </ScrollView>
        <View style={{height: 200 * px}} />

        <GoodsBottomButtons
          style={{
            position: 'absolute',
            bottom: 40 * px,
            alignSelf: 'center',
            width: SCREEN_WIDTH,
          }}
          goodsDetail={detail}
          leftLoading={loading}
          leftOnPress={nextAction !== 2 ? addToBag : null}
          rightOnPress={nextAction !== 1 ? goBuy : null}
          buttonContent={'Buy Now'}
        />
        <TouchableOpacity
          onPress={() => {
            if (from === 'mysterySuperbox') {
              // AppModule.reportClose('13', '31', {
              //     ProductId: detail.bag_id || detail.product_id,
              // });
            } else {
              AppModule.reportClose('3', '31', {
                ProductId: detail.bag_id || detail.product_id,
                CategoryId: detail.category_id,
                CateStation: detail.cate_station,
              });
            }
            BottomSheet.hide();
          }}
          style={{position: 'absolute', right: 20 * px, top: 20 * px}}>
          <Image
            style={{width: 60 * px, height: 60 * px}}
            resizeMode={'contain'}
            source={require('../../assets/ic_sku_close.png')}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  skuImageBackGround: {
    width: 231 * px,
    height: 231 * px,
    borderRadius: 10 * px,
    backgroundColor: '#F5F5F5',
    marginRight: 20 * px,
    alignItems: 'center',
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
  skuGroundSelected: {
    backgroundColor: '#FCDADA',
    borderWidth: 1,
    borderColor: '#FF7070',
  },
  skuGroundUnSelected: {
    backgroundColor: '#F5F5F5',
  },
  numberBackGround: {
    backgroundColor: '#D7D5D5',
    height: 70 * px,
    width: 70 * px,
  },
  numberDisableBackGround: {
    backgroundColor: '#F5F5F5',
    height: 70 * px,
    width: 70 * px,
  },
});
