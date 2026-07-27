import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * Root HTML for Expo web — critical for Lighthouse SEO / a11y title checks.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <title>Fidelio — Cartes de fidélité</title>
        <meta
          name="description"
          content="Fidelio range tes cartes de fidélité : scan, coffre local, accès rapide en caisse — même hors ligne."
        />
        <meta name="theme-color" content="#EEF1F6" />
        <meta name="application-name" content="Fidelio" />
        <meta property="og:title" content="Fidelio — Cartes de fidélité" />
        <meta
          property="og:description"
          content="Scan, range et retrouve tes cartes de fidélité en un clin d’œil."
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
    background-color: #EEF1F6;
  }
  body {
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    color: #14171F;
  }
  @media (prefers-color-scheme: dark) {
    html, body, #root {
      background-color: #0C0E14;
    }
    body {
      color: #F3F5FA;
    }
  }
`;
