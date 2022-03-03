import React, {FC, useCallback, useRef, useEffect, useState} from 'react';
import {useForm, Controller, FieldErrors} from 'react-hook-form';
import {ScrollView, DeviceEventEmitter, View, Text} from 'react-native';
import {
  AddressItem,
  UserEditAddressResponse,
  UserNewAddressResponse,
} from '@luckydeal/api-common';
import {useNavigationParams} from '@src/hooks/useNavigationParams';
import {useNavigationHeader} from '@src/widgets/navigationHeader';
import {
  EditAddressRouteParams,
  EDIT_ADDRESS_TYPE_ENUM,
  goback,
} from '@src/routes';
import {CommonApi} from '@src/apis';
import {Message} from '@src/helper/message';
import {BUTTON_TYPE_ENUM, StandardButton} from '@src/widgets/button';
import {
  AddressModule,
  SelectInputItem,
  TextInputItem,
} from './widgets/optionInput';
import {createStyleSheet} from '@src/helper/helper';
import {Space} from '@src/widgets/space';
import {SelectRegionModal, SelectRegionModalRef} from './widgets/selectRegion';
import {Switch} from 'react-native-switch';

type FormFileds = Omit<AddressItem, 'address_id'>;

const EditAddress: FC = () => {
  const {id, type} = useNavigationParams<EditAddressRouteParams>();
  const [isEdit, setIdEdit] = useState(!!id);
  const addressId = id ? +id : 0;
  const {handleSubmit, control, getValues, setValue, reset} = useForm<
    FormFileds
  >({
    defaultValues: {
      full_name: '',
      address_line_one: '',
      address_line_two: '',
      city: '',
      state: '',
      zip: '',
      phone_number: '',
      email: '',
      preferred: 0,
    },
  });
  const selectRegionModalRef = useRef<SelectRegionModalRef>(null);

  useNavigationHeader({
    title: isEdit ? 'Edit Shipping Address' : 'Add New Address',
  });

  const resetAddress = useCallback(
    (updateAddressId: number) => {
      Message.loading();
      CommonApi.userAddressDetailUsingPOST({address_id: updateAddressId})
        .then((res) => {
          const data = res?.data?.detail || {};
          reset({...data});
          if (data.address_id === 0) {
            setIdEdit(false);
            DeviceEventEmitter.emit('UPDATE_ADDRESS_LIST');
          }
          Message.hide();
        })
        .catch((e) => {
          Message.toast(e).then(() => {
            setIdEdit(false);
            DeviceEventEmitter.emit('UPDATE_ADDRESS_LIST');
          });
        });
    },
    [reset],
  );

  const onSubmit = useCallback(
    async (data: FormFileds) => {
      const addressData = {...data, address_line_two: '', country: 'US'};
      let res: ResponseData<UserEditAddressResponse | UserNewAddressResponse>;
      let successAddressId = 0;
      Message.loading();
      try {
        if (isEdit) {
          const editRes = await CommonApi.userEditAddressUsingPOST({
            ...addressData,
            address_id: addressId,
          });
          res = editRes;
          successAddressId = addressId;
        } else {
          //如果是订单修改地址：是新增地址&设为默认地址。(打破了添加编辑地址的正常逻辑，xxxx);
          const addRes = await CommonApi.userNewAddressUsingPOST(addressData);
          res = addRes;
          successAddressId = addRes.data.address_id;
        }
        Message.hide();
        if (res.data && res.data.success) {
          if (type === EDIT_ADDRESS_TYPE_ENUM.UPDATE_ORDER) {
            DeviceEventEmitter.emit('CHANGE_ORDER_ADDRESS', successAddressId);
          }
          DeviceEventEmitter.emit('UPDATE_ADDRESS_LIST');
          goback();
        } else {
          Message.toast('Address information is incorrect');
        }
      } catch (e) {
        Message.toast(e);
      }
    },
    [addressId, isEdit, type],
  );

  const onError = useCallback((errors: FieldErrors<FormFileds>) => {
    if (errors.full_name) {
      Message.toast(errors.full_name.message);
      return;
    }
    if (errors.address_line_one) {
      Message.toast(errors.address_line_one.message);
      return;
    }

    if (errors.country) {
      Message.toast(errors.country.message);
      return;
    }

    if (errors.state) {
      Message.toast(errors.state.message);
      return;
    }
    if (errors.city) {
      Message.toast(errors.city.message);
      return;
    }

    if (errors.zip) {
      Message.toast(errors.zip.message);
      return;
    }
    if (errors.phone_number) {
      Message.toast(errors.phone_number.message);
      return;
    }
    if (errors.email) {
      Message.toast(errors.email.message);
      return;
    }
  }, []);

  useEffect(() => {
    addressId && resetAddress(addressId);
  }, [addressId, resetAddress]);

  return (
    <>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <AddressModule>
          <TextInputItem
            editable={false}
            title={'Destination Country'}
            value={'United States'}
          />
          <Controller
            control={control}
            render={({onChange, onBlur, value}) => (
              <TextInputItem
                value={value}
                onBlur={onBlur}
                title={'Full Name'}
                placeholder={'Please Input your contact name.'}
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
                label="US +1"
                title={'Phone Number'}
                placeholder={'Need Correct Phone Number for Delivery.'}
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
                  title={'Email Address'}
                  placeholder={'Fill in contact Email Adress'}
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
        </AddressModule>
        <Space height={9} backgroundColor={'transparent'} />
        <AddressModule>
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
                title={'Post/Zip Code'}
                placeholder={'Such as 20001 or 20001-0000'}
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
                title={'Address'}
                placeholder={'Street address,P.O. box, company name, c/o'}
              />
            )}
            name={'address_line_one'}
            rules={{
              required: 'Please fill in the address',
              pattern: {
                value: /^.{5,}$/,
                message:
                  'Address line 1 should contain 5-30 letters, digits or spaces',
              },
            }}
          />
          <Controller
            control={control}
            render={({onChange, value}) => (
              <SelectInputItem
                value={value}
                editable={false}
                title={'State/Province/Region'}
                placeholder={'State/Provice/Region'}
                onPress={() => {
                  selectRegionModalRef.current
                    ?.getRegion({title: 'State/Province/Region'})
                    .then((state) => {
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
                placeholder={'City'}
                onPress={() => {
                  const state = getValues().state;
                  if (!state) {
                    Message.toast('Please fill in the state');
                    return;
                  }
                  selectRegionModalRef.current
                    ?.getRegion({title: 'Select City', region: state})
                    .then((city) => {
                      onChange(city);
                    });
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
        </AddressModule>
        <Space height={9} backgroundColor={'transparent'} />
        <View style={AddAddressStyles.switchContainer}>
          <Text style={AddAddressStyles.switchLable}>
            Set as default shipping address
          </Text>
          <Controller
            control={control}
            render={({onChange, value}) => (
              <Switch
                value={!!value}
                onValueChange={onChange}
                circleSize={24}
                switchWidthMultiplier={1.8}
                renderInActiveText={false}
                renderActiveText={false}
                backgroundActive="black"
                backgroundInactive={'#f6f6f6'}
                innerCircleStyle={{borderWidth: 0}}
                switchLeftPx={3}
                switchRightPx={3}
              />
            )}
            name={'preferred'}
            rules={{
              setValueAs: (val) => (val ? 1 : 0),
            }}
          />
        </View>
        <StandardButton
          title={'Save'}
          onPress={handleSubmit(onSubmit, onError)}
          wrapStyle={AddAddressStyles.btnWrap}
          type={BUTTON_TYPE_ENUM.HIGH_LIGHT}
        />
      </ScrollView>
      <SelectRegionModal ref={selectRegionModalRef} />
    </>
  );
};

const AddAddressStyles = createStyleSheet({
  btnWrap: {
    margin: 12,
  },
  switchContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  switchLable: {
    fontSize: 14,
    color: '#222',
  },
});

export default EditAddress;
