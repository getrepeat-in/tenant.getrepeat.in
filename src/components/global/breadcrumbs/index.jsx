"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const { toggleSidebar } = useSidebar();

  if (segments.length === 0) return null;

  return (
    <div className="flex items-center justify-between w-full h-14 sm:h-16 px-4 sm:px-6 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-30">
      <div className="flex items-center gap-3 sm:gap-3.5">
        <button
            type="button"
            onClick={toggleSidebar}
            className="flex h-6 w-9 items-center justify-center rounded-xl bg-white text-neutral-700 hover:bg-neutral-50 hover:text-primary active:scale-95 transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-primary -ml-1"
        >
            <Menu size={18} strokeWidth={2.5} />
        </button>
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
