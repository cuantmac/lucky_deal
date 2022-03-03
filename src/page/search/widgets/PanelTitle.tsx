import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React from 'react';

import {createStyleSheet} from '@src/helper/helper';

interface PanelTitleProps {
  iconType: 'del' | 'refresh';
  children: string;
  onClick?: () => void;
  loading?: boolean;
}

const PanelTitle: React.FC<PanelTitleProps> = ({
  iconType,
  children,
  onClick,
  loading = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{children}</Text>
      <TouchableOpacity style={styles.icon} onPress={onClick}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={'red'}
            style={styles.loading}
          />
        ) : (
          <>
            {iconType === 'del' ? (
              <Image
                style={styles.icon}
                resizeMode={'contain'}
                source={require('@src/assets/icon_search_delete.png')}
              />
            ) : (
              <Image
                style={styles.icon}
                resizeMode={'contain'}
                source={require('@src/assets/icon_search_refresh.png')}
              />
            )}
          </>
        )}
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
    height: 30,
    marginTop: 10,
  },
  text: {
    color: '#000',
    fontSize: 14,
  },
  icon: {
    width: 13,
    height: 13,
    position: 'relative',
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 10,
    height: 10,
  },
});
export default PanelTitle;
