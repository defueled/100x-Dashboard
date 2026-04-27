"use client";

import { useState } from "react";
import { Bot, Globe, BarChart3, ArrowRight, ArrowUpRight } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./scroll";

const topics = [
    {
        id: "ai",
        label: "Mākslīgais Intelekts",
        icon: Bot,
        color: "text-brand-blue",
        bgColor: "bg-brand-blue/10",
        borderColor: "border-brand-blue/20",
        activeTab: "bg-brand-blue",
        phases: [
            {
                title: "1. Sākums",
                period: "1950 – 2020",
                content:
                    "AI pirmsākumi – teorētiski modeļi, šahrista programmas, pirmie neironu tīkli. Bija pieejams tikai lielām korporācijām ar miljoniem dolāru budžetiem. Maz kas no tā bija pieejams \"normālam cilvēkam\".",
                tag: "Vēsture"
            },
            {
                title: "2. Tagadne",
                period: "2020 – 2025",
                content:
                    "ChatGPT, Claude, Gemini – jebkurš var izmantot AI, lai rakstītu tekstus, analizētu datus, rakstītu kodu vai pat vadītu savu uzņēmumu. Cilvēks ar AI palīgu ir 10x produktīvāks.",
                tag: "Šodien"
            },
            {
                title: "3. Nākotne",
                period: "2025 →",
                content:
                    "AI aģenti bez cilvēka klātbūtnes darbosies autonomi. Vienkāršo profesiju darbs tiks automatizēts. Uzvarēs tie, kas apgūst AI kā rīku un iekļauj to savā biznesa procesā pirms pārējiem.",
                tag: "Nākotne"
            }
        ]
    },
    {
        id: "web3",
        label: "Web3 & Kripto",
        icon: Globe,
        color: "text-brand-green",
        bgColor: "bg-brand-green/10",
        borderColor: "border-brand-green/20",
        activeTab: "bg-brand-green",
        phases: [
            {
                title: "1. Sākums",
                period: "2008 – 2017",
                content:
                    "Satoshi Nakamoto publicē Bitcoin White Paper. Ideja – beztrasta digitālā valūta, kas nepieder nevienai bankai. Vairums cilvēku to uzskatīja par hobi vai joku.",
                tag: "Vēsture"
            },
            {
                title: "2. Tagadne",
                period: "2017 – 2025",
                content:
                    "Ethereum uveda gudros līgumus (Smart Contracts), kas atļāva veidot decentralizētas applikācijas (DeFi, NFT, DAO). Tagad ir tūkstošiem projektu, institucionāli investori un regulācija.",
                tag: "Šodien"
            },
            {
                title: "3. Nākotne",
                period: "2025 →",
                content:
                    "Reālās pasaules aktīvu tokenizācija (mājokļi, akcijas, zeme). Web3 identitāte, decentralizēti sociālie tīkli. Mass Adoption – miljardiem lietotāju, kas pat nezinās, ka izmanto blockchain.",
                tag: "Nākotne"
            }
        ]
    },
    {
        id: "fintech",
        label: "FinTech & DeFi",
        icon: BarChart3,
        color: "text-brand-orange",
        bgColor: "bg-brand-orange/10",
        borderColor: "border-brand-orange/20",
        activeTab: "bg-brand-orange",
        phases: [
            {
                title: "1. Sākums",
                period: "Pre-2010",
                content:
                    "Tradicionālās finanses – banka kā vienīgais starpnieks. Augsti komisijas procenti, lēni pārskaitījumi, necaurspīdīgi nosacījumi. Vienkāršs cilvēks bez piekļuves sarežģītiem finanšu rīkiem.",
                tag: "Vēsture"
            },
            {
                title: "2. Tagadne",
                period: "2010 – 2025",
                content:
                    "DeFi protokoli piedāvā % likmes kontam, kas paceļas līdz 10-20% gadā. Stablecoins nomaina tradicionālo valstsvalūtu. Uz blockchain bazētas aizdevuma, apdrošināšanas un tirdzniecības platformas.",
                tag: "Šodien"
            },
            {
                title: "3. Nākotne",
                period: "2025 →",
                content:
                    "CBDC (Centrālās bankas digitālās valūtas), programmējamas naudas, aktīvu tokenizācija. Decentralizētās exchanges apsteigs tradicionālos vērtspapīru biržu apgrozījumus. Finanšu iekļaušana globālā mērogā.",
                tag: "Nākotne"
            }
        ]
    }
];

export function TechEvolution() {
    const [activeTopic, setActiveTopic] = useState("ai");
    const topic = topics.find(t => t.id === activeTopic)!;
    const Icon = topic.icon;

    return (
        <section className="py-24 px-6 md:px-0 max-w-6xl mx-auto relative z-10">
            <ScrollReveal variant="blurFadeIn" className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-dark mb-4">
                    Izproti nākotnes tehnoloģijas
                </h2>
                <p className="text-xl font-medium text-brand-dark/60 max-w-2xl mx-auto">
                    No idejas līdz pasaules revolūcijai. Apgūsti kontekstu — kur esam bijuši, kur esam un kur ejam.
                </p>
            </ScrollReveal>

            {/* Topic Tabs */}
            <div className="flex flex-wrap gap-3 justify-center mb-12">
                {topics.map(t => {
                    const TIcon = t.icon;
                    const isActive = t.id === activeTopic;
                    return (
                        <button
                            key={t.id}
                            onClick={() => setActiveTopic(t.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm border transition-all duration-300 ${isActive
                                    ? `${t.activeTab} text-white border-transparent shadow-lg`
                                    : `glass-card border-white/30 text-brand-dark hover:-translate-y-0.5`
                                }`}
                        >
                            <TIcon size={16} />
                            {t.label}
                        </button>
                    );
                })}
            </div>

            {/* Timeline Cards */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.15}>
                {topic.phases.map((phase, index) => (
                    <StaggerItem key={index}>
                    <div
                        className={`glass-card rounded-3xl p-8 border ${topic.borderColor} shadow-premium hover:-translate-y-1 transition-all duration-300 relative overflow-hidden h-full`}
                    >
                        {/* Phase number watermark */}
                        <div className={`absolute -right-4 -top-4 text-8xl font-black opacity-5 ${topic.color}`}>
                            {index + 1}
                        </div>

                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${topic.bgColor} ${topic.color}`}>
                            {phase.tag}
                        </div>

                        <div className={`w-12 h-12 rounded-2xl ${topic.bgColor} flex items-center justify-center ${topic.color} mb-5`}>
                            <Icon size={22} />
                        </div>

                        <h3 className="text-xl font-bold text-brand-dark mb-1">{phase.title}</h3>
                        <p className={`text-xs font-bold ${topic.color} opacity-70 mb-4 tracking-wider`}>{phase.period}</p>
                        <p className="text-brand-dark/70 font-medium leading-relaxed text-sm">{phase.content}</p>

                        {index === 2 && (
                            <div className="mt-8 pt-4 border-t border-brand-dark/10">
                                <a href="#" className={`flex items-center gap-2 text-sm font-bold ${topic.color} hover:gap-3 transition-all`}>
                                    Apgūsti ar 100x ekosistēmu <ArrowUpRight size={16} />
                                </a>
                            </div>
                        )}
                    </div>
                    </StaggerItem>
                ))}
            </StaggerContainer>
        </section>
    );
}
