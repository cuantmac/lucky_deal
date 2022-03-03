import {useRoute} from '@react-navigation/native';

export const useNavigationParams = <T,>() => {
  const {params = {}} = useRoute();
  return (params as unknown) as ValueString<T>;
};
