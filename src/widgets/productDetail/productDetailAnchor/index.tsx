import {createStyleSheet} from '@src/helper/helper';
import {
  AnchorConsumer,
  AnchorConsumerProps,
  AnchorConsumerRef,
} from '@src/widgets/anchor';
import React, {forwardRef, memo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

export type ProductDetailAnchorProps = Omit<AnchorConsumerProps, 'children'>;

export const ProductDetailAnchor = memo(
  forwardRef<AnchorConsumerRef, ProductDetailAnchorProps>((props, ref) => {
    return (
      <AnchorConsumer {...props} ref={ref}>
        {(data, scrollTo) => {
          return (
            <View style={ProductDetailAnchorStyles.container}>
              {data.map((item) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={ProductDetailAnchorStyles.textWrap}
                    onPress={() => {
                      scrollTo(item);
                    }}
                    key={item.id}>
                    <Text style={ProductDetailAnchorStyles.text}>
                      {item.title}
                    </Text>
                    <View
                      style={[
                        ProductDetailAnchorStyles.bar,
                        item.active
                          ? ProductDetailAnchorStyles.activeBar
                          : undefined,
                      ]}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        }}
      </AnchorConsumer>
    );
  }),
);

const ProductDetailAnchorStyles = createStyleSheet({
  container: {
    height: 42,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
  textWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    marginTop: 2,
    height: 3,
    backgroundColor: 'transparent',
    width: '80%',
  },
  activeBar: {
    backgroundColor: '#000',
  },
  text: {
    fontSize: 13,
    color: '#000',
    lineHeight: 13,
    fontWeight: '700',
  },
});
