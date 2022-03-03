import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  DeviceEventEmitter,
} from 'react-native';
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  FROM_ADD_ITEMS,
  FROM_CART,
  px,
  SCREEN_WIDTH,
} from '../../constants/constants';
import {ACCENT} from '../../constants/colors';
import {navigationRef} from '../../utils/refs';
import AppModule from '../../../AppModule';
import BottomSheet from '../dialog/BottomSheet';
import GlideImage from '../native/GlideImage';
import Utils from '../../utils/Utils';
import InputSpinner from 'react-native-input-spinner';
import {useDispatch} from 'react-redux';
import {reportData} from '../../constants/reportData';
import {useShallowEqualSelector} from '../../utils/hooks';
import GoodsBottomButtons from '../productdetail/GoodsBottomButtons';
import Api from '../../Api';
import {categoryDetailPath} from '../../analysis/report';

export default function SkuSelector({
  detail,
  skuList,
  from,
  path,
  recordId,
  nextAction,
  activity,
  activityType,
}) {
  const dispatch = useDispatch();
  const inputSpinnerRef = useRef();
  const [loading, setLoading] = useState(false);
  let {sku, price, product_id} = skuList;
  sku = sku || [];
  const [addCount, setAddCount] = useState(
    detail.min_purchases_num === 0 ? 1 : detail.min_purchases_num,
  );
  const {token} = useShallowEqualSelector((state) => ({
    ...state.deprecatedPersist,
  }));
  const [selectSkuInfo, setSelectSkuInfo] = useState(() => {
    return sku.map((item, i) => {
      let {sku_list, ...rest} = item;
      return {select: sku_list[0], ...rest};
    });
  });
  const [activeSku, setActiveSku] = useState(price[0]);
  const [finalPrice, setFinalPrice] = useState(0);

  useEffect(() => {
    if (recordId) {
      AppModule.reportShow(reportData.slot, '169', {
        ProductId: detail.product_id,
        ProductType: detail.product_type,
      });
    }
  }, [recordId, detail.product_id, detail.product_type]);

  const updateSkuSelected = (skuItem, value, j) => {
    let _arr = selectSkuInfo.map((item) => {
      let {select, ...rest} = item;
      return skuItem.attr_id === item.attr_id ? {select: value, ...rest} : item;
    });
    setSelectSkuInfo(_arr);
  };

  const getActiveSku = useCallback(() => {
    let idsString = product_id;
    if (!selectSkuInfo.length) {
      return;
    }
    selectSkuInfo.forEach((res) => {
      idsString += '-' + res.select.id;
    });
    let activePrice = price[idsString];
    let _price = {priceKey: idsString, ...activePrice};
    setActiveSku(_price);
  }, [price, product_id, selectSkuInfo]);

  useEffect(() => {
    getActiveSku();
  }, [getActiveSku]);

  const showFinalPrice = useCallback(
    (num) => {
      if (!activeSku) {
        setFinalPrice(detail.mark_price * num);
      } else {
        setFinalPrice(activeSku.price_low * num);
      }
    },
    [activeSku, detail.mark_price],
  );

  useEffect(() => {
    showFinalPrice(addCount);
  }, [addCount, showFinalPrice]);

  const sendSkuData = (data) => {
    let _data = [...data];
    return _data.map((item) => {
      return {
        product_id: product_id,
        sku_key: item.attr_name,
        sku_value: item.select.name,
      };
    });
  };
  const addToBag = () => {
    if (path === FROM_CART) {
      AppModule.reportClick('23', '402', {
        ProductId: detail.product_id,
      });
    } else if (path === FROM_ADD_ITEMS) {
      AppModule.reportClick('23', '396', {
        ProductId: detail.product_id,
      });
    } else {
      AppModule.reportClick('3', '300', {
        ProductId: detail.product_id,
        CategoryId: detail.category_id,
        CateStation: detail.cate_station,
        ProductCat: categoryDetailPath.getData().ProductCat,
      });
    }
    if (loading) {
      return;
    }
    setLoading(true);
    let _skuInfo = sendSkuData(selectSkuInfo);
    Api.addToCart(
      detail.bag_id || detail.gift_id || detail.product_id,
      detail.product_type,
      _skuInfo,
      activeSku?.priceKey,
      addCount,
      detail.category_id,
      activeSku?.price_low,
      categoryDetailPath.getData().ProductCat || 0,
    ).then((res) => {
      setLoading(false);
      if (res.code === 0 && res.data?.is_success === true) {
        BottomSheet.hideWithOutAnimation();
        //加入购物车成功。
        dispatch({type: 'updateCartNum', payload: res.data?.total_num});
        DeviceEventEmitter.emit('showCartDialog', res.data);
        DeviceEventEmitter.emit('updateCartList', {
          needToast: true,
          type: activityType,
        });
      } else {
        Utils.toastFun(res.error);
      }
    });
  };
  const goBuy = () => {
    if (!token) {
      navigationRef.current?.navigate('FBLogin');
      return;
    }
    let _skuInfo = sendSkuData(selectSkuInfo);
    if (recordId) {
      AppModule.reportClick(reportData.slot, '172', {
        ProductId: detail.product_id,
        ProductType: detail.product_type,
      });
    }
    AppModule.reportClick('3', '30', {
      ProductId: detail.product_id,
      CategoryId: detail.category_id,
      CateStation: detail.cate_station,
      ProductCat: categoryDetailPath.getData().ProductCat,
    });
    let markPrice = activeSku?.price_low || detail.mark_price;
    let purchaseDetail = {
      ...detail,
      mark_price: markPrice,
      original_price: activeSku?.price_high || detail.original_price,
    };

    BottomSheet.hideWithOutAnimation();
  };

  return (
    <View style={{maxHeight: 1700 * px}}>
      {/* <TouchableWithoutFeedback> */}
      <View>
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
            <GlideImage
              source={Utils.getImageUri(detail.image[0])}
              resizeMode={'contain'}
              style={{
                width: 280 * px,
                height: 280 * px,
                alignSelf: 'center',
              }}
            />
          </View>
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
                {Utils.convertAmountUS(finalPrice)}
              </Text>
            </View>
            {from === 'offers' && detail?.product_type === 4 ? (
              <View
                style={{
                  height: 200 * px,
                }}
              />
            ) : null}
          </View>
        </View>
        <ScrollView style={{maxHeight: 800 * px, minHeight: 400 * px}}>
          <View
            style={{
              borderBottomWidth: 1,
              paddingBottom: 30 * px,
              marginLeft: 36 * px,
              borderColor: '#F2F2F2',
            }}>
            {sku.map((item, i) => {
              let selectItem = selectSkuInfo.find(
                (res) => res.attr_id === item.attr_id,
              );
              return (
                <View key={item.attr_id}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 40 * px,
                      marginTop: 40 * px,
                    }}>
                    {item.attr_name}: {selectItem.name}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 30 * px,
                      flexWrap: 'wrap',
                    }}>
                    {item.sku_list.map((value, j) =>
                      value.image_url ? (
                        <TouchableOpacity
                          key={value.id}
                          activeOpacity={0.8}
                          onPress={() => {
                            AppModule.reportClick('3', '28', {
                              ProductId: detail.product_id,
                              CategoryId: detail.category_id,
                              CateStation: detail.cate_station,
                            });
                            if (recordId) {
                              AppModule.reportClick(reportData.slot, '170', {
                                ProductId: detail.product_id,
                                ProductType: detail.product_type,
                              });
                            }
                            updateSkuSelected(item, value, j);
                          }}
                          style={[
                            styles.skuImageBackGround,
                            selectItem.select.id === value.id
                              ? styles.skuGroundSelected
                              : styles.skuGroundUnSelected,
                          ]}>
                          <GlideImage
                            source={Utils.getImageUri(value.image_url)}
                            showDefaultImage={true}
                            defaultSource={require('../../assets/lucky_deal_default_small.png')}
                            resizeMode="contain"
                            style={{
                              width: '100%',
                              height: '100%',
                            }}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          key={value.id}
                          activeOpacity={0.8}
                          onPress={() => {
                            AppModule.reportClick('3', '28', {
                              ProductId: detail.product_id,
                              CategoryId: detail.category_id,
                              CateStation: detail.cate_station,
                            });
                            if (recordId) {
                              AppModule.reportClick(reportData.slot, '170', {
                                ProductId: detail.product_id,
                                ProductType: detail.product_type,
                              });
                            }
                            updateSkuSelected(item, value, j);
                          }}
                          style={styles.skuTextBackGround}>
                          <Text
                            style={{
                              fontSize: 30 * px,
                              color:
                                selectItem.select.id === value.id
                                  ? '#FF7070'
                                  : 'black',
                            }}>
                            {value.name}
                          </Text>
                        </TouchableOpacity>
                      ),
                    )}
                  </View>
                </View>
              );
            })}

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
                  detail.max_purchases_num === 0 ? 1 : detail.max_purchases_num
                }
                onMax={(max) => {
                  Utils.toastFun(`Sorry, you can only buy ${max} piece`);
                }}
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
                        (detail.force_min_purchases_num === 1
                          ? detail.min_purchases_num === 0
                            ? 1
                            : detail.min_purchases_num
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
                        (detail.max_purchases_num === 0
                          ? 1
                          : detail.max_purchases_num)
                          ? '#A5A5A5'
                          : 'black',
                    }}
                    source={require('../../assets/cart_increase_icon.png')}
                  />
                }
                onChange={(num) => {
                  if (from === 'offers') {
                    AppModule.reportClick('3', '29', {
                      ProductId: detail.product_id,
                      CategoryId: detail.category_id,
                      CateStation: detail.cate_station,
                    });
                  } else if (from === 'auction') {
                    AppModule.reportClick('4', '52', {
                      ProductId: detail.product_id,
                      AuctionId: detail.auction_id,
                    });
                  }

                  if (recordId) {
                    AppModule.reportClick(reportData.slot, '171', {
                      ProductId: detail.product_id,
                      ProductType: detail.product_type,
                    });
                  }
                  setAddCount(num);
                }}
              />
            </View>
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
          leftOnPress={nextAction !== 2 ? addToBag : null}
          rightOnPress={nextAction !== 1 ? goBuy : null}
          buttonContent={'Buy Now'}
        />
        <TouchableOpacity
          onPress={() => {
            AppModule.reportClose('3', '31', {
              ProductId: detail.product_id,
              CategoryId: detail.category_id,
              CateStation: detail.cate_station,
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
      </View>
      {/* </TouchableWithoutFeedback> */}
    </View>
  );
}

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
  skuGroundSelected: {
    backgroundColor: '#FCDADA',
    borderWidth: 1,
    borderColor: '#FF7070',
  },
  skuGroundUnSelected: {
    backgroundColor: '#F5F5F5',
  },

  buyButton: {
    backgroundColor: '#F04A33',
    width: 900 * px,
    height: 130 * px,
    alignSelf: 'center',
    // marginTop: 160 * px,
    // marginBottom: 40 * px,
    alignItems: 'center',
    borderRadius: 20 * px,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 40 * px,
  },

  okButton: {
    borderRadius: 20 * px,
    backgroundColor: ACCENT,
    width: 700 * px,
    height: 130 * px,
    alignSelf: 'center',
    // marginTop: 80 * px,
    // marginBottom: 40 * px,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 40 * px,
  },
});
