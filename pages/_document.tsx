import { createGetInitialProps } from "@mantine/next";
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class _Document extends Document {
  static getInitialProps = createGetInitialProps();

  render() {
    return (
      <Html>
        <Head>
          <meta name="application-name" content="Smart Book" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="Smart Book" />
          <meta name="description" content="Manege event booking painlessly" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />

          <meta name="msapplication-TileColor" content="#2B5797" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#f8f9fa" />

          <link rel="manifest" href="/manifest.json" />

          <link rel="apple-touch-icon" href="/icons/icons/icon-152x152.png" />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/icons/icon-152x152.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
