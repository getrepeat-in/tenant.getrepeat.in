"use client";
import Script from "next/script";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { usePathname, useSearchParams } from "next/navigation";

export default function MetaPixelProvider({ children }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const user = useSelector((state) => state.user?.user);
    const restaurant = useSelector((state) => state.restaurant?.data);
    const metaPixel = restaurant?.integrations?.metaPixel;
    const pixelId = metaPixel?.pixelId;
    
    const isConfigured = metaPixel?.isLinked && metaPixel?.isActive && !!pixelId;
    
    useEffect(() => {
        if (isConfigured && typeof window !== "undefined" && window.fbq && window.__meta_pixel_active) {
            window.fbq("track", "PageView");
        }
    }, [pathname, searchParams, isConfigured]);

    return (
        <>
            {isConfigured && (
                <>
                    <Script
                        id="meta-pixel"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                                !function(f,b,e,v,n,t,s)
                                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                                n.queue=[];t=b.createElement(e);t.async=!0;
                                t.src=v;s=b.getElementsByTagName(e)[0];
                                s.parentNode.insertBefore(t,s)}(window, document,'script',
                                'https://connect.facebook.net/en_US/fbevents.js');
                                fbq('set', 'autoConfig', true, '${pixelId}');
                                ${user ? `
                                fbq('init', '${pixelId}', {
                                    em: '${user.email || ""}',
                                    ph: '${user.phone || user.phoneNumber || ""}',
                                    fn: '${user.name ? user.name.split(" ")[0] : ""}',
                                    ln: '${user.name ? user.name.split(" ").slice(1).join(" ") : ""}'
                                });
                                ` : `fbq('init', '${pixelId}');`}
                                window.__meta_pixel_active = true;
                            `,
                        }}
                    />
                    <noscript>
                        <img 
                            height="1" 
                            width="1" 
                            style={{ display: "none" }}
                            src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                            alt=""
                        />
                    </noscript>
                </>
            )}
            {children}
        </>
    );
}
