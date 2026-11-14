import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import { I18nProvider } from "../context/I18nContext";
import CookieConsent from "../components/CookieConsent";
import GoogleAnalytics from "../components/GoogleAnalytics";
import { getWebSiteSchema } from "../lib/seo";

export const metadata = {
  metadataBase: new URL("https://fastedl.app"),
  title: {
    default: "FastEDL - Instagram Downloader",
    template: "%s | FastEDL",
  },
  description:
    "FastEDL is a fast and simple Instagram downloader. Save Instagram reels, videos, photos and carousels in high-definition MP4 and JPEG.",
  keywords: [
    "FastEDL",
    "Instagram Video Downloader",
    "Instagram Reels Downloader",
    "Instagram Photo Downloader",
    "Instagram Carousel Downloader",
    "Instagram Story Saver",
    "Save Instagram Media",
  ],
  authors: [{ name: "FastEDL Team", url: "https://fastedl.app" }],
  creator: "FastEDL",
  publisher: "FastEDL",
  alternates: {
    canonical: "https://fastedl.app",
    languages: {
      "en": "https://fastedl.app",
      "x-default": "https://fastedl.app",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "FastEDL - Fast Instagram Downloader",
    description:
      "Save Instagram videos, reels, photos and carousel posts with a clean, fast experience in original quality.",
    url: "https://fastedl.app",
    siteName: "FastEDL",
    locale: "en_US",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "FastEDL - Fast Instagram Downloader",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FastEDL - Fast Instagram Downloader",
    description:
      "Save Instagram videos, reels, photos and carousel posts with a clean, fast experience in original quality.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({ children }) {
  // Anti-flash script executed synchronously before DOM paint
  const antiFlashScript = `
    (function() {
      try {
        var savedTheme = localStorage.getItem('fastedl_theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        var savedLang = localStorage.getItem('fastedl_lang');
        if (savedLang) {
          document.documentElement.lang = savedLang;
          if (savedLang === 'ar' || savedLang === 'fa') {
            document.documentElement.dir = 'rtl';
          } else {
            document.documentElement.dir = 'ltr';
          }
        }
      } catch (e) {}
    })();
  `;

  const webSiteJsonLd = getWebSiteSchema();

  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: antiFlashScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF9FF] dark:bg-[#111018] text-[#0F172A] dark:text-[#F8FAFC] font-sans selection:bg-[#7C3AED] selection:text-white transition-colors duration-200">
        <GoogleAnalytics />
        <ThemeProvider>
          <I18nProvider>
            {children}
            <CookieConsent />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
