import React, {useEffect, useRef, memo} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  DeviceEventEmitter,
} from 'react-native';
import {
  FROM_MYSTERY,
  FROM_OFFERS,
  FROM_SUPER_BOX,
  px,
  SCREEN_WIDTH,
} from '../../constants/constants';
import InputSpinner from 'react-native-input-spinner';
import GlideImage from '../native/GlideImage';
import Utils from '../../utils/Utils';
import CartMoreAction from './CartMoreAction';
import AlertDialog from '../dialog/AlertDialog';
import {dialogs, navigationRef} from '../../utils/refs';
import {reportData} from '../../constants/reportData';
import Api from '../../Api';
import {useDispatch} from 'react-redux';
import AppModule from '../../../AppModule';
import {Space} from '../common/Space';
import {Timer} from '../common/Timer';
import {
  MartketPriceText,
  OriginPriceText,
} from '../../widgets/productItem/widgets/PriceText';
import {MysteryRoute, ProductRoute} from '@src/routes';

export default function CartItem({
  data,
  index,
  updateList = null,
  soldout = false,
}) {
  const dispatch = useDispatch();
  const moreActionRef = useRef();
  const inputSpinnerRef = useRef();

  const moveAction = () => {
    AppModule.reportClick('23', '321', {
      CategoryId: data.category_id,
      ProductId: data.product_id,
      Productstatus: data.status === 0 ? 1 : 0,
    });
    AlertDialog.hide();
    dialogs.loadingDialog.current?.show();
    let list = [{product_id: data.product_id, product_type: data.product_type}];
    Api.cartMoveToWishList(list).then((res) => {
      if (res.code === 0) {
        Api.cartEdit(data.id, 1, 0).then((res) => {
          dialogs.loadingDialog.current?.hide();
          if (res.code === 0 && res.data?.is_success) {
            dispatch({type: 'updateCartNum', payload: res.data?.total_num});
            DeviceEventEmitter.emit('updateCartList', {
              needToast: false,
              type: '',
            });
          }
          if (updateList) {
            updateList();
          }
          if (res.code !== 0) {
            Utils.toastFun(res.error);
          }
        });
      } else {
        dialogs.loadingDialog.current?.show();
        Utils.toastFun(res.error);
      }
    });
  };

  const cartItemAction = (type, qty) => {
    AlertDialog.hide();
    dialogs.loadingDialog.current?.show();
    Api.cartEdit(data.id, type, qty).then((res) => {
      dialogs.loadingDialog.current?.hide();
      if (res.code === 0 && res.data?.is_success) {
        dispatch({type: 'updateCartNum', payload: res.data?.total_num});
        DeviceEventEmitter.emit('updateCartList', {needToast: false, type: ''});
      }
      if (updateList) {
        updateList();
      }
      if (res.code !== 0) {
        Utils.toastFun(res.error);
      }
    });
  };

  /**
   *
   * @param actionType 1 移入wish list , 2-delete
   */
  const onCancel = (actionType) => {
    AlertDialog.hide();
    if (actionType === 1) {
      AppModule.reportClick('23', '320', {
        CategoryId: data.category_id,
        ProductId: data.product_id,
        Productstatus: data.status === 0 ? 1 : 0,
      });
    } else if (actionType === 2) {
      AppModule.reportClick('23', '317', {
        CategoryId: data.category_id,
        ProductId: data.product_id,
        Productstatus: data.status === 0 ? 1 : 0,
      });
    }
  };

  const moreActionClick = () => {
    AppModule.reportClick('23', '313', {
      CategoryId: data.category_id,
      ProductId: data.product_id,
      Productstatus: data.status === 0 ? 1 : 0,
    });
    if (moreActionRef.current?.isShow()) {
      moreActionRef.current?.hide();
    } else {
      DeviceEventEmitter.emit('hideMoreAction', data.id);
      moreActionRef.current?.showCartMoreAction({
        x: 30 * px,
        y: 96 * px,
        moveWishListFun: moreMoveAction,
        deleteFun: moreDeleteAction,
      });
    }
  };
  const moreMoveAction = () => {
    AppModule.reportClick('23', '314', {
      CategoryId: data.category_id,
      ProductId: data.product_id,
      Productstatus: data.status === 0 ? 1 : 0,
    });
    AppModule.reportShow('23', '319', {
      CategoryId: data.category_id,
      ProductId: data.product_id,
      Productstatus: data.status === 0 ? 1 : 0,
    });
    AlertDialog.showLayout(
      ConfirmDialog({
        content: 'Are you sure you want to move this item to your wish list?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: moveAction,
        onCancel: () => onCancel(1),
      }),
    );
  };
  const moreDeleteAction = () => {
    AppModule.reportClick('23', '315', {
      CategoryId: data.category_id,
      ProductId: data.product_id,
      Productstatus: data.status === 0 ? 1 : 0,
    });
    deleteCartItem(null);
  };

  const deleteCartItem = (cancel) => {
    AppModule.reportShow('23', '316', {
      CategoryId: data.category_id,
      ProductId: data.product_id,
      Productstatus: data.status === 0 ? 1 : 0,
    });
    AlertDialog.showLayout(
      ConfirmDialog({
        content: 'Are you sure to delete this item?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: () => {
          AppModule.reportShow('23', '318', {
            CategoryId: data.category_id,
            ProductId: data.product_id,
            Productstatus: data.status === 0 ? 1 : 0,
          });
          cartItemAction(1, 0);
        },
        onCancel: () => {
          cancel ? cancel() : onCancel(2);
        },
      }),
    );
  };

  const ProductRouter = ProductRoute.useRouteLink();
  const MysteryRouter = MysteryRoute.useRouteLink();

  const goodsDetail = (type) => {
    if (type === 1) {
      AppModule.reportClick('23', '308', {
        CategoryId: data.category_id,
        ProductId: data.product_id,
        Productstatus: data.status === 0 ? 1 : 0,
        ProductCat: data.item_id,
      });
    } else if (type === 2) {
      AppModule.reportClick('23', '309', {
        CategoryId: data.category_id,
        ProductId: data.product_id,
        Productstatus: data.status === 0 ? 1 : 0,
        ProductCat: data.item_id,
      });
    }

    DeviceEventEmitter.emit('hideMoreAction', data.id);
    if (moreActionRef.current?.isShow()) {
      moreActionRef.current?.hide();
      return;
    }
    if (data.status !== 0) {
      return;
    }
    if (data.product_type === 1) {
      //1 --福袋，2--直购，3--大转盘 4---vip商品 5---专题页 6---特殊页面
      MysteryRouter.navigate({
        productId: data.product_id,
      });
    } else if (data.product_type === 2 || data.product_type === 4) {
      ProductRouter.navigate({
        productId: data.product_id,
      });
    }
  };

  const emitEvent = () => {
    DeviceEventEmitter.emit('hideMoreAction', -1);
  };

  useEffect(() => {
    let sub = DeviceEventEmitter.addListener('hideMoreAction', (id) => {
      if (data.id !== id) {
        moreActionRef.current?.hide();
      }
    });
    return () => {
      sub.remove();
    };
  }, [data.id]);

  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
        paddingHorizontal: 20 * px,
        paddingVertical: 15 * px,
      }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={emitEvent}
        style={{
          backgroundColor: '#fff',
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            position: 'relative',
            borderRadius: 20 * px,
            overflow: 'hidden',
            width: 244 * px,
            height: 244 * px,
          }}
          onPress={() => {
            goodsDetail(1);
          }}>
          <GlideImage
            showDefaultImage={true}
            defaultSource={require('../../assets/lucky_deal_default_middle.png')}
            source={Utils.getImageUri(data?.image)}
            resizeMode={'stretch'}
            style={{
              width: 244 * px,
              height: 244 * px,
            }}
          />
          {data?.act_id ? (
            <ActivityTag
              activityTag={'Bundle Sale'}
              activityTagColor={data?.activity_tag_color}
            />
          ) : null}
          {data?.status !== 0 ? (
            <View
              style={{
                position: 'absolute',
                backgroundColor: '#00000099',
                width: 244 * px,
                height: 244 * px,
                left: 0,
                right: 0,
                borderRadius: 20 * px,
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <Image
                resizeMode="contain"
                source={require('../../assets/soldout.png')}
                style={{
                  width: 230 * px,
                  height: 170 * px,
                }}
              />
            </View>
          ) : null}
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            marginLeft: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: 60 * px,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                goodsDetail(2);
              }}>
              <Text
                numberOfLines={1}
                style={{
                  width:
                    data.status === 0
                      ? SCREEN_WIDTH - 420 * px
                      : SCREEN_WIDTH - 340 * px,
                  color: data?.status === 1 ? '#A5A5A5' : 'black',
                  fontSize: 32 * px,
                }}>
                {data.title}
              </Text>
            </TouchableOpacity>
            {data.status === 0 && (
              <TouchableOpacity
                onPress={moreActionClick}
                style={{width: 80 * px, height: 60 * px}}>
                <Image
                  style={{width: 64 * px, height: 60 * px}}
                  source={require('../../assets/more_action.png')}
                />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              marginTop: -10 * px,
              alignSelf: 'flex-start',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <MartketPriceText
              isActivity={data?.flash_sales?.is_discount}
              style={{fontSize: 36 * px}}
              value={data.price}
            />
            <OriginPriceText
              isActivity={data?.flash_sales?.is_discount}
              style={{
                marginTop: 6 * px,
                marginLeft: 10 * px,
                fontSize: 30 * px,
              }}
              value={data.original_price}
            />
          </View>
          <CartItemSku sku={data.product_sku} />
          {data?.flash_sales?.is_discount && (
            <Timer targetTime={data.flash_sales.end_time}>
              {(time) => {
                return (
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 30 * px, color: '#E00404'}}>
                      Ending in {time}
                    </Text>
                  </View>
                );
              }}
            </Timer>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 'auto',
            }}>
            <View>
              {data.is_free_shipping_fee && (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    resizeMode="contain"
                    style={{width: 55 * px, height: 30 * px}}
                    source={require('../../assets/free_ship.png')}
                  />
                  <Text
                    style={{
                      color: '#528BFC',
                      fontSize: 30 * px,
                      marginLeft: 10 * px,
                    }}>
                    Free Shipping
                  </Text>
                </View>
              )}
            </View>
            {soldout && <Text style={{fontSize: 33 * px}}>x{data?.qty}</Text>}
            {!soldout && data?.status !== 0 && (
              <TouchableOpacity
                onPress={() => {
                  AppModule.reportClick('23', '312', {
                    CategoryId: data.category_id,
                    ProductId: data.product_id,
                    ProductCat: data.item_id,
                  });
                  deleteCartItem(null);
                }}
                style={{
                  height: 70 * px,
                  width: 70 * px,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  style={{width: 53 * px, height: 61 * px}}
                  source={require('../../assets/cart_item_delete.png')}
                />
              </TouchableOpacity>
            )}
            {!soldout && data?.status === 0 && data.product_type !== 7 && (
              <TouchableOpacity
                onPress={null}
                style={{
                  width: 300 * px,
                  height: 65 * px,
                }}>
                <InputSpinner
                  ref={inputSpinnerRef}
                  max={data?.max_purchases_num}
                  min={data?.min_purchases_num}
                  step={1}
                  colorMax={'#7A7A7A'}
                  colorMin={'#7A7A7A'}
                  value={data?.qty}
                  initialValue={data?.qty}
                  rounded={false}
                  editable={false}
                  style={{
                    position: 'absolute',
                    right: 0,
                    width: 240 * px,
                    height: 62 * px,
                    alignItems: 'center',
                  }}
                  inputStyle={{
                    width: 100 * px,
                    borderTopWidth: 2 * px,
                    borderBottomWidth: 2 * px,
                    height: 60 * px,
                    borderColor: '#656565',
                    textAlign: 'center',
                  }}
                  buttonFontSize={20}
                  buttonStyle={{
                    width: 80 * px,
                    height: 60 * px,
                    fontSize: 20 * px,
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
                        tintColor: inputSpinnerRef.current?.minReached()
                          ? '#A5A5A5'
                          : 'black',
                      }}
                      source={require('../../assets/cart_decrease_icon.png')}
                    />
                  }
                  buttonRightImage={
                    <Image
                      style={{
                        width: 40 * px,
                        height: 40 * px,
                        alignSelf: 'center',
                        tintColor: inputSpinnerRef.current?.maxReached()
                          ? '#A5A5A5'
                          : 'black',
                      }}
                      source={require('../../assets/cart_increase_icon.png')}
                    />
                  }
                  buttonTextColor={'#000'}
                  onIncrease={(increased) => {
                    AppModule.reportClick('23', '310', {
                      CategoryId: data.category_id,
                      ProductId: data.product_id,
                      ProductCat: data.item_id,
                    });
                  }}
                  onDecrease={(decreased) => {
                    AppModule.reportClick('23', '311', {
                      CategoryId: data.category_id,
                      ProductId: data.product_id,
                      ProductCat: data.item_id,
                    });
                  }}
                  onChange={(num) => {
                    if (num === 0) {
                      deleteCartItem(() => {
                        onCancel(2);
                        inputSpinnerRef.current?.increase();
                      });
                    } else {
                      cartItemAction(0, num);
                    }
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
      <CartMoreAction ref={moreActionRef} />
    </View>
  );
}

export const CartItemSku = ({sku}) => {
  const skuLen = sku?.length || 0;
  return sku?.length ? (
    <View
      style={{
        flexDirection: 'row',
        marginVertical: 5 * px,
      }}>
      <FlatList
        horizontal
        data={sku}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => {
          return 'sku' + index;
        }}
        renderItem={({item, index: i}) => {
          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F8F8F8',
                borderTopLeftRadius: i === 0 ? 10 * px : 0,
                borderBottomLeftRadius: i === 0 ? 10 * px : 0,
                borderTopRightRadius: i === skuLen - 1 ? 10 * px : 0,
                borderBottomRightRadius: i === skuLen - 1 ? 10 * px : 0,
                paddingVertical: 5 * px,
                marginRight: 15 * px,
              }}>
              <Text
                style={{
                  fontSize: 25 * px,
                  paddingHorizontal: 10 * px,
                  color: '#707070',
                }}
                numberOfLines={1}>
                {item.sku_value + (i === skuLen - 1 ? '' : ',')}
              </Text>
            </View>
          );
        }}
      />
    </View>
  ) : null;
};
export const ActivityTag = memo(({activityTag, activityTagColor}) => (
  <View
    style={{
      backgroundColor: activityTagColor ? activityTagColor : '#D70000',
      position: 'absolute',
      left: 0,
      top: 0,
      height: 40 * px,
      borderBottomRightRadius: 20 * px,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <Text
      style={{
        color: 'white',
        fontSize: 25 * px,
        paddingHorizontal: 10,
      }}>
      {activityTag}
    </Text>
  </View>
));
export const ActivityDes = memo(({act_tips}) => (
  <Text
    style={{
      color: '#707070',
      fontSize: 30 * px,
      paddingHorizontal: 10 * px,
      backgroundColor: '#F8F8F8',
      paddingVertical: 5 * px,
      marginVertical: 10 * px,
    }}>
    {act_tips}
  </Text>
));
export const ConfirmDialog = ({
  content,
  okButtonBg = '#3C7DE3',
  cancelButtonBg = '#F04A33',
  okText = 'Ok',
  cancelText = 'Cancel',
  onCancel,
  onOk,
  minHeight,
}) => {
  return (
    <View
      style={{
        justifyContent: 'space-around',
        minHeight: minHeight ? minHeight : 460 * px,
        paddingTop: 20 * px,
        alignItems: 'center',
        borderRadius: 20 * px,
        backgroundColor: '#fff',
        width: '70%',
        overflow: 'hidden',
      }}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text
          style={[
            {
              textAlign: 'center',
              fontSize: 55 * px,
              paddingHorizontal: 30 * px,
              marginBottom: 80 * px,
              alignSelf: 'center',
            },
          ]}>
          {content}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: 112 * px,
        }}>
        {onCancel ? (
          <TouchableOpacity
            onPress={onCancel}
            style={{
              flex: 1,
              backgroundColor: cancelButtonBg,
              justifyContent: 'center',
              alignItems: 'center',
              height: 112 * px,
            }}>
            <Text
              style={{color: '#fff', fontSize: 40 * px, textAlign: 'center'}}>
              {cancelText}
            </Text>
          </TouchableOpacity>
        ) : null}
        {onOk ? (
          <TouchableOpacity
            onPress={onOk}
            style={{
              flex: 1,
              backgroundColor: okButtonBg,
              justifyContent: 'center',
              alignItems: 'center',
              height: 112 * px,
            }}>
            <Text
              style={{color: '#fff', fontSize: 40 * px, textAlign: 'center'}}>
              {okText}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};
