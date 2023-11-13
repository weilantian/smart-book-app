import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/nprogress/styles.css";
import { AppProps } from "next/app";
import Head from "next/head";

import { MantineProvider, createTheme } from "@mantine/core";

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

import { Provider } from "jotai";
import { useLocalStorage } from "@mantine/hooks";

// if (typeof window !== "undefined") {
//   inspect({
//     // options
//     // url: 'https://stately.ai/viz?inspect', // (default)
//     iframe: false, // open in new window
//   });
// }

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

  const theme = createTheme({});

  return (
    <>
      <Head>
        <title>My App</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <Provider>
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme}>
            <ModalsProvider>
              <LocaleProvider locale={en_US}>
                <RouterTransition />
                {getLayout(<Component {...pageProps} />)}
              </LocaleProvider>
            </ModalsProvider>
          </MantineProvider>
        </QueryClientProvider>
      </Provider>
    </>
  );
}
