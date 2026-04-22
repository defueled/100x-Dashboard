"use client";

import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Zap, Crown, Medal, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface Member {
    rank: number;
    name: string;
    avatar: string | null;
    xp: number;
    streak: number;
    level: number;
}

const RANK_STYLES: Record<number, { bg: string; text: string; icon: React.ReactNode }> = {
    1: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-600', icon: <Crown size={16} className="text-amber-500" /> },
    2: { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-500', icon: <Medal size={16} className="text-gray-400" /> },
    3: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-600', icon: <Medal size={16} className="text-orange-400" /> },
};

function Avatar({ name, src, size = 40 }: { name: string; src: string | null; size?: number }) {
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    if (src) {
        return <img src={src} alt={name} className="rounded-full object-cover" style={{ width: size, height: size }} />;
    }
    return (
        <div
            className="rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-black text-white"
            style={{ width: size, height: size, fontSize: size * 0.35 }}
        >
            {initials || '?'}
        </div>
    );
}

export function LeaderboardView({ currentUserEmail }: { currentUserEmail?: string }) {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchLeaderboard = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        try {
            const res = await fetch('/api/leaderboard');
            const data = await res.json();
            setMembers(data.members || []);
        } catch {
            // silently fail — empty state handles it
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchLeaderboard(); }, []);

    const top3 = members.slice(0, 3);
    const rest = members.slice(3);

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 bg-[#F8FAF9]/50">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                            <Trophy className="text-amber-500" size={24} /> Līderu Saraksts
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">Top 100x biedri pēc uzkrātajiem XP</p>
                    </div>
                    <button
                        onClick={() => fetchLeaderboard(true)}
                        disabled={refreshing}
                        className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-emerald-500 hover:border-emerald-200 transition-all shadow-sm disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                    </button>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-16 bg-white rounded-2xl border border-gray-100 animate-pulse" />
                        ))}
                    </div>
                ) : members.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <Trophy size={40} className="text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold">Nav datu vēl</p>
                        <p className="text-sm text-gray-300 mt-1">Sāc vākt XP — ienāc pirmajā vietā!</p>
                    </div>
                ) : (
                    <>
                        {/* Top 3 Podium */}
                        {top3.length > 0 && (
                            <div className="grid grid-cols-3 gap-4">
                                {/* 2nd place */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex flex-col items-center pt-6"
                                >
                                    {top3[1] && (
                                        <>
                                            <Avatar name={top3[1].name} src={top3[1].avatar} size={56} />
                                            <div className="mt-3 text-center">
                                                <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-sm font-black text-gray-500 mx-auto mb-1">2</div>
                                                <p className="text-sm font-bold text-gray-900 truncate max-w-[90px]">{top3[1].name}</p>
                                                <p className="text-xs font-black text-gray-400">{top3[1].xp.toLocaleString()} XP</p>
                                            </div>
                                            <div className="w-full mt-3 bg-gray-100 rounded-t-2xl h-20 flex items-center justify-center">
                                                <Medal size={24} className="text-gray-400" />
                                            </div>
                                        </>
                                    )}
                                </motion.div>

                                {/* 1st place */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0 }}
                                    className="flex flex-col items-center"
                                >
                                    {top3[0] && (
                                        <>
                                            <div className="relative">
                                                <Avatar name={top3[0].name} src={top3[0].avatar} size={72} />
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">👑</div>
                                            </div>
                                            <div className="mt-3 text-center">
                                                <div className="w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center text-sm font-black text-white mx-auto mb-1">1</div>
                                                <p className="text-sm font-bold text-gray-900 truncate max-w-[90px]">{top3[0].name}</p>
                                                <p className="text-xs font-black text-amber-600">{top3[0].xp.toLocaleString()} XP</p>
                                            </div>
                                            <div className="w-full mt-3 bg-amber-400 rounded-t-2xl h-32 flex items-center justify-center">
                                                <Crown size={28} className="text-white" />
                                            </div>
                                        </>
                                    )}
                                </motion.div>

                                {/* 3rd place */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex flex-col items-center pt-10"
                                >
                                    {top3[2] && (
                                        <>
                                            <Avatar name={top3[2].name} src={top3[2].avatar} size={48} />
                                            <div className="mt-3 text-center">
                                                <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center text-sm font-black text-orange-500 mx-auto mb-1">3</div>
                                                <p className="text-sm font-bold text-gray-900 truncate max-w-[90px]">{top3[2].name}</p>
                                                <p className="text-xs font-black text-gray-400">{top3[2].xp.toLocaleString()} XP</p>
                                            </div>
                                            <div className="w-full mt-3 bg-orange-100 rounded-t-2xl h-14 flex items-center justify-center">
                                                <Medal size={20} className="text-orange-400" />
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            </div>
                        )}

                        {/* Ranks 4–20 */}
                        {rest.length > 0 && (
                            <div className="space-y-2">
                                {rest.map((m, i) => {
                                    const style = RANK_STYLES[m.rank] || { bg: 'bg-white border-gray-100', text: 'text-gray-400', icon: null };
                                    return (
                                        <motion.div
                                            key={m.rank}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            className={`flex items-center gap-4 p-4 rounded-2xl border ${style.bg}`}
                                        >
                                            <div className={`w-8 text-center text-sm font-black ${style.text}`}>
                                                {m.rank}
                                            </div>
                                            <Avatar name={m.name} src={m.avatar} size={36} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate">{m.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Līmenis {m.level}</p>
                                            </div>
                                            <div className="flex items-center gap-4 shrink-0">
                                                {m.streak > 0 && (
                                                    <div className="flex items-center gap-1 text-xs font-bold text-orange-500">
                                                        <Flame size={12} /> {m.streak}d
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1 text-xs font-black text-emerald-600">
                                                    <Zap size={12} /> {m.xp.toLocaleString()}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
