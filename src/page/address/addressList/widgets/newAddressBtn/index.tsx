import {createStyleSheet} from '@src/helper/helper';
import {EditAddressRoute} from '@src/routes';
import {
  BUTTON_TYPE_ENUM,
  StandardButton,
  StandardButtonProps,
} from '@src/widgets/button';
import React, {FC} from 'react';

interface NewAddressBtnProps extends StandardButtonProps {}

export const NewAddressBtn: FC<NewAddressBtnProps> = ({
  wrapStyle,
  ...props
}) => {
  const EditAddressRouter = EditAddressRoute.useRouteLink();

  return (
    <StandardButton
      type={BUTTON_TYPE_ENUM.HIGH_LIGHT}
      title={'+ Add New Address'}
      wrapStyle={[NewAddressBtnStyles.btn, wrapStyle]}
      onPress={() => {
        EditAddressRouter.navigate({});
      }}
      {...props}
    />
  );
};

const NewAddressBtnStyles = createStyleSheet({
  btn: {
    marginHorizontal: 12,
  },
});
