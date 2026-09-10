import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RegisterServiceWorker } from "@/components/RegisterServiceWorker";

export const metadata: Metadata = {
  title: "Révision",
  description: "Révision technique Java / Spring / React, hors ligne, sur mobile.",
  manifest: "/manifest.webmanifest",
  applicationName: "Révision",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    // iOS ignore le SVG et le manifest : il lui faut ce lien, en PNG.
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Révision" },
  formatDetection: { telephone: false },
  // Next n'émet que `mobile-web-app-capable` ; les iOS plus anciens ne
  // connaissent que la version préfixée, sans laquelle « Ajouter à l'écran
  // d'accueil » rouvre l'app dans Safari au lieu du mode plein écran.
  other: { "apple-mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0f14",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-dvh bg-bg text-fg antialiased">
        {children}
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
