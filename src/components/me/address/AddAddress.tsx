import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {
  FC,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from 'react';
import {useForm, Controller, FieldErrors} from 'react-hook-form';
import {
  View,
  Text,
  ScrollView,
  TextInputProps,
  StyleSheet,
  Image,
  PickerProps,
  Picker,
  ActivityIndicator,
  DeviceEventEmitter,
  Platform,
} from 'react-native';
// import Picker from '@react-native-community/picker';
import {Picker as PickerIos} from '@react-native-picker/picker';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';
import AppModule from '../../../../AppModule';
import Api, {EditAddressParams} from '../../../Api';
import {PRIMARY} from '../../../constants/colors';
import {px} from '../../../constants/constants';
import {UserAddressList} from '../../../types/models/order.model';
import Utils from '../../../utils/Utils';
import {selectRegion} from './SelectRegion';
import {standardAction} from '@src/redux';

type NavigarionParams = {
  AddAddress?: AddressParams;
};
interface AddressParams {
  address?: UserAddressList.List;
  operarion?: string;
}

function isEdit(
  params: NavigarionParams['AddAddress'],
): params is Required<NavigarionParams>['AddAddress'] {
  return !!params?.address && params?.operarion === 'editAddress';
}

function isChangeAddress(
  params: NavigarionParams['AddAddress'],
): params is Required<NavigarionParams>['AddAddress'] {
  return !!params?.address && params?.operarion === 'changeAddress';
}

type FormFileds = {
  full_name: string;
  address_line_one: string;
  address_line_two: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone_number: string;
  email: string;
};

const AddAddress: FC = () => {
  const navigation = useNavigation();
  const {params} = useRoute<RouteProp<NavigarionParams, 'AddAddress'>>();
  const [loading, setLoading] = useState(false);
  const focus = useIsFocused();
  const {handleSubmit, control, getValues, setValue} = useForm<FormFileds>({
    defaultValues: params?.address || {
      full_name: '',
      address_line_one: '',
      address_line_two: '',
      city: '',
      state: '',
      zip: '',
      country: 'US',
      phone_number: '',
      email: '',
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: isEdit(params) ? 'Edit Address' : 'Add Shipping Address',
    });
  }, [navigation, params]);

  useEffect(() => {
    if (focus) {
      AppModule.reportShow('5', '448');
    }
  }, [focus]);

  const handlePickerChange = useCallback(
    (callback: (...params: any[]) => void) => {
      return (val: string, itemPosition: number) => {
        callback(val, itemPosition);
      };
    },
    [],
  );

  const onSubmit = useCallback(
    async (data: FormFileds) => {
      let res;
      let addressId = 0;
      const apiParamsData = {
        ...params?.address,
        ...data,
        preferred: 1,
      };
      setLoading(true);
      AppModule.reportClick('5', '449');
      try {
        if (isEdit(params)) {
          res = await Api.editAddress(apiParamsData as EditAddressParams);
          addressId = params.address?.address_id || 0;
        } else {
          //如果是订单修改地址：是新增地址&设为默认地址。(打破了添加编辑地址的正常逻辑，xxxx);
          res = await Api.addAddress({
            ...data,
            preferred: 1,
          });
          addressId = res.data.address_id;
        }
      } finally {
        setLoading(false);
      }
      if (res.error) {
        Utils.toastFun(res.error);
        AppModule.reportClick('5', '451', {
          failReason: res.error,
        });
        return;
      }
      if (res.data && res.data.success) {
        AppModule.reportClick('5', '450');
        if (isChangeAddress(params)) {
          DeviceEventEmitter.emit('CHANGE_ORDER_ADDRESS', addressId);
        }
        navigation.goBack();
      } else {
        Utils.toastFun('Address information is incorrect');
      }
    },
    [navigation, params],
  );

  const onError = useCallback((errors: FieldErrors<FormFileds>) => {
    if (errors.full_name) {
      Utils.toastFun(errors.full_name.message);
      AppModule.reportClick('5', '451', {
        failReason: errors.full_name.message,
      });
      return;
    }
    if (errors.address_line_one) {
      Utils.toastFun(errors.address_line_one.message);
      AppModule.reportClick('5', '451', {
        failReason: errors.address_line_one.message,
      });
      return;
    }

    if (errors.country) {
      Utils.toastFun(errors.country.message);
      AppModule.reportClick('5', '451', {
        failReason: errors.country.message,
      });
      return;
    }

    if (errors.state) {
      Utils.toastFun(errors.state.message);
      AppModule.reportClick('5', '451', {
        failReason: errors.state.message,
      });
      return;
    }
    if (errors.city) {
      Utils.toastFun(errors.city.message);
      AppModule.reportClick('5', '451', {
        failReason: errors.city.message,
      });
      return;
    }

    if (errors.zip) {
      Utils.toastFun(errors.zip.message);
      AppModule.reportClick('5', '451', {
        failReason: errors.zip.message,
      });
      return;
    }
    if (errors.phone_number) {
      Utils.toastFun(errors.phone_number.message);
      AppModule.reportClick('5', '451', {
        failReason: errors.phone_number.message,
      });
      return;
    }
    if (errors.email) {
      Utils.toastFun(errors.email.message);
      AppModule.reportClick('5', '451', {
        failReason: errors.email.message,
      });
      return;
    }
  }, []);

  return (
    <ScrollView
      keyboardShouldPersistTaps={'handled'}
      style={{
        backgroundColor: 'white',
        flex: 1,
      }}>
      <TopTip>When finished, click the "Save" button.</TopTip>
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInputItem
            value={value}
            onBlur={onBlur}
            title={'Full Name'}
            placeholder={'Fill in name'}
            onChangeText={onChange}
          />
        )}
        name={'full_name'}
        rules={{
          required: 'Please fill in the Full name',
          pattern: {
            value: /^[a-zA-Z\s]{2,30}$/,
            message: 'Full Name should be 2-30 letters or spaces',
          },
        }}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInputItem
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            title={'Shipping Address'}
            placeholder={'Street address,P.O. box, company name, c/o'}
          />
        )}
        name={'address_line_one'}
        rules={{
          required: 'Please fill in the shipping address',
          pattern: {
            value: /^.{5,}$/,
            message:
              'Address line 1 should contain 5-30 letters, digits or spaces',
          },
        }}
      />
      <Controller
        control={control}
        render={({onChange, value}) => {
          return (
            <PickerInputItem
              selectedValue={value}
              onValueChange={handlePickerChange(onChange)}
              title={'Destination Country'}
              data={[{label: 'United States', value: 'US'}]}
            />
          );
        }}
        name={'country'}
        rules={{
          required: 'Please fill in the country',
        }}
      />
      <Controller
        control={control}
        render={({onChange, value}) => (
          <SelectInputItem
            value={value}
            editable={false}
            title={'State/Province/Region'}
            onPress={() => {
              selectRegion({title: 'State/Province/Region'}).then((state) => {
                onChange(state);
                setValue('city', '');
              });
            }}
          />
        )}
        name={'state'}
        rules={{
          required: 'Please fill in the state',
        }}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <SelectInputItem
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            title={'City'}
            onPress={() => {
              const state = getValues().state;
              if (!state) {
                Utils.toastFun('Please fill in the state');
                return;
              }
              selectRegion({title: 'Select City', region: state}).then(
                (city) => {
                  onChange(city);
                },
              );
            }}
          />
        )}
        name={'city'}
        rules={{
          required: 'Please fill in the city',
          pattern: {
            value: /^[a-zA-Z\s]{2,60}$/,
            message: 'City Name should contain 2-60 characters',
          },
        }}
      />

      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInputItem
            value={value}
            onBlur={onBlur}
            onChangeText={(val) => {
              if (/^\d+$/.test(val) && val.length > 5) {
                val = val.replace(/^(\d{5})/, '$1-');
              }
              onChange(val);
            }}
            title={'Zip code'}
            placeholder={'such as 20001 or 20001-0000'}
          />
        )}
        name={'zip'}
        rules={{
          required: 'Please fill in the zip code.',
          pattern: {
            value: /^\d{5}$|^\d{5}-\d{4}$/,
            message:
              'ZIP Code should be 5 digits or 5 digits with 4-digit number, e.g. 20001 or 20001-0000.',
          },
        }}
      />

      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInputItem
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            title={'Phone Number'}
            placeholder={'Fill in mobile number'}
          />
        )}
        name={'phone_number'}
        rules={{
          required: 'Please fill in the phone number',
          pattern: {
            value: /^\d+$/,
            message: 'Phone number should be a 10-digit number.',
          },
        }}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => {
          return (
            <TextInputItem
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              title={'Email'}
              placeholder={'Fill in contact email'}
            />
          );
        }}
        name={'email'}
        rules={{
          setValueAs: (val: string) => val.trim(),
          validate: (val: string) => {
            const validateVal = val.trim();
            if (!validateVal) {
              return 'Please fill your email';
            }
            if (
              /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i.test(
                validateVal,
              )
            ) {
              return true;
            }
            return 'Please fill the correct email information';
          },
        }}
      />
      <SaveButton onPress={handleSubmit(onSubmit, onError)} loading={loading} />
    </ScrollView>
  );
};

const TopTip: FC = memo(({children}) => {
  return (
    <Text
      style={{
        color: '#4E4E4E',
        fontSize: 35 * px,
        marginLeft: 18,
        marginTop: 12,
      }}>
      {children}
    </Text>
  );
});

type TextInputItemProps = TextInputProps & {
  title: string;
};
const TextInputItem: FC<TextInputItemProps> = memo(({title, ...props}) => {
  return (
    <View style={AddAddressStyles.textInputLayout}>
      <View style={AddAddressStyles.titleLayout}>
        <Text style={AddAddressStyles.textInputLabel}>{title}</Text>
        <Text style={AddAddressStyles.titleStar}>*</Text>
      </View>
      <TextInput
        placeholderTextColor={'#C7C7D7'}
        style={AddAddressStyles.textInput}
        {...props}
      />
    </View>
  );
});

type SelectInputItemProps = TextInputProps & {
  title: string;
  onPress: () => void;
};
type SelectInputItemRef = {
  setValue: (val: string) => void;
};
const SelectInputItem = memo(
  forwardRef<SelectInputItemRef, SelectInputItemProps>(
    ({title, onPress, value, editable = true, ...props}, ref) => {
      const [val, setValue] = useState<string>();
      useImperativeHandle(
        ref,
        () => {
          return {
            setValue,
          };
        },
        [],
      );
      useEffect(() => {
        setValue(value);
      }, [value]);
      return (
        <View style={AddAddressStyles.textInputLayout}>
          <View style={AddAddressStyles.titleLayout}>
            <Text style={AddAddressStyles.textInputLabel}>{title}</Text>
            <Text style={AddAddressStyles.titleStar}>*</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            disabled={editable}
            style={{
              marginTop: 2,
              borderWidth: 1,
              borderColor: '#DBDBDB',
              height: 100 * px,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            {editable ? (
              <TextInput
                value={val}
                placeholderTextColor={'#C7C7D7'}
                style={[
                  AddAddressStyles.textInput,
                  {borderWidth: 0, flex: 1, marginTop: 0},
                ]}
                {...props}
              />
            ) : (
              <Text
                style={{
                  flex: 1,
                  fontSize: 35 * px,
                  color: '#282828',
                  marginLeft: 20 * px,
                }}>
                {val}
              </Text>
            )}

            <TouchableOpacity
              style={{paddingLeft: 50 * px}}
              activeOpacity={0.8}
              disabled={!editable}
              onPress={onPress}>
              <Image
                style={{width: 22 * px, height: 38 * px, marginRight: 20 * px}}
                source={require('../../../assets/me_arrow.png')}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      );
    },
  ),
);

type PickerInputItemProps = PickerProps & {
  title: string;
  data: Array<{label: string; value: string}>;
};
const PickerInputItem: FC<PickerInputItemProps> = memo(
  ({title, data, ...props}) => {
    return (
      <View style={AddAddressStyles.textInputLayout}>
        <View style={AddAddressStyles.titleLayout}>
          <Text style={AddAddressStyles.textInputLabel}>{title}</Text>
          <Text style={AddAddressStyles.titleStar}>*</Text>
        </View>
        <View
          style={{
            ...AddAddressStyles.textInput,
            padding: 0,
            justifyContent: 'center',
          }}>
          {Platform.OS === 'ios' ? (
            <PickerIos
              {...props}
              // style={{backgroundColor: 'transparent'}}
              itemStyle={{
                backgroundColor: '#fff',
                height: 95 * px,
                fontSize: 36 * px,
              }}>
              {data.map(({label, value}) => {
                return (
                  <PickerIos.Item key={value} label={label} value={value} />
                );
              })}
            </PickerIos>
          ) : (
            <Picker {...props}>
              {data.map(({label, value}) => {
                return <Picker.Item key={value} label={label} value={value} />;
              })}
            </Picker>
          )}
        </View>
      </View>
    );
  },
);

type SaveButtonProps = {
  loading: boolean;
  title?: string;
  onPress: () => void;
};
const SaveButton: FC<SaveButtonProps> = memo(
  ({title = 'Save', loading, onPress}) => {
    return (
      <TouchableOpacity
        disabled={loading}
        onPress={onPress}
        style={{
          margin: 18,
          height: 50,
          backgroundColor: PRIMARY,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {loading ? (
          <ActivityIndicator
            color={'white'}
            style={{
              flex: 1,
            }}
          />
        ) : (
          <Text
            style={{
              color: 'white',
              fontSize: 20,
            }}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  },
);

const AddAddressStyles = StyleSheet.create({
  textInputLayout: {
    marginLeft: 18,
    marginRight: 18,
    marginTop: 15,
  },
  textInputLabel: {
    fontSize: 35 * px,
    color: '#282828',
  },
  textInput: {
    height: 100 * px,
    marginTop: 2,
    fontSize: 35 * px,
    color: '#282828',
    borderWidth: 1,
    borderColor: '#DBDBDB',
    padding: 8,
  },
  titleLayout: {
    flexDirection: 'row',
    textAlign: 'center',
  },
  titleStar: {
    color: '#FF1F1F',
    fontSize: 40 * px,
    marginLeft: 20 * px,
  },
});

export default AddAddress;
