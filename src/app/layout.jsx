import "./globals.css";
import { cn } from "@/lib/utils";
import { fontPoppins } from "@/constants/fonts";
import StoreProvider from "@/providers/store-provider";
import ThemeProvider from "@/providers/theme-provider";
import QueryProvider from "@/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavigationWrapper from "@/components/layouts/main-layout";
import NotificationBanner from "@/components/global/notification";

export const metadata = {
  title: {
    default: "Repeat",
    template: "%s | Repeat",
  },
  description: "Order delicious food, beverages, and explore the best culinary offerings with Repeat.",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/logo.png",
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Repeat",
    description: "Order delicious food, beverages, and explore the best culinary offerings with Repeat.",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 1024,
        alt: "Repeat Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Repeat",
    description: "Order delicious food, beverages, and explore the best culinary offerings with Repeat.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased")}
    >
      <body className={cn("min-h-full flex flex-col font-sans", fontPoppins.className, fontPoppins.variable)}>
        <QueryProvider>
          <ThemeProvider>
            <StoreProvider>
              <TooltipProvider>
                <NavigationWrapper>
                  {children}
                </NavigationWrapper>
                <NotificationBanner />
              </TooltipProvider>
            </StoreProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}