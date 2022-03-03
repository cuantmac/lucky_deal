import {useNavigation} from '@react-navigation/native';
import {compilePath, isWeb, urlAddQuery} from '@src/helper/helper';
import {FC, useCallback, useMemo} from 'react';
import {AccessibilityRole, Platform} from 'react-native';

export type ParamsType = Record<
  string,
  string | boolean | number | null | undefined
>;

function prefix() {
  if (Platform.OS !== 'web') {
    return '';
  }
  if (window.__POWERED_BY_QIANKUN__) {
    return '/main';
  }
  return '/child/main';
}

/**
 * 创建顶级路径
 */
export const createPath = (p: string) => {
  return prefix() + p;
};

type Options = {
  isTab?: boolean;
};

// 创建app内部路由
export const createRoute = <T extends ParamsType | void = void>(
  name: string,
  path: string,
  component: FC,
  options?: Options,
) => {
  return {
    name,
    path,
    component,
    useRouteLink: () => {
      return useRouteLink<T>(name, path, options);
    },
  };
};

function useRouteLink<T extends ParamsType | void>(
  name: string,
  path: string,
  options?: Options,
) {
  const navigation = useNavigation();
  const buldHref = useCallback(
    (params: T) => {
      const compiler = compilePath(path, params || {});
      return urlAddQuery(compiler.path, compiler.params);
    },
    [path],
  );
  return useMemo(
    () => ({
      navigate: (params: T) => {
        if (options?.isTab && !routeInStack(navigation)) {
          (navigation as any).navigate('Main', {
            screen: name,
            params,
          });
        } else {
          (navigation as any).navigate(name, (params as unknown) as object);
        }
      },
      replace: (params: T) => {
        if (options?.isTab && !routeInStack(navigation)) {
          (navigation as any).replace('Main', {
            screen: name,
            params,
          });
        } else {
          (navigation as any).replace(name, (params as unknown) as object);
        }
      },
      push: (params: T) => {
        if (options?.isTab && !routeInStack(navigation)) {
          (navigation as any).push('Main', {
            screen: name,
            params,
          });
        } else {
          (navigation as any).push(name, (params as unknown) as object);
        }
      },
      builder: (params: T) => {
        return {
          href: buldHref(params),
          accessibilityRole: 'link' as AccessibilityRole,
        };
      },
    }),
    [buldHref, name, navigation, options],
  );
}

export type CreateExtraRouteOriginType = <T extends ParamsType | void = void>(
  origin: string,
) => {
  path: string;
  useExtraRouteLink: () => {
    navigate: (params: T) => void;
    replace: (params: T) => void;
    builder: (
      params: T,
    ) => {
      href: string;
      accessibilityRole: AccessibilityRole;
    };
  };
};

export type CreateExtraRouteType<T extends ParamsType | void = void> = (
  origin: string,
  path: string,
) => {
  path: string;
  useExtraRouteLink: () => {
    navigate: (params: T) => void;
    replace: (params: T) => void;
    builder: (
      params: T,
    ) => {
      href: string;
      accessibilityRole: AccessibilityRole;
    };
  };
};

// 创建项目外链接
export const createExtraRoute = <T extends ParamsType | void = void>(
  origin: string,
  path: string,
) => {
  return {
    path,
    useExtraRouteLink: () => {
      return useExtraRouteLink<T>(path, origin);
    },
  };
};

function useExtraRouteLink<T extends ParamsType | void>(
  path: string,
  origin: string,
) {
  const buldHref = (params: T) => {
    const compiler = compilePath(path, params || {});
    const href = urlAddQuery(compiler.path, compiler.params);
    return window.__POWERED_BY_QIANKUN__ ? href : origin + href;
  };
  return {
    navigate: (params: T) => {
      const href = buldHref(params);
      if (window.__POWERED_BY_QIANKUN__) {
        window.history.pushState(null, '', href);
      } else {
        window.location.href = href;
      }
    },
    replace: (params: T) => {
      const href = buldHref(params);
      if (window.__POWERED_BY_QIANKUN__) {
        window.history.replaceState(null, '', href);
      } else {
        window.location.replace(href);
      }
    },
    builder: (params: T) => {
      return {
        href: buldHref(params),
        accessibilityRole: 'link' as AccessibilityRole,
      };
    },
  };
}

// 创建项目外和项目内跳转的代理
// 会根据所在环境自动选择跳转项目内还是项目外
export const createExtraProxyRoute = <
  T extends object | void = void,
  E extends ParamsType | void = void
>(
  name: string,
  extraRoute: ReturnType<CreateExtraRouteType<E>>,
) => {
  return {
    useExtraProxyRouteLink: () => {
      const extraRouter = extraRoute.useExtraRouteLink();
      const navigation = useNavigation();
      return {
        navigate: (params: T, extraParams: E) => {
          if (isWeb()) {
            extraRouter.navigate(extraParams);
          } else {
            navigation.navigate(name, params as object);
          }
        },
        push: (params: T, extraParams: E) => {
          if (isWeb()) {
            extraRouter.navigate(extraParams);
          } else {
            (navigation as any).push(name, params as object);
          }
        },
        replace: (params: T, extraParams: E) => {
          if (isWeb()) {
            extraRouter.replace(extraParams);
          } else {
            (navigation as any).replace(name, (params as unknown) as object);
          }
        },
      };
    },
  };
};

const routeInStack = (navigarion: any, name: string = 'Main') => {
  const routeStack = navigarion.dangerouslyGetState();
  const routes = routeStack.routes;
  rlog(routes);
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].name === name) {
      return true;
    }
  }
  return false;
};
