import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {px} from '../../../constants/constants';
import AppModule from '../../../../AppModule';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import Utils from '../../../utils/Utils';

import {PRIMARY} from '../../../constants/colors';
import Api from '../../../Api';

import {navigationRef} from '../../../utils/refs';

import {useFetching} from '../../../utils/hooks';

import {
  ItemContainer,
  OrderNumberRender,
  AmountRender,
  OrderCancelMethodRender,
  OrderBtnRender,
  ResonDiaRender,
} from './OrderComponent';
import AlertDialog from '../../dialog/AlertDialog';

export default function ({navigation, route}) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: orderConfig?.type ? 'Delivery Item' : 'Cancel Item',
    });
  }, [navigation, orderConfig]);
  const productList = route.params?.product_list;
  const refresh = route.params?.refresh;
  //const order_status = route.params?.order_status;
  //const ProductCat = route.params?.ProductCat;
  const [loading, fetchOrderConfig] = useFetching(Api.refundReasonConfigV2);
  const [, fetchRefundOrder] = useFetching(Api.refundOrderV2);

  const [orderConfig, setOrderConfig] = useState({});
  const [refundType, setRefundType] = useState(0);
  const [selectReason, setSelectReason] = useState(0);
  const [otherReason, setOtherReason] = useState('');
  const [reasonTitle, setReasonTitle] = useState(
    'Please choose a cancellation reason',
  );
  const [productNameList, setProductNameList] = useState("");
  const [productIdList, setProductIdList] = useState("");

  useEffect(() => {
    let nameList = "";
    let idList = "";
    let i = 1;
    productList.forEach((product) => {
      if (idList.length > 0) {
        idList += ",";
        nameList += "\n";
      }
      idList += product.id;
      nameList += i + ". " + product.product_name;
      setProductIdList(idList);
      setProductNameList(nameList);
      i++;
    });
    fetchOrderConfig(idList).then((res) => {
      if (res.code === 0) {
        setOrderConfig(res.data);
        // if (res.data.type) {
        //   AppModule.reportShow('14', '332', {
        //     FromPage: 5,
        //     ChildOrderID: productList,
        //     OrderState: productList + ':' + order_status,
        //     ProductCat,
        //   });
        // } else {
        //   AppModule.reportShow('14', '331', {
        //     FromPage: 5,
        //     ChildOrderID: productList,
        //     OrderState: productList + ':' + order_status,
        //     ProductCat,
        //   });
        // }
      } else {
        Utils.toastFun(res.error);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOrderConfig, productList]);
  useEffect(() => {
    if (orderConfig?.list?.length > 0 && selectReason > 0) {
      let _item = orderConfig?.list.find((item) => item.id === selectReason);
      setReasonTitle(_item.title);
    }
  }, [selectReason, orderConfig]);

  const cancel = () => {
    AppModule.reportClick('14', '337', {
      OrderState: productIdList + ':' +  productList[0].refund_status,
      FromPage: 5,
      ChildOrderID: productIdList,
    });
    navigationRef.current.goBack();
  };
  const submit = () => {
    AppModule.reportClick('14', '338', {
      OrderState: productIdList + ':' + productList[0].refund_status,
      FromPage: 5,
      ChildOrderID: productIdList,
    });
    if (!selectReason) {
      Utils.toastFun('Please select a refund reason first.');
      return;
    } else {
      if (selectReason === 1 && !otherReason) {
        Utils.toastFun('Please select a refund reason first.');
        return;
      }
    }
    fetchRefundOrder(
      productIdList,
      orderConfig?.type,
      refundType,
      selectReason,
      otherReason,
    ).then((res) => {
      if (res.code === 0) {
        Utils.toastFun('You apply has submitted successfully!');
        refresh();
        navigationRef.current.goBack();
      } else {
        Utils.toastFun(res.error);
      }
    });
  };
  const showReasonDialog = () => {
    AppModule.reportClick('14', '334');
    const listData = orderConfig?.list.map((res) => {
      return {
        label: res.title,
        value: res.id,
      };
    });
    AppModule.reportShow('14', '335');
    AlertDialog.showLayout(
      <ResonDiaRender
        list={listData}
        onPress={(a, b) => {
          AppModule.reportClick('14', '336');
          if (a === 1 && !b) {
            Utils.toastFun('Please enter a refund reason first.');
            return;
          }
          setSelectReason(a);
          setOtherReason(b);
          AlertDialog.hide();
        }}
      />,
    );
  };

  return loading ? (
    <ActivityIndicator color={PRIMARY} style={{flex: 1}} />
  ) : (
    <ScrollView>
      <OrderNumberRender
        order_no={productNameList}
        order_time={orderConfig?.order_time}
      />
      <AmountRender amount={orderConfig.refund_amount} />
      <ItemContainer>
        <Text style={{fontSize: 46 * px}}>Please select a refund method</Text>
        <OrderCancelMethodRender
          select={refundType === 0}
          onSelect={() => {
            AppModule.reportClick('14', '333', {
              RefundType: 0,
            });
            setRefundType(0);
          }}
          icon={require('../../../assets/me/order_pay.png')}
          title={'Payment Account'}
          desc={
            'Typically the refund takes 7-14 business days to be reflected in your account after the refund has been submitted. Please note that the time it takes for you to see the refund depends on your financial institution.'
          }
        />
        <View
          style={{
            height: 2 * px,
            backgroundColor: '#EEEEEE',
            marginVertical: 10 * px,
          }}
        />
        <OrderCancelMethodRender
          select={refundType === 1}
          onSelect={() => {
            AppModule.reportClick('14', '333', {
              RefundType: 1,
            });
            setRefundType(1);
          }}
          icon={require('../../../assets/me/order_gift.png')}
          title={'Gift Card'}
          desc={
            'Your remaining refundable amount comes from the Refund Gift Card, which can be found in your Coupon Center, you can use it for your next purchase. Also, you have additional 10% refund amount($2 max) if you select Gift Card method.'
          }
        />
      </ItemContainer>
      <ItemContainer>
        <TouchableOpacity onPress={showReasonDialog}>
          <Text style={{fontSize: 46 * px}}>Cancellation Reason:</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 36 * px, color: '#707070'}}>
              {reasonTitle}
            </Text>
            <Image
              source={require('../../../assets/me/me_arrow_icon.png')}
              style={{
                width: 21 * px,
                height: 37 * px,
              }}
            />
          </View>
        </TouchableOpacity>
      </ItemContainer>
      <View
        style={{
          marginTop: 30 * px,
          justifyContent: 'flex-start',
          marginHorizontal: 30 * px,
          paddingHorizontal: 20 * px,
          paddingVertical: 20 * px,
        }}>
        <Text style={{fontSize: 36 * px, color: '#707070'}}>
          {'Warm tips:\nRefund are issued based on the method of payment used.'}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 30 * px,
          marginTop: 30 * px,
          marginBottom: 30 * px,
        }}>
        <OrderBtnRender
          color={'#F04A33'}
          text={'Maybe later'}
          onPress={cancel}
        />
        <OrderBtnRender color={'#707070'} text={'Submit'} onPress={submit} />
      </View>
    </ScrollView>
  );
}
