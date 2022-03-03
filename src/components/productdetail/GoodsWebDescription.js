import React, {memo} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {px} from '../../constants/constants';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {Space} from '../common/Space';
const GoodsWebDescription = ({detail}) => {
  return (
    <>
      <View style={{flex: 1, backgroundColor: 'white'}}>
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
              html: '<div>' + detail.desc + '</div>',
            }}
            viewportContent={'width=device-width, user-scalable=no'}
          />
          {detail.source_url ? (
            <Text
              style={{
                marginTop: 20,
                color: '#7F7F7F',
                fontSize: 10,
              }}>
              {detail.source_title}
              {'\n'}
              {detail.source_url}
            </Text>
          ) : null}
        </View>
      </View>
      <Space height={20} backgroundColor={'#eee'} />
    </>
  );
};
export default memo(GoodsWebDescription);

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
  },
  listHead: {
    marginVertical: 15 * px,
    textAlign: 'left',
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
