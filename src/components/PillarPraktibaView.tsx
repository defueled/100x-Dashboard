"use client";

import { useEffect, useMemo, useState } from 'react';
import {
    Bot, TrendingUp, Landmark, Palette,
    CheckCircle2, Clock, XCircle, Sparkles, Lock, Loader2, Trophy, Flame,
    ChevronDown, ChevronUp, ExternalLink, Copy, MessageSquare, Info,
} from 'lucide-react';
import { GHL_LEVELS } from '@/lib/ghlLevels';
import { ForumProgressBar } from './DashboardEmbed';

type Pillar = 'ai' | 'tredfi' | 'defi' | 'culture';
type ProofType = 'url' | 'tx_hash' | 'admin_review';
type Status = 'pending' | 'approved' | 'rejected';
type TierFilter = 'all' | 1 | 2 | 3;
type ProviderFilter = 'all' | 'openai' | 'anthropic' | 'grok' | 'gemini';

interface Task {
    id: string;
    pillar: string; // 'ai' | 'tredfi' | 'defi' | 'culture' | 'global'
    provider?: string | null; // 'openai' | 'anthropic' | 'grok' | 'gemini' | null
    tier: 1 | 2 | 3;
    title_lv: string;
    description_lv: string | null;
    xp_amount: number;
    proof_type: ProofType;
    proof_hint_lv: string | null;
    auto_approve: boolean;
    position: number;
    instructions_lv?: string | null;
    external_links?: Array<{ label: string; url: string }> | null;
    forum_url?: string | null;
    forum_label?: string | null;
    forum_template_lv?: string | null;
    requires_forum_proof?: boolean;
}

const PROVIDER_META: Record<Exclude<ProviderFilter, 'all'>, { label: string; emoji: string }> = {
    openai: { label: 'OpenAI', emoji: '🟢' },
    anthropic: { label: 'Anthropic', emoji: '🟣' },
    grok: { label: 'Grok', emoji: '⚫' },
    gemini: { label: 'Gemini', emoji: '🔵' },
};

interface Submission {
    task_id: string;
    status: Status;
    proof_url: string;
    submitted_at: string;
    reviewed_at: string | null;
    admin_notes: string | null;
}

interface Props {
    pillar: Pillar;
    totalXp: number;
    currentLevel: number;
    ghlLevel: number;
    forumProgress?: { ai?: number; defi?: number; tradfi?: number; culture?: number };
}

// task_catalog stores TradFi under 'tradfi' (no 'e'); ViewId uses 'tredfi'.
const PILLAR_TO_CATALOG: Record<Pillar, string> = {
    ai: 'ai',
    tredfi: 'tradfi',
    defi: 'defi',
    culture: 'culture',
};

const PILLAR_META: Record<Pillar, {
    title: string;
    subtitle: string;
    accent: string;
    bgTint: string;
    icon: React.ElementType;
    forumKey: 'ai' | 'defi' | 'tradfi' | 'culture';
    ghlThreshold: number;
}> = {
    ai: {
        title: 'AI Pratība',
        subtitle: 'Mākslīgais intelekts — no pirmā prompta līdz paša uzbūvētiem rīkiem.',
        accent: '#59b687',
        bgTint: 'bg-[#59b687]/10',
        icon: Bot,
        forumKey: 'ai',
        ghlThreshold: 3,
    },
    tredfi: {
        title: 'TradFi Pratība',
        subtitle: 'Tradicionālās finanses — tirgi, analīze un riska vadība.',
        accent: '#4A9EE5',
        bgTint: 'bg-[#4A9EE5]/10',
        icon: TrendingUp,
        forumKey: 'tradfi',
        ghlThreshold: 4,
    },
    defi: {
        title: 'DeFi Pratība',
        subtitle: 'Decentralizētas finanses — maki, swap, yield un on-chain pratība.',
        accent: '#188bf6',
        bgTint: 'bg-[#188bf6]/10',
        icon: Landmark,
        forumKey: 'defi',
        ghlThreshold: 5,
    },
    culture: {
        title: 'Kultūras Pratība',
        subtitle: 'Komūna un kultūra — cilvēki, sarunas un radīšana.',
        accent: '#F5A623',
        bgTint: 'bg-[#F5A623]/10',
        icon: Palette,
        forumKey: 'culture',
        ghlThreshold: 2,
    },
};

const TIER_LABELS: Record<number, string> = { 1: 'Iesācējs', 2: 'Pētnieks', 3: 'Meistars' };

export function PillarPraktibaView({ pillar, totalXp, currentLevel, ghlLevel, forumProgress }: Props) {
    const meta = PILLAR_META[pillar];
    const catalogKey = PILLAR_TO_CATALOG[pillar];

    const [tasks, setTasks] = useState<Task[]>([]);
    const [subs, setSubs] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [tierFilter, setTierFilter] = useState<TierFilter>('all');
    const [providerFilter, setProviderFilter] = useState<ProviderFilter>('all');
    const [selected, setSelected] = useState<Task | null>(null);
    const [proof, setProof] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/tasks', { cache: 'no-store' });
            const data = await res.json();
            if (res.ok) {
                setTasks((data.tasks || []).filter((t: Task) => t.pillar === catalogKey));
                setSubs(data.submissions || []);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [pillar]);

    const subMap = useMemo(() => {
        const m = new Map<string, Submission>();
        for (const s of subs) m.set(s.task_id, s);
        return m;
    }, [subs]);

    const filtered = useMemo(() => {
        return tasks.filter((t) => {
            if (tierFilter !== 'all' && t.tier !== tierFilter) return false;
            if (pillar === 'ai' && providerFilter !== 'all' && t.provider !== providerFilter) return false;
            return true;
        });
    }, [tasks, tierFilter, providerFilter, pillar]);

    const byTier = useMemo(() => {
        const g: Record<number, Task[]> = { 1: [], 2: [], 3: [] };
        for (const t of filtered) g[t.tier].push(t);
        return g;
    }, [filtered]);

    // Stats
    const totalTasks = tasks.length;
    const approvedCount = tasks.filter((t) => subMap.get(t.id)?.status === 'approved').length;
    const pendingCount = tasks.filter((t) => subMap.get(t.id)?.status === 'pending').length;

    const ghlObj = GHL_LEVELS.find((l) => l.level === ghlLevel) || GHL_LEVELS[0];
    const gateMet = ghlLevel >= meta.ghlThreshold;
    const gateProgress = Math.min((ghlLevel / meta.ghlThreshold) * 100, 100);
    const progressPct = Number(forumProgress?.[meta.forumKey] ?? 0);

    const openModal = (task: Task) => {
        setSelected(task);
        setProof('');
        setError(null);
        setSuccessMsg(null);
    };
    const closeModal = () => { setSelected(null); setProof(''); setError(null); setSuccessMsg(null); };

    const submit = async () => {
        if (!selected || !proof.trim()) return;
        setSubmitting(true);
        setError(null);
        try {
            const res = await fetch('/api/tasks/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task_id: selected.id, proof: proof.trim() }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Kļūda');
                return;
            }
            setSuccessMsg(data.message || 'Iesniegts');
            await load();
            setTimeout(closeModal, 1200);
        } finally {
            setSubmitting(false);
        }
    };

    const PillarIcon = meta.icon;

    return (
        <>
            <header className="h-16 border-b border-gray-100 dark:border-[var(--color-dark-border)] bg-white dark:bg-[var(--color-dark-surface)] flex items-center justify-between px-4 md:px-8 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-xl ${meta.bgTint} shrink-0`}>
                        <PillarIcon size={18} style={{ color: meta.accent }} />
                    </div>
                    <h1 className="text-lg font-bold truncate">{meta.title}</h1>
                    <span className="hidden md:inline text-[10px] font-bold bg-emerald-500 text-white px-2.5 py-0.5 rounded-full uppercase items-center gap-1"><Flame size={10} className="inline" /> Lvl {currentLevel}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 shrink-0">
                    <Trophy size={14} className="text-amber-500" />
                    <span className="font-bold">{totalXp} XP</span>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 space-y-5 md:space-y-6 bg-[#F8FAF9]/50 dark:bg-[var(--color-dark-bg)]">
                <div className="max-w-5xl mx-auto space-y-5 md:space-y-6">

                    {/* Subtitle */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2">{meta.subtitle}</p>

                    {/* Forum progress */}
                    <ForumProgressBar
                        label={`${meta.title} · foruma progress`}
                        value={progressPct}
                        color={meta.accent}
                    />

                    {/* Progress summary */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-4 rounded-2xl bg-white dark:bg-[var(--color-dark-surface)] border border-gray-100 dark:border-[var(--color-dark-border)] text-center">
                            <p className="text-xl font-black text-gray-900 dark:text-gray-100">{approvedCount}/{totalTasks}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Iegūti</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white dark:bg-[var(--color-dark-surface)] border border-gray-100 dark:border-[var(--color-dark-border)] text-center">
                            <p className="text-xl font-black text-amber-500">{pendingCount}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Gaida</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white dark:bg-[var(--color-dark-surface)] border border-gray-100 dark:border-[var(--color-dark-border)] text-center">
                            <p className="text-xl font-black" style={{ color: meta.accent }}>Lvl {ghlLevel}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">GHL</p>
                        </div>
                    </div>

                    {/* Forum reward banner */}
                    <div className={`p-5 rounded-2xl border shadow-sm ${gateMet
                        ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'
                        : 'bg-white dark:bg-[var(--color-dark-surface)] border-gray-100 dark:border-[var(--color-dark-border)]'
                    }`}>
                        <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Foruma aktivitātes atlīdzība</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                                    {gateMet
                                        ? `Atbloķēts — ${ghlObj.emoji} ${ghlObj.title}`
                                        : `Sasniedz ${meta.ghlThreshold}. līmeni forumā, lai atbloķētu 1500 XP bonusu`}
                                </p>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                                    Pašreizējais līmenis: {ghlObj.emoji} {ghlObj.title} (Lvl {ghlLevel})
                                </p>
                            </div>
                            <span className="text-xs font-black shrink-0" style={{ color: gateMet ? '#10b981' : meta.accent }}>
                                {gateMet ? '✓ IEGŪTS' : '+1500 XP'}
                            </span>
                        </div>
                        <div className="mt-3 h-1.5 bg-gray-100 dark:bg-[var(--color-dark-border)] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${gateProgress}%`, backgroundColor: meta.accent }} />
                        </div>
                    </div>

                    {/* AI flywheel banner */}
                    {pillar === 'ai' && (
                        <div
                            className="p-4 rounded-2xl border"
                            style={{ backgroundColor: `${meta.accent}14`, borderColor: `${meta.accent}33` }}
                        >
                            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: meta.accent }}>
                                AI Pratības aplis
                            </p>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-1">
                                Iemācies → Iztestē → Padalies viedokli forumā → XP → airdrop atlīdzība aktīvākajiem. Repeat.
                            </p>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                                Katrs provideris (OpenAI, Anthropic, Grok, Gemini) ir atsevišķa mācību tēma ar saviem stipro pušu uzsvariem.
                            </p>
                        </div>
                    )}

                    {/* Difficulty filter */}
                    <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 py-1">
                        {([
                            { v: 'all', label: 'Visi', count: tasks.length },
                            { v: 1, label: `T1 · ${TIER_LABELS[1]}`, count: tasks.filter(t => t.tier === 1).length },
                            { v: 2, label: `T2 · ${TIER_LABELS[2]}`, count: tasks.filter(t => t.tier === 2).length },
                            { v: 3, label: `T3 · ${TIER_LABELS[3]}`, count: tasks.filter(t => t.tier === 3).length },
                        ] as const).map((f) => {
                            const active = tierFilter === f.v;
                            return (
                                <button
                                    key={f.v}
                                    onClick={() => setTierFilter(f.v as TierFilter)}
                                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                                        active
                                            ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white'
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 dark:bg-[var(--color-dark-surface)] dark:border-[var(--color-dark-border)] dark:text-gray-400'
                                    }`}
                                >
                                    {f.label}
                                    <span className={`ml-1.5 text-[10px] ${active ? 'opacity-70' : 'opacity-50'}`}>({f.count})</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Provider filter (AI pillar only) */}
                    {pillar === 'ai' && (
                        <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 py-1">
                            {(['all', 'openai', 'anthropic', 'grok', 'gemini'] as const).map((p) => {
                                const active = providerFilter === p;
                                const count = p === 'all'
                                    ? tasks.length
                                    : tasks.filter((t) => t.provider === p).length;
                                const label = p === 'all' ? 'Visi provideri' : `${PROVIDER_META[p].emoji} ${PROVIDER_META[p].label}`;
                                return (
                                    <button
                                        key={p}
                                        onClick={() => setProviderFilter(p)}
                                        className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                                            active
                                                ? 'text-white border-transparent'
                                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 dark:bg-[var(--color-dark-surface)] dark:border-[var(--color-dark-border)] dark:text-gray-400'
                                        }`}
                                        style={active ? { backgroundColor: meta.accent } : undefined}
                                    >
                                        {label}
                                        <span className={`ml-1.5 text-[10px] ${active ? 'opacity-80' : 'opacity-50'}`}>({count})</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Task list */}
                    {loading ? (
                        <div className="py-16 flex justify-center"><Loader2 className="animate-spin text-gray-300" size={28} /></div>
                    ) : filtered.length === 0 ? (
                        <div className="py-12 text-center text-sm text-gray-400">Nav uzdevumu šajā filtrā.</div>
                    ) : (
                        <div className="space-y-5">
                            {[1, 2, 3].map((tier) => {
                                const list = byTier[tier] || [];
                                if (list.length === 0) return null;
                                return (
                                    <div key={tier}>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                            Tier {tier} · {TIER_LABELS[tier]}
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {list.map((task) => {
                                                const sub = subMap.get(task.id);
                                                const status = sub?.status;
                                                const isApproved = status === 'approved';
                                                const isPending = status === 'pending';
                                                const isRejected = status === 'rejected';
                                                return (
                                                    <button
                                                        key={task.id}
                                                        onClick={() => !isApproved && openModal(task)}
                                                        disabled={isApproved}
                                                        className={`text-left p-4 rounded-2xl border transition-all ${
                                                            isApproved
                                                                ? 'bg-gray-50/50 dark:bg-gray-50/10 border-gray-100 dark:border-[var(--color-dark-border)] opacity-60 cursor-default'
                                                                : 'bg-white dark:bg-[var(--color-dark-surface)] border-gray-100 dark:border-[var(--color-dark-border)] hover:border-emerald-300 hover:shadow-sm'
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between mb-1">
                                                            <div className="flex items-start gap-2 min-w-0">
                                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                                                                    isApproved ? 'bg-emerald-500 text-white'
                                                                    : isPending ? 'bg-amber-100 text-amber-600'
                                                                    : isRejected ? 'bg-red-100 text-red-600'
                                                                    : 'bg-gray-100 text-gray-400 dark:bg-[var(--color-dark-border)]'
                                                                }`}>
                                                                    {isApproved ? <CheckCircle2 size={14} /> :
                                                                     isPending ? <Clock size={14} /> :
                                                                     isRejected ? <XCircle size={14} /> :
                                                                     <Sparkles size={14} />}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className={`text-sm font-bold ${isApproved ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
                                                                        {task.title_lv}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <span className={`text-[10px] font-black shrink-0 ml-2 ${isApproved ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                                {isApproved ? 'IEGŪTS' : `+${task.xp_amount} XP`}
                                                            </span>
                                                        </div>
                                                        {task.description_lv && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-9 line-clamp-3">{task.description_lv}</p>
                                                        )}
                                                        {isPending && (
                                                            <p className="text-[10px] font-bold text-amber-600 mt-2 ml-9 flex items-center gap-1"><Clock size={10} /> Pārbauda administrators</p>
                                                        )}
                                                        {isRejected && (
                                                            <p className="text-[10px] font-bold text-red-600 mt-2 ml-9">
                                                                Noraidīts{sub?.admin_notes ? ` · ${sub.admin_notes}` : ''} — iesniedz atkārtoti
                                                            </p>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Submission modal */}
            {selected && (
                <TaskModal
                    task={selected}
                    proof={proof}
                    setProof={setProof}
                    submitting={submitting}
                    error={error}
                    successMsg={successMsg}
                    onClose={closeModal}
                    onSubmit={submit}
                />
            )}
        </>
    );
}

interface TaskModalProps {
    task: Task;
    proof: string;
    setProof: (s: string) => void;
    submitting: boolean;
    error: string | null;
    successMsg: string | null;
    onClose: () => void;
    onSubmit: () => void;
}

function TaskModal({ task, proof, setProof, submitting, error, successMsg, onClose, onSubmit }: TaskModalProps) {
    const [showInstructions, setShowInstructions] = useState(true);
    const [showTemplate, setShowTemplate] = useState(false);
    const [copied, setCopied] = useState<'template' | 'forum' | null>(null);

    const copy = async (text: string, kind: 'template' | 'forum') => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(kind);
            setTimeout(() => setCopied(null), 1500);
        } catch {}
    };

    const proofLooksValid = (() => {
        const p = proof.trim();
        if (!p) return false;
        if (task.proof_type === 'tx_hash') return /^0x[0-9a-fA-F]{64}$/.test(p);
        if (/^0x[0-9a-fA-F]{40}$/.test(p)) return true;  // EVM address fallback
        try {
            const u = new URL(p);
            if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
            if (task.requires_forum_proof && u.hostname !== 'platforma.100x.lv') return false;
            return true;
        } catch {
            return false;
        }
    })();

    const proofWarning = (() => {
        const p = proof.trim();
        if (!p || !task.requires_forum_proof || task.proof_type === 'tx_hash') return null;
        if (/^0x[0-9a-fA-F]{40}$/.test(p)) return null;
        try {
            const u = new URL(p);
            if (u.hostname !== 'platforma.100x.lv') {
                return 'Šim uzdevumam pierādījumam jābūt no platforma.100x.lv';
            }
        } catch {
            return 'Pārbaudi URL formātu';
        }
        return null;
    })();

    return (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-start md:items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
            <div
                className="bg-white dark:bg-[var(--color-dark-surface)] rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-gray-100 dark:border-[var(--color-dark-border)] my-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-3 gap-3">
                    <div className="min-w-0">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Tier {task.tier} · {TIER_LABELS[task.tier]}
                        </p>
                        <h3 className="text-lg md:text-xl font-black text-gray-900 dark:text-gray-100 mt-1">{task.title_lv}</h3>
                    </div>
                    <span className="text-sm font-black text-amber-500 shrink-0">+{task.xp_amount} XP</span>
                </div>

                {/* Description */}
                {task.description_lv && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{task.description_lv}</p>
                )}

                {/* Step-by-step instructions */}
                {task.instructions_lv && (
                    <div className="mb-4 rounded-2xl border border-gray-100 dark:border-[var(--color-dark-border)] overflow-hidden">
                        <button
                            onClick={() => setShowInstructions((v) => !v)}
                            className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-[var(--color-dark-bg)] hover:bg-gray-100 dark:hover:bg-[var(--color-dark-border)] transition-colors"
                        >
                            <span className="flex items-center gap-2 text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">
                                <Info size={14} className="text-emerald-500" />
                                Kā izpildīt
                            </span>
                            {showInstructions ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                        </button>
                        {showInstructions && (
                            <div className="p-4 bg-white dark:bg-[var(--color-dark-surface)]">
                                <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-700 dark:text-gray-300 font-sans">{task.instructions_lv}</pre>
                            </div>
                        )}
                    </div>
                )}

                {/* External resource links */}
                {task.external_links && task.external_links.length > 0 && (
                    <div className="mb-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Resursi</p>
                        <div className="flex flex-wrap gap-2">
                            {task.external_links.map((link, i) => (
                                <a
                                    key={i}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors border border-emerald-200 dark:border-emerald-800"
                                >
                                    <ExternalLink size={11} />
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Forum CTA + post template */}
                {task.forum_url && (
                    <div className="mb-4 rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-3">
                        <div className="flex items-center justify-between gap-3 mb-2">
                            <span className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-200">
                                <MessageSquare size={14} />
                                {task.requires_forum_proof ? 'Pierādījumam jābūt no foruma' : 'Dalies forumā ar rezultātu'}
                            </span>
                            <a
                                href={task.forum_url}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                            >
                                <ExternalLink size={11} />
                                {task.forum_label || 'Atvērt forumu'}
                            </a>
                        </div>
                        {task.forum_template_lv && (
                            <>
                                <button
                                    onClick={() => setShowTemplate((v) => !v)}
                                    className="text-[11px] font-bold text-blue-700 dark:text-blue-300 hover:underline flex items-center gap-1 mt-1"
                                >
                                    {showTemplate ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                    Posta šablons (kopējams)
                                </button>
                                {showTemplate && (
                                    <div className="mt-2 relative">
                                        <pre className="whitespace-pre-wrap text-[11px] leading-relaxed text-gray-700 dark:text-gray-300 bg-white dark:bg-[var(--color-dark-bg)] rounded-lg p-3 border border-blue-200 dark:border-blue-800 max-h-48 overflow-y-auto font-mono">{task.forum_template_lv}</pre>
                                        <button
                                            onClick={() => copy(task.forum_template_lv!, 'template')}
                                            className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white dark:bg-[var(--color-dark-surface)] border border-gray-200 dark:border-[var(--color-dark-border)] text-[10px] font-bold text-gray-600 dark:text-gray-400 hover:text-emerald-600"
                                        >
                                            {copied === 'template' ? <CheckCircle2 size={10} className="text-emerald-500" /> : <Copy size={10} />}
                                            {copied === 'template' ? 'Nokopēts' : 'Kopēt'}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Proof input */}
                <div className="mb-4">
                    <label
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"
                        title={
                            task.proof_type === 'tx_hash'
                                ? 'On-chain transakcijas identifikators (0x + 64 simboli)'
                                : task.requires_forum_proof
                                    ? 'Saite uz tavu postu platforma.100x.lv'
                                    : 'Publiska URL, ko admin var atvērt'
                        }
                    >
                        {task.proof_type === 'tx_hash' ? 'Transakcijas hash' : 'Pierādījuma URL'}
                        <Info size={11} className="text-gray-300" />
                    </label>
                    <input
                        type="text"
                        value={proof}
                        onChange={(e) => setProof(e.target.value)}
                        placeholder={task.proof_hint_lv || 'https://...'}
                        className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-[var(--color-dark-bg)] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 text-sm transition-colors ${
                            proofWarning
                                ? 'border-amber-400 focus:ring-amber-200 focus:border-amber-500'
                                : 'border-gray-200 dark:border-[var(--color-dark-border)] focus:ring-emerald-300 focus:border-emerald-400'
                        }`}
                        autoFocus
                    />
                    {proofWarning ? (
                        <p className="text-[11px] font-medium text-amber-600 mt-1.5">⚠ {proofWarning}</p>
                    ) : task.proof_hint_lv ? (
                        <p className="text-[10px] text-gray-400 mt-1.5">{task.proof_hint_lv}</p>
                    ) : null}
                </div>

                {!task.auto_approve && (
                    <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-2">
                        <Lock size={14} className="text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                            Šo pārbauda administrators. XP tiek piešķirts pēc apstiprinājuma.
                        </p>
                    </div>
                )}

                {error && (
                    <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700 text-center">
                        {error}
                    </div>
                )}
                {successMsg && (
                    <div className="mb-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700 text-center">
                        {successMsg}
                    </div>
                )}

                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-[var(--color-dark-border)] text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[var(--color-dark-bg)]"
                    >Atcelt</button>
                    <button
                        onClick={onSubmit}
                        disabled={submitting || !proofLooksValid}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 disabled:opacity-50"
                    >{submitting ? 'Iesniedz...' : 'Iesniegt'}</button>
                </div>
            </div>
        </div>
    );
}
