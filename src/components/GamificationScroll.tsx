"use client";

import { Trophy, Gift, Vote, ArrowRight, CheckCircle } from "lucide-react";
import { ScrollReveal, SpringCounter, DotGrid } from "./scroll";

export function GamificationScroll() {
    return (
        <section className="py-24 px-6 md:px-0 max-w-6xl mx-auto relative z-10">
            <DotGrid dotColor="rgba(24, 139, 246, 0.08)" gap={24} />
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">

                {/* Text Content - Left Side */}
                <ScrollReveal variant="slideLeft" className="w-full md:w-1/2 space-y-8">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-brand-green/30 bg-brand-green/10 text-brand-green text-sm font-bold tracking-wide uppercase mb-2">
                        Spēles teorija un DAO
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-dark leading-tight">
                        Mācies. Krāj XP. <span className="text-gradient-premium">Ietekmē.</span>
                    </h2>
                    <p className="text-xl text-brand-dark/70 font-medium leading-relaxed">
                        Tava iesaiste tiek atalgota. Piedalies diskusijās, apgūsti materiālus un kāp līmeņos, lai atbloķētu privilēģijas un piedalītos DAO lēmumos.
                    </p>

                    <ul className="space-y-5">
                        <li className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0 mt-1">
                                <Trophy size={20} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-brand-dark">XP Punktu Sistēma</h4>
                                <p className="text-brand-dark/60 font-medium">Lasi, komentē un palīdzi citiem. Krājot punktus, atbloķē jaunus kursus un konsultācijas.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0 mt-1">
                                <Vote size={20} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-brand-dark">DAO Balsojumi</h4>
                                <p className="text-brand-dark/60 font-medium">Biedriem (Level 4+) ir balstiesības. Kopīgi lemjam par budžetu un tālākiem tēriņiem platformas attīstībai.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0 mt-1">
                                <Gift size={20} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-brand-dark">Airdrop Kampaņas</h4>
                                <p className="text-brand-dark/60 font-medium">Regulāri Web3 uzdevumi, par kuru veikšanu iespējams saņemt atlīdzības un bonusus sadarbības platformās.</p>
                            </div>
                        </li>
                    </ul>

                    <button
                        onClick={() => document.getElementById('pievienoties')?.scrollIntoView({ behavior: 'smooth' })}
                        className="group mt-8 bg-brand-dark text-white px-8 py-3.5 rounded-full font-bold text-lg flex items-center gap-3 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-brand-dark/20"
                    >
                        Sāc pelnīt pieredzi
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </ScrollReveal>

                {/* Visual Content - Right Side */}
                <ScrollReveal variant="scaleUp" className="w-full md:w-1/2 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-brand-green/20 blur-3xl rounded-full -z-10"></div>

                    {/* User Level Card Mockup */}
                    <div className="glass-card rounded-3xl p-8 border border-white/20 shadow-premium relative flex flex-col items-center justify-center">
                        <div className="relative mb-6">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle className="text-brand-dark/5" strokeWidth="8" stroke="currentColor" fill="transparent" r="58" cx="64" cy="64" />
                                <circle className="text-brand-green drop-shadow-md" strokeWidth="8" strokeDasharray="364" strokeDashoffset="120" strokeLinecap="round" stroke="currentColor" fill="transparent" r="58" cx="64" cy="64" />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                <span className="text-3xl font-bold text-brand-dark">Lvl <SpringCounter target={4} className="inline" /></span>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-brand-dark mb-1">Tu esi Inovators</h3>
                        <p className="text-sm font-medium text-brand-dark/60 mb-6">Līdz Level 5 atlikuši <SpringCounter target={450} className="inline font-bold text-brand-green" /> XP</p>

                        <div className="w-full flex justify-between items-center bg-brand-dark/5 rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                                    <Vote size={18} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-brand-dark">DAO Tiesības</p>
                                    <p className="text-xs text-brand-dark/60 font-medium">Atslēgtas</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 flex items-center justify-center text-brand-green">
                                <CheckCircle size={24} />
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

            </div>
        </section>
    );
}
