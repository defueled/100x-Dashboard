import React, { useState, useEffect } from 'react';
import { 
    Zap, 
    Trophy, 
    TrendingUp, 
    Coins, 
    ArrowUpRight, 
    Clock, 
    Flame,
    Gem,
    BarChart3,
    CheckCircle2,
    Calendar,
    Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

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
    const [marketData, setMarketData] = useState<any>(null);

    const displayMultiplier = `${seasonMultiplier}x`;

    // Calculate XP to next level
    const totalXp = dbProgress.reduce((sum, p) => sum + (p.xp_earned || p.xp_amount || 0), 0);

    // Season 1 Airdrop: total XP × season multiplier (GM streak + GHL level bonus)
    const estimatedAirdrop = totalXp * seasonMultiplier;

    // Mock/Fetch Dexscreener Data
    useEffect(() => {
        const fetchMarket = async () => {
            try {
                // Mintiņš Token address: 0xDE65d5B4D9E2E9E94f99E94Eea9fE9495048b08F (Example)
                const res = await fetch('https://api.dexscreener.com/latest/dex/tokens/0xDE65d5B4D9E2E9E94f99E94Eea9fE9495048b08F');
                const data = await res.json();
                if (data.pairs?.[0]) {
                    setMarketData(data.pairs[0]);
                }
            } catch (err) {
                console.error('Dexscreener fetch error:', err);
            }
        };
        fetchMarket();
    }, []);

    const handleGm = async () => {
        setGmLoading(true);
        try {
            const res = await fetch('/api/gm/claim', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                setGmData(data);
                await onGmClaim(); // Refresh parent stats
            }
        } finally {
            setGmLoading(false);
        }
    };

    // Matches XP claim API formula: floor(sqrt(xp / 100)) + 1
    const currentLevel = Math.floor(Math.sqrt(totalXp / 100)) + 1;
    const nextLevelXp = Math.pow(currentLevel, 2) * 100;
    const prevLevelXp = Math.pow(currentLevel - 1, 2) * 100;
    const progressPercent = Math.min(((totalXp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100, 100);

    return (
        <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAF9]/50">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Veseļi, {session?.user?.name?.split(' ')[0]}! 🚀</h1>
                        <p className="text-sm text-gray-400 font-medium">Tavs šīsdienas progress un Mintiņš statuss.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2">
                            <Clock size={16} className="text-emerald-500" />
                            <span className="text-xs font-bold text-gray-600">Sezona 1: Turpinās</span>
                        </div>
                    </div>
                </div>

                {/* Main Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    
                    {/* GM WIDGET */}
                    <motion.div 
                        whileHover={{ scale: 1.01 }}
                        className="md:col-span-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-200 relative overflow-hidden"
                    >
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">Sezonas Reizinātājs</span>
                                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-100"><Flame size={12} /> {displayMultiplier}</span>
                                </div>
                                <h2 className="text-4xl font-black mb-4 uppercase italic tracking-tighter">
                                    Saki GM, saņem +{gmData?.xpCount ?? 100} XP!
                                </h2>
                                <p className="text-sm text-emerald-50/80 mb-8 max-w-xs font-medium">
                                    Ienāc katru dienu un palielini savu sezonas reizinātāju. Pašlaik: <strong>{displayMultiplier}</strong> uz taviem XP.
                                </p>
                            </div>
                            
                            <button 
                                onClick={handleGm}
                                disabled={gmLoading || gmData?.success}
                                className={`w-full py-5 rounded-2xl font-black text-lg transition-all transform active:scale-95 shadow-lg ${
                                    gmData?.success ? 'bg-white/30 cursor-default' : 'bg-white text-emerald-600 hover:bg-emerald-50 hover:shadow-emerald-400'
                                }`}
                            >
                                {gmLoading ? 'SINHRONIZĒ...' : gmData?.success ? 'GM NOSŪTĪTS! ✅' : 'Iesākt dienu (GM)'}
                            </button>
                        </div>
                        {/* Decorative Background Icons */}
                        <Zap size={200} className="absolute -right-20 -bottom-20 text-white/10 rotate-12" />
                        <Sparkles size={100} className="absolute right-10 top-10 text-white/10" />
                    </motion.div>

                    {/* XP PROGRESS WIDGET */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
                                <Trophy className="text-amber-500" size={24} />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 mb-1 leading-tight">Līmenis {currentLevel}</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Līdz mērķim {1000 - (totalXp % 1000)} XP</p>
                        </div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    className="h-full bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,166,35,0.4)]"
                                />
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-2xl font-black text-gray-900">{totalXp}</span>
                                <span className="text-[10px] font-bold text-gray-400 pb-1">KOPĒJAIS XP</span>
                            </div>
                        </div>
                    </div>

                    {/* AIRDROP WIDGET */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                                <Coins className="text-indigo-500" size={24} />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 mb-1 leading-tight">Mintiņš Airdrop</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Paredzamais (S1)</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-black text-gray-900">{estimatedAirdrop.toLocaleString()}</p>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500">
                                <Gem size={14} />
                                <span>Reizinātājs: {displayMultiplier} 🚀</span>
                            </div>
                        </div>
                    </div>

                    {/* MARKET STATS (MINTIŅŠ STATUS) */}
                    <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white md:col-span-2 overflow-hidden relative group">
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-black text-white">$M</div>
                                    <div>
                                        <h3 className="font-black italic tracking-tight">MINTIŅŠ STATUS</h3>
                                        <p className="text-[10px] text-gray-400 tracking-widest uppercase font-bold">100x Ecological Token</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                    marketData ? ((marketData.priceChange?.h24 || 0) >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400') : 'bg-white/10 text-white/50'
                                }`}>
                                    {marketData ? `${marketData.priceChange?.h24 || '0'}% (24H)` : 'Staging Mode'}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Cena</p>
                                    <p className="text-3xl font-black italic tracking-tighter">
                                        {marketData?.priceUsd ? `$${marketData.priceUsd}` : '$0.001 (Est.)'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Market Cap</p>
                                    <p className="text-3xl font-black italic tracking-tighter">
                                        {marketData?.fdv ? `$${(marketData.fdv / 1000).toFixed(1)}K` : '$1.2M (Init)'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button className="flex-1 py-3 bg-emerald-500 text-gray-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">Buy $MINTINŠ</button>
                                <a 
                                    href="https://dexscreener.com/solana/0xDE65d5B4D9E2E9E94f99E94Eea9fE9495048b08F" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="p-3 bg-gray-800 rounded-xl hover:bg-gray-700 active:scale-95 transition-all"
                                >
                                    <ArrowUpRight size={18} />
                                </a>
                            </div>
                        </div>
                        {/* Fake Chart Lines in background */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-end">
                            <svg className="w-full h-1/2" viewBox="0 0 400 100" preserveAspectRatio="none">
                                <motion.path 
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                    d="M0,80 Q50,70 100,20 T200,50 T300,10 T400,60" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="4" 
                                />
                            </svg>
                        </div>
                    </div>

                    {/* TELEGRAM COMMUNITY CARD */}
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

                    {/* QUICK TASKS / NEWS PREVIEW */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm md:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-gray-900">Šodienas Focus</h3>
                            <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Visi uzdevumi</button>
                        </div>
                        <div className="space-y-3">
                            {[
                                { t: 'Pabeidz Prompting Pamatus', c: 'AI Pratība', xp: 50 },
                                { t: 'Pievieno EVM adresi profilā', c: 'Airdrop setup', xp: 100, done: true },
                                { t: 'Ieskaties AI ziņu plūsmā', c: 'Kopiena', xp: 20 }
                            ].map((task, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-emerald-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${task.done ? 'bg-emerald-500 text-white' : 'bg-white text-gray-400 border border-gray-200'}`}>
                                            {task.done ? <CheckCircle2 size={16} /> : <Zap size={16} className="group-hover:text-emerald-500" />}
                                        </div>
                                        <div>
                                            <p className={`text-xs font-bold ${task.done ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.t}</p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{task.c}</p>
                                        </div>
                                    </div>
                                    {!task.done && <span className="text-[10px] font-black text-amber-500">+{task.xp} XP</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
