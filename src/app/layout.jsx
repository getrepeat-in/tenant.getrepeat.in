import "./globals.css";
import { cn } from "@/lib/utils";
import { fontPoppins } from "@/constants/fonts";
import StoreProvider from "@/providers/store-provider";
import ThemeProvider from "@/providers/theme-provider";
import QueryProvider from "@/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavigationWrapper from "@/components/layouts/main-layout";
import NotificationBanner from "@/components/global/notification";

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