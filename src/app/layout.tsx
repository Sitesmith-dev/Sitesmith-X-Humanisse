import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Bricolage_Grotesque, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { MotionProvider } from "@/components/shared/Motion";

const display = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin"] });
const body = Source_Sans_3({ variable: "--font-body", subsets: ["latin"] });
const card = Atkinson_Hyperlegible({ variable: "--font-card", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: { default: "Humanisse | Learn life through stories", template: "%s | Humanisse" },
  description: "Explore ideas from comics, cinema and literature - made simple, memorable and useful.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${card.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <a className="skip" href="#main">Skip to content</a>
        <MotionProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          {modal}
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
