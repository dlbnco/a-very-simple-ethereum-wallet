import { css, Global } from "@emotion/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "theme-ui";
import theme from "../theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Global
        styles={css`
          /*! minireset.css v0.0.6 | MIT License | github.com/jgthms/minireset.css */
          html,
          body,
          p,
          ol,
          ul,
          li,
          dl,
          dt,
          dd,
          blockquote,
          figure,
          fieldset,
          legend,
          textarea,
          pre,
          iframe,
          hr,
          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            margin: 0;
            padding: 0;
          }
          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            font-size: 100%;
            font-weight: normal;
          }
          ul {
            list-style: none;
          }
          button,
          input,
          select {
            margin: 0;
          }
          html {
            box-sizing: border-box;
          }
          *,
          *::before,
          *::after {
            box-sizing: inherit;
          }
          img,
          video {
            height: auto;
            max-width: 100%;
          }
          iframe {
            border: 0;
          }
          table {
            border-collapse: collapse;
            border-spacing: 0;
          }
          td,
          th {
            padding: 0;
          }
        `}
      />
      <Head>
        <title>a very simple Ethereum wallet</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
