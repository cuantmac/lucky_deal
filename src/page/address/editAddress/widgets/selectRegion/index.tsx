import React, {
  useCallback,
  useMemo,
  useState,
  forwardRef,
  useRef,
  useImperativeHandle,
} from 'react';
import {SectionList} from 'react-native';
import {Empty} from '@src/widgets/empty';
import {RegionItem} from '@luckydeal/api-common';
import {CommonApi} from '@src/apis';
import {Message} from '@src/helper/message';
import {useActionSheet} from '@src/widgets/modal/modal';
import {unstable_batchedUpdates} from 'react-dom';
import {createStyleSheet} from '@src/helper/helper';
import {CustomHeader} from '@src/widgets/navigationHeader/customHeader';
import {AddressSearch, SectionListItem} from './widgets';
import {Space} from '@src/widgets/space';

type SelectRegionParams = {
  title: string;
  region?: string;
};

export interface SelectRegionModalRef {
  getRegion: (params: SelectRegionParams) => Promise<string>;
}

export const SelectRegionModal = forwardRef<SelectRegionModalRef>(
  (props, ref) => {
    const [ActionSheetModal, setActionSheetModalVisible] = useActionSheet();
    const regionCache = useRef<Record<string, RegionItem[]>>({});
    const resolveRef = useRef<(value: string) => void>();
    const [data, setData] = useState<RegionItem[]>([]);
    const [search, setSearch] = useState<string>('');
    const [regionParams, setRegionParams] = useState<SelectRegionParams>();

    const getRegionList = useCallback(async (regionName?: string) => {
      const region = regionName || '_';
      const regionData = regionCache.current[region];
      if (regionData) {
        return regionData;
      }
      const res = await CommonApi.regionListUsingPOST({
        region_name: regionName,
      });
      regionCache.current[region] = res.data?.list || [];
      return regionCache.current[region];
    }, []);

    useImperativeHandle(
      ref,
      () => {
        return {
          getRegion: (params) => {
            return new Promise(async (resolve) => {
              try {
                Message.loading();
                const regionData = await getRegionList(params.region);
                resolveRef.current = resolve;
                Message.hide();
                unstable_batchedUpdates(() => {
                  setRegionParams(params);
                  setData(regionData);
                  setActionSheetModalVisible(true);
                });
              } catch (error) {
                Message.toast(error);
              }
            });
          },
        };
      },
      [getRegionList, setActionSheetModalVisible],
    );

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

    const handleSelect = useCallback(
      (val: string) => {
        resolveRef.current && resolveRef.current(val);
        setActionSheetModalVisible(false);
      },
      [setActionSheetModalVisible],
    );

    return (
      <ActionSheetModal
        useDefaultTemplate={false}
        maskClosable
        modalStyle={SelectRegionModalStyles.container}>
        <CustomHeader
          title={regionParams?.title}
          backOnPress={() => {
            setActionSheetModalVisible(false);
          }}
        />
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
            <Space height={1} backgroundColor={'#D8D8D8'} />
          )}
          keyExtractor={(item, index) => item + index}
          renderItem={({item}) => (
            <SectionListItem
              style={SelectRegionModalStyles.itemContainer}
              textStyle={SelectRegionModalStyles.itemText}
              title={item}
              onPress={handleSelect}
            />
          )}
          renderSectionHeader={({section: {title}}) => (
            <SectionListItem
              style={SelectRegionModalStyles.headerContainer}
              title={title}
            />
          )}
          ListEmptyComponent={<Empty title="Empty" />}
        />
      </ActionSheetModal>
    );
  },
);

const SelectRegionModalStyles = createStyleSheet({
  container: {
    backgroundColor: 'white',
    justifyContent: 'flex-start',
  },
  headerContainer: {
    height: 28,
    backgroundColor: '#D3D3D3',
  },
  itemContainer: {
    height: 40,
    backgroundColor: 'white',
  },
  itemText: {
    fontSize: 14,
  },
});
