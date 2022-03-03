import {CategoryTwoItem} from '@luckydeal/api-common';
import {createStyleSheet} from '@src/helper/helper';
import React, {FC, useRef, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';

interface SecondCategoryNavProps {
  data: CategoryTwoItem[];
  onChange?: (val: CategoryTwoItem) => void;
  active?: CategoryTwoItem;
}

export const SecondCategoryNav: FC<SecondCategoryNavProps> = ({
  onChange,
  data,
  active,
}) => {
  const flatListRef = useRef<FlatList>(null);
  useEffect(() => {
    if (active) {
      flatListRef.current?.scrollToItem({item: active});
    }
  }, [active]);
  return (
    <View style={SecondCategoryNavStyles.container}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        ref={flatListRef}
        horizontal
        keyExtractor={(item) => item.two_item_id + ''}
        data={data}
        renderItem={({item}) => {
          return <NavItem data={item} active={active} onPress={onChange} />;
        }}
      />
    </View>
  );
};

interface NavItemProps {
  data: CategoryTwoItem;
  active?: CategoryTwoItem;
  onPress?: (val: CategoryTwoItem) => void;
}
const NavItem: FC<NavItemProps> = ({data, active, onPress}) => {
  const actived = data.two_item_id === active?.two_item_id;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        actived || (onPress && onPress(data));
      }}
      style={SecondCategoryNavStyles.navItemContainer}>
      <Text
        style={[
          SecondCategoryNavStyles.navText,
          {fontWeight: actived ? '700' : '400'},
        ]}>
        {data.two_item_name}
      </Text>
      {actived && <View style={SecondCategoryNavStyles.indicator} />}
    </TouchableOpacity>
  );
};

const SecondCategoryNavStyles = createStyleSheet({
  container: {
    height: 52,
  },
  navItemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    minWidth: 100,
  },
  navText: {
    fontSize: 12,
    color: '#222',
  },
  indicator: {
    width: 30,
    height: 4,
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 10,
    borderRadius: 2,
  },
});
