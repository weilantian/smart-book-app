import { useRouter } from "next/router";
import { FC, useEffect } from "react";
import {
  startNavigationProgress,
  completeNavigationProgress,
  NavigationProgress,
} from "@mantine/nprogress";
import { useAtom } from "jotai";
import bookableMachineAtom from "@/store/bookableMachineStore";

const RouterTransition: FC = () => {
  const [state, send] = useAtom(bookableMachineAtom);
  const router = useRouter();

  useEffect(() => {
    const handleStart = (url: string) =>
      url !== router.asPath && startNavigationProgress();
    const handleComplete = () => completeNavigationProgress();

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    if (router.asPath === "/") {
      send("NAVIGATE_TO_HOME");
    } else if (
      router.asPath === "/bookable/create" ||
      router.asPath === "/bookable/edit/[id]"
    ) {
      send("CREATE_BOOKABLE");
    }

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router.asPath, router.events, send]);
  return <NavigationProgress />;
};

export default RouterTransition;
