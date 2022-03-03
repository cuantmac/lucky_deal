import React, {FC, useState} from 'react';

import {
  Text,
  TouchableOpacity,
  Image,
  View,
  ImageSourcePropType,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
// import {navigationRef} from '../../../utils/refs';
import AlertDialog from '../../dialog/AlertDialog';
import Utils from '../../../utils/Utils';

import {px} from '../../../constants/constants';
interface BuyAgainDialogProps {
  content: string;
  okButtonBg?: string;
  cancelButtonBg?: string;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
}
// BuyAgain
export const BuyAgainDialog = ({
  content,
  okButtonBg = '#3C7DE3',
  cancelButtonBg = '#F04A33',
  okText = 'Ok',
  cancelText = 'Cancel',
  onCancel,
  onOk,
}: BuyAgainDialogProps) => {
  return (
    <View
      style={{
        justifyContent: 'space-around',
        minHeight: 460 * px,
        paddingTop: 20 * px,
        alignItems: 'center',
        borderRadius: 20 * px,
        backgroundColor: '#fff',
        width: '70%',
        overflow: 'hidden',
      }}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 40 * px,
            paddingHorizontal: 30 * px,
            alignSelf: 'center',
          }}>
          {content}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: 112 * px,
        }}>
        {onCancel ? (
          <TouchableOpacity
            onPress={onCancel}
            style={{
              flex: 1,
              backgroundColor: cancelButtonBg,
              justifyContent: 'center',
              alignItems: 'center',
              height: 112 * px,
            }}>
            <Text
              style={{color: '#fff', fontSize: 40 * px, textAlign: 'center'}}>
              {cancelText}
            </Text>
          </TouchableOpacity>
        ) : null}
        {onOk ? (
          <TouchableOpacity
            onPress={onOk}
            style={{
              flex: 1,
              backgroundColor: okButtonBg,
              justifyContent: 'center',
              alignItems: 'center',
              height: 112 * px,
            }}>
            <Text
              style={{color: '#fff', fontSize: 40 * px, textAlign: 'center'}}>
              {okText}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

interface OrderIdProps {
  order_id: string;
}
export const OrderIdComponent = ({order_id}: OrderIdProps) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: 30 * px,
      }}>
      <Text
        selectable={true}
        style={{
          fontSize: 36 * px,
          paddingHorizontal: 20 * px,
          paddingVertical: 40 * px,
        }}>
        Order Id: {order_id}
      </Text>
    </View>
  );
};

interface PackageComponentProps {
  package_id: string;
  index: number;
}
export const PackageComponent = ({
  package_id,
  index,
}: PackageComponentProps) => {
  return (
    <View
      style={{
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginHorizontal: 30 * px,
        marginTop: 20 * px,
      }}>
      <Text
        style={{
          fontSize: 36 * px,
          paddingHorizontal: 20 * px,
        }}>
        Package {index}:
      </Text>
      <Text
        selectable={true}
        numberOfLines={1}
        style={{
          fontSize: 36 * px,
          paddingHorizontal: 20 * px,
        }}>
        {package_id}
      </Text>
    </View>
  );
};

// 退款=======

/**
 * 包裹容器
 */
export const ItemContainer: FC = ({children}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        marginTop: 30 * px,
        justifyContent: 'flex-start',
        borderRadius: 20 * px,
        marginHorizontal: 30 * px,
        paddingHorizontal: 20 * px,
        paddingVertical: 20 * px,
      }}>
      {children}
    </View>
  );
};

interface OrderNumberProps {
  order_no: string;
  order_time: string;
}
export const OrderNumberRender = ({order_no, order_time}: OrderNumberProps) => {
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={{paddingBottom: 30 * px}}
      colors={['#FF8E00', '#FE5100']}>
      <ItemContainer>
        <Text style={{fontSize: 46 * px}}>Products to Refund:</Text>
        <Text style={{fontSize: 34 * px, color: '#282828'}}>{order_no}</Text>
        <Text style={{fontSize: 30 * px, color: '#707070', marginTop: 15 * px}}>
          {order_time}
        </Text>
      </ItemContainer>
    </LinearGradient>
  );
};

interface OrderAmountProps {
  amount: number;
}
export const AmountRender = ({amount}: OrderAmountProps) => {
  return (
    <ItemContainer>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 46 * px}}>Refund amount</Text>
        <Text style={{fontSize: 46 * px, color: '#F36A36'}}>
          US ${(amount / 100.0).toFixed(2)}
        </Text>
      </View>
    </ItemContainer>
  );
};

// 退款方式组件
interface OrderCancelMethodProps {
  select: boolean;
  icon: ImageSourcePropType;
  title: string;
  desc: string;
  onSelect: () => void;
}
export const OrderCancelMethodRender = ({
  select,
  icon,
  title,
  desc,
  onSelect,
}: OrderCancelMethodProps) => {
  return (
    <TouchableOpacity style={{paddingTop: 20 * px}} onPress={onSelect}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 15 * px,
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            // flex:1
          }}>
          <Image
            style={{
              width: 67 * px,
              height: 67 * px,
              marginRight: 15 * px,
            }}
            source={icon}
            resizeMode={'contain'}
          />
          <Text style={{fontSize: 40 * px, color: '#000'}}>{title}</Text>
        </View>
        <Image
          source={
            select
              ? require('../../../assets/me/order_select.png')
              : require('../../../assets/me/order_unselect.png')
          }
          style={{width: 51 * px, height: 51 * px}}
        />
      </View>
      <Text
        style={{fontSize: 32 * px, color: '#282828', paddingBottom: 15 * px}}>
        {desc}
      </Text>
    </TouchableOpacity>
  );
};

// 退款按钮组件
interface OrderBtnProps {
  color: string;
  text: string;
  onPress: () => void;
}
export const OrderBtnRender = ({color, text, onPress}: OrderBtnProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 480 * px,
        height: 136 * px,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: color,
        borderRadius: 10 * px,
        borderWidth: 4 * px,
      }}>
      <Text
        style={{
          fontSize: 60 * px,
          textAlign: 'center',
          color: color,
          lineHeight: 135 * px,
        }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

// 退款原因弹框
type ListProp = {
  value: number;
  label: string;
};
interface resonDiaProps {
  list: ListProp[];
  onPress: (selectReson: number, otherReason: string) => void;
  onClose: () => void;
  showClose: boolean;
}
export const ResonDiaRender = ({
  list,
  onPress,
  onClose,
  showClose = false,
}: resonDiaProps) => {
  const [selectReason, setSelectReason] = useState(0);
  const [otherReason, setOtherReason] = useState('');

  return (
    <View
      style={{
        width: 820 * px,
        paddingHorizontal: 20 * px,
        paddingVertical: 30 * px,
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 20 * px,
        backgroundColor: '#fff',
        height: 1120 * px,
      }}>
      <Text
        style={{
          marginTop: 20 * px,
          fontSize: 60 * px,
          textAlign: 'center',
          marginBottom: 40 * px,
        }}>
        Please select
      </Text>
      <View style={{flex: 1}}>
        <RadioForm initial={0} buttonColor={'#F36A36'}>
          {list.map((obj, i) => (
            <RadioButton
              labelHorizontal={true}
              key={i}
              style={{
                width: 750 * px,
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginBottom: 20 * px,
              }}>
              {/*  You can set RadioButtonLabel before RadioButtonInput */}
              <RadioButtonInput
                obj={obj}
                index={i}
                isSelected={selectReason === obj.value}
                buttonInnerColor={'#F36A36'}
                buttonOuterColor={
                  selectReason === obj.value ? '#F36A36' : '#F36A36'
                }
                buttonSize={10}
                buttonOuterSize={20}
                buttonStyle={{alignItems: 'center', borderWidth: 4 * px}}
                buttonWrapStyle={{marginLeft: 10}}
                onPress={(a) => {
                  setSelectReason(a);
                }}
              />
              <RadioButtonLabel
                obj={obj}
                index={i}
                labelHorizontal={true}
                onPress={(b) => {
                  setSelectReason(b);
                }}
                labelStyle={{
                  fontSize: 36 * px,
                  color: '#000',
                  maxWidth: 600 * px,
                }}
                labelWrapStyle={{}}
              />
            </RadioButton>
          ))}
        </RadioForm>
        {selectReason === 1 ? (
          <TextInput
            placeholder={'write the resaon'}
            style={{
              marginVertical: 10 * px,
              height: 114 * px,
              paddingHorizontal: 20 * px,
              borderColor: '#989898',
              borderWidth: 3 * px,
              borderRadius: 10 * px,
              width: 750 * px,
            }}
            onChangeText={(text) => setOtherReason(text)}
          />
        ) : null}
      </View>
      <TouchableOpacity
        onPress={() => onPress(selectReason, otherReason)}
        style={{
          width: 570 * px,
          height: 120 * px,
          backgroundColor: '#EC3A30',
          borderRadius: 10 * px,
          marginTop: 30 * px,
          marginBottom: 30 * px,
        }}>
        <Text
          style={{
            fontSize: 60 * px,
            color: '#fff',
            textAlign: 'center',
            lineHeight: 120 * px,
          }}>
          OK
        </Text>
      </TouchableOpacity>
      {showClose && (
        <TouchableOpacity
          style={{
            width: 70 * px,
            height: 70 * px,
            position: 'absolute',
            right: 20 * px,
            top: 20 * px,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={onClose}>
          <Image
            style={{
              width: 60 * px,
              height: 60 * px,
            }}
            source={require('../../../assets/ic_sku_close.png')}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

// 退款选择包裹弹框
interface packageDiaProps {
  list: ListProp[];
  goOrderCancel: (order_id: number) => void;
}

export const PackageDiaRender = ({list, goOrderCancel}: packageDiaProps) => {
  const [selectPackage, setSelectPackage] = useState(0);
  let idItem: any = list.find((item) => {
    return item.value === selectPackage;
  });
  const onPress = () => {
    AlertDialog.hide();
    goOrderCancel(idItem.value);
  };
  const close = () => {
    AlertDialog.hide();
  };
  return (
    <View
      style={{
        width: 820 * px,
        paddingHorizontal: 20 * px,
        paddingVertical: 30 * px,
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 20 * px,
        backgroundColor: '#fff',
        height: 1120 * px,
        position: 'relative',
      }}>
      <TouchableOpacity
        onPress={close}
        style={{
          position: 'absolute',
          right: 0 * px,
          top: 0 * px,
          padding: 20 * px,
        }}>
        <Image
          source={require('../../../assets/invitefriend_close.png')}
          style={{
            width: 30 * px,
            height: 30 * px,

            tintColor: 'black',
          }}
        />
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 50 * px,
          textAlign: 'center',
          marginBottom: 40 * px,
        }}>
        Please select the package{'\n'} you want refund
      </Text>
      <View style={{flex: 1}}>
        <RadioForm initial={0} buttonColor={'#F36A36'}>
          {list.map((obj, i) => (
            <RadioButton
              labelHorizontal={true}
              key={i}
              style={{
                width: 750 * px,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                marginBottom: 20 * px,
              }}>
              {/*  You can set RadioButtonLabel before RadioButtonInput */}
              <RadioButtonInput
                obj={obj}
                index={i}
                isSelected={selectPackage === obj.value}
                buttonInnerColor={'#F36A36'}
                buttonOuterColor={
                  selectPackage === obj.value ? '#F36A36' : '#F36A36'
                }
                buttonSize={10}
                buttonOuterSize={20}
                buttonStyle={{alignItems: 'center', borderWidth: 4 * px}}
                buttonWrapStyle={{marginLeft: 10}}
                onPress={(a) => {
                  // console.log('a', a);
                  setSelectPackage(a);
                }}
              />
              <RadioButtonLabel
                obj={obj}
                index={i}
                labelHorizontal={true}
                onPress={(b) => {
                  // console.log('b', a);
                  setSelectPackage(b);
                }}
                labelStyle={{
                  fontSize: 36 * px,
                  // lineHeight: 50 * px,
                  color: '#000',
                  maxWidth: 600 * px,
                }}
                labelWrapStyle={{}}
              />
            </RadioButton>
          ))}
        </RadioForm>
      </View>
      <TouchableOpacity
        onPress={onPress}
        style={{
          width: 570 * px,
          height: 120 * px,
          backgroundColor: '#EC3A30',
          borderRadius: 10 * px,
          marginTop: 30 * px,
          marginBottom: 30 * px,
        }}>
        <Text
          style={{
            fontSize: 60 * px,
            color: '#fff',
            textAlign: 'center',
            lineHeight: 120 * px,
          }}>
          OK
        </Text>
      </TouchableOpacity>
    </View>
  );
};

interface orderStatusRightProp {
  showMore: () => void;
}

export const OrderStatusRightRender = ({showMore}: orderStatusRightProp) => {
  return (
    <>
      <TouchableOpacity
        style={{
          marginRight: 20 * px,
          paddingHorizontal: 20 * px,
          paddingVertical: 20 * px,
        }}
        onPress={showMore}>
        <Image
          source={require('../../../assets/order_status_more.png')}
          style={{width: 48 * px, height: 48 * px}}
        />
      </TouchableOpacity>
    </>
  );
};

interface refundTipProp {
  refund_status: number;
}

export const RefundTip = ({refund_status}: refundTipProp) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: 5 * px,
      }}>
      <View style={{flexDirection: 'column', flex: 1}}>
        <Text
          style={{paddingRight: 20 * px, fontSize: 36 * px}}
          numberOfLines={2}>
          {Utils.refundStateText(refund_status)}
        </Text>
      </View>
    </View>
  );
};
