import React, {useMemo} from 'react';
import {Image, Text, TouchableWithoutFeedback, View} from 'react-native';
import {pure} from 'recompose';
import {px} from '../../constants/constants';
import Utils from '../../utils/Utils';
import GlideImage from '../native/GlideImage';

function SearchRankingCard({data, onPress}) {
  const ActivityTag = useMemo(
    () => {
      return data.product_category === 4 ? (
        <Image
          source={require('../../assets/pro/pro_tag.png')}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 260 * px,
            height: 50 * px,
          }}
        />
      ) : data.activity_tag ? (
        <View
          style={{
            backgroundColor: data.activity_tag_color
              ? data.activity_tag_color
              : '#D70000',
            position: 'absolute',
            left: 0,
            top: 0,
            height: 50 * px,
            borderBottomRightRadius: 25 * px,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 30 * px,
              paddingHorizontal: 10,
            }}>
            {data.activity_tag}
          </Text>
        </View>
      ) : null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.activity_tag],
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
            backgroundColor: 'white',
            width: 360 * px,
            marginRight: 40 * px,
            height: 700 * px,
          }}>
          <View style={{position: 'relative'}}>
            <GlideImage
              showDefaultImage={true}
              source={Utils.getImageUri(data.image)}
              defaultSource={require('../../assets/lucky_deal_default_middle.png')}
              resizeMode={'contain'}
              style={{
                width: 350 * px,
                height: 350 * px,
              }}
            />
            {data.product_status ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  width: 350 * px,
                  height: 350 * px,
                }}>
                <Image
                  source={require('../../assets/sold.png')}
                  style={{width: 229 * px, height: 185 * px}}
                />
              </View>
            ) : null}
            {ActivityTag}
          </View>
          {BuyItNowPrice}
          <Text
            numberOfLines={2}
            style={{
              color: 'black',
              marginRight: 10,
              fontSize: 40 * px,
            }}>
            {data.title ? data.title : 'Unknown'}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              marginTop: 6 * px,
              color: '#8A8A8A',
              //marginLeft: 8,
              marginRight: 10,
              fontSize: 30 * px,
            }}>
            {data.order_num} Orders
          </Text>
          {BaseTag}
        </View>
      </TouchableWithoutFeedback>
    );
  }, [data, BaseTag, BuyItNowPrice, ActivityTag, onPress]);
  return Render;
}

export default pure(SearchRankingCard);
