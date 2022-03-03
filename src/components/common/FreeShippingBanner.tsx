import {
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Image,
  ViewStyle,
} from 'react-native';
import React, {useEffect} from 'react';
import {px} from '../../constants/constants';
import {useSelector} from 'react-redux';
import AppModule from '../../../AppModule';
import {Space} from './Space';

export const FreeShippingBannerSmall = ({
  from,
  taxFee,
  shippingFee,
}: {
  from: string;
  taxFee: number;
  shippingFee: number;
}) => {
  const configV2 = useSelector(
    (state: any) => state.deprecatedPersist.configV2,
  );
  const pageNo = from === 'home' ? '2' : from === 'productList' ? '7' : '3';
  useEffect(() => {
    const envNo =
      from === 'home' ? '346' : from === 'productList' ? '350' : '354';
    AppModule.reportShow(pageNo, envNo);
  }, [from, pageNo]);

  return shippingFee > 0 ? (
    <TouchableOpacity
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10 * px,
      }}>
      <Image
        source={require('../../assets/banner_car_free.png')}
        style={{
          width: 80 * px,
          height: 66 * px,
          alignSelf: 'center',
          marginRight: 20 * px,
        }}
      />
      <View
        style={{
          marginLeft: 10 * px,
        }}>
        <Text
          style={{
            fontSize: 32 * px,
            color: '#000',
          }}>
          Buy ${shippingFee / 100}+: Up to $
          {configV2.free_shipping_fee_up / 100} shipping bonus
        </Text>
        <Text
          style={{
            fontSize: 32 * px,
            color: '#000',
          }}>
          Buy ${taxFee / 100}+: Up to ${configV2.free_tax_fee_up / 100} tax
          bonus
        </Text>
      </View>
    </TouchableOpacity>
  ) : null;
};

export const FreeShippingBannerBig = ({
  styles,
  from,
}: {
  styles?: ViewStyle;
  from: string;
}) => {
  const configV2 = useSelector(
    (state: any) => state.deprecatedPersist.configV2,
  );
  const pageNo = from === 'home' ? '2' : from === 'productList' ? '7' : '3';
  useEffect(() => {
    const envNo =
      from === 'home' ? '346' : from === 'productList' ? '350' : '354';
    AppModule.reportShow(pageNo, envNo);
  }, [from, pageNo]);

  return configV2.free_shipping_fee_amt > 0 ? (
    <>
      <View style={{justifyContent: 'center'}}>
        <View
          style={{
            marginHorizontal: 15 * px,
            marginVertical: 20 * px,
            ...styles,
          }}>
          <ImageBackground
            resizeMode={'contain'}
            source={require('../../assets/free_banner.png')}
            style={{
              height: 205 * px,
              borderRadius: 20 * px,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 60 * px,
                color: '#fff',
                textAlign: 'center',
              }}>
              FREE SHIPPING on ${configV2.free_shipping_fee_amt / 100}+
            </Text>
            <Text
              style={{
                fontSize: 50 * px,
                color: '#fff',
                marginTop: 20 * px,
                textAlign: 'center',
              }}>
              FREE TAX on ${configV2.free_tax_fee_amt / 100}+
            </Text>
          </ImageBackground>
        </View>
      </View>
      <Space height={20} backgroundColor={'#eee'} />
    </>
  ) : null;
};
