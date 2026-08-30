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
    };
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

    return (
        <ThemeContext.Provider value={theme}>
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