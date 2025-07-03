import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../lib/api";

const useGetMyInfo = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    retry: false
  });

  const isUnauthorized = error?.response?.status === 401;

  return {
    isLoading,
    myInfo: isUnauthorized ? null : data,
    error,
  };
};

export default useGetMyInfo;
