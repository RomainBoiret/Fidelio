import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * Root HTML for Expo web - critical for Lighthouse SEO / a11y title checks.
 */
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
        <title>Fidelio - Loyalty cards</title>
        <meta
          name="description"
          content="Fidelio stores your loyalty cards: scan, local vault, quick checkout access - even offline."
        />
        <meta name="theme-color" content="#3B6BFF" />
        <meta name="application-name" content="Fidelio" />
        <meta property="og:title" content="Fidelio - Loyalty cards" />
        <meta
          property="og:description"
          content="Scan, store, and find your loyalty cards in a flash."
        />
        <meta property="og:type" content="website" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
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
    background-color: #F3F5FA;
  }
  body {
    font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    color: #1C1F2A;
  }
  @media (prefers-color-scheme: dark) {
    html, body, #root {
      background-color: #11141C;
    }
    body {
      color: #F4F6FB;
    }
  }
`;
