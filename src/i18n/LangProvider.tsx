"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LOCALE, LOCALES, type Locale, dictionary, type DictKey } from "./dictionary";

const STORAGE_KEY = "100x:locale";
const COOKIE_KEY = "locale";

type LangContextValue = {
    locale: Locale;
    setLocale: (l: Locale) => void;
    t: (k: DictKey) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

function readInitialLocale(initial: Locale): Locale {
    if (typeof window === "undefined") return initial;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && LOCALES.includes(stored as Locale)) return stored as Locale;
    const cookieMatch = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_KEY}=([^;]+)`));
    if (cookieMatch && LOCALES.includes(cookieMatch[1] as Locale)) return cookieMatch[1] as Locale;
    const nav = window.navigator.language?.toLowerCase() ?? "";
    if (nav.startsWith("lv")) return "lv";
    return initial === "lv" ? "lv" : "en";
}

export function LangProvider({ initialLocale = DEFAULT_LOCALE, children }: { initialLocale?: Locale; children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(initialLocale);

    useEffect(() => {
        setLocaleState(readInitialLocale(initialLocale));
    }, [initialLocale]);

    useEffect(() => {
        document.documentElement.lang = locale;
    }, [locale]);

    const setLocale = useCallback((l: Locale) => {
        setLocaleState(l);
        try {
            window.localStorage.setItem(STORAGE_KEY, l);
            document.cookie = `${COOKIE_KEY}=${l}; path=/; max-age=31536000; samesite=lax`;
        } catch {
            // storage unavailable — silent
        }
    }, []);

    const t = useCallback((k: DictKey): string => dictionary[locale][k] ?? dictionary[DEFAULT_LOCALE][k] ?? k, [locale]);

    const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

    return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
    const ctx = useContext(LangContext);
    if (!ctx) {
        return {
            locale: DEFAULT_LOCALE,
            setLocale: () => {},
            t: (k) => dictionary[DEFAULT_LOCALE][k] ?? k,
        };
    }
    return ctx;
}

export function useT() {
    return useLang().t;
}
