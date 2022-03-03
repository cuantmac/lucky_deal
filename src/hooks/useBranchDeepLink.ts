import {branchAppShow, branchMarketPath} from './../analysis/report';
import {APP_PAGE_TYPE_NUM} from './../constants/enum';
import {useEffect} from 'react';
import branch from 'react-native-branch';
import {ProductRoute} from '@src/routes';

interface Params {
  marketId?: string;
  productType?: string;
  productId?: string;
  page: string;
}

export function useBranchDeepLink() {
  const ProductRouter = ProductRoute.useRouteLink();
  useEffect(() => {
    const unSubscribe = branch.subscribe(
      ({error, params}: {error: Error; params: Params; uri: string}) => {
        if (error) {
          return;
        }
        const reportData = branchMarketPath.setData({
          H5PageID: params.marketId,
          H5ProductID: params.productId,
        });
        reportData?.H5PageID &&
          branchAppShow.setDataAndReport({
            H5PageID: reportData?.H5PageID,
            H5ProductID: reportData?.H5ProductID,
          });
        switch (params.page) {
          case APP_PAGE_TYPE_NUM.ONE_DOLLAR_PRODUCT:
            if (params.productId && params.productType) {
              ProductRouter.navigate({
                productId: parseInt(params.productId, 10),
              });
            }
            break;
        }
      },
    );
    return () => {
      unSubscribe();
    };
  });
}
