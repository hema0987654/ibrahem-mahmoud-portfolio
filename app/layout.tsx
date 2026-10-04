import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { profile } from "@/content/profile";
import { siteDescription, siteTitle, siteUrl } from "@/lib/site";
import { SiteHeader } from "@/components/ui/SiteHeader";
import "./globals.css";

const bricolage = localFont({
  src: "./fonts/BricolageGrotesque-latin-wght.woff2",
  variable: "--font-bricolage",
  weight: "200 800",
  display: "swap",
  preload: true,
});

const jetbrains = localFont({
  src: "./fonts/JetBrainsMono-latin-wght.woff2",
  variable: "--font-jetbrains",
  weight: "100 800",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: `%s — ${profile.name}` },
  description: siteDescription,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: profile.name,
    title: siteTitle,
    description: siteDescription,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: siteTitle, description: siteDescription },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#f2efe8",
  colorScheme: "light",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  url: siteUrl,
  email: `mailto:${profile.email}`,
  image: `${siteUrl}/about-640.jpg`,
  address: { "@type": "PostalAddress", addressLocality: "Qena", addressCountry: "EG" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "South Valley University" },
  knowsAbout: ["Node.js", "NestJS", "TypeScript", "PostgreSQL", "REST APIs"],
  sameAs: [profile.links.github, profile.links.linkedin],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${jetbrains.variable}`}>
      <body>
        <a
          href="#main"
          className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-text focus:px-4 focus:py-3 focus:text-paper"
        >
          Skip to content
        </a>
        <div className="progress" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        <SiteHeader />
        <main id="main">{children}</main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
