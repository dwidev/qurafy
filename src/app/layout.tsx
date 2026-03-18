import type { Metadata } from "next";
import { LandingCursor } from "@/components/shared/LandingCursor";
import { ThemeProvider } from "@/components/shared/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qurafy - Read & Memorize Quran",
  description: "A clean, modern web application for reading and memorizing the Quran.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LandingCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
