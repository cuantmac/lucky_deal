import {PolicyConfigItem} from '@luckydeal/api-common';
import {CommonApi} from '@src/apis';
import {PolicyRoute} from '@src/routes';
import {useLoading} from '@src/utils/hooks';
import {ListItem} from '@src/widgets/listItem';
import {useNavigationHeader} from '@src/widgets/navigationHeader';
import {PageStatusControl} from '@src/widgets/pageStatusControl';
import React, {FC, useEffect, useState} from 'react';
import {ScrollView} from 'react-native';

const AboutList: FC = () => {
  const [loading, withLoading] = useLoading();
  const [data, setData] = useState<PolicyConfigItem[]>();
  const PolicyRouter = PolicyRoute.useRouteLink();

  useNavigationHeader({
    title: 'About Gesleben',
  });

  useEffect(() => {
    withLoading(CommonApi.policyConfigListUsingPOST()).then((res) => {
      setData(res.data.list);
    });
  }, [withLoading]);

  return (
    <PageStatusControl hasData={!!data?.length} loading={loading} showEmpty>
      <ScrollView>
        {data?.map(({title, id}) => {
          return (
            <ListItem
              title={title}
              key={id}
              onPress={() =>
                PolicyRouter.navigate({
                  id,
                })
              }
            />
          );
        })}
      </ScrollView>
    </PageStatusControl>
  );
};

export default AboutList;
