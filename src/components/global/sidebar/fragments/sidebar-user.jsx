"use client"

import { useState } from "react"
import { getImageUrl } from "@/lib/utils"
import { useDispatch } from "react-redux"
import { useUser } from "@/hooks/useUser"
import { useRouter } from "next/navigation"
import { clearUser } from "@/store/slices/userSlice"
import { AuthService } from "@/services/frontend/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarMenu, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import {
    LogInIcon,
    UserPlusIcon,
    LogOutIcon,
    Loader2,
    CheckCircle2Icon,
    AlertCircleIcon,
    XCircleIcon,
    ChevronsUpDownIcon,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function StatusBadge({ status }) {
    switch (status?.toLowerCase()) {
        case "active":
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
                    <CheckCircle2Icon className="size-3 shrink-0" />
                    Active
                </span>
            )
        case "inactive":
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20">
                    <AlertCircleIcon className="size-3 shrink-0" />
                    Inactive
                </span>
            )
        case "blocked":
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20">
                    <XCircleIcon className="size-3 shrink-0" />
                    Blocked
                </span>
            )
        default:
            return null
    }
}

export function NavUser() {
    const { user, loading } = useUser()
    const dispatch = useDispatch()
    const { isMobile } = useSidebar()
    const router = useRouter()

    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true)
            await AuthService.logout()
            dispatch(clearUser())
            router.push("/login")
            router.refresh()
        } catch (error) {
            console.error("Logout failed:", error)
            setIsLoggingOut(false)
        }
    }

    if (loading) {
        return (
            <div className="w-full rounded-xl border border-gray-200/80 bg-white p-3 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="size-9 rounded-lg bg-gray-200 dark:bg-zinc-850 animate-pulse shrink-0" />
                        <div className="flex flex-col flex-1 min-w-0 gap-1.5">
                            <div className="h-3.5 w-24 rounded bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                            <div className="h-3 w-16 rounded bg-gray-100 dark:bg-zinc-800/60 animate-pulse" />
                        </div>
                    </div>
                    <div className="size-4 rounded bg-gray-100 dark:bg-zinc-800/60 animate-pulse shrink-0" />
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <SidebarMenu className="w-full">
                <SidebarMenuItem className="w-full">
                    <div className="flex w-full items-center gap-2 rounded-xl border border-gray-200/80 bg-white/90 p-1.5 shadow-xs backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/90">
                        <button
                            type="button"
                            onClick={() => router.push("/login")}
                            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 active:scale-[0.98] dark:text-gray-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                        >
                            <LogInIcon className="size-3.5" />
                            <span>Login</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push("/register")}
                            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            <UserPlusIcon className="size-3.5" />
                            <span>Register</span>
                        </button>
                    </div>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    const initials =
        user?.name
            ?.split(" ")
            .map((word) => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase() || "U"

    return (
        <div className="w-full rounded-xl border border-gray-200/80 bg-white p-1.5 shadow-xs transition-all dark:border-zinc-800 dark:bg-zinc-900">
            <DropdownMenu>
                <DropdownMenuTrigger className="w-full" asChild>
                    <button
                        type="button"
                        className="group flex w-full items-center justify-between gap-3 rounded-lg p-1.5 text-left transition-colors hover:bg-gray-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:hover:bg-zinc-800/80"
                    >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                            <div className="relative shrink-0">
                                <Avatar className="size-9 rounded-lg border border-gray-100 shadow-xs dark:border-zinc-800">
                                    <AvatarImage
                                        src={getImageUrl(user?.avatar, true, "thumbnail")}
                                        alt={user?.name}
                                        className="rounded-lg object-cover"
                                    />
                                    <AvatarFallback className="rounded-lg bg-gray-100 font-bold text-gray-700 dark:bg-zinc-800 dark:text-zinc-200">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <span
                                    className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white dark:border-zinc-900 ${user?.status === "active"
                                        ? "bg-emerald-500"
                                        : user?.status === "inactive"
                                            ? "bg-amber-500"
                                            : "bg-rose-500"
                                        }`}
                                />
                            </div>

                            <div className="flex min-w-0 flex-1 flex-col">
                                <span className="truncate text-xs font-bold leading-snug text-gray-900 dark:text-zinc-100">
                                    {user?.name}
                                </span>
                                <span className="truncate text-[11px] font-medium leading-tight text-gray-500 dark:text-zinc-400">
                                    {user?.phone || "No phone provided"}
                                </span>
                            </div>
                        </div>

                        <ChevronsUpDownIcon className="size-4 shrink-0 text-gray-400 transition-colors group-hover:text-gray-600 dark:text-zinc-500 dark:group-hover:text-zinc-300" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    side={isMobile ? "bottom" : "right"}
                    align="end"
                    sideOffset={8}
                    className="w-[--anchor-width] min-w-[240px] rounded-xl border border-gray-200/80 bg-white p-1.5 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
                >
                    <div className="flex items-center gap-3 p-2">
                        <Avatar className="size-10 rounded-lg">
                            <AvatarImage
                                src={getImageUrl(user?.avatar, true, "thumbnail")}
                                alt={user?.name}
                                className="rounded-lg object-cover"
                            />
                            <AvatarFallback className="rounded-lg bg-gray-100 font-bold text-gray-700 dark:bg-zinc-800 dark:text-zinc-200">
                                {initials}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-center justify-between gap-2">
                                <h4 className="truncate text-xs font-bold text-gray-900 dark:text-white">
                                    {user?.name}
                                </h4>
                                <StatusBadge status={user?.status || "active"} />
                            </div>
                            <p className="truncate text-[11px] text-gray-500 dark:text-zinc-400">
                                {user?.phone || "No phone provided"}
                            </p>
                        </div>
                    </div>

                    <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-zinc-800" />

                    <DropdownMenuItem
                        disabled={isLoggingOut}
                        onClick={(event) => {
                            event.preventDefault()
                            handleLogout()
                        }}
                        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-4 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 focus:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 dark:focus:bg-rose-500/10"
                    >
                        {isLoggingOut ? (
                            <Loader2 className="size-3.5 animate-spin text-rose-600 dark:text-rose-400" />
                        ) : (
                            <LogOutIcon className="size-3.5" />
                        )}
                        <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}