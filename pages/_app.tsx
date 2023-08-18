import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import Layout from "../components/Layout";
import { NextPage } from "next";
import { ReactElement, ReactNode, useEffect } from "react";
import RouterTransition from "../components/RouterTransition";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ModalsProvider } from "@mantine/modals";
import { LocaleProvider } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { inspect } from "@xstate/inspect";
import { Provider } from "jotai";

dayjs.extend(LocalizedFormat);

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const [queryClient] = useState(() => new QueryClient());
  useEffect(() => {
    const body = document.body;
    body.setAttribute("theme-mode", "dark");
  }, []);

  return (
    <>
      <Head>
        <title>My App</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <QueryClientProvider client={queryClient}>
        <MantineProvider
          theme={{
            colorScheme: "light",
          }}
          withGlobalStyles
          withNormalizeCSS
        >
          <ModalsProvider>
            <LocaleProvider locale={en_US}>
              <RouterTransition />
              {getLayout(<Component {...pageProps} />)}
            </LocaleProvider>
          </ModalsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </>
  );
}
