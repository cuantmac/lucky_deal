import {StandardButton, StandardButtonProps} from '@src/widgets/button';
import React, {FC} from 'react';

export const ProductButton: FC<StandardButtonProps> = ({
  title = 'button',
  disabledTitle = 'SOLD OUT',
  ...props
}) => {
  return (
    <StandardButton {...props} disabledTitle={disabledTitle} title={title} />
  );
};
