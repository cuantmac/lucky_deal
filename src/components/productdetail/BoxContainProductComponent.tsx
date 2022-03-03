import React, {FC} from 'react';
import {Text, View} from 'react-native';
import {px, SCREEN_WIDTH} from '../../constants/constants';
import Utils from '../../utils/Utils';
import GlideImage from '../native/GlideImage';
const GlideImageElm = GlideImage as any;
interface BoxProductImages {
  bag_chart_list: string[];
}
export const BoxContainProductComponent: FC<BoxProductImages> = ({
  bag_chart_list,
}) => {
  const bagChartList =
    bag_chart_list?.length > 6 ? bag_chart_list.slice(0, 6) : bag_chart_list;
  return bagChartList?.length > 0 ? (
    <View>
      <Text style={{color: '#000', fontSize: 30 * px, marginLeft: 30 * px}}>
        Mystery box may contains some of the following items:
      </Text>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 40 * px,
          marginLeft: 30 * px,
          justifyContent: 'flex-start',
        }}>
        {bagChartList.map((url) => {
          return (
            <View
              style={{
                width: SCREEN_WIDTH / 6,
                height: SCREEN_WIDTH / 6,
              }}>
              <GlideImageElm
                style={{
                  width: 80 * px,
                  height: 80 * px,
                }}
                showDefaultImage={true}
                defaultSource={require('../../assets/lucky_deal_default_middle.png')}
                source={Utils.getImageUri(url)}
                resizeMode={'contain'}
              />
            </View>
          );
        })}
      </View>
    </View>
  ) : null;
};
