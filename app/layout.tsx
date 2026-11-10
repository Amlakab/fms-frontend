import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/lib/theme-context";
import { LanguageProvider } from "@/lib/language-context";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "MAT Engineering & Trading PLC | Construction Materials, Furniture & Steel Fabrication",
  description: "Official portal for MAT Engineering & Trading PLC. Premium construction materials, home & office furniture, custom steel fabrication and contracting.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Viewport meta tag for proper responsive scaling */}
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes, viewport-fit=cover" 
        />
      </head>
      <body className="font-sans overflow-x-hidden antialiased selection:bg-blue-500 selection:text-white">
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              <div className="relative min-h-screen overflow-x-hidden">
                {children}
              </div>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}