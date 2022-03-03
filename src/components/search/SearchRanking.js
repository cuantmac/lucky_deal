import React, {useEffect, useLayoutEffect} from 'react';
import {StatusBar, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ListenPayBackPress from '../common/ListenPayBackPress';
import {useSelector} from 'react-redux';
import RankList from './RankList';
import AppModule from '../../../AppModule';
function SearchRanking({navigation}) {
  useEffect(() => {
    AppModule.reportShow('16', '247');
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions(
      {
        headerShown: true,
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: '#fff',
          borderBottomWidth: 0,
          elevation: 0,
        },
        headerTitleAlign: 'center',
        title: 'Search Ranking',
      },
      [navigation],
    );
  });

  return (
    <View style={{flex: 1, backgroundColor: '#F1F1F1'}}>
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor={'transparent'}
      />
      <ListenPayBackPress
        onGoBack={() => navigation.goBack()}
        interrupt={true}
      />
      <RankList />
    </View>
  );
}

export default SearchRanking;
