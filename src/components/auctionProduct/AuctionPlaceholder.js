import {
  Fade,
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
} from 'rn-placeholder';
import React from 'react';
import {Dimensions, StatusBar, View} from 'react-native';
import {px} from '../../constants/constants';

export default () => {
  return (
    <Placeholder Animation={Fade} style={{flex: 1}}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <PlaceholderMedia size={Dimensions.get('screen').width} />
      <PlaceholderLine
        style={{
          marginVertical: 20 * px,
          width: 900 * px,
          alignSelf: 'center',
          textAlign: 'center',
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          marginTop: 15,
        }}>
        <PlaceholderMedia
          size={128 * px}
          style={{
            marginRight: 15 * px,
            borderRadius: 128 * px,
            overflow: 'hidden',
          }}
        />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <PlaceholderLine
            style={{
              marginBottom: 20 * px,
              width: 900 * px,
              alignSelf: 'center',
              textAlign: 'center',
            }}
          />
          <PlaceholderLine
            style={{
              width: 900 * px,
              alignSelf: 'center',
              textAlign: 'center',
            }}
          />
          <PlaceholderLine
            style={{
              width: 900 * px,
              alignSelf: 'center',
              textAlign: 'center',
            }}
          />
        </View>
      </View>
      <PlaceholderLine
        style={{
          marginVertical: 20 * px,
          width: 1000 * px,
          alignSelf: 'center',
          textAlign: 'center',
        }}
      />
      <PlaceholderMedia size={Dimensions.get('screen').width} />
      <PlaceholderLine
        style={{
          marginBottom: 20 * px,
          width: 900 * px,
          alignSelf: 'center',
          textAlign: 'center',
        }}
      />
    </Placeholder>
  );
};
