import React, {useMemo} from 'react';
import {Text, TouchableWithoutFeedback, View} from 'react-native';
import {pure} from 'recompose';
import {px} from '../../constants/constants';
import Utils from '../../utils/Utils';
import GlideImage from '../native/GlideImage';
import LinearGradient from 'react-native-linear-gradient';

function RankCard({data, index, onPress}) {
  const ActivityTag = useMemo(
    () => {
      return index < 3 ? (
        <LinearGradient
          colors={['#FAB07E', '#F04933']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={{
            width: 220 * px,
            backgroundColor: '#D70000',
            position: 'absolute',
            left: 0,
            top: 0,
            borderTopLeftRadius: 20 * px,
            height: 50 * px,
            borderBottomRightRadius: 45 * px,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 30 * px,
              paddingHorizontal: 10,
            }}>
            Top.{index + 1}
          </Text>
        </LinearGradient>
      ) : null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [index],
  );
  const BaseTag = useMemo(
    () =>
      data.base_tag?.length > 0 && data.base_tag.map ? (
        <View
          style={{
            flexDirection: 'row',
            height: 36 * px,
            marginTop: 10 * px,
          }}>
          {data.base_tag.map((item) => (
            <View
              key={item}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FFD7D7',
                borderRadius: 4,
                marginRight: 2,
              }}>
              <Text
                style={{
                  color: '#F34A31',
                  fontSize: 26 * px,
                  paddingHorizontal: 5,
                }}>
                {item}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={{height: 36 * px}} />
      ),
    [data.base_tag],
  );

  const BuyItNowPrice = useMemo(() => {
    return (
      <View style={{marginLeft: 0, marginTop: 20 * px, height: 22}}>
        <Text
          numberOfLines={1}
          style={{
            color: 'black',
            fontSize: data.mark_price > 9999 ? 40 * px : 46 * px,
            marginTop: 0,
            fontWeight: 'bold',
          }}>
          ${(data.mark_price / 100.0).toFixed(2)}
        </Text>
      </View>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.mark_price, data.original_price]);

  const Render = useMemo(() => {
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View
          style={{
            marginVertical: 10 * px,
            backgroundColor: 'white',
            marginHorizontal: 32 * px,
            paddingLeft: 20 * px,
            borderRadius: 20 * px,
            height: 320 * px,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <GlideImage
            showDefaultImage={true}
            source={Utils.getImageUri(data.image)}
            defaultSource={require('../../assets/lucky_deal_default_middle.png')}
            resizeMode={'contain'}
            style={{
              width: 280 * px,
              height: 280 * px,
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              marginLeft: 40 * px,
              marginRight: 30 * px,
            }}>
            {BuyItNowPrice}
            <Text
              numberOfLines={2}
              style={{
                color: 'black',
                fontSize: 40 * px,
              }}>
              {data.title ? data.title : 'Unknown'}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                marginTop: 6 * px,
                color: '#8A8A8A',
                marginRight: 10,
                fontSize: 30 * px,
              }}>
              {data.order_num} Orders
            </Text>
            {BaseTag}
          </View>
          {ActivityTag}
        </View>
      </TouchableWithoutFeedback>
    );
  }, [data, BaseTag, BuyItNowPrice, ActivityTag, onPress]);
  return Render;
}

export default pure(RankCard);
