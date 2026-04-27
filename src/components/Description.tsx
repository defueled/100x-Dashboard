"use client";

import { Bot, BarChart3, Globe, Users } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem, DotGrid, Spotlight } from "./scroll";
import { useT } from "@/i18n/LangProvider";

export function Description() {
    const t = useT();
    return (
        <section className="py-24 px-6 md:px-0 max-w-6xl mx-auto relative overflow-hidden z-10">
            {/* Dot Grid Background — WOW effect from Gorilla SOP */}
            <DotGrid dotColor="rgba(89, 182, 135, 0.12)" gap={32} />

            {/* Background Colorful Clouds */}
            <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] bg-brand-green/15 blur-[120px] rounded-full animate-float pointer-events-none -z-10" />
            <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] bg-brand-blue/15 blur-[100px] rounded-full animate-float-delayed pointer-events-none -z-10" />

            <ScrollReveal variant="blurFadeIn" className="text-center mb-16 relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-dark mb-4">
                    {t("desc.h2")}
                </h2>
                <p className="text-xl font-medium text-brand-dark/70 max-w-2xl mx-auto">
                    {t("desc.subtitle")}
                </p>
            </ScrollReveal>

            {/* Bento Grid layout — staggered reveal */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 relative z-10" staggerDelay={0.15}>

                {/* 1. Kārts: AI Optimizācija (Plašāka) */}
                <StaggerItem className="md:col-span-2 md:row-span-1">
                    <Spotlight className="glass-card rounded-3xl p-8 shadow-premium hover:shadow-glow-green overflow-hidden relative group transition-all duration-300 h-full">
                        <div className="absolute top-0 right-0 p-8 text-brand-blue/10 group-hover:text-brand-blue/20 transition-colors duration-300 transform group-hover:scale-110">
                            <Bot size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue mb-6">
                                <Bot size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-brand-dark mb-3">{t("desc.card1.title")}</h3>
                            <p className="text-brand-dark/70 font-medium max-w-sm">
                                {t("desc.card1.body")}
                            </p>
                        </div>
                    </Spotlight>
                </StaggerItem>

                {/* 2. Kārts: Slēgtais Forums */}
                <StaggerItem className="md:col-span-1 md:row-span-2">
                    <Spotlight className="glass-card rounded-3xl p-8 shadow-premium hover:-translate-y-1 overflow-hidden relative group transition-all duration-300 flex flex-col h-full">
                        <div className="relative z-10 flex-grow">
                            <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange mb-6">
                                <Users size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-brand-dark mb-3">{t("desc.card2.title")}</h3>
                            <p className="text-brand-dark/70 font-medium mb-8">
                                {t("desc.card2.body")}
                            </p>
                        </div>

                        {/* Visual element representing forum activity */}
                        <div className="mt-auto pt-6 border-t border-brand-dark/10 space-y-4">
                            <div className="flex gap-3 items-center opacity-80">
                                <div className="w-8 h-8 rounded-full bg-brand-dark/10 shrink-0"></div>
                                <div className="h-4 w-3/4 bg-brand-dark/10 rounded-full"></div>
                            </div>
                            <div className="flex gap-3 items-center opacity-60">
                                <div className="w-8 h-8 rounded-full bg-brand-dark/10 shrink-0"></div>
                                <div className="h-4 w-1/2 bg-brand-dark/10 rounded-full"></div>
                            </div>
                            <div className="flex gap-3 items-center opacity-40">
                                <div className="w-8 h-8 rounded-full bg-brand-dark/10 shrink-0"></div>
                                <div className="h-4 w-2/3 bg-brand-dark/10 rounded-full"></div>
                            </div>
                        </div>
                    </Spotlight>
                </StaggerItem>

                {/* 3. Kārts: FinTech / DeFi */}
                <StaggerItem className="md:col-span-1 md:row-span-1">
                    <Spotlight className="glass-card rounded-3xl p-8 shadow-premium hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group h-full">
                        <div className="absolute -bottom-8 -right-8 text-brand-green/10 group-hover:text-brand-green/20 transition-colors duration-300">
                            <BarChart3 size={150} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green mb-6">
                                <BarChart3 size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-2">{t("desc.card3.title")}</h3>
                            <p className="text-sm font-medium text-brand-dark/70">
                                {t("desc.card3.body")}
                            </p>
                        </div>
                    </Spotlight>
                </StaggerItem>

                {/* 4. Kārts: Web 3.0 */}
                <StaggerItem className="md:col-span-1 md:row-span-1">
                    <Spotlight className="glass-card rounded-3xl p-8 shadow-premium hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group h-full">
                        <div className="absolute -bottom-8 -right-8 text-brand-dark/5 group-hover:text-brand-dark/10 transition-colors duration-300">
                            <Globe size={150} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-brand-dark/5 flex items-center justify-center text-brand-dark mb-6">
                                <Globe size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-2">{t("desc.card4.title")}</h3>
                            <p className="text-sm font-medium text-brand-dark/70">
                                {t("desc.card4.body")}
                            </p>
                        </div>
                    </Spotlight>
                </StaggerItem>

            </StaggerContainer>
        </section>
    );
}
