import {
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
  DeviceEventEmitter,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {FROM_ADD_ITEMS, px, SCREEN_WIDTH} from '../../constants/constants';
import {navigationRef} from '../../utils/refs';
import AppModule from '../../../AppModule';
import BottomSheet from '../dialog/BottomSheet';
import GlideImage from '../native/GlideImage';
import Utils from '../../utils/Utils';
import InputSpinner from 'react-native-input-spinner';
import {reportData} from '../../constants/reportData';
import {useShallowEqualSelector} from '../../utils/hooks';
import GoodsBottomButtons from '../productdetail/GoodsBottomButtons';
import Api from '../../Api';
import {useDispatch} from 'react-redux';
import {categoryDetailPath, bagGiftReportPath} from '../../analysis/report';
import {dialogs} from '../../utils/refs';
export default function QuantityView({
  detail,
  from,
  path,
  wheelIndex,
  way,
  recordId,
  nextAction,
  activity,
}) {
  const {profile, oneDollerCategory} = useShallowEqualSelector((state) => ({
    ...state.deprecatedPersist,
  }));
  const [loading, setLoading] = useState(false);
  const [addCount, setAddCount] = useState(
    detail.min_purchases_num === 0 ? 1 : detail.min_purchases_num,
  );
  const dispatch = useDispatch();
  let _percent = (
    (1 - detail.mark_price / detail.original_price) * 100 || 0
  ).toFixed(0);
  _percent = _percent < 0 ? '0' : _percent > 99 ? 99 : _percent;

  useEffect(() => {
    if (recordId) {
      AppModule.reportShow(reportData.slot, '169', {
        ProductId: detail.product_id,
        ProductType: detail.product_type,
      });
    }
  }, [recordId, detail.product_id, detail.product_type]);
  const vipProductPrice = () => {
    if (from === 'offers' && detail?.product_type === 4) {
      if (profile?.is_vip) {
        return detail?.mark_price;
      } else {
        return detail?.original_price;
      }
    }
    return detail?.mark_price || 0;
  };

  const addToBag = () => {
    if (path === FROM_ADD_ITEMS) {
      AppModule.reportClick('23', '402', {
        ProductId: detail.product_id,
      });
    }
    if (loading) {
      return;
    }
    setLoading(true);
    Api.addToCart(
      detail.bag_id || detail.gift_id || detail.product_id,
      detail.product_type,
      [],
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
  const buyNow = async () => {
    if (recordId) {
      AppModule.reportClick(reportData.slot, '172', {
        ProductId: detail.product_id,
        ProductType: detail.product_type,
      });
    }
    BottomSheet.hideWithOutAnimation();
    if (from === 'mystery') {
      AppModule.reportClick('3', '30', {
        ProductId: detail.bag_id || detail.product_id,
        CategoryId: detail.category_id,
        CateStation: detail.cate_station,
        ProductCat: categoryDetailPath.getData().ProductCat,
      });
    } else if (from === 'mysterySuperbox') {
      AppModule.reportClick('13', '130', {
        ProductId: detail.bag_id || detail.product_id,
        CategoryId: detail.category_id,
        SuperboxId: detail.bag_id || detail.product_id,
        CateStation: detail.cate_station,
      });
    } else if (from === 'offers') {
      AppModule.reportClick('3', '30', {
        ProductId: detail.bag_id || detail.product_id,
        CategoryId: detail.category_id,
        CateStation: detail.cate_station,
        ProductCat: categoryDetailPath.getData().ProductCat,
      });
      let productDetail = {
        ...detail,
        mark_price: vipProductPrice(),
      };
    }
  };
  return (
    <ScrollView style={{maxHeight: 1800 * px}}>
      <TouchableWithoutFeedback>
        <View>
          <View
            style={{
              flexDirection: from === 'mystery' ? 'column' : 'row',
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
                  detail.image != null && Array.isArray(detail.image)
                    ? detail.image[0]
                    : detail.image || '',
                )}
                resizeMode={'contain'}
                style={{
                  width: from === 'mystery' ? 600 * px : 280 * px,
                  height: from === 'mystery' ? 600 * px : 280 * px,
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
                  US ${(vipProductPrice() / 100.0).toFixed(2)}
                </Text>
              </View>
              {
                from === 'offers' && detail?.product_type === 4 ? (
                  <View
                    style={{
                      height: 200 * px,
                    }}
                  />
                ) : null
                /*<View
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
                    ${detail.original_price / 100.0 || 0}
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
                </View>*/
              }
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginTop: 20 * px,
              marginLeft: 36 * px,
            }}>
            <Text style={{color: 'black', fontSize: 50 * px}}>Quantity</Text>
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
              onMax={(max) => {
                Utils.toastFun(`Sorry, you can only buy ${max} piece`);
              }}
              onChange={(num) => {
                setAddCount(num);
                if (recordId) {
                  AppModule.reportClick(reportData.slot, '171', {
                    ProductId: detail.product_id,
                    ProductType: detail.product_type,
                  });
                }
                if (from === 'mystery') {
                  AppModule.reportClick('3', '29', {
                    ProductId: detail.bag_id || detail.product_id,
                    CategoryId: detail.category_id,
                    CateStation: detail.cate_station,
                  });
                } else if (from === 'offers') {
                  AppModule.reportClick('3', '29', {
                    ProductId: detail.bag_id || detail.product_id,
                    CategoryId: detail.category_id,
                    CateStation: detail.cate_station,
                  });
                } else if (from === 'mysterySuperbox') {
                  AppModule.reportClick('13', '129', {
                    ProductId: detail.bag_id || detail.product_id,
                    CategoryId: detail.category_id,
                    CateStation: detail.cate_station,
                    SuperboxId: detail.bag_id || detail.product_id,
                  });
                }
              }}
            />
          </View>

          <GoodsBottomButtons
            style={{
              alignSelf: 'center',
              marginTop: 160 * px,
              marginBottom: 40 * px,
              alignItems: 'center',
              width: SCREEN_WIDTH,
            }}
            goodsDetail={detail}
            leftOnPress={nextAction !== 2 ? addToBag : null}
            rightOnPress={nextAction !== 1 ? buyNow : null}
            buttonContent={'Buy Now'}
          />
          <TouchableOpacity
            onPress={() => {
              AppModule.reportClose('3', '31', {
                ProductId: detail.bag_id || detail.product_id,
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
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}
