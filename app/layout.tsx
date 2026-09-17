import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "The Council of Extremely Specific Opinions",
  description:
    "Twelve members. Zero qualifications. Submit your questionable idea to a very opinionated council, powered by TypeSafe AI.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "The Council of Extremely Specific Opinions",
    description:
      "Your idea. Their problem. Twelve very specific opinions, powered by TypeSafe AI.",
  },
  twitter: {
    card: "summary",
    title: "The Council of Extremely Specific Opinions",
    description:
      "Twelve members. Zero qualifications. Your idea. Their problem.",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
