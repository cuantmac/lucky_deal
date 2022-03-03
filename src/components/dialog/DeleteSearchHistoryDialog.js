import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {px} from '../../constants/constants';
import AppModule from '../../../AppModule';
let clear = null;
let giveUp = null;
import {ModalContainer} from '../common/ModalContainer';
export default forwardRef(({}, ref) => {
  const [show, setShow] = useState(false);
  useImperativeHandle(
    ref,
    () => ({
      show: (onClear, onGiveUp) => {
        clear = onClear;
        giveUp = onGiveUp;
        setShow(true);
        AppModule.reportShow('16', '152');
      },
      hide: () => {
        setShow(false);
      },
      isShowing: () => {
        return show;
      },
    }),
    [show],
  );
  const styles = StyleSheet.create({
    container: {
      width: 720 * px,
      height: 550 * px,
      backgroundColor: 'white',
      borderRadius: 20 * px,
      alignItems: 'center',
    },
    shareContainer: {
      flexDirection: 'row',
      width: 720 * px,
      height: 112 * px,
      borderBottomLeftRadius: 20 * px,
      borderBottomRightRadius: 20 * px,
    },
  });
  const Content = () => (
    <View style={styles.container}>
      <Text
        style={{
          color: 'black',
          fontSize: 60 * px,
          marginTop: 120 * px,
          marginLeft: 5,
          marginRight: 5,
          textAlign: 'center',
        }}>
        Are you sure you want to remove all search history?
      </Text>
      <View
        style={{
          height: 1 * px,
          width: 720 * px,
          backgroundColor: '#00000022',
          marginTop: 80 * px,
        }}
      />
      <View style={styles.shareContainer}>
        <TouchableOpacity
          onPress={giveUp}
          style={{
            width: 360 * px,
            height: 112 * px,
            borderBottomLeftRadius: 20 * px,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: '#3C7DE3',
              fontSize: 42 * px,
            }}>
            No
          </Text>
        </TouchableOpacity>
        <View
          style={{
            width: 1 * px,
            height: 120 * px,
            backgroundColor: '#00000022',
          }}
        />
        <TouchableOpacity
          onPress={clear}
          style={{
            width: 360 * px,
            height: 112 * px,
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomRightRadius: 20 * px,
          }}>
          <Text
            style={{
              color: '#3C7DE3',
              fontSize: 42 * px,
            }}>
            Yes
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: 720 * px,
          height: 82 * px,
          position: 'absolute',
          right: 0,
          top: 0,
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}>
        <TouchableOpacity
          style={{
            width: 70 * px,
            height: 82 * px,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={giveUp}>
          <Image
            style={{
              width: 30 * px,
              height: 30 * px,
            }}
            source={require('../../assets/close.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

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
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {Content()}
      </View>
    </ModalContainer>
  );
});
