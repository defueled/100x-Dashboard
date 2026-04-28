"use client";

import Image from "next/image";
import { useT } from "@/i18n/LangProvider";

export function Footer() {
    const t = useT();
    return (
        <footer className="bg-[var(--color-background)] py-12 px-6 border-t border-brand-dark/10 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 right-[-10%] w-[30vw] h-[30vw] bg-brand-green/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-[-10%] w-[40vw] h-[40vw] bg-brand-blue/10 blur-[120px] rounded-full" />

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left relative z-10">
                <div className="flex flex-col items-center md:items-start gap-1">
                    <Image
                        src="/assets/logos/100x-refined-logo.png"
                        alt="100x.lv"
                        width={40}
                        height={40}
                        className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity"
                    />
                    <p className="text-xs text-brand-dark/50 font-medium tracking-wide">{t("footer.tagline").replace("2026", String(new Date().getFullYear()))}</p>
                </div>

                {/* Lieldraugs — ClickScale partnership */}
                <a
                    href="https://clickscale.agency"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={t("footer.lieldraugs.aria")}
                    className="group flex items-center gap-2.5 rounded-full bg-white/60 hover:bg-white px-3 py-1.5 border border-brand-dark/10 hover:border-brand-blue/30 shadow-sm hover:shadow transition-all"
                >
                    <Image
                        src="/assets/logos/clickscale.png"
                        alt="ClickScale"
                        width={28}
                        height={28}
                        className="h-7 w-7 rounded-full object-contain shrink-0"
                    />
                    <span className="text-[9px] uppercase tracking-[0.2em] text-brand-dark/40 font-bold leading-none">{t("footer.lieldraugs")}</span>
                    <span className="text-sm font-bold text-brand-dark/80 group-hover:text-brand-blue transition-colors leading-none">ClickScale</span>
                </a>

                <div className="flex items-center gap-3">
                    <p className="text-xs text-brand-dark/50 font-medium">{t("footer.join")}</p>
                    <a
                        href="https://t.me/+AzkOgTHpNENmYjU0"
                        target="_blank"
                        rel="noreferrer"
                        title="100x Telegram Kopiena"
                        className="w-9 h-9 rounded-full bg-[#229ED9]/10 flex items-center justify-center text-[#229ED9] hover:bg-[#229ED9] hover:text-white transition-all duration-200"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}
