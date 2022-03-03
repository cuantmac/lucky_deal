import classNames from 'classnames';
import React, {FC} from 'react';
import {View, ViewStyle} from 'react-native';
import styles from './index.module.scss';

interface HtmlRenderProps {
  html?: string;
  style?: ViewStyle;
}

export const HtmlRender: FC<HtmlRenderProps> = ({html = '', style}) => {
  return (
    <View style={[{backgroundColor: 'white'}, style]}>
      <div
        className={styles.htmlRender}
        dangerouslySetInnerHTML={{__html: html}}
      />
    </View>
  );
};
