import React, {FC, useEffect, useState} from 'react';
import {View, Text, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Api from '../../Api';
import {px} from '../../constants/constants';
import {PolicyConfig} from '../../types/models/product.model';
import {navigationRef} from '../../utils/refs';
import {Space} from '../common/Space';

interface ShippingInfoProps {
  shippingTime: string;
  preparingTime: string;
}
export const ShippingInfo: FC<ShippingInfoProps> = ({
  shippingTime,
  preparingTime,
}) => {
  return (
    <>
      <View
        style={{
          paddingHorizontal: 30 * px,
          paddingVertical: 55 * px,
          backgroundColor: '#fff',
        }}>
        <Text
          style={{
            fontSize: 40 * px,
            fontWeight: 'bold',
            textAlign: 'left',
            marginBottom: 10 * px,
          }}>
          Shipping Info
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 36 * px, color: '#707070'}}>
            Estimate shipping time:
          </Text>
          <Text style={{fontSize: 36 * px, textAlign: 'left'}}>
            {' '}
            {shippingTime} days
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 36 * px, color: '#707070'}}>
            Estimate preparing time:
          </Text>
          <Text style={{fontSize: 36 * px, textAlign: 'left'}}>
            {' '}
            {preparingTime} days
          </Text>
        </View>
      </View>
      <Space height={20} backgroundColor={'#eee'} />
    </>
  );
};
interface PolicyComponentProps {
  onPress: () => void;
  title: string;
}

export const PolicyComponent: FC<PolicyComponentProps> = ({title, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15 * px,
      }}>
      <Text
        style={{
          fontSize: 40 * px,
          fontWeight: 'normal',
          textAlign: 'left',
          color: '#3E3E3E',
        }}>
        {title}
      </Text>

      <Image
        style={{width: 18 * px, height: 32 * px}}
        source={require('../../assets/me/me_arrow_icon.png')}
      />
    </TouchableOpacity>
  );
};

export const SPCComponent = () => {
  const [policys, setPolicys] = useState<PolicyConfig.PolicyItem[]>();
  useEffect(() => {
    Api.policyList().then((res) => {
      setPolicys(res.data?.list);
    });
  }, []);
  return (
    <View>
      <View style={{height: 20 * px, backgroundColor: '#F7F7F7'}} />
      <View
        style={{
          paddingHorizontal: 30 * px,
          paddingVertical: 55 * px,
          backgroundColor: '#fff',
        }}>
        {policys &&
          policys.map((item, i) => {
            return (
              <PolicyComponent
                title={item.title}
                key={i}
                onPress={() => {
                  navigationRef.current.navigate('PolicyContent', {
                    id: item.id,
                    title: item.title,
                  });
                }}
              />
            );
          })}
      </View>
    </View>
  );
};
