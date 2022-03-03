import {View, Image, Text, TouchableWithoutFeedback} from 'react-native';
import React from 'react';

import {createStyleSheet} from '@src/helper/helper';
import {SearchRankingRoute} from '@src/routes';

const ViewAllItem = () => {
  const router = SearchRankingRoute.useRouteLink();
  return (
    <TouchableWithoutFeedback onPress={() => router.navigate()}>
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <Image
            source={require('@src/assets/more.png')}
            resizeMode={'contain'}
            style={styles.iconImage}
          />
          <Text numberOfLines={1} style={styles.iconText}>
            View All
          </Text>
        </View>

        <Text numberOfLines={2} style={styles.viewAll}>
          Click to view more
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = createStyleSheet({
  container: {
    backgroundColor: 'white',
    width: 120,
    marginRight: 30,
  },
  iconWrap: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: 120,
    height: 120,
    backgroundColor: '#eee',
  },
  iconImage: {
    width: 40,
    height: 40,
  },
  iconText: {
    color: '#2A9A9A',
    fontSize: 16,
    marginTop: 10,
  },
  viewAll: {
    color: 'black',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default ViewAllItem;
