import {Image, Modal, Text, TouchableOpacity, View} from 'react-native';
import React, {
  createRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import {px} from '../../constants/constants';
import {ACCENT} from '../../constants/colors';
import {ModalContainer} from '../common/ModalContainer';
export default class AlertDialog {
  static ref = createRef();

  static show(title, content, button, onSubmit, onCancel, small) {
    AlertDialog.ref.current?.show({
      title,
      content,
      button,
      onSubmit,
      onCancel,
      small,
    });
  }

  static showLayout(layout, zIndex) {
    AlertDialog.ref.current?.show({layout, zIndex});
  }

  static hide() {
    AlertDialog.ref.current?.hide();
  }

  static isShowing() {
    return AlertDialog.ref.current?.isShowing();
  }
}

export const AlertDialogView = forwardRef(() => {
  const [show, setShow] = useState(false);
  const [args, setArgs] = useState({});

  useImperativeHandle(
    AlertDialog.ref,
    () => ({
      show: (_args) => {
        console.log('_args', _args);
        setArgs(_args);
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

  return (
    <ModalContainer
      transparent={true}
      animationType={'fade'}
      onRequestClose={() => {}}
      visible={show}
      zIndex={args.zIndex}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#000000cc',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {React.isValidElement(args.layout) ? (
          args.layout
        ) : (
          <View
            style={{
              width: 865 * px,
              minHeight: args.small ? 500 * px : 967 * px,
              // minHeight: 967 * px,
              backgroundColor: 'white',
              alignItems: 'center',
              borderRadius: 20 * px,
            }}>
            {React.isValidElement(args.title) ? (
              args.title
            ) : (
              <Text
                style={{
                  color: 'black',
                  fontSize: args.small ? 40 * px : 50 * px,
                  marginLeft: args.small ? 20 * px : 77 * px,
                  marginRight: args.small ? 20 * px : 77 * px,
                  marginTop: args.small ? 20 * px : 92 * px,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                {args.title}
              </Text>
            )}
            {React.isValidElement(args.content) ? (
              args.content
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: '#353434',
                    fontSize: args.small ? 40 * px : 50 * px,
                    marginLeft: 77 * px,
                    marginRight: 77 * px,
                    textAlign: 'center',
                  }}>
                  {args.content}
                </Text>
              </View>
            )}
            {React.isValidElement(args.button) ? (
              args.button
            ) : (
              <TouchableOpacity
                style={{
                  marginBottom: 40 * px,
                  width: args.small ? 400 * px : 585 * px,
                  height: args.small ? 100 * px : 130 * px,
                  backgroundColor: ACCENT,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: args.small ? 10 * px : 0,
                }}
                onPress={() => {
                  if (args.onSubmit) {
                    args.onSubmit();
                  }
                  setShow(false);
                }}>
                <Text
                  style={{
                    fontSize: args.small ? 40 * px : 60 * px,
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  {args.button}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={{
                width: 70 * px,
                height: 70 * px,
                position: 'absolute',
                right: 0,
                top: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                if (args.onCancel) {
                  args.onCancel();
                }
                setShow(false);
              }}>
              <Image
                style={{
                  width: 30 * px,
                  height: 30 * px,
                }}
                source={require('../../assets/close.png')}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ModalContainer>
  );
});
