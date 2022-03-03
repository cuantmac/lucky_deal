import {CommonApi} from '@src/apis';
import {PAY_METHOD_ENUM} from '@src/constants/enum';
import {useLoading} from '@src/utils/hooks';
import {GlideImage} from '@src/widgets/glideImage';
import React, {FC, memo, useEffect, useState} from 'react';
import {Text} from 'react-native';
import {PayMethodItem as PayMethodItemType} from '@luckydeal/api-common';
import {
  PayModuleContainer,
  PayModuleContainerHeader,
} from '../payModuleContainer';
import {LoadingIndicator} from '@src/widgets/loadingIndicator';
import {createStyleSheet, styleAdapter} from '@src/helper/helper';
import {ItemSelect} from '../itemSelect';
import {Space} from '@src/widgets/space';

interface PayMethodProps {
  method: PAY_METHOD_ENUM;
  onChange?: (method: PAY_METHOD_ENUM) => void;
}

/**
 * 支付方式选择
 */
export const PayMethod: FC<PayMethodProps> = memo(({method, onChange}) => {
  const [loading, withLoading] = useLoading();
  const [pays, setPays] = useState<PayMethodItemType[]>();

  useEffect(() => {
    withLoading(CommonApi.payMethodUsingPOST({source: 1})).then((res) => {
      setPays(res.data.list);
    });
  }, [setPays, withLoading]);

  // 选择默认支付方式
  useEffect(() => {
    if (pays && pays.length) {
      const item = pays.find(({pay_type}) => pay_type === method);
      if (!item) {
        onChange && onChange(pays[0].pay_type);
      }
    }
  }, [pays, onChange, method]);

  return (
    <PayModuleContainer>
      <PayModuleContainerHeader title={'Payment Method'} />
      {loading ? (
        <LoadingIndicator style={styleAdapter({paddingVertical: 10})} />
      ) : (
        pays?.map((item, index) => {
          return (
            <PayMethodItem
              isLatest={pays.length - 1 === index}
              key={item.pay_type}
              data={item}
              active={method === item.pay_type}
              onPress={() => onChange && onChange(item.pay_type)}
            />
          );
        })
      )}
    </PayModuleContainer>
  );
});

interface PayMethodItemProps {
  onPress: (item: PayMethodItemType) => void;
  active: boolean;
  data: PayMethodItemType;
  isLatest?: boolean;
}

const PayMethodItem: FC<PayMethodItemProps> = ({
  onPress,
  active,
  data,
  isLatest,
}) => {
  return (
    <ItemSelect
      extraChildren={
        !isLatest && <Space height={1} backgroundColor="#e5e5e5" />
      }
      contentStyle={PayMethodStyles.itemContainer}
      checked={active}
      onChange={(bool) => bool && onPress && onPress(data)}>
      <GlideImage style={PayMethodStyles.icon} source={{uri: data.icon}} />
      <Text style={PayMethodStyles.text}>{data.name}</Text>
    </ItemSelect>
  );
};

const PayMethodStyles = createStyleSheet({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  icon: {
    width: 30,
    height: 30,
  },
  text: {
    color: '#222',
    fontSize: 12,
    marginLeft: 12,
  },
});
