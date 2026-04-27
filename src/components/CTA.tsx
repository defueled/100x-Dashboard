'use client';

import { ScrollReveal } from "./scroll";
import { useT } from "@/i18n/LangProvider";

export function CTA() {
    const t = useT();
    const scrollToCheckout = () => {
        document.getElementById('pievienoties')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-32 px-6 bg-transparent relative overflow-hidden">
            {/* Background Blobs */}
            <div className="bg-blob bg-brand-orange w-[30vw] h-[30vw] top-[20%] -right-[10%] opacity-10" />
            <div className="bg-blob bg-brand-green w-[50vw] h-[50vw] -bottom-[20%] -left-[20%] opacity-10" />

            <ScrollReveal variant="scaleUp" className="max-w-4xl mx-auto text-center relative z-10 glass-card rounded-[3rem] p-12 md:p-20 shadow-premium">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                    <span className="text-brand-dark">{t("cta.title")} </span>
                    <span className="text-gradient-premium">{t("cta.title.accent")}</span>
                </h2>
                <p className="text-xl text-brand-dark/70 font-medium mb-10 max-w-2xl mx-auto whitespace-pre-line">
                    {t("cta.subtitle")}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="relative inline-block group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue via-brand-green to-brand-blue rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                        <button onClick={scrollToCheckout} className="relative bg-brand-dark text-white px-10 py-4 rounded-full font-bold text-lg tracking-wide shadow-2xl flex items-center gap-3 transition-transform duration-300 hover:-translate-y-1">
                            {t("cta.primary")}
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>
                    <a
                        href="https://t.me/+AzkOgTHpNENmYjU0"
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg tracking-wide border-2 border-brand-dark/20 text-brand-dark hover:border-[#229ED9] hover:text-[#229ED9] transition-all duration-300 hover:-translate-y-1"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                        {t("cta.telegram")}
                    </a>
                </div>
            </ScrollReveal>
        </section>
    );
}
