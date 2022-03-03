import {useEffect, useReducer, useState} from 'react';
import axios from '../axiosConfig';
// import dataFetchReducer from '../redux/dataFetchReducer';

const useDataApi = () => {
  // const [url, setUrl] = useState(initailUrl);
  const [param, setParam] = useState(null);
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    isLoadComplete: false,
    data: null,
  });
  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      dispatch({type: 'fetchInit'});
      try {
        const result = await axios.post(param.url, param.data);
        console.log('aaa', result);
        if (!didCancel) {
          let list = result.data?.list || [];
          if (list.length < 10) {
            dispatch({type: 'fetchComplete'});
          }
          // let _data = param.data.page > 1 ? state.data.concat(list) : list;

          dispatch({type: 'fetchSuccess', payload: list});
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({type: 'fetchFailure'});
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [param]);
  return [state, setParam];
};
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'fetchInit': {
      return {
        ...state,
        isLoading: true,
        isError: false,
        isLoadComplete: false,
      };
    }
    case 'fetchSuccess': {
      return {
        ...state,
        isLoading: false,
        isError: false,
        isLoadComplete: false,
        data: action.payload,
      };
    }
    case 'fetchComplete': {
      return {
        ...state,
        isLoading: false,
        isError: false,
        isLoadComplete: true,
        data: action.payload,
      };
    }
    case 'fetchFailure': {
      return {
        ...state,
        isLoading: false,
        isLoadComplete: true,
        isError: true,
      };
    }
    default:
      return state;
  }
};
export default useDataApi;
