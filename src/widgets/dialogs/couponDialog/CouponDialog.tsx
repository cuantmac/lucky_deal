import {
  CouponInfoItem,
  UserAvailableCouponsResponse,
} from '@luckydeal/api-common';
import React, {forwardRef, memo, useImperativeHandle, useCallback} from 'react';
import {Text} from 'react-native';
import {Space} from '@src/widgets/space';
import {COUPON_USE_CONDITION_TYPE_ENUM} from '@src/constants/enum';
import {
  StandardCouponCard,
  StandardCouponCardGetAction,
} from '@src/widgets/coupons/Coupons';
import {
  ActionSheetScrollContent,
  ACTION_SHEET_CONTENT_PADDING_HORIZONTAL,
} from '@src/widgets/modal/modal/widgets';
import {
  DiscountContainer,
  DiscountContent,
  DiscountTitle,
} from './widgets/Widgets';
import {useShallowEqualSelector} from '@src/utils/hooks';
import {CommonApi} from '@src/apis';
import {Message} from '@src/helper/message';
import {
  convertAmountUS,
  createStyleSheet,
  styleAdapter,
} from '@src/helper/helper';
import {useActionSheet} from '@src/widgets/modal/modal';
import {navigate2Login} from '@src/routes';
import {Clipboard} from '@src/widgets/clipboard';
import {ReduxRootState} from '@src/redux';
import {useSelector, shallowEqual} from 'react-redux';

interface CouponDialogProps {
  title?: string;
  isCart?: boolean;
  data?: UserAvailableCouponsResponse;
  onCouponClick?: (val: CouponInfoItem) => Promise<void>;
}

export type CouponDialogRef = {
  show: () => void;
  hide: () => void;
  isShowing: () => boolean;
};

export const CouponDialog = memo(
  forwardRef<CouponDialogRef, CouponDialogProps>(
    ({title, data, isCart, onCouponClick}, ref) => {
      const [Modal, setShow, show] = useActionSheet();
      const {token} = useSelector(
        (state: ReduxRootState) => ({
          token: state.persist.persistAuth.token,
        }),
        shallowEqual,
      );
      useImperativeHandle(
        ref,
        () => ({
          show: () => {
            setShow(true);
          },
          hide: () => {
            setShow(false);
          },
          isShowing: () => {
            return show;
          },
        }),
        [setShow, show],
      );

      const handleCouponClick = useCallback(
        async (val: CouponInfoItem) => {
          if (!token) {
            navigate2Login();
            setShow(false);
            return;
          }
          if (val.status) {
            return;
          }
          Message.loading();
          try {
            await CommonApi.userUserReceiveCouponsUsingPOST({
              promo_code: val.promo_code,
            });
            if (onCouponClick) {
              await onCouponClick(val);
            }
            Message.toast('You got this coupon!');
          } catch (error) {
            if (onCouponClick) {
              await onCouponClick(val);
            }
            Message.toast(error);
          }
        },
        [onCouponClick, setShow, token],
      );

      const handleCodeCopy = useCallback((val: string) => {
        Clipboard.setString(val);
        Message.toast('Coupon code copied！');
      }, []);

      if (!data) {
        return null;
      }

      return (
        <Modal title={title} maskClosable style={CouponDialogStyles.container}>
          <ActionSheetScrollContent>
            {data.promo_code_info && data.promo_code_info.id !== 0 && (
              <DiscountContainer>
                <Space backgroundColor={'white'} />
                <DiscountContent
                  onPress={() =>
                    handleCodeCopy(data.promo_code_info?.promo_code || '')
                  }
                  icon={require('@src/assets/add_coupon.png')}>
                  <Text
                    style={styleAdapter({
                      fontSize: 14,
                      color: 'white',
                    })}>
                    CODE: <Text>{data.promo_code_info.promo_code}</Text>
                  </Text>
                  <Text
                    style={styleAdapter({
                      fontSize: 14,
                      color: 'white',
                    })}>
                    Get {convertAmountUS(data.promo_code_info.amount)} off on{' '}
                    {COUPON_USE_CONDITION_TYPE_ENUM.ANY ===
                      data.promo_code_info.use_condition_type &&
                      'orders over US $0.00'}
                    {COUPON_USE_CONDITION_TYPE_ENUM.AMOUNT ===
                      data.promo_code_info.use_condition_type &&
                      `orders over ${convertAmountUS(
                        data.promo_code_info.use_condition,
                      )}`}
                    {COUPON_USE_CONDITION_TYPE_ENUM.NUMBER ===
                      data.promo_code_info.use_condition_type &&
                      `orders at least ${data.promo_code_info.use_condition} quantities`}
                  </Text>
                </DiscountContent>
              </DiscountContainer>
            )}
            {data.coupon_info?.map((val) => {
              return (
                <StandardCouponCard
                  showCode={false}
                  onPress={() => handleCouponClick(val)}
                  key={val.promo_code}
                  data={val}>
                  <StandardCouponCardGetAction get={!!val.status} />
                </StandardCouponCard>
              );
            })}
          </ActionSheetScrollContent>
        </Modal>
      );
    },
  ),
);

const CouponDialogStyles = createStyleSheet({
  container: {
    paddingHorizontal: 12,
  },
});
