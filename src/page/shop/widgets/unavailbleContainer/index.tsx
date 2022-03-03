import {createStyleSheet} from '@src/helper/helper';
import React, {FC} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';

interface UnavailbleContainerProps {
  onMoveAllPress?: () => void;
}

export const UnavailbleContainer: FC<UnavailbleContainerProps> = ({
  children,
  onMoveAllPress,
}) => {
  return (
    <>
      <View style={UnavailbleContainerStyles.container}>
        <Text style={UnavailbleContainerStyles.title}>Unavailble items</Text>
        <TouchableOpacity activeOpacity={0.8} onPress={onMoveAllPress}>
          <Text style={UnavailbleContainerStyles.rightText}>Move all</Text>
        </TouchableOpacity>
      </View>
      {children}
    </>
  );
};

const UnavailbleContainerStyles = createStyleSheet({
  container: {
    height: 40,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },
  rightText: {
    fontSize: 14,
    color: '#222',
    fontWeight: '400',
  },
});
