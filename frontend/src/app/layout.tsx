import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IslaInvest | El Futuro de las Inversiones en Bienes Raíces",
  description: "Marketplace regulado de bienes raíces y fideicomisos en República Dominicana.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

import AlfredGlobal from "@/components/AlfredGlobal";

import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LanguageProvider>
          {children}
          <AlfredGlobal />
        </LanguageProvider>
      </body>
    </html>
  );
}
