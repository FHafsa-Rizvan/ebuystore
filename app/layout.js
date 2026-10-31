import { Bricolage_Grotesque } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import "./globals.css";
import "./hero.css";

const font = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-main", display: "swap" });

export const metadata = {
  title: "Ebuy | Homeware & Glassware",
  description: "Shop homeware, glassware, kitchenware and decor from Ebuy. Order easily via WhatsApp.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={font.variable}>
      <body>
        <CartProvider>
          <Header />
          <main className="container">{children}</main>
          <footer className="footer">© {new Date().getFullYear()} Ebuy. All rights reserved.</footer>
        </CartProvider>
      </body>
    </html>
  );
}