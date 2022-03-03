import {isWeb} from '@src/helper/helper';
import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';

export type FormConfig = {
  // 是否替换当前的路由
  replace?: boolean;
  // 新页面的打开方式 参考form的taeget
  target?: string;
};

export interface SubmitFormRef {
  submit: (
    url: string,
    params: Record<string, string>,
    config?: FormConfig,
  ) => void;
}

export const SubmitForm = forwardRef<SubmitFormRef>((props, ref) => {
  const [data, setData] = useState<
    {url: string; params: Record<string, string>} & FormConfig
  >();
  const formRef = useRef<HTMLFormElement>(null);

  useImperativeHandle(
    ref,
    () => {
      return {
        submit: (
          url: string,
          params: Record<string, string>,
          {replace = false, ...config}: FormConfig = {},
        ) => {
          if (!isWeb()) {
            return;
          }
          setTimeout(() => {
            setData({
              url,
              params,
              ...config,
            });
            if (replace) {
              window.history.go(-1);
            }
            formRef.current?.submit();
          });
        },
      };
    },
    [setData],
  );

  if (!isWeb()) {
    return null;
  }

  return (
    <form ref={formRef} action={data?.url} method="POST" target={data?.target}>
      {data?.params &&
        Object.keys(data.params).map((name) => {
          return (
            <input
              key={name}
              type="hidden"
              name={name}
              value={data.params[name]}
            />
          );
        })}
    </form>
  );
});
