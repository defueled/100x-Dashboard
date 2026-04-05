"use client";

import React, { useState, useEffect } from 'react';
import {
    User,
    Link2,
    Wallet,
    Globe,
    Twitter,
    Save,
    Shield,
    Camera,
    Loader2,
    Trophy,
    Crown,
    Lock,
    Zap,
    Flame,
    Edit3,
    Target
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import { GHL_LEVELS, getGhlLevelFromTags } from '@/lib/ghlLevels';
import { OnboardingWizard } from '../OnboardingWizard';

const GOAL_LABELS: Record<string, string> = {
    web3: '🔗 Web3 & DeFi',
    ai: '🤖 AI & Automatizācija',
    trading: '📈 Trading & Ieguldījumi',
    building: '🛠 Veidot Projektus',
    community: '🌍 Networking',
};

const SKILL_LABELS: Record<string, string> = {
    beginner: '🌱 Iesācējs',
    intermediate: '⚡ Vidējs',
    advanced: '🔥 Pieredzējis',
};

const calculateLevel = (xp: number) => Math.floor(Math.sqrt(xp / 100)) + 1;

export function ProfileSettings() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [daoLoading, setDaoLoading] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [profile, setProfile] = useState({
        evm_address: '',
        profile_description: '',
        display_name: '',
        goals: [] as string[],
        skill_level: '',
        total_xp: 0,
        gm_streak: 0,
        socials: {
            x: '',
            webpage: ''
        }
    });

    useEffect(() => {
        if (session?.user?.email) {
            fetchProfile();
        }
    }, [session]);

    const fetchProfile = async () => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('email', session?.user?.email)
                .single();

            if (data) {
                const rawSocials = data.socials ?? {};
                setProfile({
                    evm_address: data.evm_address ?? '',
                    profile_description: data.profile_description ?? '',
                    display_name: data.display_name ?? '',
                    goals: Array.isArray(data.goals) ? data.goals : [],
                    skill_level: data.skill_level ?? '',
                    total_xp: data.total_xp ?? 0,
                    gm_streak: data.gm_streak ?? 0,
                    socials: {
                        x: rawSocials.x ?? '',
                        webpage: rawSocials.webpage ?? ''
                    }
                });
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDaoJoin = async () => {
        setDaoLoading(true);
        try {
            const res = await fetch('/api/dao/invite', { method: 'POST' });
            const data = await res.json();
            if (data.deepLink) {
                window.open(data.deepLink, '_blank');
            }
        } finally {
            setDaoLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error: sError } = await supabase
                .from('profiles')
                .update({
                    evm_address: profile.evm_address,
                    profile_description: profile.profile_description,
                    display_name: profile.display_name,
                    socials: profile.socials
                })
                .eq('email', session?.user?.email);

            if (sError) throw sError;

            const response = await fetch('/api/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile)
            });

            if (!response.ok) {
                console.error('GHL Sync failed');
            }

            alert('Profils veiksmīgi atjaunots! 🚀');
        } catch (err) {
            console.error('Error saving profile:', err);
            alert('Kļūda saglabājot profilu.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-emerald-500" size={32} />
            </div>
        );
    }

    const ghl_tags = (session?.user as any)?.ghl_tags || [];
    const currentGhlLevel = getGhlLevelFromTags(ghl_tags);

    // XP level math (matches DashboardHome + API formula)
    const totalXp = profile.total_xp;
    const currentLevel = calculateLevel(totalXp);
    const nextLevelXp = Math.pow(currentLevel, 2) * 100;
    const prevLevelXp = Math.pow(currentLevel - 1, 2) * 100;
    const progressPercent = Math.min(
        ((totalXp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100,
        100
    );

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
            {/* Onboarding re-open from profile */}
            {showOnboarding && (
                <OnboardingWizard
                    userName={session?.user?.name || profile.display_name || ''}
                    onComplete={() => {
                        setShowOnboarding(false);
                        fetchProfile();
                    }}
                />
            )}

            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                             Iestatījumi
                        </h1>
                        <p className="text-sm text-gray-400">Pārvaldi savu identitāti un airdrop maciņu</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg shadow-gray-200 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        Saglabāt izmaiņas
                    </button>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Avatar, XP Stats & Airdrop info */}
                    <div className="md:col-span-1 space-y-6">
                        {/* Avatar card */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center overflow-hidden">
                                    {session?.user?.image ? (
                                        <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={40} className="text-emerald-500" />
                                    )}
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-white border border-gray-100 rounded-full shadow-md text-gray-400 hover:text-emerald-500 transition-colors">
                                    <Camera size={14} />
                                </button>
                            </div>
                            <h2 className="mt-4 font-bold text-gray-900">
                                {profile.display_name || session?.user?.name}
                            </h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{session?.user?.email}</p>
                        </div>

                        {/* XP Stats card */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-500">
                                    <Zap size={14} />
                                </div>
                                <h3 className="text-sm font-bold text-gray-700">Tavs Progress</h3>
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-emerald-50 rounded-xl p-3">
                                    <div className="text-lg font-black text-emerald-700">{totalXp.toLocaleString()}</div>
                                    <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">XP</div>
                                </div>
                                <div className="bg-indigo-50 rounded-xl p-3">
                                    <div className="text-lg font-black text-indigo-700">{currentLevel}</div>
                                    <div className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider">Līmenis</div>
                                </div>
                                <div className="bg-orange-50 rounded-xl p-3">
                                    <div className="flex items-center justify-center gap-0.5">
                                        <Flame size={14} className="text-orange-500" />
                                        <span className="text-lg font-black text-orange-700">{profile.gm_streak}</span>
                                    </div>
                                    <div className="text-[9px] font-bold text-orange-500 uppercase tracking-wider">Sērija</div>
                                </div>
                            </div>

                            {/* XP progress bar */}
                            <div>
                                <div className="flex justify-between text-[10px] text-gray-400 font-bold mb-1.5">
                                    <span>Līdz līmenim {currentLevel + 1}</span>
                                    <span>{totalXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl text-white shadow-xl shadow-emerald-100">
                            <div className="flex items-center gap-2 mb-4">
                                <Shield size={18} className="opacity-80" />
                                <h3 className="text-sm font-bold">Airdrop Drošība</h3>
                            </div>
                            <p className="text-[11px] leading-relaxed opacity-90">
                                Tavs EVM maciņš ir vieta, kur saņemsi visus Mintiņš airdrops. Pārliecinies, ka adrese ir pareiza!
                            </p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Goals & Skill Level */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-violet-50 text-violet-600">
                                        <Target size={18} />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Mērķi & Līmenis</h3>
                                </div>
                                <button
                                    onClick={() => setShowOnboarding(true)}
                                    className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-violet-600 transition-colors"
                                >
                                    <Edit3 size={12} />
                                    Labot
                                </button>
                            </div>

                            {profile.goals.length > 0 || profile.skill_level ? (
                                <div className="space-y-3">
                                    {profile.goals.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {profile.goals.map(g => (
                                                <span key={g} className="px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-xs font-bold border border-violet-100">
                                                    {GOAL_LABELS[g] || g}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {profile.skill_level && (
                                        <div>
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                                                {SKILL_LABELS[profile.skill_level] || profile.skill_level}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-sm text-gray-400 mb-3">Nav aizpildīts onboarding</p>
                                    <button
                                        onClick={() => setShowOnboarding(true)}
                                        className="px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-bold hover:bg-violet-700 transition-all"
                                    >
                                        Aizpildīt profilu → +50 XP
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* GHL Community Level Section */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                                    <Trophy size={18} />
                                </div>
                                <h3 className="font-bold text-gray-900">GHL Foruma Līmenis</h3>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                {GHL_LEVELS.map(level => {
                                    const isCurrent = level.level === currentGhlLevel;
                                    const isUnlocked = level.level <= currentGhlLevel;
                                    return (
                                        <div key={level.level} className={`p-4 rounded-xl border-2 flex flex-col items-center text-center transition-all ${isCurrent ? 'border-indigo-500 bg-indigo-50/30' : isUnlocked ? 'border-emerald-100 bg-white' : 'border-gray-50 bg-gray-50 opacity-50 grayscale'}`}>
                                            <span className="text-2xl mb-1">{level.emoji}</span>
                                            <span className={`font-black text-sm ${isCurrent ? 'text-indigo-700' : 'text-gray-900'}`}>Lvl {level.level}</span>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{level.title}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* DAO Access Section */}
                        {currentGhlLevel >= 4 ? (
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-sm">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="p-2 rounded-lg bg-white/10 text-yellow-400">
                                        <Crown size={18} />
                                    </div>
                                    <h3 className="font-bold text-white">100x DAO 🔐</h3>
                                </div>
                                <p className="text-gray-300 text-sm font-semibold mb-1">Ekskluzīva piekļuve DAO biedru grupai</p>
                                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                    Tu esi sasniedzis Lvl 4 — Pētnieks. Apsveicu, tev ir tiesības pievienoties privātajai DAO grupai Telegram.
                                </p>
                                <button
                                    onClick={handleDaoJoin}
                                    disabled={daoLoading}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all disabled:opacity-50"
                                >
                                    {daoLoading ? <Loader2 className="animate-spin" size={16} /> : <Crown size={16} />}
                                    Pievienojies DAO Telegram →
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="p-2 rounded-lg bg-gray-100 text-gray-400">
                                        <Lock size={18} />
                                    </div>
                                    <h3 className="font-bold text-gray-900">100x DAO 🔐</h3>
                                    <span className="ml-auto px-2 py-0.5 bg-gray-100 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-wider">Slēgts</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-500 mb-4">Nepieciešams: Lvl 4 — Pētnieks 🔍</p>
                                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                                    <div
                                        className="bg-indigo-500 h-2 rounded-full transition-all"
                                        style={{ width: `${Math.min((currentGhlLevel / 4) * 100, 100)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 font-semibold mb-3">Tavs līmenis: {currentGhlLevel} / 4</p>
                                <p className="text-[11px] text-gray-400">Apmeklē GHL forumus un paaugstini savu līmeni</p>
                            </div>
                        )}

                        {/* Display Name + Wallet + Socials */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
                                    <Link2 size={18} />
                                </div>
                                <h3 className="font-bold text-gray-900">Identitāte & Sociālie Tīkli</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {/* Display name */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5">
                                        <User size={10} /> Vārds Komūnā
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Tavs vārds vai nick..."
                                        value={profile.display_name}
                                        onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    />
                                </div>

                                {/* X (Twitter) */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5">
                                        <Twitter size={10} /> X (Twitter) Konts
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="@lietotajvards"
                                        value={profile.socials.x}
                                        onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, x: e.target.value } })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    />
                                </div>

                                {/* Website */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5">
                                        <Globe size={10} /> Mājaslapa
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="https://tavabizness.lv"
                                        value={profile.socials.webpage}
                                        onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, webpage: e.target.value } })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    />
                                </div>

                                {/* Profile description */}
                                <div className="space-y-1.5 pt-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5">
                                        Profila Apraksts
                                    </label>
                                    <textarea
                                        rows={4}
                                        placeholder="Pastāsti par sevi vai savu projektu..."
                                        value={profile.profile_description}
                                        onChange={(e) => setProfile({ ...profile, profile_description: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* EVM Wallet */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                    <Wallet size={18} />
                                </div>
                                <h3 className="font-bold text-gray-900">EVM Maciņa Adrese</h3>
                            </div>
                            <input
                                type="text"
                                placeholder="0x..."
                                value={profile.evm_address}
                                onChange={(e) => setProfile({ ...profile, evm_address: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                            <p className="mt-2 text-[10px] text-gray-400">Atbalsta Base, Ethereum, Polygon u.c. saderīgus tīklus.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
