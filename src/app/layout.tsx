import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ogum Tech - Sistema de Gestão de Giras",
  description: "Sistema completo para gerenciamento de filas de atendimento em giras de Umbanda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <footer className="w-full text-center py-6 text-xs text-gray-500 border-t border-gray-200 mt-12">
          © 2025 Ogum Tech. Licenciado sob MIT License. Desenvolvido com <span aria-label="amor" role="img">❤️</span> por <a href="https://github.com/dev-mateus" className="underline hover:text-black">Mateus</a>
        </footer>
      </body>
    </html>
  );
}
