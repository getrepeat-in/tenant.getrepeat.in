import "./globals.css";
import { cn } from "@/lib/utils";
import { fontPoppins } from "@/constants/fonts";
import StoreProvider from "@/providers/store-provider";
import ThemeProvider from "@/providers/theme-provider";
import QueryProvider from "@/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavigationWrapper from "@/components/layouts/main-layout";
import NotificationBanner from "@/components/global/notification";
import PostHogProvider, { PostHogPageview } from "@/providers/posthog-provider";
import { Suspense } from "react";
import { headers } from "next/headers";

export const metadata = {
  title: {
    default: "Repeat",
    template: "%s | Repeat",
  },
  description: "Order delicious food, beverages, and explore the best culinary offerings with Repeat.",
  icons: {
    icon: [
      { url: "/logo.png", sizes: "any" },
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

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  let slug = "haldiram";
  
  const parts = host.split(".");
  if (parts.length > 0 && parts[0] !== "localhost" && parts[0] !== "www" && parts[0] !== "127") {
    slug = parts[0];
  }

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased")}
      suppressHydrationWarning
    >
      <body 
        className={cn("min-h-full flex flex-col font-sans", fontPoppins.className, fontPoppins.variable)}
        suppressHydrationWarning
      >
        <Suspense fallback={null}>
          <PostHogPageview />
        </Suspense>

        <PostHogProvider>
          <QueryProvider>
            <ThemeProvider>
              <StoreProvider slug={slug}>
                <TooltipProvider>
                  <NavigationWrapper>
                    {children}
                  </NavigationWrapper>
                  <NotificationBanner />
                </TooltipProvider>
              </StoreProvider>
            </ThemeProvider>
          </QueryProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}