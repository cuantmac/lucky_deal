import {PolicyConfigListResponse} from '@luckydeal/api-common';
import {useNavigation} from '@react-navigation/native';
import React, {FC, useEffect, useLayoutEffect} from 'react';
import {Image} from 'react-native';
import {
  Text,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Api from '../../../Api';
import {PRIMARY} from '../../../constants/colors';
import {px} from '../../../constants/constants';
import {useFetching} from '../../../utils/hooks';
import Empty from '../../common/Empty';

const About: FC = () => {
  const [loading, fetchFn, data] = useFetching<
    ResponseData<PolicyConfigListResponse>
  >(Api.policyConfigList, undefined, true);
  const navigation = useNavigation<any>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: 'About Lucky Deal',
    });
  }, [navigation]);

  useEffect(() => {
    fetchFn();
  }, [fetchFn]);

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
    <>
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor={'white'}
      />
      <ScrollView>
        {data?.data?.list.map(({title, id}) => {
          return (
            <AboutItem
              key={id}
              onPress={() => {
                navigation.navigate('AboutDetail', {id});
              }}
              title={title}
            />
          );
        })}
      </ScrollView>
    </>
  );
};

interface AboutItemProps {
  onPress: () => void;
  title: string;
}

const AboutItem: FC<AboutItemProps> = ({title, onPress}) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        height: 124 * px,
        backgroundColor: 'white',
        paddingHorizontal: 28 * px,
        alignItems: 'center',
      }}
      activeOpacity={0.8}
      onPress={onPress}>
      <Text>{title}</Text>
      <Image
        style={{marginLeft: 'auto', width: 18 * px, height: 32 * px}}
        source={require('../../../assets/me/me_arrow_icon.png')}
      />
    </TouchableOpacity>
  );
};

export default About;
