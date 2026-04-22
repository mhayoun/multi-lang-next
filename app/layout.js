import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders"; // Importez le nouveau fichier

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "בית הנוער העברי",
  description: "בית קהילתי ירושלמי לכל המשפחה",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="he" // J'ai mis "he" car votre projet semble être principalement en hébreu
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* On enveloppe ici pour que la Navbar et les autres voient la session */}
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}