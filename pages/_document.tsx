// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* 🔥 اضافه کردن Favicon */}
        <link rel="icon" href="/favicon.ico" />
        {/* اگر PNG استفاده می‌کنی به جای بالا اینو بذار: */}
        {/* <link rel="icon" type="image/png" href="/favicon.png" /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
