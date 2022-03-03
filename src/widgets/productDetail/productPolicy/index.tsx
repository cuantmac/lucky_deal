import {PolicyConfigItem} from '@luckydeal/api-common';
import {CommonApi} from '@src/apis';
import {createStyleSheet} from '@src/helper/helper';
import {PolicyRoute} from '@src/routes';
import {GlideImage} from '@src/widgets/glideImage';
import React, {FC, memo, useEffect} from 'react';
import {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {ProductDetailModule} from '../widgets';

let policyList: PolicyConfigItem[] = [];

export const ProductPolicy: FC = memo(() => {
  const [list, setList] = useState<PolicyConfigItem[]>(policyList);
  const PolicyRouter = PolicyRoute.useRouteLink();
  useEffect(() => {
    !list.length &&
      CommonApi.policyConfigListUsingPOST().then((res) => {
        setList(res.data.list || []);
        policyList = res.data.list || [];
      });
  }, [list.length]);

  if (!list.length) {
    return null;
  }

  return (
    <ProductDetailModule style={ProductPolicyStyles.container}>
      <View style={ProductPolicyStyles.headerContainer}>
        <Text style={ProductPolicyStyles.headerText}>About Gesleben</Text>
      </View>
      {list.map(({title, id}) => {
        return (
          <PolicyItem
            title={title}
            key={id}
            onPress={() => PolicyRouter.navigate({id})}
          />
        );
      })}
    </ProductDetailModule>
  );
});

interface PolicyItemProps {
  title: string;
  onPress?: () => void;
}

const PolicyItem: FC<PolicyItemProps> = ({title, onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={ProductPolicyStyles.itemContainer}
      onPress={onPress}>
      <Text style={ProductPolicyStyles.itemTitle}>{title}</Text>
      <GlideImage
        style={ProductPolicyStyles.arrowImg}
        source={require('@src/assets/me_arrow.png')}
      />
    </TouchableOpacity>
  );
};

const ProductPolicyStyles = createStyleSheet({
  container: {
    backgroundColor: 'transparent',
    paddingBottom: 40,
    paddingTop: 20,
  },
  headerContainer: {
    height: 40,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },
  itemTitle: {
    fontSize: 12,
    color: '#222',
  },
  arrowImg: {
    width: 10,
    height: 10,
  },
});
