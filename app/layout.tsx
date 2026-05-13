import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../registry/providers/theme-provider";
import { I18nProvider } from "../registry/hooks/use-lang";
import { PreferencesProvider } from "../registry/hooks/use-preferences";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "jh-design-system",
  description: "Canonical design system for jh-* apps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <I18nProvider>
            <PreferencesProvider>{children}</PreferencesProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
