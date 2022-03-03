export const initialState = {
  tabIndex: 0,
  auctionDetail: {},
  mysteryDetail: {},
  oneDollarDetail: {},
  joinList: [],
  now: new Date().getTime() / 1000,
  boxData: {},
};

/**
 * @deprecated 已经过时将逐步移除
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case 'setTabIndex': {
      return {
        ...state,
        tabIndex: action.payload,
      };
    }
    case 'setJoinList': {
      return {
        ...state,
        joinList: action.payload || [],
      };
    }
    case 'getAuctionDetail': {
      return {
        ...state,
        auctionDetail: action.payload,
      };
    }
    case 'setMysteryDetail': {
      return {
        ...state,
        mysteryDetail: action.payload,
      };
    }

    case 'setOneDollarDetail': {
      return {
        ...state,
        oneDollarDetail: action.payload,
      };
    }
    case 'setBoxData': {
      return {
        ...state,
        boxData: action.payload,
      };
    }
    case 'updateTime': {
      return {
        ...state,
        now: action.payload,
      };
    }
    case 'setTime': {
      return {
        ...state,
        now: action.payload,
      };
    }

    default:
      return state;
  }
};
