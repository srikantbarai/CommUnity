import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../lib/api";

const useGetMyInfo = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    retry: false
  });

  const isUnauthenticated = error?.response?.status === 401;

  return {
    myInfo: isUnauthenticated ? null : data?.data,
    isLoading,
    error,
  };
};

export default useGetMyInfo;
