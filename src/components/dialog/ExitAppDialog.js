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
let close = null;
let confirm = null;
import {ModalContainer} from '../common/ModalContainer';
export default forwardRef(({}, ref) => {
  const [show, setShow] = useState(false);
  useImperativeHandle(
    ref,
    () => ({
      show: (onClose, onConfirm) => {
        close = onClose;
        confirm = onConfirm;
        setShow(true);
        AppModule.reportPv('exitapppop');
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
          fontSize: 42 * px,
          marginTop: 92 * px,
          marginLeft: 5,
          marginRight: 5,
          textAlign: 'center',
        }}>
        Are you sure to exit the app?
      </Text>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text
          style={{
            color: '#2DAC1C',
            width: 224 * px,
            height: 70 * px,
            fontSize: 50 * px,
            fontWeight: 'bold',
            lineHeight: 70 * px,
            marginTop: 20 * px,
            backgroundColor: '#E1F4D6',
            textAlign: 'center',
            borderRadius: 10 * px,
          }}>
          $1
        </Text>
        <Text
          style={{
            color: 'black',
            fontSize: 30 * px,
            marginTop: 20 * px,
            marginLeft: 5,
            marginRight: 5,
            textAlign: 'center',
          }}>
          to get your favorite goods
        </Text>
      </View>
      <View
        style={{height: 1 * px, width: 720 * px, backgroundColor: '#00000022'}}
      />
      <View style={styles.shareContainer}>
        <TouchableOpacity
          onPress={confirm}
          style={{
            width: 360 * px,
            height: 112 * px,
            borderBottomLeftRadius: 20 * px,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: '#A3A3A3',
              fontSize: 32 * px,
            }}>
            Exit app
          </Text>
        </TouchableOpacity>
        <View
          style={{
            width: 1 * px,
            height: 112 * px,
            backgroundColor: '#00000022',
          }}
        />
        <TouchableOpacity
          onPress={close}
          style={{
            width: 360 * px,
            height: 112 * px,
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomRightRadius: 20 * px,
          }}>
          <Text
            style={{
              color: '#F04A33',
              fontSize: 32 * px,
            }}>
            Continue browsing
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
          onPress={close}>
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
