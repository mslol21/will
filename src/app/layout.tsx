import type { Metadata, Viewport } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { INITIAL_STORE_SETTINGS } from "@/lib/mockData";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#1F2A44",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Empório Caminho da Fé | Sabores de Minas e Presentes da Fé",
  description:
    "Catálogo premium de gastronomia artesanal mineira. Queijos Canastra maturados, cafés especiais de altitude, doce de leite no tacho, méis puros, cestas de presente e artigos da fé.",
  keywords: [
    "Empório Caminho da Fé",
    "Queijo Canastra",
    "Café Especial Mantiqueira",
    "Gastronomia Mineira",
    "Cestas de Presente",
    "Doce de Leite",
    "Terços em Madeira",
    "Caminho da Fé",
  ],
  authors: [{ name: "Empório Caminho da Fé" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "Empório Caminho da Fé | Sabores de Minas e Presentes",
    description:
      "Acolhimento, tradição e gastronomia de Minas Gerais. Queijos premiados, cafés e cestas artesanais personalizadas.",
    url: "https://caminhodafeemporio.com.br",
    siteName: "Empório Caminho da Fé",
    images: [
      {
        url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Empório Caminho da Fé",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLdStore = {
    "@context": "https://schema.org",
    "@type": "GourmetStore",
    "name": INITIAL_STORE_SETTINGS.storeName,
    "image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80",
    "telephone": INITIAL_STORE_SETTINGS.phone,
    "email": INITIAL_STORE_SETTINGS.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": INITIAL_STORE_SETTINGS.address,
      "addressLocality": "Águas da Prata / Andradas",
      "addressRegion": "MG",
      "addressCountry": "BR"
    },
    "url": "https://caminhodafeemporio.com.br",
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "19:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "08:00",
        "closes": "20:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "07:30",
        "closes": "18:00"
      }
    ]
  };

  return (
    <html lang="pt-BR" className={`${playfair.variable} ${montserrat.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdStore) }}
        />
      </head>
      <body className="font-montserrat bg-emporio-beige text-emporio-navy antialiased">
        {children}
      </body>
    </html>
  );
}
