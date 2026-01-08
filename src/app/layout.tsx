import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Zelige Bladi | Carrelage Marocain Artisanal",
  description: "Découvrez l'authenticité du zellige marocain, fabriqué à Fès selon des méthodes ancestrales.",
};

import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${outfit.variable} antialiased selection:bg-gold-200 selection:text-gold-900 min-h-screen flex flex-col`}
      >
        <CartProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </ThemeProvider>
        </CartProvider>
      </body>
    </html>
  );
}
