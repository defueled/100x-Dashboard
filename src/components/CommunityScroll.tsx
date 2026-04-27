"use client";

import { MessageSquare, Video, CalendarHeart, ArrowRight } from "lucide-react";
import { ScrollReveal, ShimmerCard } from "./scroll";
import { useT } from "@/i18n/LangProvider";

export function CommunityScroll() {
    const t = useT();
    return (
        <section className="py-24 px-6 md:px-0 max-w-6xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">

                {/* Text Content - Right Side */}
                <ScrollReveal variant="slideRight" className="w-full md:w-1/2 space-y-8">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-brand-orange/30 bg-brand-orange/10 text-brand-orange text-sm font-bold tracking-wide uppercase mb-2">
                        {t("comm.tag")}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-dark leading-tight">
                        {t("comm.title.a")} <span className="text-brand-orange">{t("comm.title.b")}</span>
                    </h2>
                    <p className="text-xl text-brand-dark/70 font-medium leading-relaxed">
                        {t("comm.subtitle")}
                    </p>

                    <ul className="space-y-5">
                        <li className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0 mt-1">
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-brand-dark">{t("comm.bullet1.title")}</h4>
                                <p className="text-brand-dark/60 font-medium">{t("comm.bullet1.body")}</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0 mt-1">
                                <Video size={20} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-brand-dark">{t("comm.bullet2.title")}</h4>
                                <p className="text-brand-dark/60 font-medium">{t("comm.bullet2.body")}</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0 mt-1">
                                <CalendarHeart size={20} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-brand-dark">{t("comm.bullet3.title")}</h4>
                                <p className="text-brand-dark/60 font-medium">{t("comm.bullet3.body")}</p>
                            </div>
                        </li>
                    </ul>

                    <button
                        onClick={() => document.getElementById('pievienoties')?.scrollIntoView({ behavior: 'smooth' })}
                        className="group mt-8 bg-brand-dark text-white px-8 py-3.5 rounded-full font-bold text-lg flex items-center gap-3 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-brand-dark/20"
                    >
                        {t("comm.cta")}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </ScrollReveal>

                {/* Visual Content - Left Side */}
                <ScrollReveal variant="slideLeft" className="w-full md:w-1/2 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 to-brand-green/10 blur-3xl rounded-full -z-10"></div>

                    {/* Main Chat Mockup */}
                    <div className="glass-card rounded-3xl p-6 border border-white/20 shadow-premium relative md:translate-x-[-20px]">
                        <div className="flex border-b border-brand-dark/10 pb-4 mb-4 gap-3 items-center">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            <span className="text-sm font-bold text-brand-dark/60 ml-2"># alpha-calls</span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-green/20 shrink-0"></div>
                                <div className="bg-brand-dark/5 p-3 rounded-2xl rounded-tl-none">
                                    <div className="h-2 w-24 bg-brand-dark/20 rounded mb-2"></div>
                                    <div className="h-2 w-32 bg-brand-dark/10 rounded"></div>
                                </div>
                            </div>
                            <div className="flex gap-3 flex-row-reverse">
                                <div className="w-8 h-8 rounded-full bg-brand-blue/20 shrink-0"></div>
                                <div className="bg-brand-blue/10 p-3 rounded-2xl rounded-tr-none">
                                    <div className="h-2 w-20 bg-brand-blue/30 rounded mb-2"></div>
                                    <div className="h-2 w-40 bg-brand-blue/20 rounded"></div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-orange/20 shrink-0"></div>
                                <div className="bg-brand-dark/5 p-3 rounded-2xl rounded-tl-none">
                                    <div className="h-2 w-16 bg-brand-dark/20 rounded mb-2"></div>
                                    <div className="h-2 w-28 bg-brand-dark/10 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Zoom Session Notification */}
                    <ShimmerCard className="glass-card rounded-2xl p-4 border border-white/20 shadow-premium absolute top-[10%] right-[-5%] w-[60%] backdrop-blur-xl animate-float">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white">
                                    <Video size={16} />
                                </div>
                                <div className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full border-2 border-green-500"></div>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-brand-dark">{t("comm.live.label")}</p>
                                <p className="text-[10px] text-brand-dark/60 font-medium">{t("comm.live.sub")}</p>
                            </div>
                        </div>
                    </ShimmerCard>
                </ScrollReveal>

            </div>
        </section>
    );
}
