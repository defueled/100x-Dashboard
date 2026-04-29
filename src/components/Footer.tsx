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

                <div className="flex items-center gap-3 flex-wrap justify-center">
                    <p className="text-xs text-brand-dark/50 font-medium">{t("footer.join")}</p>
                    <a
                        href="https://t.me/+AzkOgTHpNENmYjU0"
                        target="_blank"
                        rel="noreferrer"
                        title="100x Telegram Kopiena"
                        aria-label="Telegram"
                        className="w-9 h-9 rounded-full bg-[#229ED9]/10 flex items-center justify-center text-[#229ED9] hover:bg-[#229ED9] hover:text-white transition-all duration-200"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                    </a>
                    <a
                        href="https://www.linkedin.com/company/107874816"
                        target="_blank"
                        rel="noreferrer"
                        title="100x LinkedIn"
                        aria-label="LinkedIn"
                        className="w-9 h-9 rounded-full bg-[#0A66C2]/10 flex items-center justify-center text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all duration-200"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </a>
                    <a
                        href="https://www.facebook.com/100XABC/"
                        target="_blank"
                        rel="noreferrer"
                        title="100x Facebook"
                        aria-label="Facebook"
                        className="w-9 h-9 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all duration-200"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    </a>
                    <a
                        href="https://www.instagram.com/100x.lv/"
                        target="_blank"
                        rel="noreferrer"
                        title="100x Instagram"
                        aria-label="Instagram"
                        className="w-9 h-9 rounded-full bg-[#E1306C]/10 flex items-center justify-center text-[#E1306C] hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white transition-all duration-200"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.849.07 3.26.149 4.771 1.699 4.919 4.92.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.265.058-1.644.07-4.849.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                        </svg>
                    </a>
                    <a
                        href="https://www.tiktok.com/@100xabc"
                        target="_blank"
                        rel="noreferrer"
                        title="100x TikTok"
                        aria-label="TikTok"
                        className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-200"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}
