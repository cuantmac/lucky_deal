import React, {FC} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {px} from '../../constants/constants';

export const RecommendListHeader: FC = ({children}) => {
  return (
    <View style={RecommendListHeaderStyles.container}>
      <View style={RecommendListHeaderStyles.icon} />
      <Text style={RecommendListHeaderStyles.text}>{children}</Text>
      <View style={RecommendListHeaderStyles.icon} />
    </View>
  );
};

const RecommendListHeaderStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 90 * px,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 14 * px,
    height: 14 * px,
    backgroundColor: '#CBCBCB',
    transform: [{rotateZ: '45deg'}],
  },
  text: {
    fontSize: 38 * px,
    fontWeight: 'bold',
    marginHorizontal: 22 * px,
    lineHeight: 36 * px,
  },
});
