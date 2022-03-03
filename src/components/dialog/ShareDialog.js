import {
  Dimensions,
  Image,
  Modal,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {APP_ID, px} from '../../constants/constants';
import AppModule from '../../../AppModule';
import {useSelector} from 'react-redux';
import RNShare from 'react-native-share';
import {ModalContainer} from '../common/ModalContainer';
const {width, height} = Dimensions.get('window');
const appModule = NativeModules.AppModule;
export default forwardRef(({}, ref) => {
  const [show, setShow] = useState(false);
  const [args, setArgs] = useState({});
  const userId = useSelector((state) => state.deprecatedPersist.userID);
  useImperativeHandle(
    ref,
    () => ({
      show: (_args) => {
        if (Platform.OS === 'android') {
          setArgs(_args);
          setShow(true);
        } else {
          onShare();
          //   RNShare.open({
          //     title: 'Lucky Deal',
          //     url: 'https://itunes.apple.com/app/id' + APP_ID,
          //   })
          //     .then((res) => {
          //       console.log('res', res);
          //     })
          //     .catch((err) => {
          //       console.log('err', err);
          //     });
        }
      },
      hide: () => {
        setShow(false);
      },
      isShowing: () => {
        return show;
      },
    }),
    [show, userId],
  );
  const onShare = async () => {
    try {
      const result = await Share.share({
        title: 'LuckyDeal',
        url: 'https://itunes.apple.com/app/id' + APP_ID,
        message: 'LuckyDeal - Get Discount Goods',
      });
      console.log('----share', result);
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  const sharePop = (number, channel) => {
    let type = 'invite';
    if (args.type == 2) {
      type = 'detail';
    } else if (args.type == 3) {
      type = 'buy';
    } else if (args.type == 4) {
      type = 'Bookingpop';
    } else if (args.type == 5) {
      type = 'Bookingdetail';
    } else if (args.type == 6) {
      type = 'blackSurprise';
    }
    if (args.type === 6) {
      AppModule.showPop(
        '' + args.type,
        'LuckyDeal',
        args.content ? args.content : 'Invite your friend to get more money',
        args.url,
        '' + number,
      );
    } else {
      AppModule.showPop(
        '' + args.type,
        'LuckyDeal',
        args.content ? args.content : 'Invite your friend to get more money',
        args.url +
          '%3d' +
          userId +
          '%26' +
          'versionCode%3d' +
          appModule.versionCode +
          '%26' +
          'Channel%3d' +
          channel +
          '%26' +
          'Sharetype%3d' +
          type,
        '' + number,
      );
    }
    setShow(false);
  };
  const styles = StyleSheet.create({
    container: {
      height: 661 * px,
      width: width,
      backgroundColor: 'white',
    },
    shareContainer: {
      height: 270 * px,
      width: width,
      backgroundColor: 'white',
      flexDirection: 'row',
    },
    imgContainer: {
      height: 270 * px,
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  return (
    <ModalContainer
      transparent={true}
      animationType={'fade'}
      onRequestClose={() => {}}
      visible={show}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#000000cc',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}>
        <View style={styles.container}>
          <View style={styles.shareContainer}>
            <TouchableOpacity
              style={styles.imgContainer}
              onPress={() => sharePop(1, 'fb')}>
              <View>
                <Image
                  style={{
                    width: 150 * px,
                    height: 150 * px,
                  }}
                  source={require('../../assets/facebook_icon.png')}
                />
                <Text
                  style={{
                    color: 'black',
                    fontSize: 32 * px,
                    textAlign: 'center',
                  }}>
                  Facebook
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imgContainer}
              onPress={() => sharePop(4, 'messenger')}>
              <View>
                <Image
                  style={{
                    width: 150 * px,
                    height: 150 * px,
                  }}
                  source={require('../../assets/messenger_icon.png')}
                />
                <Text
                  style={{
                    color: 'black',
                    fontSize: 32 * px,
                    textAlign: 'center',
                  }}>
                  Messenger
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imgContainer}
              onPress={() => sharePop(3, 'whatsapp')}>
              <View>
                <Image
                  style={{
                    width: 150 * px,
                    height: 150 * px,
                  }}
                  source={require('../../assets/whatsapp_icon.png')}
                />
                <Text
                  style={{
                    color: 'black',
                    fontSize: 32 * px,
                    textAlign: 'center',
                  }}>
                  WhatsApp
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.shareContainer}>
            <TouchableOpacity
              style={styles.imgContainer}
              onPress={() => sharePop(2, 'twiter')}>
              <View>
                <Image
                  style={{
                    width: 150 * px,
                    height: 150 * px,
                  }}
                  source={require('../../assets/twiter_icon.png')}
                />
                <Text
                  style={{
                    color: 'black',
                    fontSize: 32 * px,
                    textAlign: 'center',
                  }}>
                  Twitter
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imgContainer}
              onPress={() => sharePop(5)}>
              <View>
                <Image
                  style={{
                    width: 150 * px,
                    height: 150 * px,
                  }}
                  source={require('../../assets/systrm_icon.png')}
                />
                <Text
                  style={{
                    color: 'black',
                    fontSize: 32 * px,
                    textAlign: 'center',
                  }}>
                  More
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imgContainer} />
          </View>
          <View
            style={{height: 1 * px, width: width, backgroundColor: '#000000'}}
          />
          <Text
            style={{
              color: 'black',
              fontSize: 40 * px,
              lineHeight: 120 * px,
              textAlign: 'center',
            }}
            onPress={() => {
              setShow(false);
            }}>
            Cancel
          </Text>
        </View>
      </View>
    </ModalContainer>
  );
});
