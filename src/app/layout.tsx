import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/ui/providers/theme-provider";
import { UseCaseProvider } from "@/ui/providers/use-case-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemedToaster } from "@/ui/components/themed-toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Visor JSON",
  description: "Un visor de JSON con navegación en árbol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <UseCaseProvider>
            <TooltipProvider>
              {children}
              <ThemedToaster />
            </TooltipProvider>
          </UseCaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
