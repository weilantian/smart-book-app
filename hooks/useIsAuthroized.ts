import { useEffect, useState } from "react";

const useIsAuthorized = () => {
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(
    () =>
      setIsAuthorized(localStorage.getItem("smart_book_token") ? true : false),
    []
  );

  return { isAuthorized };
};

export default useIsAuthorized;
