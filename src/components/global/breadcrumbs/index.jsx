"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <div className="flex items-center justify-between w-full h-14 sm:h-16 px-4 sm:px-6 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-30">
      <div className="flex items-center gap-3 sm:gap-3.5">
        <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer -ml-1.5" />
        <div className="h-4.5 w-px bg-gray-200 dark:bg-zinc-800 shrink-0" />

        <nav className="flex items-center gap-1.5 text-sm sm:text-[15px]">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors font-normal">
            Home
          </Link>

          {segments.map((segment, idx) => {
            const href = "/" + segments.slice(0, idx + 1).join("/");
            const isLast = idx === segments.length - 1;
            
            let decoded = decodeURIComponent(segment);
            if (decoded.length > 16) {
              decoded = decoded.slice(0, 12) + "...";
            }

            return (
              <span key={href} className="flex items-center gap-1.5">
                <ChevronRight size={15} className="text-muted-foreground shrink-0" />
                {isLast ? (
                  <span className="text-gray-900 dark:text-zinc-100 font-semibold capitalize">
                    {decoded}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground capitalize transition-colors font-normal"
                  >
                    {decoded}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
