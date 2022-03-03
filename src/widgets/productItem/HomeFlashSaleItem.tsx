import React, {FC} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  ImageBackground,
} from 'react-native';
import {px} from '../../constants/constants';
import Utils from '../../utils/Utils';
import {ProductSimpleBaseItem} from '@luckydeal/api-common';
import {MartketPriceText, OriginPriceText} from './widgets/PriceText';
import {ProductTag} from './widgets/ProductTag';

export interface HomeFlashSaleItemProps {
  onPress?: () => void;
  data: ProductSimpleBaseItem;
  showTag?: boolean;
  showMore?: boolean;
}

export const HomeFlashSaleItem: FC<HomeFlashSaleItemProps> = ({
  onPress,
  data,
  showTag,
  showMore = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        position: 'relative',
        width: 300 * px,
        marginLeft: 15 * px,
      }}>
      <ImageBackground
        style={{
          width: 300 * px,
          height: 400 * px,
        }}
        resizeMode={'stretch'}
        source={Utils.getImageUri(data.image) as any}
        defaultSource={require('../../assets/ph.png')}>
        {showMore && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              backgroundColor: 'white',
              opacity: 0.7,
            }}>
            <Image
              resizeMode="contain"
              style={{width: 90 * px, height: 90 * px}}
              source={require('../../assets/flash_more.png')}
            />
            <Text
              style={{
                marginTop: 20 * px,
                fontSize: 34 * px,
                fontWeight: 'bold',
              }}>
              More
            </Text>
          </View>
        )}
      </ImageBackground>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          marginTop: 19 * px,
          flexWrap: 'wrap',
          width: '100%',
        }}>
        <MartketPriceText
          style={{fontSize: 32 * px, marginRight: 18 * px}}
          isActivity={Utils.isActivityProduct(data.act_tag_list)}
          value={data.mark_price}
        />
        <OriginPriceText
          isActivity={Utils.isActivityProduct(data.act_tag_list)}
          style={{fontSize: 24 * px}}
          value={data.original_price}
        />
      </View>
      {showTag && <ProductTag tags={data.act_tag_list} />}
    </TouchableOpacity>
  );
};
