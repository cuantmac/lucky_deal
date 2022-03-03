import {SafeAreaView, Text, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
export default function ({left, title, right, style, gradientColors}) {
  return (
    <SafeAreaView>
      <LinearGradient
        locations={[0.1, 1]}
        style={[style, {position: 'relative'}]}
        colors={gradientColors ? gradientColors : ['#F04933', '#FAB07E']}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: '100%',
            height: 60,
          }}>
          <Text
            style={{
              position: 'absolute',
              //paddingTop: style ? style.paddingTop : 0,
              backgroundColor: style ? style.backgroundColor : 'white',
              height: 60,
              width: '100%',
              color: style ? style.color : 'black',
              fontSize: 17,
              fontWeight: 'bold',
              flex: 1,
              includeFontPadding: false,
              lineHeight: 60,
              textAlign: 'center',
            }}
            numberOfLines={1}>
            {title}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              overflow: 'hidden',
              height: 60,
            }}>
            {left}
            <View style={{flex: 1}} />
            {right}
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
