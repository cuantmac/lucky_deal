import AppModule from '../../AppModule';
import branch, {BranchEvent} from 'react-native-branch';

export enum REPORT_TYPE {
  CLICK,
  SHOW,
  CLOSE,
  GENERAL,
}

type ReportDataExtends = Record<string, any>;
type ReportPool = Record<string, Path<any>>;
type BranchReporterReturn<T> = {
  setDataAndReport: (data?: Partial<T>) => void;
};

export class Analysis {
  createShowReporterWithPath<T extends ReportDataExtends>(
    pageNo: string,
    eventNo: string,
    path: Path<T>,
    keys: Array<keyof T>,
  ) {
    return this.createReporter<T>(
      REPORT_TYPE.SHOW,
      pageNo,
      eventNo,
      path,
      keys,
    );
  }

  createClickReporterWithPath<T extends ReportDataExtends>(
    pageNo: string,
    eventNo: string,
    path: Path<T>,
    keys: Array<keyof T>,
  ) {
    return this.createReporter<T>(
      REPORT_TYPE.CLICK,
      pageNo,
      eventNo,
      path,
      keys,
    );
  }

  createCloseReporterWithPath<T extends ReportDataExtends>(
    pageNo: string,
    eventNo: string,
    path: Path<T>,
    keys: Array<keyof T>,
  ) {
    return this.createReporter<T>(
      REPORT_TYPE.CLOSE,
      pageNo,
      eventNo,
      path,
      keys,
    );
  }

  createGeneralReporterWithPath<T extends ReportDataExtends>(
    pageNo: string,
    eventNo: string,
    path: Path<T>,
    keys: Array<keyof T>,
  ) {
    return this.createReporter<T>(
      REPORT_TYPE.GENERAL,
      pageNo,
      eventNo,
      path,
      keys,
    );
  }

  createShowReporter<T extends ReportDataExtends>(
    pageNo: string,
    eventNo: string,
  ): Reporter<T> {
    return this.createReporter<T>(REPORT_TYPE.SHOW, pageNo, eventNo);
  }

  createClickReporter<T extends ReportDataExtends>(
    pageNo: string,
    eventNo: string,
  ): Reporter<T> {
    return this.createReporter<T>(REPORT_TYPE.CLICK, pageNo, eventNo);
  }

  createCloseReporter<T extends ReportDataExtends>(
    pageNo: string,
    eventNo: string,
  ): Reporter<T> {
    return this.createReporter<T>(REPORT_TYPE.CLOSE, pageNo, eventNo);
  }

  createGeneralReporter<T extends ReportDataExtends>(
    pageNo: string,
    eventNo: string,
  ): Reporter<T> {
    return this.createReporter<T>(REPORT_TYPE.GENERAL, pageNo, eventNo);
  }

  createPath<T extends ReportDataExtends>() {
    const path = new Path<T>();
    return path;
  }

  createBranchRepoter<
    T extends Record<string, any> = {},
    S extends Record<string, any>[] = Record<string, any>[]
  >(event: string): BranchReporterReturn<T> {
    return {setDataAndReport: branchReport<T, S>(event)};
  }

  private createReporter<T>(
    type: REPORT_TYPE,
    pageNo: string,
    eventNo: string,
    path?: Path<T>,
    keys?: Array<keyof T>,
  ): Reporter<T> {
    const reporter = new Reporter<T>(type, pageNo, eventNo, path, keys);
    return reporter;
  }
}

type ReportData<T> = Partial<T>;

class Path<T extends ReportDataExtends> {
  protected data: ReportData<T> = {};

  setData(params?: Partial<T>): ReportData<T> {
    this.data = params || {};
    return this.data;
  }

  getData(): ReportData<T> {
    return this.data;
  }

  clear(): void {
    this.data = {};
  }

  mergeData(params: Partial<T>): ReportData<T> {
    if (this.data) {
      this.data = {...this.data, ...params};
    } else {
      this.data = params;
    }
    return this.data;
  }
}

export class Reporter<T extends ReportDataExtends> extends Path<T> {
  private type: REPORT_TYPE;
  private path?: Path<T>;
  private keys?: Array<keyof T>;
  private pageNo: string;
  private eventNo: string;
  constructor(
    type: REPORT_TYPE,
    pageNo: string,
    eventNo: string,
    path?: Path<T>,
    keys?: Array<keyof T>,
  ) {
    super();
    this.type = type;
    this.pageNo = pageNo;
    this.eventNo = eventNo;
    this.path = path;
    this.keys = keys;
  }

  private report(): void {
    this.log();
    switch (this.type) {
      case REPORT_TYPE.CLICK:
        AppModule.reportClick(this.pageNo, this.eventNo, this.data);
        break;
      case REPORT_TYPE.SHOW:
        AppModule.reportShow(this.pageNo, this.eventNo, this.data);
        break;
      case REPORT_TYPE.CLOSE:
        AppModule.reportClose(this.pageNo, this.eventNo, this.data);
        break;
      case REPORT_TYPE.GENERAL:
        AppModule.reportGeneral(this.pageNo, this.eventNo, this.data);
        break;
    }
  }

  // 已绑定path
  pathReporter() {
    if (!this.path) {
      throw new Error(
        "please bind the reporter with path, link analysis.createShowReporterWithPath<PayPathParams>('5', '269', payPath, ['OrderId']);",
      );
    }
    if (!this.keys) {
      this.report();
      return;
    }
    const data: Partial<T> = {};
    const pathData = this.path.getData();
    for (const key of this.keys) {
      data[key] = pathData[key];
    }
    this.setData(data);
    this.report();
  }

  setDataAndReport(params?: Partial<T>): ReportData<T> {
    this.setData(params);
    this.report();
    return this.data;
  }

  private log() {
    switch (this.type) {
      case REPORT_TYPE.CLICK:
        rlog('REPORT_CLICK', this.pageNo, this.eventNo, this.data);
        break;
      case REPORT_TYPE.SHOW:
        rlog('REPORT_SHOW', this.pageNo, this.eventNo, this.data);
        break;
      case REPORT_TYPE.CLOSE:
        rlog('REPORT_CLOSE', this.pageNo, this.eventNo, this.data);
        break;
      case REPORT_TYPE.GENERAL:
        rlog('REPORT_GENERAL', this.pageNo, this.eventNo, this.data);
        break;
    }
  }
}

/**
 * branch 上报事件
 *
 * @param event 事件类型
 * @param pageNo 模块编号
 * @param eventNo 事件编号
 */
function branchReport<
  T extends Record<string, any>,
  S extends Record<string, any>[]
>(event: string) {
  return async (item?: Partial<T>, contentItem?: S) => {
    const data = filterEmpty(item);
    let branchUniversalObject = await branch.createBranchUniversalObject(
      'canonicalIdentifier',
      {
        locallyIndex: true,
      },
    );
    if (event === BranchEvent.Purchase) {
      new BranchEvent(
        event,
        branchUniversalObject,
        data,
        contentItem,
      ).logEvent();
      return;
    }
    new BranchEvent(
      event,
      branchUniversalObject,
      {
        customData: {...data},
      },
      contentItem,
    ).logEvent();
  };
}

function filterEmpty(obj: Record<string, any> | undefined) {
  let o: Record<string, any> = {};
  if (!obj) {
    return o;
  }
  Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      o[key] = obj[key];
    }
  });
  return o;
}

export const analysis = new Analysis();
