import {Dimensions, Image, TouchableOpacity, View, Text} from 'react-native';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {px, StatusBarHeight} from '../../constants/constants';
import {dialogs, navigationRef} from '../../utils/refs';
import AppModule from '../../../AppModule';
const {width} = Dimensions.get('window');
import {updateBackMessageCount} from '../../redux/persistReducers';
import BadgeCartButton from '../cart/BadgeCartButton';
import {useIsFocused} from '@react-navigation/core';
export default forwardRef(({data, way}, ref) => {
  const Pixel_644 = (1080 / 2) * px;
  const [opacity, setOpacity] = useState(0);
  const {unreadMsgCount, feedBackList, token} = useSelector(
    (state) => state.deprecatedPersist,
  );
  const dispatch = useDispatch();
  const cartRef = useRef();
  const focus = useIsFocused();
  useEffect(() => {
    if (!token || !focus) {
      return;
    }
    const _listener = setInterval(() => {
      dispatch(updateBackMessageCount(feedBackList.length));
    }, 60 * 1000);

    return () => {
      clearInterval(_listener);
    };
  }, [token, dispatch, feedBackList.length, focus]);

  useImperativeHandle(
    ref,
    () => ({
      setScrollY: (_args) => {
        const val = _args / Pixel_644;
        setOpacity(val < 0 ? 0 : val);
      },
    }),
    [Pixel_644],
  );
  return (
    <View
      style={{
        width: width,
        marginTop: StatusBarHeight,
        height: 160 * px,
        position: 'absolute',
      }}>
      <View
        opacity={opacity}
        style={{
          width: width,
          height: 160 * px,
          position: 'absolute',
          backgroundColor: '#fff',
          borderBottomWidth: 2 * px,
          borderColor: '#F2F2F2',
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          width: width,
          height: 80 * px,
          position: 'absolute',
          left: 10,
          top: 10,
          zIndex: 2,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigationRef.current?.goBack();
          }}
          style={{
            width: 80 * px,
            height: 80 * px,
            borderRadius: 40 * px,
            backgroundColor: '#00000090',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('../../assets/back.png')}
            resizeMode={'contain'}
            style={{
              width: 50 * px,
              height: 50 * px,
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            marginRight: 10,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <BadgeCartButton
            style={{
              borderRadius: 40 * px,
              backgroundColor: '#00000099',
              marginRight: 70 * px,
            }}
            tintColor={'white'}
            sourceType={2}
            ref={cartRef}
          />
          <TouchableOpacity
            onPress={() => {
              try {
                AppModule.reportClick('3', '19', {
                  ProductId: data.bag_id || data.product_id,
                  CategoryId: data.category_id,
                  CateStation: data.cate_station,
                });
                navigationRef.current?.navigate('CustomerHelp');
              } catch (e) {}
            }}
            style={{
              width: 80 * px,
              height: 80 * px,
              alignSelf: 'flex-end',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              marginRight: 13,
            }}>
            <Image
              style={{width: 80 * px, height: 80 * px, marginRight: 31 * px}}
              source={require('../../assets/new_feedback1.png')}
            />
            {unreadMsgCount > 0 && (
              <View
                style={{
                  position: 'absolute',
                  right: 10,
                  top: 0,
                  backgroundColor: 'red',
                  borderRadius: 15 * px,
                  width: 30 * px,
                  height: 30 * px,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 24 * px,
                    fontWeight: 'bold',
                  }}>
                  {unreadMsgCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              data &&
                data.share_url &&
                dialogs.shareRef.current.show({
                  type: 2,
                  url: data.share_url,
                });
              try {
                AppModule.reportClick('3', '20', {
                  ProductId: data.bag_id || data.product_id,
                  CategoryId: data.category_id,
                  CateStation: data.cate_station,
                });
              } catch (e) {}
            }}
            style={{
              width: 80 * px,
              height: 80 * px,
              alignSelf: 'flex-end',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            }}>
            <Image
              style={{width: 80 * px, height: 80 * px, marginRight: 31 * px}}
              source={require('../../assets/new_detail_share_icon.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});
