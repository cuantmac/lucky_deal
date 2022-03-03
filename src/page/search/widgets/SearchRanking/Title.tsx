import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

import {createStyleSheet} from '@src/helper/helper';
import {SearchRankingRoute} from '@src/routes';
const Title = () => {
  const router = SearchRankingRoute.useRouteLink();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Ranking</Text>
      <TouchableOpacity onPress={() => router.navigate()}>
        <Text style={styles.viewAll}>View All</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 28,
    paddingLeft: 15,
    paddingRight: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  viewAll: {
    fontSize: 12,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#000',
  },
});
export default Title;
