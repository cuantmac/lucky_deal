import React from 'react';
import {View, Text, Image} from 'react-native';
import {createStyleSheet} from '@src/helper/helper';

const Empty = () => {
  return (
    <>
      <View style={styles.wrap}>
        <Image
          source={require('../../../../assets/home_empty.png')}
          style={styles.img}
        />
        <Text style={styles.text}>Temporarily no data</Text>
      </View>
    </>
  );
};

export default Empty;

const styles = createStyleSheet({
  wrap: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 79,
    height: 75,
    marginBottom: 10,
  },
  text: {
    fontSize: 13,
    color: '#222222',
  },
});
