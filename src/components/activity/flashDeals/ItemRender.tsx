import {useNavigation} from '@react-navigation/core';
import React, {FC} from 'react';
import {Dimensions, Image, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {px} from '../../../constants/constants';
import {FlashProductListApi} from '../../../types/models/activity.model';
import Utils from '../../../utils/Utils';
import GlideImage from '../../native/GlideImage';

const {width: screenWidth} = Dimensions.get('window');
const GlideImageEl = GlideImage as any;

interface renderItemProps {
  item: FlashProductListApi.ProductItem;
  i: number;
  onPress: (item: FlashProductListApi.ProductItem, i: number) => void;
}
const renderItem: FC<renderItemProps> = ({item, i, onPress}) => {
  let _percent = parseInt(
    ((1 - item.mark_price / item.original_price) * 100).toFixed(0),
    10,
  );
  _percent = _percent < 0 ? 0 : _percent > 99 ? 99 : _percent;

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        marginTop: 30 * px,
      }}
      key={i}>
      <View
        style={{
          overflow: 'hidden',
          borderRadius: 20 * px,
          marginRight: 30 * px,
          width: 230 * px,
          height: 230 * px,
        }}>
        <GlideImageEl
          showDefaultImage={true}
          source={Utils.getImageUri(item.image)}
          resizeMode={'stretch'}
          defaultSource={require('../../../assets/lucky_deal_default_small.png')}
          style={{
            width: 230 * px,
            height: 230 * px,
            alignSelf: 'center',
          }}
        />
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          marginRight: 20 * px,
        }}>
        <Text style={{fontSize: 28 * px}} numberOfLines={2}>
          {item.title}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flex: 1,
          }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: '#E00404',
                  fontSize: 40 * px,
                  textAlign: 'center',
                }}>
                ${item.mark_price / 100.0}
              </Text>
              <Text
                style={{
                  color: '#E00404',
                  fontSize: 30 * px,
                  textAlign: 'center',
                  paddingVertical: 5 * px,
                  paddingHorizontal: 15 * px,
                  backgroundColor: '#FFD7D7',
                  marginLeft: 20 * px,
                  borderRadius: 10 * px,
                }}>
                {_percent}% OFF
              </Text>
            </View>
            <Text
              style={{
                fontSize: 30 * px,
                color: '#888686',
                textDecorationLine: 'line-through',
                marginTop: 10 * px,
              }}>
              ${(item.original_price / 100.0).toFixed(2)}
            </Text>
          </View>

          {!item.stock ? (
            <Image
              source={require('../../../assets/sold.png')}
              style={{width: 167 * px, height: 135 * px}}
            />
          ) : (
            <View>
              <Text
                style={{
                  fontSize: 30 * px,
                  color: '#E00404',
                  textAlign: 'center',
                  marginBottom: 10 * px,
                }}>
                {item.stock} Left
              </Text>
              <TouchableOpacity
                style={{
                  width: 260 * px,
                  height: 80 * px,
                  backgroundColor: '#F04A33',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10 * px,
                }}
                onPress={() => onPress(item, i)}>
                <Text
                  style={{
                    fontSize: 40 * px,
                    color: '#fff',
                    textAlign: 'center',
                  }}>
                  Buy
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
export default renderItem;
