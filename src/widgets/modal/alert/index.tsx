import {createStyleSheet, isWeb, styleAdapter} from '@src/helper/helper';
import {StandardButton, StandardButtonProps} from '@src/widgets/button';
import {height} from 'dom7';
import React, {createRef, FC, forwardRef, Fragment} from 'react';
import {useState} from 'react';
import {useCallback} from 'react';
import {useImperativeHandle} from 'react';
import {ReactNode} from 'react';
import {ViewStyle} from 'react-native';
import {Text, View, TextStyle, TouchableHighlight} from 'react-native';
import Modal from 'react-native-modal';

enum ALERT_TYPE_ENUM {
  DEFAULT,
  STANDARD,
}

type AlertActions = {
  text: string;
  onPress: () => void;
  defaultTextStyle?: TextStyle;
} & Omit<StandardButtonProps, 'title'>;

export type AlertParams = {
  title?: ReactNode;
  content: ReactNode;
  actions: AlertActions[];
  type?: ALERT_TYPE_ENUM;
};

interface AlertRef {
  alert: (params: AlertParams) => void;
}

export const Alert = forwardRef<AlertRef>((props, ref) => {
  const [alertParams, setAlertParams] = useState<AlertParams>();
  const [visible, setVisible] = useState(false);
  useImperativeHandle(
    ref,
    () => {
      return {
        alert(params) {
          setAlertParams({type: ALERT_TYPE_ENUM.STANDARD, ...params});
          setVisible(true);
        },
      };
    },
    [],
  );

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  const handlePress = useCallback(
    (press: AlertActions['onPress']) => {
      handleClose();
      press && press();
    },
    [handleClose],
  );

  return (
    <Modal
      // @ts-ignore
      deviceHeight={isWeb() ? 'auto' : undefined}
      useNativeDriver={!isWeb()}
      backdropOpacity={0.2}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      animationIn="zoomIn"
      animationOut="zoomOut"
      isVisible={visible}
      style={AlertStyles.container}>
      {alertParams?.type === ALERT_TYPE_ENUM.STANDARD ? (
        <StandardAlert {...alertParams} onClose={handleClose} />
      ) : (
        <View style={AlertStyles.alertContainer}>
          {typeof alertParams?.title === 'string' ? (
            <Text numberOfLines={1} style={AlertStyles.titleText}>
              {alertParams?.title}
            </Text>
          ) : (
            alertParams?.title
          )}
          {typeof alertParams?.content === 'string' ? (
            <Text style={AlertStyles.contentText}>{alertParams?.content}</Text>
          ) : (
            alertParams?.content
          )}
          {(alertParams?.actions.length || 0) > 2 ? (
            alertParams?.actions.map((item, index) => {
              return (
                <View style={AlertStyles.actionContainer} key={index}>
                  <AlertAction
                    text={item.text}
                    textStyle={item.defaultTextStyle}
                    onPress={() => handlePress(item.onPress)}
                  />
                </View>
              );
            })
          ) : (
            <View style={[AlertStyles.actionContainer, {flexDirection: 'row'}]}>
              {alertParams?.actions.map((item, index) => {
                return (
                  <Fragment key={index}>
                    {index >= 1 && (
                      <View
                        style={styleAdapter({
                          borderLeftWidth: 1,
                          borderLeftColor: '#ddd',
                        })}
                      />
                    )}
                    <AlertAction
                      style={{flex: 1}}
                      text={item.text}
                      textStyle={item.defaultTextStyle}
                      onPress={() => handlePress(item.onPress)}
                    />
                  </Fragment>
                );
              })}
            </View>
          )}
        </View>
      )}
    </Modal>
  );
});

interface AlertActionProps {
  text: string;
  onPress: () => void;
  textStyle?: TextStyle;
  style?: ViewStyle;
}

const AlertAction: FC<AlertActionProps> = ({
  text,
  textStyle,
  style,
  onPress,
}) => {
  return (
    <TouchableHighlight
      onPress={onPress}
      style={[AlertStyles.alertAction, style]}
      underlayColor="rgba(182,182,182,.5)">
      <Text style={[AlertStyles.actionText, textStyle]}>{text}</Text>
    </TouchableHighlight>
  );
};

const AlertStyles = createStyleSheet({
  container: {
    alignItems: 'center',
  },
  alertContainer: {
    width: 270,
    backgroundColor: 'white',
    borderRadius: 7,
    overflow: 'hidden',
    paddingTop: 15,
  },
  titleText: {
    fontSize: 18,
    textAlign: 'center',
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  contentText: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    textAlign: 'center',
    fontSize: 15,
    color: '#888',
    lineHeight: 22,
  },
  actionContainer: {
    borderTopColor: '#ddd',
    borderTopWidth: 1,
  },
  alertAction: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 18,
  },
});

type StandardAlertProps = {
  onClose: () => void;
} & AlertParams;

const StandardAlert: FC<StandardAlertProps> = ({content, actions, onClose}) => {
  return (
    <View style={StandardAlertStyles.container}>
      <View style={StandardAlertStyles.contentContainer}>
        {typeof content === 'string' ? (
          <Text style={StandardAlertStyles.contentText}>{content}</Text>
        ) : (
          content
        )}
      </View>
      <View style={StandardAlertStyles.btnContainer}>
        {actions.map(({onPress, text, wrapStyle, ...btnProps}, index) => {
          return (
            <StandardButton
              key={index}
              title={text}
              wrapStyle={[
                StandardAlertStyles.btnWrap,
                actions.length === 2 && index === 1 && {marginLeft: 'auto'},
                wrapStyle,
              ]}
              onPress={() => {
                onClose();
                onPress && onPress();
              }}
              {...btnProps}
            />
          );
        })}
      </View>
    </View>
  );
};

const StandardAlertStyles = createStyleSheet({
  container: {
    width: 298,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    paddingBottom: 16,
  },
  contentContainer: {
    alignItems: 'center',
    paddingVertical: 26,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 17,
    color: '#222',
    fontWeight: '700',
    textAlign: 'center',
  },
  btnContainer: {
    flexDirection: 'row',
  },
  btnWrap: {
    height: 35,
    width: 126,
  },
});

const alertRef = createRef<AlertRef>();

export const AlertPortal: FC = () => {
  return (
    <>
      <Alert ref={alertRef} />
    </>
  );
};

export const AlertManager = {
  alert(params: AlertParams) {
    alertRef.current?.alert(params);
  },
};
