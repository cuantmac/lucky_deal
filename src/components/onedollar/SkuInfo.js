import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {px} from '../../constants/constants';
import GlideImage from '../native/GlideImage';
import Utils from '../../utils/Utils';
import BottomSheet from '../dialog/BottomSheet';
import MysterySkuSelector from '../mystery/MysterySkuSelector';
import SkuSelector from '../common/SkuSelector';
import AppModule from '../../../AppModule';
import {navigationRef} from '../../utils/refs';
import {reportData} from '../../constants/reportData';
import AlertDialog from '../dialog/AlertDialog';
import {useShallowEqualSelector} from '../../utils/hooks';
import {categoryDetailPath} from '../../analysis/report';
import {Space} from '../common/Space';

export default function ({productSkus, data, way, path, from}) {
  const {token} = useShallowEqualSelector((state) => ({
    ...state.deprecatedPersist,
  }));
  const {sku} = productSkus;
  const [skuTitle, setSkuTitle] = useState('');
  const [showSkuInfo, setShowSkuInfo] = useState([]);

  const skuDataFilter = useCallback(() => {
    if (!sku) {
      return;
    }
    let _arr = [];
    let _listArr = [];
    sku.forEach((item, index) => {
      let _arrItem = item.sku_list.length + ' ' + item.attr_name;
      _arr.push(_arrItem);
      let i = item.sku_list.some((val) => val.image_url);
      if (i) {
        _listArr = item.sku_list;
      }
    });
    _listArr = !_listArr || !_listArr.length ? sku[0].sku_list : _listArr;
    let _skuTitle = _arr.join(',');
    setSkuTitle(_skuTitle);
    setShowSkuInfo(_listArr);
  }, [sku]);

  useEffect(() => {
    skuDataFilter();
  }, [skuDataFilter]);

  const goBuy = async () => {
    // vip商品判断
    let now = new Date().getTime();
    if (data.begin_time * 1000 > now) {
      Utils.toastFun('Please wait, coming soon');
      return;
    }

    BottomSheet.showLayout(
      <SkuSelector
        detail={data}
        skuList={productSkus}
        showQuantity={true}
        showItem={false}
        from={'offers'}
        nextAction={data.product_type === 5 ? 2 : 0}
      />,
    );
  };

  if (!sku) {
    return null;
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          AppModule.reportClick('3', '26', {
            ProductId: data.bag_id || data.product_id,
            CategoryId: data.category_id,
            CateStation: data.cate_station,
            ProductCat: categoryDetailPath.getData().ProductCat,
          });
          if (!token) {
            navigationRef.current?.navigate('FBLogin');
            return;
          }
          if (from === 'mystery') {
            BottomSheet.showLayout(
              <MysterySkuSelector
                detail={data}
                skuList={data.sku_info}
                showQuantity={true}
                showItem={true}
                path={path}
                way={way}
                nextAction={0}
              />,
            );
          } else {
            goBuy();
          }
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            height: 48 * px,
            marginTop: 10,
          }}>
          <Text
            style={{
              marginLeft: 30 * px,
              color: 'black',
              fontSize: 40 * px,
              fontWeight: 'bold',
            }}>
            Select: {skuTitle}
          </Text>
          <Image
            resizeMode={'contain'}
            style={{
              position: 'absolute',
              width: 13,
              height: 13,
              right: 30 * px,
            }}
            source={require('../../assets/me_arrow.png')}
          />
        </View>
        <View
          style={{
            marginLeft: 30 * px,
            flexDirection: 'row',
            marginTop: 30 * px,
            flexWrap: 'wrap',
            marginBottom: 20 * px,
          }}>
          {showSkuInfo.length > 0 &&
            showSkuInfo.map((value, i) => {
              if (i > 4) {
                return null;
              }
              return value.image_url ? (
                <View style={styles.skuImageBackGround} key={value.id}>
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
                </View>
              ) : (
                <Text
                  key={value.id}
                  style={[
                    {
                      fontSize: 36 * px,
                      lineHeight: 90 * px,
                      color: 'black',
                    },
                    styles.skuTextBackGround,
                  ]}>
                  {value.name}
                </Text>
              );
            })}
          {/* {showSkuInfo.length >= 5 && ( */}
          <Text
            style={{
              alignItems: 'center',
              paddingHorizontal: 5 * px,
              lineHeight: 30 * px,
              alignSelf: 'center',
            }}>
            ...
          </Text>
          {/* )} */}
        </View>
      </TouchableOpacity>
      <Space height={20} backgroundColor={'#eee'} />
    </>
  );
}

const styles = StyleSheet.create({
  skuImageBackGround: {
    width: 160 * px,
    height: 160 * px,
    borderRadius: 10 * px,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#F5F5F5',
    marginRight: 25 * px,
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
