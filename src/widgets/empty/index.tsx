import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  Text,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import React, {FC} from 'react';
import {createStyleSheet} from '@src/helper/helper';
import {TouchableOpacity} from 'react-native-gesture-handler';

export interface EmptyProps {
  image?: ImageSourcePropType;
  title?: string;
  imageStyle?: StyleProp<ImageStyle>;
  onRefresh?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const Empty: FC<EmptyProps> = ({
  image = require('@src/assets/empty.png'),
  title = 'Nothing at all',
  imageStyle,
  onRefresh,
  style,
}) => {
  return (
    <View style={[EmptyStyles.container, style]}>
      <Image
        resizeMode={'contain'}
        style={[EmptyStyles.image, imageStyle]}
        source={image}
      />
      <Text style={EmptyStyles.desc}>{title}</Text>
      {onRefresh ? (
        <TouchableOpacity onPress={onRefresh}>
          <Text style={EmptyStyles.tapText}>tap to refresh</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const EmptyStyles = createStyleSheet({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  image: {
    width: 266,
    height: 166,
  },
  desc: {
    color: '#676767',
    fontSize: 14,
    marginTop: 38,
    marginLeft: 38,
    marginRight: 38,
    textAlign: 'center',
  },
  tapText: {
    color: '#4D79F8',
    fontSize: 14,
    marginTop: 38,
    marginLeft: 38,
    marginRight: 38,
    textAlign: 'center',
  },
});
