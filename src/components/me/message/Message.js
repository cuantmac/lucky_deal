import {pure} from 'recompose';
import {Image, Text, View} from 'react-native';
import React from 'react';
import Autolink from 'react-native-autolink';

export default pure(function ({data, navigation}) {
  return (
    <View>
      <Text
        style={{
          backgroundColor: '#DEDEDE',
          borderRadius: 10,
          fontSize: 10,
          marginTop: 12,
          paddingHorizontal: 16,
          height: 20,
          textAlign: 'center',
          lineHeight: 20,
          alignSelf: 'center',
        }}>
        {new Date(data.time_stamps * 1000).toDateString()}
      </Text>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <Image
          style={{
            width: 36,
            height: 36,
            margin: 12,
            borderRadius: 18,
          }}
          source={require('../../../assets/ic_launcher.png')}
        />
        <View
          style={{
            flex: 1,
            marginEnd: 60,
            marginTop: 12,
            backgroundColor: 'white',
            borderRadius: 8,
            elevation: 1,
          }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#202020',
              margin: 8,
            }}>
            {data.subject}
          </Text>
          <View style={{height: 1, backgroundColor: '#E3E3E3'}} />
          <Autolink
            text={data.content}
            style={{
              margin: 8,
              fontSize: 13,
              color: '#333333',
            }}
          />
          {/* {memberShipReward && (
            <TouchableOpacity
              onPress={onPress}
              style={{
                marginBottom: 40 * px,
                width: 585 * px,
                height: 130 * px,
                backgroundColor: ACCENT,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: 60 * px,
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                {type === 1 ? 'Bid Now' : 'Get Now'}
              </Text>
            </TouchableOpacity>
          )} */}
        </View>
      </View>
    </View>
  );
});
