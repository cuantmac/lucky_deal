import {Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useCallback} from 'react';
import {createStyleSheet, px2dp} from '@src/helper/helper';
import {CategoryTopItem} from '@luckydeal/api-common/lib/api';
interface SidebarProps {
  data: CategoryTopItem[];
  active?: CategoryTopItem;
  onPress: (item: CategoryTopItem) => void;
}

const Sidebar: React.FC<SidebarProps> = ({data, active, onPress}) => {
  const handlePress = useCallback(
    (val: CategoryTopItem) => {
      onPress(val);
    },
    [onPress],
  );
  return (
    <ScrollView
      style={SidebarStyles.container}
      showsVerticalScrollIndicator={false}>
      {data?.map((item) => (
        <TouchableOpacity
          style={[
            SidebarStyles.item,
            active?.top_item_id === item.top_item_id
              ? SidebarStyles.active
              : null,
          ]}
          key={item.top_item_id}
          activeOpacity={0.8}
          onPress={() => handlePress(item)}>
          <Text
            style={{
              textAlign: 'center',
              fontWeight:
                active?.top_item_id === item.top_item_id ? 'bold' : '400',
            }}>
            {item.top_item_name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const SidebarStyles = createStyleSheet({
  container: {
    width: 100,
    backgroundColor: '#f6f6f6',
    flexGrow: 0,
  },
  item: {
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: px2dp(10),
  },
  active: {
    backgroundColor: '#fff',
    fontWeight: 'bold',
  },
});

export default Sidebar;
