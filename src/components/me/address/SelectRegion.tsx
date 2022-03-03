import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useLayoutEffect,
  useState,
} from 'react';
import {View, SectionList, SafeAreaView, ActivityIndicator} from 'react-native';
import Api from '../../../Api';
import {PRIMARY} from '../../../constants/colors';
import {px} from '../../../constants/constants';
import {RegionList} from '../../../types/models/address.model';
import {useFetching} from '../../../utils/hooks';
import {navigationRef} from '../../../utils/refs';
import Empty from '../../common/Empty';
import {AddressSearch, SectionListItem} from './AddressComponent';

let subscribe: (params: string) => void;

type SelectRegionParams = {
  title: string;
  region?: string;
};

type NavigationType = {
  SelectRegion: SelectRegionParams;
};

const SelectRegion: FC = () => {
  const navigation = useNavigation();
  const {params} = useRoute<RouteProp<NavigationType, 'SelectRegion'>>();
  const [loading, fetchFn, res] = useFetching<RegionList.RootObject>(
    Api.regionList,
  );
  const [search, setSearch] = useState<string>('');
  const data = (res?.data || {list: []}).list;

  useEffect(() => {
    fetchFn(params.region || '');
  }, [fetchFn, params.region]);

  // 配置header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: params.title,
    });
  }, [navigation, params]);

  // 生成sectionList所需要的数据
  const sectionData = useMemo(() => {
    const map: Record<string, string[]> = {};
    data
      .filter(({name}) => {
        return name.toUpperCase().includes(search.toUpperCase());
      })
      .forEach(({name}) => {
        const category = name[0].toUpperCase();
        if (map[category]) {
          map[category].push(name);
          return;
        }
        map[category] = [name];
      });
    return Object.keys(map).map((title) => {
      return {
        title,
        data: map[title].sort(),
      };
    });
  }, [data, search]);

  const handleSelect = useCallback((params: string) => {
    subscribe && subscribe(params);
  }, []);

  if (!res && loading) {
    return <ActivityIndicator color={PRIMARY} style={{flex: 1}} />;
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <AddressSearch
        value={search}
        onChange={setSearch}
        placeholder={'Search'}
      />
      <SectionList
        stickySectionHeadersEnabled
        keyboardShouldPersistTaps={'always'}
        style={{flex: 1}}
        sections={sectionData}
        ItemSeparatorComponent={() => (
          <View style={{height: 1, backgroundColor: '#D8D8D8'}} />
        )}
        keyExtractor={(item, index) => item + index}
        renderItem={({item}) => (
          <SectionListItem
            style={{
              height: 120 * px,
              backgroundColor: 'white',
              paddingLeft: 30 * px,
            }}
            textStyle={{fontSize: 40 * px}}
            title={item}
            onPress={handleSelect}
          />
        )}
        renderSectionHeader={({section: {title}}) => (
          <SectionListItem
            style={{
              height: 80 * px,
              backgroundColor: '#D3D3D3',
              paddingLeft: 30 * px,
            }}
            title={title}
          />
        )}
        ListEmptyComponent={<Empty title="Empty" />}
      />
    </SafeAreaView>
  );
};

export const selectRegion = (navigationParams: SelectRegionParams) => {
  navigationRef.current.navigate('SelectRegion', navigationParams);
  return new Promise<string>((resolve) => {
    subscribe = (params: string) => {
      resolve(params);
      navigationRef.current.goBack();
    };
  });
};

export default SelectRegion;
