import {Portal} from '@gorhom/portal';
import {isWeb} from '@src/helper/helper';
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import RNModal, {ModalProps} from 'react-native-modal';
import {ActionSheetTitle, ActionSheetContent} from './widgets';

type ModalPropsType = Partial<ModalProps> & {
  modalStyle?: ViewStyle;
  onClosePress?: () => void;
  useDefaultTemplate?: boolean;
  title?: string;
};

const Modal: FC<ModalPropsType> = ({children, modalStyle, ...props}) => {
  return (
    <RNModal
      // @ts-ignore
      deviceHeight={isWeb() ? 'auto' : undefined}
      animationIn="zoomIn"
      animationOut="zoomOut"
      {...props}
      style={[ModalStyles.modal, modalStyle]}>
      {children}
    </RNModal>
  );
};

const ActionSheetModal: FC<ModalPropsType> = ({
  children,
  onClosePress,
  title,
  modalStyle,
  style,
  useDefaultTemplate = true,
  ...props
}) => {
  return (
    <RNModal
      // @ts-ignore
      deviceHeight={isWeb() ? 'auto' : undefined}
      {...props}
      style={[ModalStyles.actionSheet, modalStyle]}>
      {useDefaultTemplate ? (
        <ActionSheetContent style={style}>
          <ActionSheetTitle onPress={onClosePress} title={title} />
          {children}
        </ActionSheetContent>
      ) : (
        children
      )}
    </RNModal>
  );
};

const ModalStyles = StyleSheet.create({
  modal: {
    margin: 0,
    alignItems: 'center',
  },
  actionSheet: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});

export type UseModalConfig = Omit<ModalPropsType, 'isVisible'> & {
  backPressCloseable?: boolean;
  maskClosable?: boolean;
  usePortal?: boolean;
};

export const createModalHook = (El: typeof Modal | typeof ActionSheetModal) => {
  return () => {
    const [modalVisible, setModalVisible] = useState(false);
    const setVisibleRef = useRef<Dispatch<SetStateAction<boolean>>>();

    const setModalVisibleMethod = useCallback((bool: boolean) => {
      setVisibleRef.current && setVisibleRef.current(bool);
      setModalVisible(bool);
    }, []);

    const ModalContainer: FC<Partial<UseModalConfig>> = useCallback(
      ({
        onBackdropPress,
        maskClosable,
        usePortal = true,
        onBackButtonPress,
        backPressCloseable = true,
        ...props
      }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [visible, setVisible] = useState(false);
        setVisibleRef.current = setVisible;
        const WrapComponent: FC = useCallback(
          ({children}) => {
            if (usePortal) {
              return <Portal hostName={'MODAL'}>{children}</Portal>;
            }
            return <>{children}</>;
          },
          [usePortal],
        );
        return (
          <WrapComponent>
            <El
              {...(props as any)}
              isVisible={visible}
              coverScreen={false}
              backdropOpacity={0.2}
              onBackdropPress={() => {
                onBackdropPress && onBackdropPress();
                maskClosable && setModalVisibleMethod(false);
              }}
              onBackButtonPress={() => {
                onBackButtonPress && onBackButtonPress();
                backPressCloseable && setModalVisibleMethod(false);
              }}
              onClosePress={() => setModalVisibleMethod(false)}
              useNativeDriver={!isWeb()}
            />
          </WrapComponent>
        );
      },
      [setModalVisibleMethod],
    );
    return [ModalContainer, setModalVisibleMethod, modalVisible] as const;
  };
};

export const useModal = createModalHook(Modal);

export const useActionSheet = createModalHook(ActionSheetModal);
