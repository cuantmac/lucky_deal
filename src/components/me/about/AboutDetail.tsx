import {PolicyConfigDetailResponse} from '@luckydeal/api-common';
import {useNavigation, useRoute} from '@react-navigation/native';
import {styleAdapter} from '@src/helper/helper';
import {HtmlRender} from '@src/widgets/htmlRender';
import React, {FC, useEffect, useLayoutEffect} from 'react';
import {ActivityIndicator, ScrollView} from 'react-native';
import Api from '../../../Api';
import {PRIMARY} from '../../../constants/colors';
import {useFetching} from '../../../utils/hooks';
import Empty from '../../common/Empty';

const AboutDetail: FC = () => {
  const navigation = useNavigation<any>();
  const {
    params: {id},
  } = useRoute<any>();
  const [loading, fetchFn, data] = useFetching<
    ResponseData<PolicyConfigDetailResponse>
  >(Api.policyConfigDetail, undefined, true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: data?.data.title,
    });
  }, [data, navigation]);

  useEffect(() => {
    fetchFn(id);
  }, [fetchFn, id]);

  if (loading) {
    return <ActivityIndicator color={PRIMARY} style={{flex: 1}} />;
  }

  if (!loading && !data) {
    return (
      <Empty
        image={require('../../../assets/empty.png')}
        title={'Nothing at all'}
      />
    );
  }

  return (
    <ScrollView>
      <HtmlRender
        style={styleAdapter({paddingHorizontal: 16})}
        html={data?.data.content}
      />
    </ScrollView>
  );
};

export default AboutDetail;
