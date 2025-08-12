import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./globals.scss";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Get me a chai",
  description: "this is crowd funding website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        {/* Background Animation Layer */}
        <div className="container">
          {/* Particle Elements */}
          {[...Array(200)].map((_, i) => (
            <div key={i} className="circle-container">
              <div className="circle"></div>
            </div>
          ))}
        </div>

        {/* Foreground Content */}
        <div className="relative z-10">
          <Navbar />
          <div className="min-h-[89vh]">{children}</div>
          <Footer />
        </div>

      </body>
    </html>
  );
}
