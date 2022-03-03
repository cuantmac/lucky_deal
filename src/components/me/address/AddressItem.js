import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {px} from '../../../constants/constants';
import {pure} from 'recompose';
import Api from '../../../Api';
import AppModule from '../../../../AppModule';
import {PRIMARY} from '../../../constants/colors';
import {navigationRef} from '../../../utils/refs';
import {goback} from '@src/routes';

export default pure(function ({data, onDel, onMainPress}) {
  const [showDelIndicator, setShowDelIndicator] = useState(false);

  const del = () => {
    AppModule.reportClick('5', '446');
    setShowDelIndicator(true);
    Api.delAddress(data.address_id).then((res) => {
      setShowDelIndicator(false);
      if (res.data.success) {
        if (onDel) {
          onDel();
        }
      }
    });
  };

  return (
    <TouchableOpacity
      onPress={() => goback()}
      activeOpacity={0.8}
      style={{
        backgroundColor: 'white',
        marginBottom: 10,
      }}>
      <Text
        style={{
          color: '#282828',
          fontSize: 40 * px,
          marginTop: 15,
          marginLeft: 15,
        }}>
        Name: {data.full_name}
      </Text>
      <Text
        style={{
          color: '#282828',
          fontSize: 40 * px,
          marginTop: 10,
          marginLeft: 15,
        }}>
        Phone NO.: {data.phone_number}
      </Text>
      <Text
        style={{
          color: '#282828',
          fontSize: 40 * px,
          marginTop: 10,
          marginLeft: 15,
        }}>
        Address:{' '}
        {(
          data.address_line_one +
          ', ' +
          data.address_line_two +
          ', ' +
          data.city +
          ', ' +
          data.state +
          ', ' +
          data.country
        ).replace(', , ', ', ')}
      </Text>
      <View
        style={{
          height: 1,
          width: '100%',
          marginTop: 10,
          backgroundColor: '#F5F4F9',
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          height: 35,
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={onMainPress}>
          <Image
            source={
              data.preferred
                ? require('../../../assets/checkbox_checked.png')
                : require('../../../assets/checkbox_uncheck.png')
            }
            style={{
              marginLeft: 15,
              width: 15,
              height: 15,
              marginRight: 10,
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 12,
            color: '#282828',
            flex: 1,
          }}>
          Main
        </Text>
        <TouchableOpacity
          style={{
            paddingLeft: 15,
            paddingRight: 15,
          }}
          onPress={() => {
            AppModule.reportClick('5', '445');
            navigationRef.current.navigate('AddAddress', {
              address: data,
              operarion: 'editAddress',
            });
          }}>
          <Text
            style={{
              fontSize: 12,
              color: PRIMARY,
            }}>
            Edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingLeft: 15,
            paddingRight: 15,
          }}
          onPress={del}>
          {showDelIndicator ? (
            <ActivityIndicator />
          ) : (
            <Text
              style={{
                fontSize: 12,
                color: '#FF4849',
              }}>
              Delete
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});
