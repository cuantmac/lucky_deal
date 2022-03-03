import React from 'react';
import {Text, TouchableNativeFeedback, View, Image} from 'react-native';
import {pure} from 'recompose';
import {px} from '../../../constants/constants';
import Utils from '../../../utils/Utils';
import GlideImage from '../../native/GlideImage';

export default pure(function ({data, onChangeValue, navigation}) {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        marginHorizontal: 30 * px,
        marginVertical: 15 * px,
        borderRadius: 20 * px,
        paddingRight: 20 * px,
        paddingLeft: 10 * px,
        paddingVertical: 30 * px,
      }}>
      <TouchableNativeFeedback
        onPress={() => {
          onChangeValue && onChangeValue(data);
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image
            style={{
              justifyContent: 'center',
              width: 70 * px,
              height: 70 * px,
              marginRight: 10 * px,
              alignSelf: 'center',
            }}
            source={
              data.selected
                ? require('../../../assets/select.png')
                : require('../../../assets/unselect.png')
            }
          />
          <View
            style={{
              position: 'relative',
              width: 230 * px,
              height: 230 * px,
              borderRadius: 20 * px,
            }}>
            <GlideImage
              source={Utils.getImageUri(data.image)}
              resizeMode={'center'}
              style={{
                width: 230 * px,
                height: 230 * px,
                borderRadius: 20 * px,
              }}
            />
            {data.items ? (
              <View
                style={{
                  position: 'absolute',
                  width: 230 * px,
                  height: 64 * px,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  bottom: 0,
                  left: 0,
                  borderBottomLeftRadius: 20 * px,
                  borderBottomRightRadius: 20 * px,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 34 * px,
                    lineHeight: 64 * px,
                    textAlign: 'center',
                  }}>
                  {data.items} Item(s)
                </Text>
              </View>
            ) : null}
          </View>
          <View
            style={{
              flexDirection: 'column',
              flex: 1,
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                overflow: 'hidden',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                <Text
                  numberOfLines={2}
                  style={{
                    color: 'black',
                    maxWidth: 440 * px,
                    fontSize: 40 * px,
                    marginLeft: 10,
                  }}>
                  Order Id: {data.order_id}
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 28 * px,
                    marginLeft: 10,
                    marginTop: 10,
                  }}>
                  Deal Done Time:{' '}
                  {new Date(data.order_time * 1000).toDateString()}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#010101',
                    fontSize: 45 * px,
                    marginLeft: 10,
                    fontWeight: 'bold',
                    marginRight: 10,
                    includeFontPadding: false,
                  }}>
                  ${data.order_price / 100.0}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
});
