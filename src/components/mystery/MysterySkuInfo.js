import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {px, PATH_DEEPLINK} from '../../constants/constants';
import BottomSheet from '../dialog/BottomSheet';
import MysterySkuSelector from '../mystery/MysterySkuSelector';
import AppModule from '../../../AppModule';
import {navigationRef} from '../../utils/refs';
import {useSelector} from 'react-redux';
import {categoryDetailPath} from '../../analysis/report';
export default function ({skuList, data, from, path, way}) {
  const {token} = useSelector((state) => state.deprecatedPersist);
  let _showSkuInfo = [];
  const _skuTitle = () => {
    let _title = '';
    skuList.map((item, index) => {
      if (index === 0) {
        _showSkuInfo = item.sku_value;
      }
      _title += item.sku_value.length;
      _title += ' ';
      _title += item.sku_key;
      if (index < skuList.length - 1) {
        _title += ',';
      }
      _title += ' ';
    });
    if (_showSkuInfo && _showSkuInfo.length > 4) {
      _showSkuInfo = _showSkuInfo.slice(0, 4);
    }
    return _title;
  };
  useEffect(() => {
    AppModule.reportPv('DeeplinkAdsSKU', {
      way: path === PATH_DEEPLINK ? way : null,
    });
  }, [way, path]);
  return (
    <TouchableOpacity
      onPress={() => {
        AppModule.reportClick('3', '26', {
          ProductId: data.bag_id || data.product_id,
          CategoryId: data.category_id,
          CateStation: data.cate_station,
          ProductCat: categoryDetailPath.getData().ProductCat,
        });
        if (from === 'mystery') {
          AppModule.reportTap(
            'MysteryPrizeDetail',
            'ld_mystery_product_sku_click',
            {
              path: path,
              way: path === PATH_DEEPLINK ? way : null,
            },
          );
          if (!token) {
            navigationRef.current?.navigate('FBLogin');
            return;
          }
          BottomSheet.showLayout(
            <MysterySkuSelector
              detail={data}
              skuList={data.sku_info}
              showQuantity={true}
              showItem={true}
              path={path}
              way={way}
            />,
          );
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
          Select: {_skuTitle()}
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
        {_showSkuInfo.map((value, j) => {
          return (
            j < 5 && (
              <View style={styles.skuTextBackGround} key={j}>
                <Text
                  style={{
                    fontSize: 50 * px,
                    color: 'black',
                  }}>
                  {value}
                </Text>
              </View>
            )
          );
        })}
        {_showSkuInfo.length >= 5 && (
          <Text
            style={{
              alignItems: 'center',
              paddingHorizontal: 5 * px,
              lineHeight: 30 * px,
              alignSelf: 'center',
            }}>
            ...
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  skuImageBackGround: {
    width: 160 * px,
    height: 160 * px,
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
});
