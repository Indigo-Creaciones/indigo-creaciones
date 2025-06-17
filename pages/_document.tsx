import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Material Icons stylesheet */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        {/* Viewport meta tag REMOVIDA, debe ir en _app.tsx */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
