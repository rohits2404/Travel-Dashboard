import type { Metadata } from "next";
import { Figtree, Inter } from "next/font/google";
import { registerLicense } from "@syncfusion/ej2-base";

import "./globals.css";

const fig = Figtree({
    variable: "--font-figtree",
    subsets: ["latin"],
});

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

registerLicense(process.env.SYNCFUSION_LICENSE_KEY!);

export const metadata: Metadata = {
    title: "Tourvista",
    description: "Discover and plan your next adventure with Tourvista.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${fig.variable} ${inter.variable}`}>
                {children}
            </body>
        </html>
    );
}
