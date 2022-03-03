import React, {useState} from 'react';

import {
  DeviceEventEmitter,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {px, SCREEN_WIDTH} from '../../constants/constants';
import BottomSheet from '../dialog/BottomSheet';
import CartItem from './CartItem';
import {useShallowEqualSelector} from '../../utils/hooks';
export default function CartSoldOutList({
  list,
  moveToList,
  deleteAll,
  removeCartItem,
}) {
  const [soldList, setSoldList] = useState(list);
  const is_vip = useShallowEqualSelector(
    (state) => state.deprecatedPersist.profile.is_vip,
  );

  const removeItem = (data) => {
    removeCartItem && removeCartItem(data);
    let removedList = soldList?.filter((item) => {
      return data.id !== item.id;
    });

    setSoldList(removedList);
  };

  const blockClick = () => {
    DeviceEventEmitter.emit('hideMoreAction', -1);
  };
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={blockClick}
      style={{flex: 1, backgroundColor: '#fff', minHeight: 1400 * px}}>
      <Text
        style={{
          color: '#000',
          fontSize: 50 * px,
          marginTop: 48 * px,
          textAlign: 'center',
          alignSelf: 'center',
        }}>
        OUT OF STOCK TIPS
      </Text>
      <Text
        style={{
          color: '#000',
          fontSize: 36 * px,
          marginTop: 40 * px,
          textAlign: 'center',
        }}>
        The items in your shopping bag are unavailable now，please remove them
        to continue
      </Text>

      <FlatList
        style={{
          marginTop: 20 * px,
          backgroundColor: '#fff',
        }}
        contentContainerStyle={{
          paddingHorizontal: 20 * px,
          paddingTop: 10 * px,
        }}
        data={soldList}
        renderItem={({item, index: i}) => {
          return (
            <CartItem
              data={item}
              index={i}
              updateList={() => removeItem(item)}
              vip={is_vip}
            />
          );
        }}
        keyExtractor={(item, index) => item.id + ''}
      />
      {/*<TouchableOpacity*/}
      {/*  onPress={moveToList}*/}
      {/*  style={{*/}
      {/*    marginTop: 70 * px,*/}
      {/*    width: SCREEN_WIDTH - 100 * px,*/}
      {/*    alignSelf: 'center',*/}
      {/*    borderRadius: 10 * px,*/}
      {/*    backgroundColor: '#3C7DE3',*/}
      {/*    height: 136 * px,*/}
      {/*  }}>*/}
      {/*  <Text*/}
      {/*    style={{*/}
      {/*      fontSize: 60 * px,*/}
      {/*      color: '#fff',*/}
      {/*      lineHeight: 136 * px,*/}
      {/*      textAlign: 'center',*/}
      {/*    }}*/}
      {/*    numberOfLines={1}>*/}
      {/*    MOVE TO WISH LIST*/}
      {/*  </Text>*/}
      {/*</TouchableOpacity>*/}
      <TouchableOpacity
        onPress={deleteAll}
        style={{
          marginTop: 38 * px,
          width: SCREEN_WIDTH - 100 * px,
          alignSelf: 'center',
          borderRadius: 10 * px,
          backgroundColor: '#3C7DE3',
          height: 136 * px,
          marginBottom: 40 * px,
        }}>
        <Text
          style={{
            fontSize: 60 * px,
            color: '#fff',
            lineHeight: 136 * px,
            textAlign: 'center',
          }}
          numberOfLines={1}>
          DELETE
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: 70 * px,
          height: 70 * px,
          position: 'absolute',
          right: 5,
          top: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          BottomSheet.hide();
        }}>
        <Image
          style={{
            width: 30 * px,
            height: 30 * px,
          }}
          source={require('../../assets/close.png')}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
