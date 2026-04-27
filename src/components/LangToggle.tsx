"use client";

import { useLang } from "@/i18n/LangProvider";

export function LangToggle({ className = "" }: { className?: string }) {
    const { locale, setLocale, t } = useLang();
    const next = locale === "lv" ? "en" : "lv";
    return (
        <button
            type="button"
            onClick={() => setLocale(next)}
            aria-label={t("lang.toggle.aria")}
            className={`text-xs font-bold tracking-widest uppercase px-2.5 py-1.5 rounded-full border border-black/10 bg-white/70 backdrop-blur-sm hover:bg-white transition-colors text-brand-dark ${className}`}
            title={t("lang.toggle.aria")}
        >
            {t("lang.toggle")}
        </button>
    );
}
