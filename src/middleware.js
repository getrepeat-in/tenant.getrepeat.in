import { NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = [
    "/login",
    "/register",
];

export function middleware(request) {
    const { pathname } = request.nextUrl;
    
    const isPublicRoute = PUBLIC_ROUTES.some(route => {
        return pathname === route || pathname.startsWith(`${route}/`);
    });
    
    const isAuthRoute = AUTH_ROUTES.some(route => {
        return pathname === route || pathname.startsWith(`${route}/`);
    });

    const token = request.cookies.get("auth-token")?.value;
    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (token && isAuthRoute) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets).*)",
    ],
};
