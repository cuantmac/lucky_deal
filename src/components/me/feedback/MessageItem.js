import {pure} from 'recompose';
import {Image, Text, View, Dimensions} from 'react-native';
import React from 'react';
import Lightbox from 'react-native-lightbox';
import Utils from '../../../utils/Utils';
import {px} from '../../../constants/constants';
const {width, height} = Dimensions.get('window');
// import Autolink from 'react-native-autolink';

export default pure(function ({data}) {
  const {back, feed} = data;

  const imgListRender = (list, type) => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        {list.map((photo, index) => {
          return (
            <>
              <Lightbox
                springConfig={{overshootClamping: true}}
                swipeToDismiss={false}
                renderContent={() => (
                  <View style={{width, height}}>
                    <Image
                      style={{flex: 1, resizeMode: 'contain'}}
                      source={{uri: photo}}
                    />
                  </View>
                )}>
                <Image
                  key={type + index}
                  style={{
                    width: 200 * px,
                    height: 200 * px,
                    marginHorizontal: 5,
                    marginVertical: 5,
                  }}
                  source={{uri: photo}}
                  resizeMode={'contain'}
                />
              </Lightbox>
            </>
          );
        })}
      </View>
    );
  };
  return (
    <View>
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
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#202020',
                margin: 8,
              }}>
              Lucky Deal
            </Text>
            <Text
              style={{
                fontSize: 10,
                marginRight: 12,
                textAlign: 'center',
                alignSelf: 'center',
              }}>
              {Utils.formatDate2(back.create_time)}
            </Text>
          </View>
          <View style={{height: 1, backgroundColor: '#E3E3E3'}} />
          <Text
            style={{
              margin: 8,
              fontSize: 13,
              color: '#333333',
            }}>
            {back.content}
          </Text>
          {back.images && imgListRender(back.images, 'back')}
          <View style={{height: 1, backgroundColor: '#E3E3E3'}} />
          <Text
            style={{
              margin: 8,
              fontSize: 13,
              color: '#333333',
            }}>
            {feed.content}
          </Text>
          {feed.images && imgListRender(feed.images, 'feed')}
        </View>
      </View>
    </View>
  );
});
