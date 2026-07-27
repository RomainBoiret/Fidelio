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
        <meta name="theme-color" content="#2A2560" />
        <meta name="application-name" content="Fidelio" />
        <meta property="og:title" content="Fidelio - Loyalty cards" />
        <meta
          property="og:description"
          content="Scan, store, and find your loyalty cards in a flash."
        />
        <meta property="og:type" content="website" />
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
    background-color: #F3F2F8;
  }
  body {
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    color: #14122A;
  }
  @media (prefers-color-scheme: dark) {
    html, body, #root {
      background-color: #0E0C1A;
    }
    body {
      color: #F4F3FA;
    }
  }
`;
