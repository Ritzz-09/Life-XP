import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://life-xp.game'),
  title: "Life-XP | Gamified Real-Life Habit Tracker & Superhero Evolution",
  description: "Turn your daily routines, fitness, and goals into an epic RPG adventure with 3D superheroes, co-op raids, talent trees, and focus timers.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Life-XP | Gamified Real-Life Habit Tracker & Superhero Evolution",
    description: "Turn your daily routines, fitness, and goals into an epic RPG adventure with 3D superheroes, co-op raids, talent trees, and focus timers.",
    url: "https://life-xp.game",
    siteName: "Life-XP",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Life-XP - Gamified Habit Tracker & Superhero Evolution",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Life-XP | Gamified Real-Life Habit Tracker & Superhero Evolution",
    description: "Turn your daily routines, fitness, and goals into an epic RPG adventure with 3D superheroes, co-op raids, talent trees, and focus timers.",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Life-XP",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#020617" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': 'https://life-xp.game/#website',
                  url: 'https://life-xp.game',
                  name: 'Life-XP',
                  description: 'Gamified Real-Life Habit Tracker & Superhero Evolution',
                  publisher: {
                    '@type': 'Organization',
                    name: 'Life-XP Realm',
                  },
                },
                {
                  '@type': 'SoftwareApplication',
                  name: 'Life-XP',
                  applicationCategory: 'ProductivityApplication',
                  operatingSystem: 'Web, iOS, Android',
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD',
                  },
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.9',
                    ratingCount: '1284',
                  },
                  description:
                    'Turn your daily routines, fitness, and goals into an epic RPG adventure with superheroes, co-op raids, talent trees, and focus timers.',
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
