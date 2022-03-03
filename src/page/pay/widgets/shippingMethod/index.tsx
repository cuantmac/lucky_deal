import {ProductLogistics} from '@luckydeal/api-common';
import {
  convertAmountUS,
  createStyleSheet,
  styleAdapter,
} from '@src/helper/helper';
import {Space} from '@src/widgets/space';
import React, {FC, memo, useCallback} from 'react';
import {Text} from 'react-native';
import {ItemSelect} from '../itemSelect';
import {
  PayModuleContainer,
  PayModuleContainerHeader,
} from '../payModuleContainer';

interface ShippingMethodProps {
  onChange?: (channleId: number) => void;
  logisticsChannel?: ProductLogistics[];
}

/**
 * 物流方式选择
 */
export const ShippingMethod: FC<ShippingMethodProps> = memo(
  ({onChange, logisticsChannel}) => {
    const handlePress = useCallback(
      (item: ProductLogistics) => {
        onChange && onChange(item.id);
      },
      [onChange],
    );

    if (!logisticsChannel) {
      return null;
    }

    return (
      <PayModuleContainer>
        <PayModuleContainerHeader title={'Shipping Method'} />
        {!!logisticsChannel.length &&
          logisticsChannel.map((item, i) => {
            return (
              <ShippingMethodItem
                islatest={i === logisticsChannel.length - 1}
                key={item.id + item.send_type + i}
                data={item}
                onPress={handlePress}
              />
            );
          })}
      </PayModuleContainer>
    );
  },
);

interface ShippingMethodItemProps {
  islatest?: boolean;
  onPress: (item: ProductLogistics) => void;
  data: ProductLogistics;
}

const ShippingMethodItem: FC<ShippingMethodItemProps> = ({
  onPress,
  data,
  islatest,
}) => {
  const active = data.is_select === 1;
  return (
    <ItemSelect
      contentStyle={ShippingMethodStyles.itemContainer}
      checked={active}
      onChange={(bool) => bool && onPress && onPress(data)}
      extraChildren={
        <>
          <Text style={ShippingMethodStyles.extraText}>
            Estimated to preparing time {data.preparing_time} days
          </Text>
          <Text
            style={[
              ShippingMethodStyles.extraText,
              styleAdapter({marginBottom: 12}),
            ]}>
            Estimated to be delivered within {data.send_time} days
          </Text>
          {!islatest && <Space height={1} backgroundColor="#e5e5e5" />}
        </>
      }>
      <Text
        style={[
          ShippingMethodStyles.titleText,
          {
            color:
              data.en_title === 'FREE SHIPPING DISCOUNT' ? '#E11616' : '#222',
          },
        ]}>
        {data.en_title}
      </Text>
      <Text style={ShippingMethodStyles.priceText}>
        {convertAmountUS(data.price)}
      </Text>
    </ItemSelect>
  );
};

const ShippingMethodStyles = createStyleSheet({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  titleText: {
    fontSize: 12,
    color: '#222',
    fontWeight: '700',
  },
  priceText: {
    color: '#222',
    fontSize: 12,
  },
  extraText: {
    color: '#222',
    fontSize: 12,
    lineHeight: 14,
  },
});
