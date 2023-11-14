import { useRouter } from "next/router";
import { useMemo } from "react";

const useComputeBookableSharableLink = (id: string) => {
  const router = useRouter();

  const link = useMemo(() => {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "";
    return `${origin}/book/${id}`;
  }, [id]);
  return { link };
};

export default useComputeBookableSharableLink;
