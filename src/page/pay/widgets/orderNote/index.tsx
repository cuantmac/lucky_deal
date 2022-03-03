import {createStyleSheet} from '@src/helper/helper';
import React, {useEffect, useState} from 'react';
import {useImperativeHandle} from 'react';
import {forwardRef} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {
  PayModuleContainer,
  PayModuleContainerHeader,
} from '../payModuleContainer';

export interface OrderNoteRef {
  getContent: () => string;
}

interface OrderNoteProps {
  value?: string;
}

export const OrderNote = forwardRef<OrderNoteRef, OrderNoteProps>(
  ({value = ''}, ref) => {
    const [content, setContent] = useState(value);

    useImperativeHandle(
      ref,
      () => {
        return {
          getContent: () => {
            return content;
          },
        };
      },
      [content],
    );

    useEffect(() => {
      setContent(value);
    }, [value]);

    return (
      <PayModuleContainer style={OrderNoteStyles.container}>
        <PayModuleContainerHeader title={'Order Note'} />
        <TextInput
          style={OrderNoteStyles.textInput}
          multiline={true}
          value={content}
          onChangeText={setContent}
        />
      </PayModuleContainer>
    );
  },
);

const OrderNoteStyles = createStyleSheet({
  container: {
    marginBottom: 0,
    paddingBottom: 12,
  },
  textInput: {
    borderStyle: 'solid',
    borderColor: '#e5e5e5',
    borderWidth: 1,
    height: 40,
  },
});
