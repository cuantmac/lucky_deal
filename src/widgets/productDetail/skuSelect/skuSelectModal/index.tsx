import {
  BagProductDetailResponse,
  OfferProductDetailResponse,
  ProductSku,
  ProductSkuInfoItem,
} from '@luckydeal/api-common';
import {PRODUCT_CATEGPRY_TYPE} from '@src/constants/enum';
import {convertAmountUS, createCtx, createStyleSheet} from '@src/helper/helper';
import {ErrorMsg, Message} from '@src/helper/message';
import {useNavigationParams} from '@src/hooks/useNavigationParams';
import {thunkAction} from '@src/redux';
import {PayRoute, requireAuth} from '@src/routes';
import {BUTTON_TYPE_ENUM} from '@src/widgets/button';
import {GlideImage} from '@src/widgets/glideImage';
import {InputSpinner} from '@src/widgets/inputSpinner';
import {useActionSheet} from '@src/widgets/modal/modal';
import {
  ActionSheetContent,
  ActionSheetScrollContent,
} from '@src/widgets/modal/modal/widgets';
import {Space} from '@src/widgets/space';
import React, {
  FC,
  forwardRef,
  useCallback,
  Fragment,
  useEffect,
  useState,
  useImperativeHandle,
  SetStateAction,
  Dispatch,
  memo,
  useContext,
} from 'react';
import {useMemo} from 'react';
import {Text, View, ScrollView, TouchableOpacity} from 'react-native';
import {ProductButton} from '../../productButton';
import {
  skuFunnel,
  SkuImageItem,
  SkuStandardItem,
  SKU_ITEM_STATUS_ENUM,
} from '../widgets';

type SelectSkuType = (number | undefined)[];

export type OnSkuChangePrams = {
  price: ReturnType<typeof querySkuPrice>;
  selectedSku: SelectSkuType;
  skuText: string[];
  skuSelectIsComplete?: boolean;
};

export interface SkuSelectModalProps {
  data?: OfferProductDetailResponse | BagProductDetailResponse;
  onAdd2Bag?: () => void | Promise<void>;
  onBuyNow?: () => void | Promise<void>;
  onSkuChange?: (params: OnSkuChangePrams) => void;
}

interface ShowParams {
  showAdd2Bag?: boolean;
  showBuyNow?: boolean;
}

export interface SkuSelectModalRef {
  show: (params?: ShowParams) => void;
}

export interface ProductStatusCtxParams {
  stock: number;
  offShelf: boolean;
}

export const [ProductStatusCtx, ProductStatusProvider] = createCtx<
  ProductStatusCtxParams
>({
  stock: 1,
  offShelf: false,
});

export const SkuSelectModal = memo(
  forwardRef<SkuSelectModalRef, SkuSelectModalProps>(
    ({data, onSkuChange, onAdd2Bag, onBuyNow}, ref) => {
      const {sku: skuStr} = useNavigationParams<{sku?: string}>();
      const [Modal, setModalVisible] = useActionSheet();
      const [sourceData, setSourceData] = useState(data);
      const [selectedSku, setSelectedSku] = useState<SelectSkuType>([]);
      const [config, setConfig] = useState<ShowParams>();
      const [qty, setQty] = useState(1);
      const PayRouter = PayRoute.useRouteLink();
      const {update} = useContext(ProductStatusCtx);

      // 对 sourceData 中的 product_sku 过滤处理
      const souceDataClone = useMemo(() => {
        if (!sourceData) {
          return;
        }
        (sourceData as OfferProductDetailResponse).product_sku = skuFunnel(
          (sourceData as OfferProductDetailResponse)?.product_sku,
        );
        return sourceData;
      }, [sourceData]);

      const skuData = useMemo(() => {
        return convertSkuData(souceDataClone);
      }, [souceDataClone]);

      const productId = useMemo(() => {
        if (!souceDataClone) {
          return;
        }
        return (
          (souceDataClone as OfferProductDetailResponse).product_id ||
          (souceDataClone as BagProductDetailResponse).bag_id
        );
      }, [souceDataClone]);

      const handleInputSpinnerChange = useCallback((val: number) => {
        setQty(val);
      }, []);

      // 校验sku是否选择完整
      const isComplete = useMemo(() => {
        return skuSelectIsComplete(skuData, selectedSku);
      }, [selectedSku, skuData]);

      // 查询当前sku库存
      const stock = useMemo(() => {
        // 无sku商品
        if (
          !(souceDataClone as OfferProductDetailResponse)?.product_sku?.sku
            ?.length
        ) {
          return souceDataClone?.stock || 0;
        }

        // 未选择完sku
        if (!isComplete) {
          return souceDataClone?.max_purchases_num || 0;
        }

        // 查询库存
        return queryStock(
          (souceDataClone as OfferProductDetailResponse)?.product_sku,
          selectedSku,
        );
      }, [isComplete, selectedSku, souceDataClone]);

      // 查询sku需要显示的价格
      const price = useMemo(() => {
        return querySkuPrice(
          souceDataClone?.mark_price || 0,
          souceDataClone?.original_price || 0,
          skuData,
          selectedSku,
        );
      }, [selectedSku, skuData, souceDataClone]);

      // 查询sku对应文案
      const skuText = useMemo(() => {
        return querySkuText(skuData, selectedSku);
      }, [selectedSku, skuData]);

      // 查询sku需要显示的图片
      const productImage = useMemo(() => {
        return querySkuImage(
          souceDataClone?.image,
          (souceDataClone as OfferProductDetailResponse)?.product_sku,
          selectedSku,
        );
      }, [selectedSku, souceDataClone]);

      const buttonDisabled = useMemo(() => {
        const productStatus = (souceDataClone as OfferProductDetailResponse)
          ?.product_status;
        if (
          productStatus !== undefined &&
          (souceDataClone as OfferProductDetailResponse).product_status !== 0
        ) {
          return true;
        }

        if (stock <= 0) {
          return true;
        }
        return false;
      }, [souceDataClone, stock]);

      const purchaseCheck = useCallback(() => {
        if (!isComplete) {
          Message.toast('Please select the options!');
          return false;
        }
        if (qty > stock) {
          Message.toast(
            'sorry,up to ' +
              stock +
              ' items of this product can be purchased per order.',
          );
          return false;
        }
        return true;
      }, [isComplete, qty, stock]);

      const handleBuyNowPress = useCallback(() => {
        requireAuth()
          .then(() => {
            if (purchaseCheck()) {
              const sku = generatorSkuResult(skuData, selectedSku);
              setModalVisible(false);
              PayRouter.navigate({
                productId,
                productType: souceDataClone!.product_type,
                sku,
                qty,
              });
            }
          })
          .catch(() => {
            setModalVisible(false);
          });
      }, [
        PayRouter,
        productId,
        purchaseCheck,
        qty,
        selectedSku,
        setModalVisible,
        skuData,
        souceDataClone,
      ]);

      const handleAddToBagPress = useCallback(() => {
        if (!sourceData) {
          return;
        }
        if (purchaseCheck()) {
          const sku = generatorSkuResult(skuData, selectedSku);
          Message.loading();
          thunkAction
            .addProduct2CartAsync({
              productDetail: sourceData,
              qty,
              price: price.marketPrice,
              productId: productId as number,
              productType: souceDataClone!.product_type,
              sku: sku ? [sku] : [],
            })
            .then(() => {
              return onAdd2Bag && onAdd2Bag();
            })
            .then(() => {
              setModalVisible(false);
              Message.toast('Added to bag');
            })
            .catch((e: ErrorMsg) => {
              Message.toast(e);
            });
        }
      }, [
        onAdd2Bag,
        price.marketPrice,
        productId,
        purchaseCheck,
        qty,
        selectedSku,
        setModalVisible,
        skuData,
        souceDataClone,
        sourceData,
      ]);

      useImperativeHandle(
        ref,
        () => {
          return {
            show: (params = {showAdd2Bag: true, showBuyNow: true}) => {
              setConfig(params);
              setModalVisible(true);
            },
          };
        },
        [setModalVisible],
      );

      // 将props中data同步至state
      useEffect(() => {
        setSourceData(data);
      }, [data, setModalVisible]);

      useEffect(() => {
        onSkuChange &&
          onSkuChange({
            price,
            selectedSku,
            skuText,
            skuSelectIsComplete: isComplete,
          });
      }, [isComplete, onSkuChange, price, selectedSku, skuText]);

      useEffect(() => {
        const restoreSku = generatorRestoreSku(skuStr, skuData);
        if (restoreSku?.length) {
          setSelectedSku(restoreSku);
        }
      }, [skuData, skuStr]);

      useEffect(() => {
        souceDataClone &&
          update({
            offShelf: souceDataClone.product_status !== 0,
            stock: stock,
          });
      }, [souceDataClone, stock, update]);

      if (!souceDataClone) {
        return null;
      }

      return (
        <Modal useDefaultTemplate={false} maskClosable>
          <ActionSheetContent style={SkuSelectModalStyles.content}>
            <SkuInfo price={price} image={productImage} skuText={skuText} />
            <ActionSheetScrollContent>
              {/* 商品sku选择 */}
              <SkuSelect
                selectedSku={selectedSku}
                onChange={setSelectedSku}
                data={souceDataClone}
              />

              {/* qty选择器 */}
              <SkuSelectModule>
                <View style={SkuSelectModalStyles.qtyContainer}>
                  <Text style={SkuSelectModalStyles.qtyTitle}>Quantity</Text>
                  <InputSpinner
                    min={sourceData?.min_purchases_num}
                    max={sourceData?.max_purchases_num}
                    onChange={handleInputSpinnerChange}
                    value={qty}
                  />
                </View>
              </SkuSelectModule>
            </ActionSheetScrollContent>
            <Space
              backgroundColor={'#e5e5e5'}
              height={1}
              marginLeft={-16}
              marginRight={-16}
            />

            {/* 底部按钮 */}
            <View style={SkuSelectModalStyles.buttonContainer}>
              {buttonDisabled ? (
                <ProductButton
                  wrapStyle={{flex: 1}}
                  disabled={buttonDisabled}
                  type={BUTTON_TYPE_ENUM.HIGH_LIGHT}
                />
              ) : (
                <>
                  {config?.showAdd2Bag && (
                    <ProductButton
                      wrapStyle={{flex: 1}}
                      type={BUTTON_TYPE_ENUM.STANDARD}
                      title={'Add to Bag'}
                      onPress={handleAddToBagPress}
                    />
                  )}
                  {config?.showAdd2Bag && config?.showBuyNow && (
                    <Space height={0} marginRight={7} />
                  )}
                  {config?.showBuyNow && (
                    <ProductButton
                      wrapStyle={{flex: 1}}
                      type={BUTTON_TYPE_ENUM.HIGH_LIGHT}
                      title={'Buy Now'}
                      onPress={handleBuyNowPress}
                    />
                  )}
                </>
              )}
            </View>

            {/* 弹窗关闭安妮 */}
            <TouchableOpacity
              style={SkuSelectModalStyles.closeBtn}
              onPress={() => {
                setModalVisible(false);
              }}>
              <GlideImage
                style={SkuSelectModalStyles.closeImage}
                source={require('@src/assets/close.png')}
                defaultSource={false}
              />
            </TouchableOpacity>
          </ActionSheetContent>
        </Modal>
      );
    },
  ),
);

interface SkuInfoProps {
  image: string;
  price: ReturnType<typeof querySkuPrice>;
  skuText: string[];
}

const SkuInfo: FC<SkuInfoProps> = ({image, price, skuText}) => {
  const showLinePrice = !!price.originalPrice;
  return (
    <View style={SkuSelectModalStyles.skuInfoContainer}>
      <GlideImage
        resizeMode="cover"
        style={SkuSelectModalStyles.skuInfoImage}
        source={{uri: image}}
      />
      <View style={SkuSelectModalStyles.skuInfoRightContainer}>
        <Text
          style={[
            SkuSelectModalStyles.skuInfoOriginPrice,
            showLinePrice && {color: '#D0011A'},
          ]}>
          {convertAmountUS(price.marketPrice)}
        </Text>
        {showLinePrice && (
          <Text style={SkuSelectModalStyles.skuLinePrice}>
            {convertAmountUS(price.originalPrice)}
          </Text>
        )}
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          style={SkuSelectModalStyles.skuInfoSelectedSkuList}>
          {skuText && !!skuText.length && (
            <Text style={SkuSelectModalStyles.skuInfoSelectedSkuText}>
              {skuText
                .join(',  |')
                .split('|')
                .map((str, index) => {
                  return <Fragment key={index}>{str}</Fragment>;
                })}
            </Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

interface SkuSelectProps {
  data: OfferProductDetailResponse | BagProductDetailResponse;
  selectedSku: (number | undefined)[];
  onChange: Dispatch<SetStateAction<(number | undefined)[]>>;
}

const SkuSelect: FC<SkuSelectProps> = ({data, selectedSku, onChange}) => {
  const sku = useMemo(() => {
    return (data as OfferProductDetailResponse)?.product_sku;
  }, [data]);

  const handleRowOnPress = useCallback(
    (row: number, skuInfoItem: ProductSkuInfoItem) => {
      onChange((old) => {
        const clone = [...old];
        clone[row] = clone[row] === skuInfoItem.id ? undefined : skuInfoItem.id;
        return clone;
      });
    },
    [onChange],
  );

  const getStatus = useCallback(
    (row: number, skuInfoItem: ProductSkuInfoItem) => {
      // 去除空值 去除选中的同行元素
      const limit = selectedSku.filter((val, index) => {
        return index !== row;
      });
      const stock = queryStock(sku, [skuInfoItem.id, ...(limit as number[])]);
      if (stock > 0) {
        return SKU_ITEM_STATUS_ENUM.STANDARD;
      } else {
        return SKU_ITEM_STATUS_ENUM.DISABLED;
      }
    },
    [selectedSku, sku],
  );

  // 福袋 或 无sku 无需选择sku
  if (
    data.product_type === PRODUCT_CATEGPRY_TYPE.MYSTERY ||
    !sku?.sku?.length
  ) {
    return null;
  }

  return (
    <SkuSelectModule>
      {sku?.sku?.map(({attr_id, attr_name, sku_list}, rowIndex) => {
        return (
          <Fragment key={attr_id}>
            <SkuSelectTitle title={attr_name} />
            <View
              style={[
                SkuSelectModalStyles.skuItemWrap,
                sku_list[0]?.image_url
                  ? SkuSelectModalStyles.skuItemImageWrap
                  : SkuSelectModalStyles.skuItemStandardWrap,
              ]}>
              {sku_list?.map((productSkuInfoItem, index) => {
                if (productSkuInfoItem.image_url) {
                  return (
                    <SkuImageItem
                      onPress={() =>
                        handleRowOnPress(rowIndex, productSkuInfoItem)
                      }
                      status={getStatus(rowIndex, productSkuInfoItem)}
                      style={SkuSelectModalStyles.skuImageItem}
                      key={index}
                      value={productSkuInfoItem}
                      active={selectedSku[rowIndex] === productSkuInfoItem.id}
                    />
                  );
                }
                return (
                  <SkuStandardItem
                    onPress={() =>
                      handleRowOnPress(rowIndex, productSkuInfoItem)
                    }
                    status={getStatus(rowIndex, productSkuInfoItem)}
                    style={SkuSelectModalStyles.skuItem}
                    key={index}
                    value={productSkuInfoItem.name}
                    active={selectedSku[rowIndex] === productSkuInfoItem.id}
                  />
                );
              })}
            </View>
          </Fragment>
        );
      })}
      <Space height={11} backgroundColor={'transparent'} />
    </SkuSelectModule>
  );
};

const SkuSelectModule: FC = ({children}) => {
  return <View style={SkuSelectModalStyles.skuSelectModule}>{children}</View>;
};

interface SkuSelectTitleProps {
  title?: string;
}

const SkuSelectTitle: FC<SkuSelectTitleProps> = ({title}) => {
  return <Text style={SkuSelectModalStyles.skuSelectTitle}>{title}</Text>;
};

const SkuSelectModalStyles = createStyleSheet({
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    right: 10,
    top: 10,
  },
  closeImage: {
    width: 14,
    height: 14,
  },
  skuInfoContainer: {
    flexDirection: 'row',
    paddingBottom: 16,
  },
  skuInfoImage: {
    width: 100,
    height: 100,
    borderRadius: 6,
    marginRight: 16,
  },
  skuInfoRightContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  skuInfoOriginPrice: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  skuLinePrice: {
    color: '#999',
    textDecorationLine: 'line-through',
    fontSize: 14,
    lineHeight: 17,
    marginTop: 4,
  },
  skuInfoSelectedSkuList: {
    flexGrow: 0,
    height: 14,
    marginTop: 10,
  },
  skuInfoSelectedSkuText: {
    backgroundColor: '#f6f6f6',
    borderRadius: 2,
    lineHeight: 14,
    fontSize: 12,
    paddingHorizontal: 4,
  },
  skuSelectModule: {
    borderTopColor: '#e5e5e5',
    borderTopWidth: 1,
    borderStyle: 'solid',
  },
  skuSelectTitle: {
    height: 37,
    fontSize: 14,
    lineHeight: 37,
    fontWeight: '700',
  },
  skuItemWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  skuItemStandardWrap: {
    marginRight: -8,
    marginBottom: -8,
  },
  skuItem: {
    marginRight: 8,
    marginBottom: 8,
  },
  skuItemImageWrap: {
    marginRight: -20,
    marginBottom: -20,
  },
  skuImageItem: {
    marginRight: 20,
    marginBottom: 20,
  },
  qtyContainer: {
    height: 52,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qtyTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    justifyContent: 'space-between',
  },
});

// 判断arr1 是否包含 arr2
const arrayContain = (arr1: any[], arr2: any[]) => {
  let arr1Len = arr1.length;
  let arr2Len = arr2.length;
  if (arr1Len < arr2Len) {
    return false;
  }
  for (let i = 0; i < arr2Len; i++) {
    if (!arr1.includes(arr2[i])) {
      return false;
    }
  }
  return true;
};

// 查询sku库存
export const queryStock = (
  sku: ProductSku | undefined,
  skuList: SelectSkuType,
) => {
  let stock = 0;
  const price = sku?.price;
  if (!price) {
    return stock;
  }
  Object.keys(price).forEach((key) => {
    if (
      arrayContain(
        key.split('-'),
        skuList.filter((val) => val).map((val) => val + ''),
      )
    ) {
      stock += price[key].stock;
    }
  });
  return stock;
};

// 根据sku id查询 规格文本
export const querySkuText = (
  skuData: ReturnType<typeof convertSkuData>,
  skuList: SelectSkuType,
) => {
  let strArr: string[] = [];
  if (!skuData?.sku || !skuData?.sku.sku.length) {
    return strArr;
  }
  return skuList
    .filter((val) => val)
    .map((val) => {
      return skuData.id2ValueMap[val + ''];
    });
};

// 查询sku是否完整
export const skuSelectIsComplete = (
  skuData: ReturnType<typeof convertSkuData>,
  skuList: SelectSkuType,
) => {
  if (skuList.filter((val) => val).length === skuData?.skuLength) {
    return true;
  }
  return false;
};

// 查询sku价格信息
export const querySkuPrice = (
  marketPrice: number,
  originalPrice: number,
  skuData: ReturnType<typeof convertSkuData>,
  skuList: SelectSkuType,
) => {
  let lowPrice = {marketPrice, originalPrice};
  const sku = skuData?.sku;
  const price = sku?.price;
  if (price) {
    const priceArr = Object.keys(price).map((key) => price[key]);
    priceArr.sort(({price_low}, {price_low: price_low1}) => {
      return price_low - price_low1;
    });
    const low = priceArr[0];
    lowPrice = low
      ? {marketPrice: low.price_low, originalPrice: low.price_high}
      : lowPrice;
  } else {
    return lowPrice;
  }
  if (!skuSelectIsComplete(skuData, skuList)) {
    return lowPrice;
  }
  if (!sku?.sku.length) {
    return lowPrice;
  }
  const skuRes = generatorSkuResult(skuData, skuList);
  for (let key in price) {
    if (key === skuRes) {
      return {
        marketPrice: price[key].price_low,
        originalPrice: price[key].price_high,
      };
    }
  }
  return lowPrice;
};

// 根据选择的sku显示图片
export const querySkuImage = (
  image: string[] | undefined,
  sku: ProductSku | undefined,
  skuList: SelectSkuType,
) => {
  const img = image ? image[0] : '';
  const skuListTrim = skuList.filter((val) => val);
  if (!sku?.sku.length) {
    return img;
  }
  if (!skuListTrim.length) {
    return img;
  }
  for (let i = 0; i < sku.sku.length; i++) {
    const skuItem = sku.sku[i].sku_list || [];
    for (let j = 0; j < skuItem.length; j++) {
      const skuListItem = skuItem[j];
      if (skuListTrim.includes(skuListItem.id) && skuListItem.image_url) {
        return skuListItem.image_url;
      }
    }
  }
  return img;
};

const convertSkuData = (
  data?: OfferProductDetailResponse | BagProductDetailResponse,
) => {
  const sku = (data as OfferProductDetailResponse)?.product_sku;
  const productId =
    (data as OfferProductDetailResponse)?.product_id ||
    (data as BagProductDetailResponse)?.bag_id;
  let skuLength = 0;
  if (!sku) {
    return {
      skuLength,
      productId: productId as number | undefined,
      data,
    };
  }
  const map: Record<string, string> = {};
  const skuSort: Record<string, number> = {};
  sku.sku.forEach(({sku_list}, index) => {
    skuLength++;
    sku_list.forEach(({id, name}) => {
      map[id] = name;
      skuSort[id] = index;
    });
  });
  return {
    id2ValueMap: map,
    skuLength,
    skuSort,
    sku,
    data,
    productId: productId as number | undefined,
  };
};

const generatorSkuResult = (
  skuData: ReturnType<typeof convertSkuData>,
  skuList: SelectSkuType,
) => {
  const productId = skuData?.productId;
  // 如果是福袋商品 无sku
  if (!productId) {
    return;
  }
  // 如果无sku 直接返回
  if (!skuList.length) {
    return;
  }
  return [
    productId,
    ...(JSON.parse(JSON.stringify(skuList)) as number[]).sort((a, b) => a - b),
  ].join('-');
};

// 恢复sku
const generatorRestoreSku = (
  restoreData: string | undefined,
  skuData: ReturnType<typeof convertSkuData>,
) => {
  const productId = skuData?.productId;
  if (!skuData?.sku || !productId || !skuData.sku.price) {
    return [];
  }
  if (!restoreData) {
    let lowSku = '';
    Object.keys(skuData.sku.price).forEach((key) => {
      const item = skuData.sku.price;
      if ((item[lowSku]?.price_low || Infinity) > item[key].price_low) {
        lowSku = key;
      }
    });
    if (!lowSku) {
      return [];
    }
    const arr = new Array(skuData.skuLength).fill(undefined);
    const [skuProduct, ...skuArr] = lowSku.split('-');
    if (skuProduct === productId + '') {
      skuArr.forEach((val) => {
        const item = skuData.skuSort[val];
        if (item !== undefined) {
          arr[item] = +val;
        }
      });
    }
    return arr;
  }
  const arr = new Array(skuData.skuLength).fill(undefined);
  const [skuProduct, ...skuArr] = restoreData.split('-');
  if (skuProduct === productId + '') {
    skuArr.forEach((val) => {
      const item = skuData.skuSort[val];
      if (item !== undefined) {
        arr[item] = +val;
      }
    });
  }
  return arr;
};
