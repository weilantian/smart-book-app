import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import Layout from "../components/Layout";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import RouterTransition from "../components/RouterTransition";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ModalsProvider } from "@mantine/modals";
import { LocaleProvider } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const [queryClient] = useState(() => new QueryClient());
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
        <MantineProvider withGlobalStyles withNormalizeCSS>
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
