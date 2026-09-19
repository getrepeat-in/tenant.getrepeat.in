"use client";
import { themes } from "@/constants/fonts/themes";
import { createContext, useContext, useMemo } from "react";

const ThemeContext = createContext(null);
function flattenTheme(theme) {
    return {
        "--primary": theme.colors.primary,
        "--primary-foreground": theme.colors.primaryForeground,
        "--secondary": theme.colors.secondary,
        "--secondary-foreground": theme.colors.secondaryForeground,
        "--background": theme.colors.background,
        "--foreground": theme.colors.foreground,
        "--muted": theme.colors.muted,
        "--muted-foreground": theme.colors.mutedForeground,
    };
}

function generateCSS(vars) {
    return `:root, :host, body { ${Object.entries(vars)
        .map(([k, v]) => `${k}: ${v} !important;`)
        .join(" ")} }`;
}

export default function ThemeProvider({
    themeName = "default",
    theme: customTheme,
    children,
}) {
    const theme = useMemo(() => {
        return customTheme ?? themes[themeName] ?? themes.default;
    }, [themeName, customTheme]);

    const variables = useMemo(() => flattenTheme(theme), [theme]);
    const cssString = useMemo(() => generateCSS(variables), [variables]);

    return (
        <ThemeContext.Provider value={theme}>
            <style dangerouslySetInnerHTML={{ __html: cssString }} />
            <div style={variables} className="contents">
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const theme = useContext(ThemeContext);

    if (!theme) {
        throw new Error("useTheme must be used inside ThemeProvider");
    }

    return theme;
}