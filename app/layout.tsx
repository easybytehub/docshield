import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// Load Google Fonts with custom CSS variables for easy usage in CSS.
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// Metadata for SEO and social sharing
export const metadata: Metadata = {
    title: "DocShield",
    description: "Protect documents with intelligent and secure watermarks.",
    openGraph: {
        title: "DocShield - Smart Document Protection",
        description: "Easily add watermarks to documents securely and efficiently.",
        type: "website",
        url: "https://docshield.easybyte.es",
        images: [
            {
                url: "https://docshield.easybyte.es/og-image.png",
                width: 1200,
                height: 630,
                alt: "DocShield - Document Protection",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@DocShieldApp",
        title: "DocShield - Smart Document Protection",
        description: "Easily add secure watermarks and protect your documents.",
        images: ["https://docshield.easybyte.es/twitter-card.png"],
    },
};

/**
 * RootLayout Component
 * This is the main layout for the application.
 * It sets up the HTML structure, applies global styles and fonts,
 * and includes external scripts such as Google Analytics.
 */
export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
        >
        {/* Render application content */}
        {children}
        {/* Toast notifications positioned at the top-center */}
        <Toaster position="top-center" />
        </body>
        </html>
    );
}
