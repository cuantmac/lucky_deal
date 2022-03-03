import React, {FC} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {px, SCREEN_WIDTH} from '../../constants/constants';
import {SearchResult} from '../../types/models/product.model';
import Utils from '../../utils/Utils';
import GlideImage from '../native/GlideImage';
const GlideImageElm = GlideImage as any;
const cardItemWidth = SCREEN_WIDTH / 2;

interface BoxCardProps {
  data: SearchResult.List;
  onPress: () => void;
}
export const BoxCard: FC<BoxCardProps> = ({data, onPress}) => {
    console.log('BoxCard===>' + JSON.stringify(data));
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 5,
        width: cardItemWidth,
        marginTop: 5,
        marginBottom: 16,
      }}>
      <View
        style={{
          width: cardItemWidth - 10,
          height: cardItemWidth - 10,
          backgroundColor: '#F9F9F9',
          alignItems: 'center',
          padding: 5,
        }}>
        <GlideImageElm
          showDefaultImage={true}
          defaultSource={require('../../assets/lucky_deal_default_middle.png')}
          source={Utils.getImageUri(data.image)}
          style={{width: 480 * px, height: 480 * px}}
          resizeMode={'contain'}
        />
      </View>
      <View style={{flexDirection: 'row', marginTop: 4, alignItems: 'center'}}>
        <Text style={{color: '#F72020', fontSize: 40 * px, fontWeight: 'bold'}}>
          $
        </Text>
          <Text
            style={{color: '#F72020', fontSize: 50 * px, fontWeight: 'bold'}}>
            {data.mark_price / 100.0}
          </Text>
          <Text
            style={{
              color: '#606060',
              fontSize: 32 * px,
              marginLeft: 6 * px,
              textDecorationStyle: 'solid',
              textDecorationLine: 'line-through',
            }}>
            ${data.original_price / 100.0}
          </Text>
      </View>
      <Text style={{color: '#000000', fontSize: 40 * px}} numberOfLines={1}>
        {data.title}
      </Text>
    </TouchableOpacity>
  );
};
