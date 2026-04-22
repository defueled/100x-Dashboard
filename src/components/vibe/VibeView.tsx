'use client';

import React, { useState, useEffect } from 'react';
import {
    Code2, Zap, ExternalLink, CheckCircle2, Loader2,
    Trophy, Star, Clock, ArrowUpRight, Flame, Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

// ─── SPRINT CONFIG ───────────────────────────────────────────
// Update this object each sprint — no DB needed for sprint metadata
const CURRENT_SPRINT = {
    id: 'sprint_1',
    number: 1,
    theme: 'Uzbūvē 100x Rīku',
    description: 'Izmanto AI, lai uzbūvētu rīku, kas palīdz 100x kopienai. Apraksti ideju, ļauj AI rakstīt kodu, publicē un iesniedz.',
    xpReward: 250,
    status: 'active' as const,
};

const TOOL_OPTIONS = [
    'Lovable', 'v0.dev', 'Bolt.new', 'Cursor',
    'Replit', 'Claude Code', 'Windsurf', 'Cits'
];

const STARTER_TOOLS = [
    { name: 'Lovable', desc: 'Pilna app bez koda', url: 'https://lovable.dev', color: '#FF4B4B' },
    { name: 'v0.dev', desc: 'UI komponentes ar AI', url: 'https://v0.dev', color: '#000000' },
    { name: 'Bolt.new', desc: 'Ātra prototipēšana', url: 'https://bolt.new', color: '#6C47FF' },
    { name: 'Cursor', desc: 'AI koda editors', url: 'https://cursor.sh', color: '#3B82F6' },
    { name: 'Replit', desc: 'Live pair coding', url: 'https://replit.com', color: '#F26207' },
    { name: 'Claude Code', desc: 'Sarežģīti projekti', url: 'https://claude.ai/code', color: '#CC785C' },
];

interface VibeBuild {
    id: string;
    user_email: string;
    user_name: string | null;
    user_avatar: string | null;
    title: string;
    description: string | null;
    url: string;
    tools: string[];
    sprint_id: string;
    created_at: string;
}

interface VibeViewProps {
    session: any;
    dbProgress: any[];
    syncProgress: (questId: string, progress: number, xp: number) => Promise<void>;
}

export function VibeView({ session, dbProgress, syncProgress }: VibeViewProps) {
    const [builds, setBuilds] = useState<VibeBuild[]>([]);
    const [buildsLoading, setBuildsLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTools, setSelectedTools] = useState<string[]>([]);

    const questId = `vibe_${CURRENT_SPRINT.id}_build`;
    const alreadySubmitted = dbProgress.some(p => p.quest_id === questId && p.status === 'completed');

    useEffect(() => {
        fetchBuilds();
    }, []);

    // Open form automatically if logged in and hasn't submitted yet
    useEffect(() => {
        if (session && !alreadySubmitted && !submitSuccess) {
            setFormOpen(true);
        }
    }, [session, alreadySubmitted, submitSuccess]);

    const fetchBuilds = async () => {
        setBuildsLoading(true);
        try {
            const res = await fetch('/api/vibe/builds');
            const data = await res.json();
            setBuilds(Array.isArray(data) ? data : []);
        } catch {
            setBuilds([]);
        } finally {
            setBuildsLoading(false);
        }
    };

    const toggleTool = (tool: string) => {
        setSelectedTools(prev =>
            prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
        );
    };

    const handleSubmit = async () => {
        if (!title.trim() || !url.trim()) {
            setSubmitError('Nosaukums un URL ir obligāti.');
            return;
        }
        setSubmitting(true);
        setSubmitError('');
        try {
            const res = await fetch('/api/vibe/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    url: url.trim(),
                    description: description.trim(),
                    tools: selectedTools,
                    sprint_id: CURRENT_SPRINT.id,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setSubmitError(data.error || 'Kļūda iesniedzot build.');
                return;
            }
            setSubmitSuccess(true);
            setFormOpen(false);
            // Sync XP locally so parent state updates without page refresh
            await syncProgress(questId, 100, CURRENT_SPRINT.xpReward);
            await fetchBuilds();
        } catch {
            setSubmitError('Savienojuma kļūda. Mēģini vēlreiz.');
        } finally {
            setSubmitting(false);
        }
    };

    const isSubmitted = alreadySubmitted || submitSuccess;

    return (
        <div className="flex-1 overflow-y-auto bg-[#F8FAF9]/50 pt-14 md:pt-0">
            {/* Header */}
            <header className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10">
                        <Code2 size={18} className="text-emerald-600" />
                    </div>
                    <h1 className="text-lg font-bold">VibeCoding Hub</h1>
                    <span className="text-[10px] font-bold bg-emerald-500 text-white px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                        <Flame size={10} /> Sprint {CURRENT_SPRINT.number}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Users size={14} />
                    <span className="font-bold">{builds.length} builds</span>
                </div>
            </header>

            <div className="p-8 max-w-6xl mx-auto space-y-8">

                {/* ── Sprint Hero ── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-200 relative overflow-hidden"
                >
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    Sprint {CURRENT_SPRINT.number} · Aktīvs
                                </span>
                                <span className="flex items-center gap-1 text-xs font-bold text-emerald-100">
                                    <Star size={12} fill="currentColor" /> +{CURRENT_SPRINT.xpReward} XP
                                </span>
                            </div>
                            <h2 className="text-3xl font-black mb-3 tracking-tight">{CURRENT_SPRINT.theme}</h2>
                            <p className="text-sm text-emerald-50/80 max-w-lg leading-relaxed">
                                {CURRENT_SPRINT.description}
                            </p>
                        </div>
                        <div className="shrink-0">
                            {isSubmitted ? (
                                <div className="flex items-center gap-2 px-6 py-4 bg-white/20 rounded-2xl text-white font-bold">
                                    <CheckCircle2 size={20} />
                                    <span>Iesniegts!</span>
                                </div>
                            ) : session ? (
                                <button
                                    onClick={() => setFormOpen(v => !v)}
                                    className="px-6 py-4 bg-white text-emerald-700 font-black rounded-2xl hover:bg-emerald-50 transition-all shadow-lg"
                                >
                                    {formOpen ? 'Aizvērt formu ↑' : 'Iesniegt build →'}
                                </button>
                            ) : (
                                <div className="px-6 py-4 bg-white/20 rounded-2xl text-sm font-bold text-white/80">
                                    Piesakies, lai iesniegtu
                                </div>
                            )}
                        </div>
                    </div>
                    <Zap size={200} className="absolute -right-16 -bottom-16 text-white/10 rotate-12 pointer-events-none" />
                </motion.div>

                {/* ── Submit Form ── */}
                {formOpen && !isSubmitted && session && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                                <Code2 size={16} className="text-white" />
                            </div>
                            <h3 className="font-black text-gray-900">Tavs Build</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Rīka nosaukums *
                                </label>
                                <input
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="piem., 100x Kvotu Ģenerators"
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Live URL vai GitHub *
                                </label>
                                <input
                                    value={url}
                                    onChange={e => setUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Ko šis rīks dara? (neobligāts)
                            </label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Īss apraksts — ko tu uzbūvēji un kā tas palīdz kopienai."
                                rows={3}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50 resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Izmantotie rīki
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {TOOL_OPTIONS.map(tool => (
                                    <button
                                        key={tool}
                                        onClick={() => toggleTool(tool)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                                            selectedTools.includes(tool)
                                                ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                                                : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-emerald-300'
                                        }`}
                                    >
                                        {tool}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {submitError && (
                            <p className="text-xs text-red-500 font-medium">{submitError}</p>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {submitting ? (
                                <><Loader2 size={18} className="animate-spin" /> Iesniedz...</>
                            ) : (
                                <><CheckCircle2 size={18} /> Iesniegt build (+{CURRENT_SPRINT.xpReward} XP)</>
                            )}
                        </button>
                    </motion.div>
                )}

                {/* ── Success Banner ── */}
                {submitSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex items-center gap-4"
                    >
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-200">
                            <CheckCircle2 size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="font-black text-emerald-800">Uzbūvēts! +{CURRENT_SPRINT.xpReward} XP pievienoti tavai sezonai.</p>
                            <p className="text-xs text-emerald-600 mt-0.5">Tavs build tagad redzams kopienā zemāk.</p>
                        </div>
                    </motion.div>
                )}

                {/* ── Community Builds ── */}
                <div>
                    <div className="flex items-center gap-2 mb-5">
                        <Trophy size={16} className="text-amber-500" />
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Kopienas Builds
                        </h3>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                            {builds.length}
                        </span>
                    </div>

                    {buildsLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 size={28} className="animate-spin text-emerald-500" />
                        </div>
                    ) : builds.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <div className="text-5xl mb-4">🚀</div>
                            <h4 className="font-bold text-gray-900 mb-2">Esi pirmais, kurš iesniedz build!</h4>
                            <p className="text-sm text-gray-400 max-w-xs mx-auto">
                                Uzbūvē rīku 100x kopienai, iesniedz to augstāk un nopelni {CURRENT_SPRINT.xpReward} XP.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {builds.map((build, i) => (
                                <motion.a
                                    key={build.id}
                                    href={build.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/30 transition-all flex flex-col"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            {build.user_avatar ? (
                                                <Image
                                                    src={build.user_avatar}
                                                    alt={build.user_name || ''}
                                                    width={28}
                                                    height={28}
                                                    className="rounded-full"
                                                />
                                            ) : (
                                                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-600">
                                                    {(build.user_name || '?')[0]}
                                                </div>
                                            )}
                                            <span className="text-xs font-semibold text-gray-500 truncate max-w-[100px]">
                                                {build.user_name || 'Builders'}
                                            </span>
                                        </div>
                                        <ArrowUpRight
                                            size={16}
                                            className="text-gray-300 group-hover:text-emerald-500 transition-colors shrink-0"
                                        />
                                    </div>

                                    <h4 className="font-bold text-sm text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors leading-snug">
                                        {build.title}
                                    </h4>

                                    {build.description && (
                                        <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2 mb-4 flex-1">
                                            {build.description}
                                        </p>
                                    )}

                                    <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex flex-wrap gap-1">
                                            {(build.tools || []).slice(0, 3).map(tool => (
                                                <span
                                                    key={tool}
                                                    className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600"
                                                >
                                                    {tool}
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-[9px] text-gray-300 flex items-center gap-1">
                                            <Clock size={9} />
                                            {new Date(build.created_at).toLocaleDateString('lv-LV')}
                                        </span>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Tool Starter Pack ── */}
                <div>
                    <div className="flex items-center gap-2 mb-5">
                        <Zap size={16} className="text-amber-500" />
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Sāc ar labākajiem rīkiem
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {STARTER_TOOLS.map(tool => (
                            <a
                                key={tool.name}
                                href={tool.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all flex items-center gap-4"
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-black"
                                    style={{ backgroundColor: tool.color }}
                                >
                                    {tool.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-gray-900">{tool.name}</p>
                                    <p className="text-[11px] text-gray-400">{tool.desc}</p>
                                </div>
                                <ExternalLink size={14} className="text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
