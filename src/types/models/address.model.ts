export enum ADDRESS_STATUS {
  ERROR,
  SUCCESS,
}

// /user/new/address  新增地址
// /user/edit/address 编辑地址
export namespace Address {
  export interface RootObject {
    code: number;
    data: Data;
  }

  export interface Data {
    success: ADDRESS_STATUS;
    address_id: number;
  }
}

export namespace RegionList {
  export interface RootObject {
    code: number;
    data: Data;
  }

  export interface Data {
    list: List[];
  }

  export interface List {
    id: number;
    parent_id: number;
    name: string;
    level: number;
    short_name: string;
  }
}
