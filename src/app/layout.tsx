import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChocoMED | O Sabor que Une Cuidado, Ciência e Afeto",
  description: "Chocolates funcionais de baixo impacto glicêmico desenvolvidos para diabéticos tipo 2 e pessoas preocupadas com a saúde. Sabor e inclusão alimentar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <CartProvider>
        <html
          lang="pt-BR"
          className={`${outfit.variable} ${inter.variable} h-full antialiased`}
          suppressHydrationWarning
        >
          <body className="min-h-full flex flex-col" suppressHydrationWarning>
            <Navbar />
            <main style={{ flex: '1 0 auto' }}>{children}</main>
            <Footer />
          </body>
        </html>
      </CartProvider>
    </ClerkProvider>
  );
}
