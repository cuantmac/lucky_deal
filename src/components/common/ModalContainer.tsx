import {Platform, View, Modal} from 'react-native';
import React, {memo, FC} from 'react';

interface ModalContainerProps {
  visible: boolean;
  onRequestClose: () => void;
  zIndex?: number;
}

export const ModalContainer: FC<ModalContainerProps> = memo(
  ({visible, onRequestClose, zIndex = 9, children}) => {
    return Platform.OS === 'ios' ? (
      visible ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: zIndex,
          }}>
          {children}
        </View>
      ) : null
    ) : (
      <Modal
        transparent={true}
        animationType={'fade'}
        onRequestClose={onRequestClose}
        visible={visible}>
        {children}
      </Modal>
    );
  },
);
