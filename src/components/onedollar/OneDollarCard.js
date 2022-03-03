import React, {useCallback, useMemo} from 'react';
import {
  Dimensions,
  Image,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {pure} from 'recompose';
import {px} from '../../constants/constants';
import Utils from '../../utils/Utils';
import {useSelector} from 'react-redux';
import GlideImage from '../native/GlideImage';

function OneDollarCard({data, onPress}) {
  const now = useSelector((state) => state.memory.now);

  const itemSize = (Dimensions.get('window').width - 20) / 2;

  const ActivityTag = useMemo(
    () =>
      data.activity_tag ? (
        <View
          style={{
            backgroundColor: '#D70000',
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
      ) : null,
    [data.activity_tag],
  );

  const BaseTag = useMemo(
    () =>
      data.base_tag?.length > 0 &&
      data.base_tag.map && (
        <View
          style={{
            flexDirection: 'row',
            height: 25,
          }}>
          {data.base_tag.map((item) => (
            <View
              key={item}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                margin: 5,
                backgroundColor: '#FFD7D7',
                borderRadius: 4,
              }}>
              <Text
                style={{
                  color: '#F34A31',
                  fontSize: 10,
                  paddingHorizontal: 5,
                }}>
                {item}
              </Text>
            </View>
          ))}
        </View>
      ),
    [data.base_tag],
  );

  const BuyItNowPrice = useMemo(() => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 20,
          margin: 8,
        }}>
        <Text
          numberOfLines={1}
          style={{
            color: 'black',
            fontSize: data.mark_price > 9999 ? 12 : 15,
            marginTop: 0,
            fontWeight: 'bold',
          }}>
          ${(data.mark_price / 100.0).toFixed(2)}
        </Text>
      </View>
    );
  }, [data.mark_price]);

  /*竞拍未开始*/
  const StartingSoon = useMemo(
    () => (
      <Text
        style={{
          color: 'black',
          width: '100%',
          margin: 8,
          fontSize: 12,
          height: 20,
          fontWeight: 'bold',
        }}>
        Coming in: {Utils.endTimeShow(data.begin_time - now)}
      </Text>
    ),
    [data.begin_time, now],
  );

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          backgroundColor: '#FDEFEE',
          width: itemSize,
          borderRadius: 8,
          overflow: 'hidden',
        }}>
        <View style={{width: itemSize, height: itemSize}}>
          <View
            style={{
              width: itemSize - 8,
              height: itemSize - 8,
              borderRadius: 8,
              marginTop: 4,
              alignSelf: 'center',
              overflow: 'hidden',
            }}>
            <GlideImage
              source={Utils.getImageUri(data.image)}
              defaultSource={require('../../assets/ph.png')}
              resizeMode={'contain'}
              style={{
                width: itemSize - 8,
                height: itemSize - 8,
              }}
            />
          </View>
          <Image
            source={require('../../assets/sold.png')}
            resizeMode={'contain'}
            style={{
              width: itemSize - 8,
              height: itemSize - 8,
              alignSelf: 'center',
              position: 'absolute',
              opacity: 0,
            }}
          />
          {ActivityTag}
        </View>
        <Text
          numberOfLines={1}
          style={{
            color: 'black',
            fontSize: 10,
            marginTop: 5,
            height: 15,
            marginLeft: 8,
            marginRight: 10,
          }}>
          {data.title ? data.title : 'Unknown'}
        </Text>
        {BaseTag}
        {data.begin_time > now ? StartingSoon : BuyItNowPrice}
      </View>
    </TouchableWithoutFeedback>
  );
}

export default pure(OneDollarCard);
