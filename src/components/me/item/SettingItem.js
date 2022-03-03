import {
  Image,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {PRIMARY} from '../../../constants/colors';

export default function SettingItem({
  icon,
  title,
  isSwitch,
  onPress,
  value,
  onValueChange,
  badge,
  right,
  badgeStyle,
  badgeTextStyle,
}) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: 'white',
      }}
      onPress={onPress}>
      <View
        style={{
          height: 48,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          resizeMode={'contain'}
          style={{
            width: 28,
            height: 28,
            marginLeft: 10,
            marginRight: 10,
          }}
          source={icon}
        />
        <Text
          style={{
            color: '#040404',
            fontSize: 13,
            flex: 1,
          }}>
          {title}
        </Text>
        {badge ? (
          <View style={[badgeStyle ? badgeStyle : styles.innerBadgeStyle]}>
            <Text
              style={[badgeTextStyle ? badgeTextStyle : styles.badgeTextStyle]}>
              {badge}
            </Text>
          </View>
        ) : null}
        {isSwitch ? (
          <Switch
            trackColor={{
              true: Platform.OS === 'android' ? '#3C7DE37f' : PRIMARY,
              false: Platform.OS === 'android' ? '#d3d3d3' : '#fbfbfb',
            }}
            thumbColor={[
              Platform.OS === 'ios' ? '#FFFFFF' : value ? PRIMARY : '#ffffff',
            ]}
            ios_backgroundColor="#fbfbfb"
            style={[
              value
                ? {
                    borderColor: '#6fa6d3',
                    borderWidth: 1,
                  }
                : {
                    borderColor: '#f2f2f2',
                    borderWidth: 1,
                  },
            ]}
            value={value}
            onValueChange={onValueChange}
          />
        ) : right ? (
          right
        ) : (
          <Image
            resizeMode={'contain'}
            style={{
              width: 13,
              height: 13,
              marginLeft: 10,
              marginRight: 10,
            }}
            source={require('../../../assets/me_arrow.png')}
          />
        )}
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: '#EEEEEE',
          marginLeft: 48,
        }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  innerBadgeStyle: {
    backgroundColor: 'red',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  badgeTextStyle: {
    color: 'white',
    fontSize: 10,
  },
});
