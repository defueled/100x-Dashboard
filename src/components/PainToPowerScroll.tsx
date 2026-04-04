"use client";

import { useState } from "react";
import { TrendingDown, ShieldAlert, BotOff, Wallet, CheckCircle2, TrendingUp, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const painPoints = [
    {
        id: "inflation",
        title: "Nauda zaudē vērtību",
        description: "Inflācija apēd iekrājumus. Alga no darba netiek līdzi veikalu cenām, un bankas krājkonts nedod reālu atdevi.",
        painIcon: TrendingDown,
        painColor: "text-rose-500",
        painBg: "bg-rose-500/10",
        solutionTitle: "TradFi & ETF",
        solutionDescription: "Mēs mācām saprast tirgu. Uzzināsi, kā atvērt kontu pie uzticama brokera un investēt S&P 500 ETF vai dividendēs, pārvēršot naudu par aktīvu, kas strādā tavā labā.",
        solutionIcon: TrendingUp,
        solutionColor: "text-brand-orange",
        solutionBg: "bg-brand-orange/10",
        solutionBorder: "border-brand-orange/30",
        perks: [
            "Brokeru un platformu izvēle",
            "ETF un Akciju pamati",
            "Pasīvā ienākuma stratēģijas"
        ]
    },
    {
        id: "scams",
        title: "Kripto liekas kā krāpniecība",
        description: "Mediji ziņo tikai par bankrotiem vai Meme-monētām. Baiļu un FOMO (Fear of Missing Out) dēļ ir viegli pieļaut kļūdas un manipulāciju tirgū pazaudēt visu.",
        painIcon: ShieldAlert,
        painColor: "text-amber-500",
        painBg: "bg-amber-500/10",
        solutionTitle: "Web3 & DeFi",
        solutionDescription: "Mācām atšķirt viltus projektus no reāliem blokķēdes protokoliem ar pastāvīgu vērtību. Apgūsi kustamos makus un decentralizētās finanses (DeFi).",
        solutionIcon: ShieldCheck,
        solutionColor: "text-brand-green",
        solutionBg: "bg-brand-green/10",
        solutionBorder: "border-brand-green/30",
        perks: [
            "Drošība un Wallets (Maki)",
            "Smart Contracts (Gudrie Līgumi)",
            "Vērtības un tirgus analīze"
        ]
    },
    {
        id: "ai_fear",
        title: "AI atņems manu darbu",
        description: "Automatizācija strauji ienāk visās sfērās. Šķiet, ka ChatGPT raksta kodus un tekstus labāk par cilvēkiem, radot nedrošību par savu kā darbinieka vērtību nākotnē.",
        painIcon: BotOff,
        painColor: "text-slate-500",
        painBg: "bg-slate-500/10",
        solutionTitle: "AI Instrumenti",
        solutionDescription: "AI neatņems tavu darbu. To izdarīs cits cilvēks, kurš māk šo rīku izmantot. 100x māca inženierijas pamatus ('Prompting') un darba plūsmas automatizāciju.",
        solutionIcon: Sparkles,
        solutionColor: "text-brand-blue",
        solutionBg: "bg-brand-blue/10",
        solutionBorder: "border-brand-blue/30",
        perks: [
            "Prompt Inženierija un ChatGPT",
            "Satura Radīšanas Automatizācija",
            "Biznesa Darbplūsmu (Workflows) pielāgošana"
        ]
    }
];

// --- 1. INFLATION ANIMATIONS ---
const InflationPain = () => (
    <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="w-full h-full bg-rose-950/20 flex flex-col items-center justify-center relative overflow-hidden"
    >
        {/* Red plummeting graph */}
        <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 100 100">
            <motion.polyline
                points="0,20 20,25 40,40 60,80 80,95 100,100"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
            />
            <path d="M0,20 L20,25 L40,40 L60,80 L80,95 L100,100 L100,100 L0,100 Z" fill="url(#redGrad)" className="opacity-20" />
            <defs>
                <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="transparent" />
                </linearGradient>
            </defs>
        </svg>
        <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [-1, 1, -1] }}
            transition={{ repeat: Infinity, duration: 0.2 }}
            className="text-rose-600 font-mono text-3xl md:text-4xl font-black z-10 drop-shadow-md tracking-tighter"
        >
            -8.4% INFLĀCIJA
        </motion.div>
        <div className="text-rose-500/80 font-bold text-xs uppercase mt-2 z-10 tracking-widest bg-rose-950/50 px-3 py-1 rounded-full backdrop-blur-sm">Iekrājumi Deg</div>
    </motion.div>
);

const TradFiPower = () => (
    <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="w-full h-full bg-brand-orange/10 flex flex-col items-center justify-center relative overflow-hidden"
    >
        {/* Green/Orange climbing graph */}
        <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 100 100">
            <motion.polyline
                points="0,100 20,80 40,85 60,50 80,40 100,10"
                fill="none"
                stroke="#f97316"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />
        </svg>
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-brand-orange font-bold text-3xl z-10 flex items-center gap-2"
        >
            <TrendingUp size={32} /> SALIKTIE PROCENTI
        </motion.div>
        <div className="text-brand-orange/80 text-xs font-bold mt-2 z-10 tracking-widest bg-brand-orange/10 px-3 py-1 rounded-full border border-brand-orange/20">S&P 500 / DIVIDENDES</div>
        <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute z-0 w-full h-full bg-brand-orange/10 blur-2xl rounded-full"
        />
    </motion.div>
);

// --- 2. CRYPTO SCAM ANIMATIONS ---
const CryptoScamPain = () => (
    <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="w-full h-full bg-amber-950/20 flex flex-col items-center justify-center relative overflow-hidden"
    >
        <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none" viewBox="0 0 100 100">
            <motion.polyline
                points="0,90 20,70 40,20 45,10 50,95 100,95"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            />
        </svg>
        <motion.div
            animate={{ opacity: [1, 0, 1], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 0.15, repeatType: "mirror" }}
            className="text-amber-500 font-mono text-4xl font-black z-10 drop-shadow-md tracking-tighter"
        >
            RUGPULL
        </motion.div>
        <div className="text-amber-500/80 font-bold text-xs uppercase mt-2 z-10 tracking-widest bg-amber-950/50 px-3 py-1 rounded-full">-99.9% PORTFELIS</div>
    </motion.div>
);

const DeFiPower = () => (
    <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="w-full h-full bg-brand-green/10 flex flex-col items-center justify-center relative overflow-hidden"
    >
        <motion.div
            initial={{ rotate: -90, opacity: 0, scale: 0 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="text-brand-green font-bold text-3xl z-10 flex items-center gap-2"
        >
            <ShieldCheck size={36} /> AUDITĒTI LĪGUMI
        </motion.div>
        <div className="text-brand-green/80 font-bold text-xs mt-2 z-10 tracking-widest bg-brand-green/10 px-3 py-1 rounded-full border border-brand-green/20">DECENTRALIZĒTAS FINANSES</div>
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="w-64 h-64 border-[1px] border-dashed border-brand-green rounded-full" />
            <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} className="w-48 h-48 border-[2px] border-dotted border-brand-green rounded-full absolute" />
        </div>
    </motion.div>
);

// --- 3. AI FEAR ANIMATIONS ---
const AIFearPain = () => (
    <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="w-full h-full bg-slate-900/10 flex flex-col items-center justify-center relative overflow-hidden"
    >
        <motion.div
            animate={{ x: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 0.1 }}
            className="text-slate-500 font-mono text-3xl font-black z-10 flex items-center gap-3 drop-shadow-md tracking-tighter"
        >
            <BotOff size={32} /> AI AIZVIETO
        </motion.div>
        <div className="w-64 h-3 bg-slate-200 rounded-full mt-4 overflow-hidden relative z-10 shadow-inner">
            <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "5%" }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                className="h-full bg-rose-500"
            />
        </div>
        <div className="text-slate-500/80 font-bold text-[10px] mt-2 z-10 tracking-widest uppercase">Cilvēka Vērtības Zudums</div>
    </motion.div>
);

const AIPower = () => (
    <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="w-full h-full bg-brand-blue/10 flex flex-col items-center justify-center relative overflow-hidden"
    >
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-brand-blue font-mono text-2xl font-bold z-10 bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm border border-brand-blue/20 shadow-sm"
        >
            <span className="text-brand-blue/50 mr-2">{">"}</span>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                run
            </motion.span>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                _100x
            </motion.span>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                _agent()
            </motion.span>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="ml-1 inline-block w-2 h-5 bg-brand-blue align-middle" />
        </motion.div>
        <div className="text-brand-blue/80 font-bold text-xs mt-3 z-10 tracking-widest uppercase px-3 py-1 bg-brand-blue/10 rounded-full border border-brand-blue/10">10x Produktivitāte</div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Particles flying up */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ y: 300, x: Math.random() * 800 - 400, opacity: 0 }}
                    animate={{ y: -100, opacity: [0, 1, 0] }}
                    transition={{ duration: Math.random() * 2 + 1, repeat: Infinity, delay: Math.random() * 2 }}
                    className="absolute bottom-0 left-1/2 w-1 h-4 bg-brand-blue/40 rounded-full"
                />
            ))}
        </div>
    </motion.div>
);


export function PainToPowerScroll() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const activeData = painPoints[activeIndex];
    const SolutionIcon = activeData.solutionIcon;

    return (
        <section className="py-24 px-6 md:px-0 max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
                <div className="inline-block px-4 py-1.5 rounded-full border border-brand-dark/20 bg-brand-dark/5 text-brand-dark text-sm font-bold tracking-wide uppercase mb-4">
                    Kāpēc tieši tagad?
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-dark mb-4">
                    No problēmas līdz <span className="text-gradient-premium">priekšrocībai</span>
                </h2>
                <p className="text-xl font-medium text-brand-dark/60 max-w-2xl mx-auto">
                    Mēs izprotam lielākos šķēršļus un bailes mūsdienu finanšu pasaulē. 100x ekosistēma ir tavs vairogs pret neziņu un vērtības zudumu.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">

                {/* Left Side: Pain Selection */}
                <div className="w-full lg:w-5/12 space-y-4">
                    {painPoints.map((point, index) => {
                        const Icon = point.painIcon;
                        const isActive = activeIndex === index;
                        return (
                            <button
                                key={point.id}
                                onClick={() => setActiveIndex(index)}
                                className={`w-full text-left p-6 rounded-3xl transition-all duration-300 border flex gap-6 items-start ${isActive
                                    ? "bg-white border-brand-dark/20 shadow-[0_8px_30px_rgb(0,0,0,0.06)] scale-100"
                                    : "glass-card border-white/30 hover:bg-white/50 scale-[0.98] opacity-70 hover:opacity-100"
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${point.painBg} ${point.painColor}`}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-brand-dark mb-2">{point.title}</h3>
                                    <p className="text-sm font-medium text-brand-dark/60 leading-relaxed">{point.description}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Right Side: Animated Transformation Canvas (Power) */}
                <div className="w-full lg:w-7/12 sticky top-24 pt-8 lg:pt-0">
                    <div
                        className="relative group cursor-pointer"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Glow effect matching the active solution color */}
                        <div className={`absolute -inset-1 ${activeData.solutionBg} blur-2xl rounded-3xl transition-colors duration-500 opacity-50`}></div>

                        <div className={`relative glass-card bg-white/90 rounded-[2rem] p-8 md:p-12 border-2 ${isHovered ? activeData.solutionBorder : 'border-gray-200'} shadow-premium transition-all duration-500 overflow-hidden`}>

                            {/* VISUALIZER CANVAS */}
                            <div className={`h-56 -mx-8 md:-mx-12 -mt-8 md:-mt-12 mb-8 relative border-b ${isHovered ? activeData.solutionBorder : 'border-gray-100'} transition-colors duration-500 bg-gray-50/50`}>
                                <AnimatePresence mode="wait">
                                    {!isHovered ? (
                                        <motion.div key="pain" className="w-full h-full absolute inset-0">
                                            {activeIndex === 0 && <InflationPain />}
                                            {activeIndex === 1 && <CryptoScamPain />}
                                            {activeIndex === 2 && <AIFearPain />}
                                        </motion.div>
                                    ) : (
                                        <motion.div key="power" className="w-full h-full absolute inset-0">
                                            {activeIndex === 0 && <TradFiPower />}
                                            {activeIndex === 1 && <DeFiPower />}
                                            {activeIndex === 2 && <AIPower />}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Instruction Float */}
                                <AnimatePresence>
                                    {!isHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
                                        >
                                            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200 shadow-sm flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Uzbīdi lai atrisinātu</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* SOLUTION TEXT DATA */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-colors duration-500 ${isHovered ? `${activeData.solutionBg} ${activeData.solutionColor}` : 'bg-gray-100 text-gray-400'}`}>
                                    <SolutionIcon size={24} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest mb-1">
                                        100x Risinājums
                                    </div>
                                    <h3 className={`text-2xl font-bold transition-colors duration-500 ${isHovered ? activeData.solutionColor : 'text-gray-900'}`}>
                                        {activeData.solutionTitle}
                                    </h3>
                                </div>
                            </div>

                            <p className="text-md text-brand-dark/80 font-medium leading-relaxed mb-6">
                                {activeData.solutionDescription}
                            </p>

                            <div className="bg-gray-50 rounded-2xl p-5 mb-8">
                                <h4 className="text-brand-dark font-bold text-sm mb-3 flex items-center gap-2">
                                    <Wallet size={16} className="text-brand-dark/40" /> Praksē apgūsi:
                                </h4>
                                <ul className="space-y-2">
                                    {activeData.perks.map((perk, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <CheckCircle2 size={16} className={`shrink-0 mt-0.5 transition-colors duration-500 ${isHovered ? activeData.solutionColor : 'text-gray-300'}`} />
                                            <span className="font-bold text-brand-dark/70 text-sm">{perk}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-white transition-all transform duration-300 shadow-lg ${!isHovered
                                    ? "bg-gray-800 hover:bg-brand-dark shadow-gray-200"
                                    : activeIndex === 0 ? "bg-brand-orange hover:bg-brand-orange/90 shadow-brand-orange/20"
                                        : activeIndex === 1 ? "bg-brand-green hover:bg-brand-green/90 shadow-brand-green/20"
                                            : "bg-brand-blue hover:bg-brand-blue/90 shadow-brand-blue/20"
                                }`}>
                                Aktivizēt {activeData.solutionTitle} Zināšanas <ArrowRight size={18} className={isHovered ? "animate-pulse" : ""} />
                            </button>

                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
