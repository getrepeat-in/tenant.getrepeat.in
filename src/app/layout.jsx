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

export async function generateMetadata() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  let slug = "haldiram";
  
  const parts = host.split(".");
  if (parts.length > 0 && parts[0] !== "localhost" && parts[0] !== "www" && parts[0] !== "127") {
    slug = parts[0];
  }

  let restaurantName = "Repeat";
  let restaurantLogo = "/logo.png";
  let description = "Order delicious food, beverages, and explore the best culinary offerings with Repeat.";

  try {
    const merchantAppUrl = process.env.MERCHANT_APP_URL || "http://localhost:3001";
    const res = await fetch(`${merchantAppUrl}/api/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const restaurant = data?.data || data;
      if (restaurant?.name) {
        restaurantName = restaurant.name;
        description = `Order delicious food, beverages, and explore the best culinary offerings with ${restaurantName}.`;
      }
      if (restaurant?.logo) {
        restaurantLogo = restaurant.logo;
      }
    }
  } catch (error) {
    console.error("Failed to fetch restaurant metadata:", error);
  }

  return {
    title: {
      default: restaurantName,
      template: `%s | ${restaurantName}`,
    },
    description: description,
    icons: {
      icon: [
        { url: restaurantLogo, sizes: "any" },
      ],
      shortcut: restaurantLogo,
      apple: [
        { url: restaurantLogo, sizes: "180x180", type: "image/png" },
      ],
    },
    manifest: "/manifest.json",
    openGraph: {
      title: restaurantName,
      description: description,
      images: [
        {
          url: restaurantLogo,
          width: 1024,
          height: 1024,
          alt: `${restaurantName} Logo`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: restaurantName,
      description: description,
      images: [restaurantLogo],
    },
  };
}

export default function RootLayout({ children }) {
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for(let registration of registrations) {
                      registration.unregister();
                    }
                  });
                });
              }
            `,
          }}
        />
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