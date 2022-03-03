import {createStyleSheet} from '@src/helper/helper';
import {Space} from '@src/widgets/space';
import React, {FC} from 'react';
import {Text, TouchableOpacity} from 'react-native';

interface ActionModalItemProps {
  onPress?: () => void;
  value?: string;
  hideBottomLine?: boolean;
}

export const ActionModalItem: FC<ActionModalItemProps> = ({
  value = 'value',
  onPress,
  hideBottomLine,
}) => {
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        style={ActionModalItemStyles.container}
        onPress={onPress}>
        <Text style={ActionModalItemStyles.text}>{value}</Text>
      </TouchableOpacity>
      {!hideBottomLine && <Space height={1} backgroundColor={'#e5e5e5'} />}
    </>
  );
};

const ActionModalItemStyles = createStyleSheet({
  container: {
    height: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '500',
    color: '#222',
    fontSize: 14,
  },
});
