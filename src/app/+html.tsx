import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <title>Fidelio — Your Loyalty Gallery</title>
        <meta
          name="description"
          content="Fidelio is your personal gallery of loyalty cards — scan, collect, and present at checkout."
        />
        <meta name="theme-color" content="#E8EAF6" />
        <meta name="application-name" content="Fidelio" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-48.png" type="image/png" sizes="48x48" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <meta property="og:title" content="Fidelio — Your Loyalty Gallery" />
        <meta
          property="og:description"
          content="Every loyalty card, thoughtfully placed. Scan, store, and present at checkout."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
  html, body, #root {
    min-height: 100%;
    background-color: #E8EAF6;
  }
  body {
    font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    font-weight: 400;
    color: #1A1C2E;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  @media (prefers-color-scheme: dark) {
    html, body, #root {
      background-color: #131210;
    }
    body {
      color: #F4F2EC;
    }
  }
`;
