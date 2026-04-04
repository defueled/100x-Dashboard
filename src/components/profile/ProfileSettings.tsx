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
    Trophy
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import { GHL_LEVELS, getGhlLevelFromTags } from '@/lib/ghlLevels';

export function ProfileSettings() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        evm_address: '',
        profile_description: '',
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
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('email', session?.user?.email)
                .single();

            if (data) {
                const rawSocials = data.socials ?? {};
                setProfile({
                    evm_address: data.evm_address ?? '',
                    profile_description: data.profile_description ?? '',
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

    const handleSave = async () => {
        setSaving(true);
        try {
            // 1. Update Supabase
            const { error: sError } = await supabase
                .from('profiles')
                .update({
                    evm_address: profile.evm_address,
                    profile_description: profile.profile_description,
                    socials: profile.socials
                })
                .eq('email', session?.user?.email);

            if (sError) throw sError;

            // 2. Sync to GHL via API
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

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
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
                    {/* Left Column: Avatar & Crypto */}
                    <div className="md:col-span-1 space-y-6">
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
                            <h2 className="mt-4 font-bold text-gray-900">{session?.user?.name}</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{session?.user?.email}</p>
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

                    {/* Right Column: Address, Socials & GHL Levels */}
                    <div className="md:col-span-2 space-y-6">
                        
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

                        {/* Wallet Section */}
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
                                onChange={(e) => setProfile({...profile, evm_address: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                            <p className="mt-2 text-[10px] text-gray-400">Atbalsta Base, Ethereum, Polygon u.c. saderīgus tīklus.</p>
                        </div>

                        {/* Socials Section */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
                                    <Link2 size={18} />
                                </div>
                                <h3 className="font-bold text-gray-900">Sociālie Tīkli & Mājaslapa</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5">
                                        <Twitter size={10} /> X (Twitter) Konts
                                    </label>
                                    <input 
                                        type="text"
                                        placeholder="@lietotajvards"
                                        value={profile.socials.x}
                                        onChange={(e) => setProfile({...profile, socials: {...profile.socials, x: e.target.value}})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5">
                                        <Globe size={10} /> Mājaslapa
                                    </label>
                                    <input 
                                        type="text"
                                        placeholder="https://tavabizness.lv"
                                        value={profile.socials.webpage}
                                        onChange={(e) => setProfile({...profile, socials: {...profile.socials, webpage: e.target.value}})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5 pt-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5">
                                        Profila Apraksts
                                    </label>
                                    <textarea 
                                        rows={4}
                                        placeholder="Pastāsti par sevi vai savu projektu..."
                                        value={profile.profile_description}
                                        onChange={(e) => setProfile({...profile, profile_description: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
