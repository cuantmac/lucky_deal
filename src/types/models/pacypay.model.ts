export namespace PacyPay {
  export interface RootObject {
    code: number;
    data: Data;
  }

  export interface Data {
    pay_url: string;
    pay_info: PayInfo;
  }

  export interface PayInfo {
    merchantNo: string;
    subAccount: string;
    transactionId: string;
    amount: string;
    currency: string;
    sign: string;
    returnUrl: string;
    notifyUrl: string;
    consumerId: string;
    address: string;
    consigneeFirstName: string;
    consigneeLastName: string;
    consigneeAddress: string;
    firstName: string;
    lastName: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    email: string;
    phone: string;
    consigneeCity: string;
    consigneeState: string;
    consigneeCountry: string;
    consigneeZip: string;
    consigneeEmail: string;
    consigneePhone: string;
  }
}

export namespace PayPal {
  export interface RootObject {
    code: number;
    data: Data;
  }

  export interface Data {
    pay_url: string;
    pay_board_url: string;
    transaction_id: string;
  }
}

export namespace AisaBill {
  export interface RootObject {
    code: number;
    data: Data;
  }
  export interface Data {
    pay_info: PayInfo;
  }

  export interface PayInfo {
    merNo: string;
    gatewayNo: string;
    orderNo: string;
    orderCurrency: string;
    orderAmount: string;
    paymentMethod: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    state: string;
    city: string;
    address: string;
    callbackUrl: string;
    zip: string;
    isMobile: string;
    TokenPayType: string;
    CardType: string;
    signKey: string;
  }
}
