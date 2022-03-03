import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {px} from '../../constants/constants';
import {useSelector} from 'react-redux';
import AutoHeightWebView from 'react-native-autoheight-webview';

export default function OneDollarDescription() {
  const oneDollarDetail = useSelector((state) => state.memory.oneDollarDetail);

  return (
    <View style={{flex: 1, marginBottom: 30}}>
      <View
        style={{
          backgroundColor: '#eee',
          height: 8,
        }}
      />
      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Product Description</Text>
          <View style={{flex: 1}} />
        </View>
        <AutoHeightWebView
          customScript={`
            let images = document.images;
            let length = images == null ? 0 : images.length;
            for (var i = 0; i < length; i++) {
                let item = images[i];
                item.onerror = function () {
                   item.src ='https://static.luckydeal.vip/images/lucky_deal_default_large.jpg';
                   item.onerror = null;
            };}`}
          style={{width: Dimensions.get('window').width - 15, marginTop: 20}}
          customStyle={
            'img {max-width: 100%;height: auto;} p {width:95%;margin:auto}'
          }
          source={{
            html: '<div>' + oneDollarDetail.desc + '</div>',
          }}
          viewportContent={'width=device-width, user-scalable=no'}
        />
        {oneDollarDetail.source_url ? (
          <Text
            style={{
              marginTop: 20,
              color: '#7F7F7F',
              fontSize: 10,
            }}>
            {oneDollarDetail.source_title}
            {'\n'}
            {oneDollarDetail.source_url}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 20 * px,
    margin: 20 * px,
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 50 * px,
    // textAlign: 'left',
    fontWeight: 'bold',
    marginLeft: 8,
    marginBottom: 15 * px,
  },
  img: {
    width: 664 * px,
    height: 287 * px,
    marginVertical: 40 * px,
    marginHorizontal: 'auto',
  },
  infoText: {
    fontSize: 36 * px,
  },
  flexRowBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    marginVertical: 20 * px,
    paddingHorizontal: 20 * px,

    // height: 'auto',
  },
  listHead: {
    marginVertical: 15 * px,
    textAlign: 'left',
    // height: 100 * px,
  },
  headText: {
    fontSize: 40 * px,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  listBody: {
    marginVertical: 10 * px,
  },
  bodyText: {
    fontSize: 36 * px,
    color: '#000',
    flex: 1,
  },
});
