import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from './context/AuthContext';
import { BacteriaProvider } from './context/BacteriaContext';

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "PurelyBiome",
  description: "PurelyBiome provides personalized, science-based skincare recommendations through facial microbiome testing.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PurelyBiome",
    startupImage: [
      {
        url: "/splash/apple-splash-2048-2732.jpg",
        media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <BacteriaProvider>
            {children}
          </BacteriaProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
