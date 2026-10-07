import { NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = [
    "/",
    "/cart",
    "/menu",
    "/login",
    "/register",
    "/social"
];

export function proxy(request) {
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

    // Custom domain routing logic
    let hostname = request.headers
        .get('host')
        ?.replace('.localhost:3000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'}`);

    if (hostname) {
        hostname = hostname.replace('www.', '');
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
        
        const isCustomDomain =
            hostname !== rootDomain &&
            hostname !== 'localhost:3000' &&
            !hostname.includes('vercel.app') &&
            hostname !== process.env.NEXT_PUBLIC_VERCEL_URL;

        if (isCustomDomain) {
            // Rewrite the URL to the dynamic domain route
            return NextResponse.rewrite(new URL(`/${hostname}${pathname}`, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets|manifest.json|icon.png|apple-icon.png).*)",
    ],
};
