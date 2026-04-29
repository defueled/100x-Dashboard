"use client";

import React, { useState, useEffect } from 'react';
import {
    Zap,
    Trophy,
    Clock,
    Flame,
    CheckCircle2,
    Sparkles,
    GraduationCap,
} from 'lucide-react';
import { MintinaBalanceChip, MintinaAirdropCard, MintinaMarketCard } from './mintins/MintinaStats';
import { motion } from 'framer-motion';

const PRATIBA_PILLARS = [
    { key: 'ai',      label: 'AI Pratība',       emoji: '🤖', accent: '#59b687' },
    { key: 'tradfi',  label: 'TradFi Pratība',   emoji: '📈', accent: '#4A9EE5' },
    { key: 'defi',    label: 'DeFi Pratība',     emoji: '⛓️', accent: '#188bf6' },
    { key: 'culture', label: 'Kultūras Pratība', emoji: '🎨', accent: '#F5A623' },
] as const;

interface PratibaTask { id: string; pillar: string; bonus_xp?: number; xp_amount?: number }
interface PratibaClaim { task_id: string; claim_type: 'base' | 'bonus' }

function PratibaProgressPanel() {
    const [tasks, setTasks] = useState<PratibaTask[]>([]);
    const [claims, setClaims] = useState<PratibaClaim[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/tasks')
            .then(r => r.json())
            .then((d: { tasks?: PratibaTask[]; claims?: PratibaClaim[] }) => {
                setTasks(d.tasks || []);
                setClaims(d.claims || []);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    // Build per-task claim map: { base?: true, bonus?: true }
    const claimMap = new Map<string, { base?: boolean; bonus?: boolean }>();
    for (const c of claims) {
        const e = claimMap.get(c.task_id) || {};
        if (c.claim_type === 'base') e.base = true;
        else if (c.claim_type === 'bonus') e.bonus = true;
        claimMap.set(c.task_id, e);
    }

    const pillarStats = PRATIBA_PILLARS.map(p => {
        const list = tasks.filter(t => t.pillar === p.key);
        const total = list.length;
        const done = list.filter(t => {
            const c = claimMap.get(t.id);
            return !!c?.base || !!c?.bonus;
        }).length;
        const unclaimedBonus = list.filter(t => {
            const c = claimMap.get(t.id);
            return !!c?.base && !c?.bonus;
        }).length;
        const newCount = list.filter(t => !claimMap.get(t.id)).length;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        return { ...p, total, done, unclaimedBonus, newCount, pct };
    });

    return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm md:col-span-2">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                        <GraduationCap size={18} className="text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900">Pratība Progress</h3>
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">4 Stabi</span>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-14 bg-gray-50 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {pillarStats.map(p => (
                        <div key={p.key} className="p-4 bg-gray-50 rounded-2xl">
                            <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-base shrink-0">{p.emoji}</span>
                                    <span className="text-xs font-black text-gray-900 truncate">{p.label}</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-[10px] font-bold text-gray-500">
                                        <strong className="text-gray-900">{p.done}</strong>/{p.total} <span className="text-gray-400 uppercase tracking-widest">pabeigts</span>
                                    </span>
                                    {p.unclaimedBonus > 0 && (
                                        <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                                            {p.unclaimedBonus} bonuss
                                        </span>
                                    )}
                                    {p.newCount > 0 && (
                                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                            {p.newCount} jauns
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="h-1.5 bg-white rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all"
                                    style={{ width: `${p.pct}%`, backgroundColor: p.accent }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Flying stars particle effect
function FlyingStars() {
    const stars = Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * 360;
        const distance = 80 + Math.random() * 120;
        const x = Math.cos((angle * Math.PI) / 180) * distance;
        const y = Math.sin((angle * Math.PI) / 180) * distance;
        const delay = Math.random() * 0.2;
        const size = 6 + Math.random() * 10;
        return { x, y, delay, size, id: i };
    });

    return (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
            {stars.map(s => (
                <motion.div
                    key={s.id}
                    initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    animate={{ opacity: 0, x: s.x, y: s.y, scale: 0 }}
                    transition={{ duration: 0.8, delay: s.delay, ease: 'easeOut' }}
                    className="absolute left-1/2 top-1/2"
                    style={{ fontSize: s.size }}
                >
                    ⭐
                </motion.div>
            ))}
        </div>
    );
}

interface DashboardHomeProps {
    session: any;
    dbProgress: any[];
    profileData?: any;
    seasonMultiplier: number;
    onGmClaim: () => Promise<void>;
}

export function DashboardHome({ session, dbProgress, profileData, seasonMultiplier, onGmClaim }: DashboardHomeProps) {
    const [gmLoading, setGmLoading] = useState(false);
    const [gmData, setGmData] = useState<any>(null);
    const [countdown, setCountdown] = useState('');
    const [showStars, setShowStars] = useState(false);
    const [alreadyClaimedMsg, setAlreadyClaimedMsg] = useState(false);

    const displayMultiplier = `${seasonMultiplier}x`;
    const totalXp = profileData?.total_xp || dbProgress.reduce((sum, p) => sum + (p.xp_earned || p.xp_amount || 0), 0);

    // GM cooldown: 12 hours since last claim (not calendar day).
    const GM_COOLDOWN_MS = 12 * 60 * 60 * 1000;
    const lastGmMs = (() => {
        if (gmData?.lastGmAt) return new Date(gmData.lastGmAt).getTime();
        if (profileData?.last_gm_at) return new Date(profileData.last_gm_at).getTime();
        return 0;
    })();
    const isClaimedToday = Boolean(gmData?.success) || (lastGmMs > 0 && Date.now() - lastGmMs < GM_COOLDOWN_MS);

    // Live countdown to next GM window (last_gm_at + 12h).
    useEffect(() => {
        const tick = () => {
            if (!lastGmMs) { setCountdown(''); return; }
            const diff = lastGmMs + GM_COOLDOWN_MS - Date.now();
            if (diff <= 0) { setCountdown('00:00:00'); return; }
            const h = Math.floor(diff / 3_600_000);
            const m = Math.floor((diff % 3_600_000) / 60_000);
            const s = Math.floor((diff % 60_000) / 1_000);
            setCountdown(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
        };
        tick();
        const id = setInterval(tick, 1_000);
        return () => clearInterval(id);
    }, [lastGmMs, GM_COOLDOWN_MS]);

    const handleGm = async () => {
        // If already claimed, show message instead of hitting API
        if (isClaimedToday) {
            setAlreadyClaimedMsg(true);
            setTimeout(() => setAlreadyClaimedMsg(false), 3000);
            return;
        }
        setGmLoading(true);
        try {
            const res = await fetch('/api/gm/claim', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                setGmData(data);
                setShowStars(true);
                setTimeout(() => setShowStars(false), 1200);
                await onGmClaim();
            } else if (data.error === 'Already claimed today') {
                setAlreadyClaimedMsg(true);
                setTimeout(() => setAlreadyClaimedMsg(false), 3000);
            }
        } finally {
            setGmLoading(false);
        }
    };

    const currentLevel = Math.floor(Math.sqrt(totalXp / 100)) + 1;
    const nextLevelXp = Math.pow(currentLevel, 2) * 100;
    const prevLevelXp = Math.pow(currentLevel - 1, 2) * 100;
    const progressPercent = Math.min(((totalXp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100, 100);

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 bg-[#F8FAF9]/50">
            <div className="max-w-6xl mx-auto flex flex-col gap-5 md:gap-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 order-2 md:order-1">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                            Sveiks, {session?.user?.name?.split(' ')[0]}! 🚀
                        </h1>
                        <p className="text-sm text-gray-400 font-medium">Tavs šīsdienas progress.</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <MintinaBalanceChip evmAddress={profileData?.evm_address} />
                        <div className="px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2">
                            <Clock size={16} className="text-emerald-500" />
                            <span className="text-xs font-bold text-gray-600">Sezona 1: Turpinās</span>
                        </div>
                    </div>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-auto order-1 md:order-2">

                    {/* GM WIDGET */}
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        animate={gmData?.success ? { scale: [1, 1.02, 1] } : {}}
                        transition={{ duration: 0.4 }}
                        className="md:col-span-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-200 relative"
                    >
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">Airdrop Reizinātājs</span>
                                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-100"><Flame size={12} /> {displayMultiplier}</span>
                                </div>
                                <h2 className="text-4xl font-black mb-4 uppercase italic tracking-tighter">
                                    {isClaimedToday ? 'GM iekasēts!' : `Saki GM, saņem +${gmData?.xpCount ?? 100} XP!`}
                                </h2>
                                <p className="text-sm text-emerald-50/80 mb-8 max-w-xs font-medium">
                                    {isClaimedToday
                                        ? <>Streak: <strong>{gmData?.streak ?? profileData?.gm_streak ?? 0} dienas</strong> · Reizinātājs: <strong>{displayMultiplier}</strong></>
                                        : <>Ienāc katru dienu. Pašlaik: <strong>{displayMultiplier}</strong> airdrop reizinātājs.</>
                                    }
                                </p>

                                {/* XP celebration banner */}
                                {gmData?.success && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className="mb-4 px-5 py-3 bg-white/20 rounded-2xl backdrop-blur-sm text-center"
                                    >
                                        <p className="text-2xl font-black">+{gmData.xpCount ?? 100} XP</p>
                                        <p className="text-xs font-bold text-emerald-100">Streak: {gmData.streak} dienas · {gmData.multiplier} reizinātājs</p>
                                    </motion.div>
                                )}
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={handleGm}
                                    disabled={gmLoading}
                                    className={`w-full py-5 rounded-2xl font-black text-lg transition-all transform active:scale-95 shadow-lg ${
                                        isClaimedToday ? 'bg-white/30 text-white/80' : 'bg-white text-emerald-600 hover:bg-emerald-50'
                                    }`}
                                >
                                    {gmLoading ? 'SINHRONIZĒ...' : isClaimedToday ? 'IEKASĒTS' : 'Iesākt dienu (GM)'}
                                </button>
                                {isClaimedToday && (
                                    <div className="flex items-center justify-center gap-2 text-white/70 text-sm font-bold">
                                        <Clock size={14} />
                                        <span>Nākamais GM pēc {countdown}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Flying stars on claim */}
                        {showStars && <FlyingStars />}

                        {/* Already claimed toast */}
                        {alreadyClaimedMsg && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg"
                            >
                                <p className="text-xs font-bold text-gray-700 whitespace-nowrap">
                                    Jau iekasēts! Nākamais pēc {countdown}
                                </p>
                            </motion.div>
                        )}

                        <Zap size={200} className="absolute -right-20 -bottom-20 text-white/10 rotate-12" />
                        <Sparkles size={100} className="absolute right-10 top-10 text-white/10" />
                    </motion.div>

                    {/* XP PROGRESS */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
                                <Trophy className="text-amber-500" size={24} />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 mb-1 leading-tight">Līmenis {currentLevel}</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
                                Līdz nākamajam {nextLevelXp - totalXp} XP
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    className="h-full bg-amber-500 rounded-full"
                                />
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-2xl font-black text-gray-900">{totalXp}</span>
                                <span className="text-[10px] font-bold text-gray-400 pb-1">KOPĒJAIS XP</span>
                            </div>
                        </div>
                    </div>

                    {/* MINTINA AIRDROP */}
                    <MintinaAirdropCard totalXp={totalXp} seasonMultiplier={seasonMultiplier} />

                    {/* QUICK TASKS */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm md:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-gray-900">Šodienas Focus</h3>
                            <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Visi uzdevumi</button>
                        </div>
                        <div className="space-y-3">
                            {(() => {
                                // GM is "done" if claimed within the last 12h, not just per React state.
                                const lastGm = profileData?.last_gm_at ? new Date(profileData.last_gm_at).getTime() : 0;
                                const gmOnCooldown = Boolean(gmData?.success) || (lastGm > 0 && Date.now() - lastGm < 12 * 60 * 60 * 1000);
                                // Onboarding counts as done if the profile has the flag OR they already
                                // have goals/skill_level filled (legacy rows without the flag).
                                const onboardingDone = Boolean(
                                    profileData?.onboarding_complete ||
                                    (profileData?.goals && profileData.goals.length > 0) ||
                                    profileData?.skill_level
                                );
                                return [
                                    { t: 'Saki GM — saņem +100 XP', c: 'Ik pēc 12h', xp: 100, done: gmOnCooldown },
                                    { t: 'Pievieno EVM adresi profilā', c: 'Airdrop setup', xp: 100, done: Boolean(profileData?.evm_address) },
                                    { t: 'Aizpildi onboarding anketu', c: 'Profils · +50 XP', xp: 50, done: onboardingDone },
                                ];
                            })().map((task, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center justify-between p-4 rounded-2xl transition-colors group ${
                                        task.done
                                            ? 'bg-gray-50/50 opacity-60'
                                            : 'bg-gray-50 hover:bg-emerald-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${task.done ? 'bg-emerald-500 text-white' : 'bg-white text-gray-400 border border-gray-200'}`}>
                                            {task.done ? <CheckCircle2 size={16} /> : <Zap size={16} className="group-hover:text-emerald-500" />}
                                        </div>
                                        <div>
                                            <p className={`text-xs font-bold ${task.done ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.t}</p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{task.c}</p>
                                        </div>
                                    </div>
                                    {task.done ? (
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Iegūts</span>
                                    ) : (
                                        <span className="text-[10px] font-black text-amber-500">+{task.xp} XP</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PRATĪBA PROGRESS PANEL — per-pillar what to do / done / new */}
                    <PratibaProgressPanel />

                    {/* TELEGRAM CARD — pushed to bottom of grid */}
                    <a
                        href="https://t.me/+AzkOgTHpNENmYjU0"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-gradient-to-br from-[#229ED9] to-[#1a7ab0] rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200 flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300"
                    >
                        <div>
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-black text-white mb-1 leading-tight">Kopiena Telegram</h3>
                            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Diskusijas · Jaunumi · Support</p>
                        </div>
                        <div className="mt-6 w-full py-3 bg-white text-[#229ED9] rounded-2xl font-black text-sm text-center shadow-lg group-hover:bg-blue-50 transition-colors">
                            Pievienojies →
                        </div>
                    </a>

                    {/* MINTINA MARKET — pushed to bottom of grid */}
                    <MintinaMarketCard />

                </div>
            </div>
        </div>
    );
}
