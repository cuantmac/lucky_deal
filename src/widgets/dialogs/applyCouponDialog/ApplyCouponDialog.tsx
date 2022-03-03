import {CouponDetail} from '@luckydeal/api-common';
import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useState,
  useCallback,
} from 'react';
import {useWindowDimensions, View, Text} from 'react-native';
import {TabBar, TabView} from 'react-native-tab-view';
import {NotValidCoupons} from './widgets/NotValidCoupons';
import {ValidCoupons, ValidCouponsProps} from './widgets/ValidCoupons';
import {Props} from 'react-native-tab-view/lib/typescript/src/TabView';
import {useActionSheet} from '@src/widgets/modal/modal';
import {styleAdapter} from '@src/helper/helper';
import {ACTION_SHEET_CONTENT_PADDING_HORIZONTAL} from '@src/widgets/modal/modal/widgets';

export interface ApplyCouponDialogProps extends ValidCouponsProps {
  notAvalidCouponList?: CouponDetail[];
}

export type ApplyCouponDialogRef = {
  show: () => void;
  hide: () => void;
  isShowing: () => boolean;
};

export const ApplyCouponDialog = memo(
  forwardRef<ApplyCouponDialogRef, ApplyCouponDialogProps>((props, ref) => {
    const {notAvalidCouponList} = props;
    const layout = useWindowDimensions();
    const [routes] = useState([
      {key: 'validCoupons', title: 'Available'},
      {key: 'notValidCoupons', title: 'Not Available'},
    ]);
    const [
      ActionSheetModal,
      setActionSheetModalVisible,
      visible,
    ] = useActionSheet();
    const [index, setIndex] = useState(0);
    useImperativeHandle(
      ref,
      () => ({
        show: () => {
          setActionSheetModalVisible(true);
        },
        hide: () => {
          setActionSheetModalVisible(false);
        },
        isShowing: () => {
          return visible;
        },
      }),
      [setActionSheetModalVisible, visible],
    );

    const renderScene = useCallback<Props<any>['renderScene']>(
      ({route}) => {
        switch (route.key) {
          case 'validCoupons':
            return (
              <ValidCoupons
                {...props}
                onApplyCode={(code) => {
                  setActionSheetModalVisible(false);
                  setTimeout(() => {
                    props.onApplyCode && props.onApplyCode(code);
                  }, 200);
                }}
                onApplyCoupon={(con) => {
                  setActionSheetModalVisible(false);
                  setTimeout(() => {
                    props.onApplyCoupon && props.onApplyCoupon(con);
                  }, 200);
                }}
              />
            );
          case 'notValidCoupons':
            return (
              <NotValidCoupons notAvalidCouponList={notAvalidCouponList} />
            );
          default:
            return null;
        }
      },
      [notAvalidCouponList, props, setActionSheetModalVisible],
    );
    const contentWidth = layout.width;
    const indicatorWidth = contentWidth * 0.4;
    const indicatorLeft = (contentWidth - indicatorWidth) / 4;

    const renderTabBar = useCallback<Props<any>['renderTabBar']>(
      // eslint-disable-next-line no-shadow
      (props) => {
        return (
          <TabBar
            {...props}
            indicatorStyle={styleAdapter({backgroundColor: '#000', height: 2})}
            style={{
              backgroundColor: '#fff',
              elevation: 0,
              shadowOpacity: 0,
              shadowColor: 'white',
            }}
            activeColor={'#000'}
            inactiveColor={'#999'}
            indicatorContainerStyle={{
              width: indicatorWidth,
              marginLeft: indicatorLeft,
            }}
            scrollEnabled={true}
            tabStyle={{width: contentWidth / 2}}
            renderLabel={({route, color}) => {
              return (
                <Text style={{color, fontWeight: '700', fontSize: 13}}>
                  {route.title}
                </Text>
              );
            }}
          />
        );
      },
      [contentWidth, indicatorLeft, indicatorWidth],
    );

    return (
      <ActionSheetModal
        maskClosable
        title={'Apply Coupon'}
        style={styleAdapter({height: layout.height * 0.7})}>
        <View
          style={styleAdapter({
            marginHorizontal: -ACTION_SHEET_CONTENT_PADDING_HORIZONTAL,
            flex: 1,
          })}>
          <TabView
            renderTabBar={renderTabBar}
            swipeEnabled={false}
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{width: contentWidth}}
          />
        </View>
      </ActionSheetModal>
    );
  }),
);
