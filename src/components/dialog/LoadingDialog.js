import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {px} from '../../constants/constants';
import {PRIMARY} from '../../constants/colors';
import {ModalContainer} from '../common/ModalContainer';

export default forwardRef(({}, ref) => {
  const [show, setShow] = useState(false);
  useImperativeHandle(
    ref,
    () => ({
      show: () => {
        setShow(true);
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
      width: 955 * px,
      padding: 0,
      maxHeight: 1103 * px,
      borderRadius: 20 * px,
      backgroundColor: 'white',
    },
  });
  return (
    <ModalContainer
      transparent={true}
      animationType={'fade'}
      onRequestClose={() => {
        setShow(false);
      }}
      visible={show}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#00000099',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={styles.container}>
          <ActivityIndicator
            color={PRIMARY}
            style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
            size="large"
          />
        </View>
      </View>
    </ModalContainer>
  );
});
