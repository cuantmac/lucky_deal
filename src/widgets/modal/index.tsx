import React, {FC} from 'react';
import {PortalProvider, PortalHost} from '@gorhom/portal';

import {ToastPortal} from './toast';
import {AlertPortal} from './alert';

export const ModalProvider: FC = ({children}) => {
  return (
    <PortalProvider>
      {children}
      <PortalHost name="FIXED" />
      <PortalHost name={'MODAL'} />
      <AlertPortal />
      <ToastPortal />
    </PortalProvider>
  );
};
