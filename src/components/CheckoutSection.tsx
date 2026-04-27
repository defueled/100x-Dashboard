'use client';
import Script from 'next/script';
import { ScrollReveal } from "./scroll";
import { useT } from "@/i18n/LangProvider";

export function CheckoutSection() {
    const t = useT();
    return (
        <section id="pievienoties" className="py-24 px-6 relative overflow-hidden">
            {/* Background blobs */}
            <div className="bg-blob bg-brand-green w-[40vw] h-[40vw] top-0 -left-[10%] opacity-10" />
            <div className="bg-blob bg-brand-blue w-[30vw] h-[30vw] bottom-0 right-[-5%] opacity-10" />

            <div className="max-w-2xl mx-auto relative z-10">
                <ScrollReveal variant="blurFadeIn" className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 bg-brand-green/10 text-brand-green text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                        {t("checkout.tag")}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        <span className="text-brand-dark">{t("checkout.title.a")} </span>
                        <span className="text-gradient-premium">{t("checkout.title.b")}</span>
                    </h2>
                    <p className="text-brand-dark/60 text-lg max-w-md mx-auto">
                        {t("checkout.subtitle")}
                    </p>
                </ScrollReveal>

                <ScrollReveal variant="scaleUp" delay={0.15}>
                <div className="glass-card rounded-[2rem] overflow-hidden shadow-premium">
                    <iframe
                        src="https://updates.maverick.lv/widget/form/o29v27nzeMeAkOqO8Pwj"
                        style={{ width: '100%', height: '1054px', border: 'none' }}
                        id="inline-o29v27nzeMeAkOqO8Pwj"
                        data-layout="{'id':'INLINE'}"
                        data-trigger-type="alwaysShow"
                        data-trigger-value=""
                        data-activation-type="alwaysActivated"
                        data-activation-value=""
                        data-deactivation-type="neverDeactivate"
                        data-deactivation-value=""
                        data-form-name="Jaunais pietiekums -  pay as you want! "
                        data-height="1054"
                        data-layout-iframe-id="inline-o29v27nzeMeAkOqO8Pwj"
                        data-form-id="o29v27nzeMeAkOqO8Pwj"
                        title="Jaunais pietiekums — maksā cik vēlies"
                    />
                </div>
                </ScrollReveal>
            </div>

            <Script
                src="https://updates.maverick.lv/js/form_embed.js"
                strategy="afterInteractive"
            />
        </section>
    );
}
