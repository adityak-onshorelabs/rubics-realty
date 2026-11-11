import type { Metadata, Viewport } from "next";
import { Mona_Sans } from "next/font/google";
import { company, offices } from "@/content/en";
import { absoluteUrl, siteUrl } from "@/lib/site";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Providers } from "@/components/site/providers";
import { FloorShaft } from "@/components/site/floor-rail";
import { JsonLd } from "@/components/site/json-ld";
import "./globals.css";

const mona = Mona_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-mona",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rubics Realty | Design-first residences in Mumbai",
    template: "%s | Rubics Realty",
  },
  description:
    "Rubics Realty builds design-first residences in Mumbai's established neighbourhoods. BeauMonté Tower C at Sion Circle is now selling. MahaRERA P51900050715.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: company.name,
    locale: "en_IN",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  verification: { google: "yGKuOENnNbpzOBBgKzi3BvAigWiYzIhpmmhQgzDnTrg" },
};

export const viewport: Viewport = {
  themeColor: "#121a33",
  colorScheme: "light",
};

const orgLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": absoluteUrl("/#organization"),
  name: company.name,
  url: siteUrl,
  logo: absoluteUrl("/images/brand/rubics-logo.png"),
  slogan: company.motto,
  email: company.salesEmail,
  telephone: "+91-1800-209-6363",
  parentOrganization: { "@type": "Organization", name: company.group },
  founder: { "@type": "Person", name: "Suhan Shetty" },
  address: {
    "@type": "PostalAddress",
    streetAddress: offices[1].lines.slice(0, 2).join(", "),
    addressLocality: "Mumbai",
    postalCode: "400013",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  areaServed: { "@type": "City", name: "Mumbai" },
  sameAs: company.social.map((s) => s.href),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${mona.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="t-label sr-only z-50 bg-brass px-4 py-3 text-lacquer focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
        >
          Skip to content
        </a>
        <Providers>
          <Header />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer />
          <FloorShaft />
        </Providers>
        <JsonLd data={orgLd} />
      </body>
    </html>
  );
}
