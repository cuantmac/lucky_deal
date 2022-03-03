import {PolicyConfigDetailResponse} from '@luckydeal/api-common';
import {CommonApi} from '@src/apis';
import {styleAdapter} from '@src/helper/helper';
import {useNavigationParams} from '@src/hooks/useNavigationParams';
import {PolicyRouteParams} from '@src/routes';
import {useLoading} from '@src/utils/hooks';
import {useNavigationHeader} from '@src/widgets/navigationHeader';
import {HtmlRender} from '@src/widgets/htmlRender';
import {PageStatusControl} from '@src/widgets/pageStatusControl';
import React, {FC, useEffect, useState} from 'react';
import {ScrollView} from 'react-native';

const Policy: FC = () => {
  const [content, setContent] = useState<PolicyConfigDetailResponse>();
  const [loading, withLoading] = useLoading();
  const {id} = useNavigationParams<PolicyRouteParams>();

  useEffect(() => {
    withLoading(
      CommonApi.policyConfigDetailUsingPOST({
        id: +id,
      }),
    ).then((res) => {
      setContent(res.data);
    });
  }, [id, withLoading]);

  useNavigationHeader({
    title: content?.title,
  });

  return (
    <ScrollView>
      <PageStatusControl hasData={!!content} loading={loading}>
        {content && (
          <HtmlRender
            style={styleAdapter({paddingHorizontal: 16})}
            html={content.content}
          />
        )}
      </PageStatusControl>
    </ScrollView>
  );
};

export default Policy;
