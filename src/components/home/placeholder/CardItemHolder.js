import {Dimensions, View} from 'react-native';
import {PlaceholderLine, PlaceholderMedia} from 'rn-placeholder';
import React from 'react';

export default () => {
  const itemSize = (Dimensions.get('window').width - 20) / 2;
  return (
    <View
      style={{
        margin: 5,
        backgroundColor: 'white',
        width: itemSize,
        borderRadius: 8,
        overflow: 'hidden',
      }}>
      <PlaceholderMedia size={itemSize} />
      <PlaceholderLine
        style={{
          width: itemSize - 16,
          marginTop: 5,
          marginLeft: 8,
        }}
      />
      <PlaceholderLine
        style={{
          width: itemSize - 16,
          marginTop: 5,
          marginLeft: 8,
        }}
      />
      <PlaceholderLine
        style={{
          width: itemSize - 16,
          marginTop: 5,
          marginLeft: 8,
        }}
      />
    </View>
  );
};
