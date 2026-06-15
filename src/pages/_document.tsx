import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1D6B69" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
