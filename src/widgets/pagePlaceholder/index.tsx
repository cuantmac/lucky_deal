import React, {FC} from 'react';
import {LoadingIndicator} from '../loadingIndicator';
import styles from './index.module.scss';

export const PagePlaceHolder: FC = () => {
  return (
    <div className={styles.loadAnimateContainer}>
      <LoadingIndicator />
    </div>
  );
};
