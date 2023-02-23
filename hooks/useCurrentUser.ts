import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../lib/endpoint";

const useCurrentUser = () => {
  const { data, refetch } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  return { data, refetch };
};

export default useCurrentUser;
