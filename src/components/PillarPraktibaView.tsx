"use client";

import { useEffect, useMemo, useState } from 'react';
import {
    Bot, TrendingUp, Landmark, Palette,
    CheckCircle2, Clock, XCircle, Sparkles, Lock, Loader2, Trophy, Flame,
    ChevronDown, ChevronUp, ExternalLink, Copy, MessageSquare, Info,
    Building2, UserPlus, Target,
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
    base_xp?: number | null;
    bonus_xp?: number | null;
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

interface Claim {
    task_id: string;
    claim_type: 'base' | 'bonus';
    xp_amount: number;
    claimed_at: string;
}

const OpenAILogo = ({ size = 14 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 260" fill="currentColor" aria-hidden>
        <path d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z" />
    </svg>
);

const AnthropicLogo = ({ size = 14 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path fillRule="evenodd" d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z" />
    </svg>
);

const GrokLogo = ({ size = 14 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 1024 1024" fill="currentColor" aria-hidden>
        <path d="M395.479 633.828L735.91 381.105C752.599 368.715 776.454 373.548 784.406 392.792C826.26 494.285 807.561 616.253 724.288 699.996C641.016 783.739 525.151 802.104 419.247 760.277L303.556 814.143C469.49 928.202 670.987 899.995 796.901 773.282C896.776 672.843 927.708 535.937 898.785 412.476L899.047 412.739C857.105 231.37 909.358 158.874 1016.4 10.6326C1018.93 7.11771 1021.47 3.60279 1024 0L883.144 141.651V141.212L395.392 633.916" />
        <path d="M325.226 695.251C206.128 580.84 226.662 403.776 328.285 301.668C403.431 226.097 526.549 195.254 634.026 240.596L749.454 186.994C728.657 171.88 702.007 155.623 671.424 144.2C533.19 86.9942 367.693 115.465 255.323 228.382C147.234 337.081 113.244 504.215 171.613 646.833C215.216 753.423 143.739 828.818 71.7385 904.916C46.2237 931.893 20.6216 958.87 0 987.429L325.139 695.339" />
    </svg>
);

// Google Gemini sparkle — simplified 4-pointed star preserving brand gradient colors
const GeminiLogo = ({ size = 14 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 28 28" aria-hidden>
        <defs>
            <linearGradient id="gem-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3186FF" />
                <stop offset="50%" stopColor="#8A6AF5" />
                <stop offset="100%" stopColor="#FA4340" />
            </linearGradient>
        </defs>
        <path fill="url(#gem-g)" d="M14 0c.5 6.2 2.7 10.7 6.6 13.4 1.4 1 3.5 1.6 7.4 2.6-6.2.5-10.7 2.7-13.4 6.6-1 1.4-1.6 3.5-2.6 7.4-.5-6.2-2.7-10.7-6.6-13.4-1.4-1-3.5-1.6-7.4-2.6 6.2-.5 10.7-2.7 13.4-6.6 1-1.4 1.6-3.5 2.6-7.4Z" />
    </svg>
);

const PROVIDER_META: Record<Exclude<ProviderFilter, 'all'>, { label: string; Logo: React.FC<{ size?: number }>; tint: string }> = {
    openai: { label: 'OpenAI', Logo: OpenAILogo, tint: 'text-[#10A37F]' },
    anthropic: { label: 'Anthropic', Logo: AnthropicLogo, tint: 'text-[#D97706]' },
    grok: { label: 'Grok', Logo: GrokLogo, tint: 'text-gray-900' },
    gemini: { label: 'Gemini', Logo: GeminiLogo, tint: 'text-[#3186FF]' },
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

// Parse instructions_lv that uses "(A) heading\nbody\n(B) heading\nbody" format
// into a list of wizard steps. Falls back to [] if the text has no section markers.
function parseWizardSections(text: string): Array<{ letter: string; title: string; body: string }> {
    const lines = text.split('\n');
    const headerRe = /^\(([A-Z])\)\s+(.+)$/;
    const out: Array<{ letter: string; title: string; body: string[] }> = [];
    let current: { letter: string; title: string; body: string[] } | null = null;
    for (const line of lines) {
        const m = line.match(headerRe);
        if (m) {
            if (current) out.push(current);
            current = { letter: m[1], title: m[2].trim(), body: [] };
        } else if (current) {
            current.body.push(line);
        }
    }
    if (current) out.push(current);
    return out.map((s) => ({ letter: s.letter, title: s.title, body: s.body.join('\n').trim() }));
}

// Pick an icon + accent for a section based on its title keyword, falling back to letter order
function wizardIconFor(letter: string, title: string): { Icon: React.ElementType; color: string; bg: string; label: string } {
    const t = title.toLowerCase();
    if (t.startsWith('kas ir') || t.includes('kāpēc') || t.includes('par uzņēmum')) {
        return { Icon: Building2, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800', label: 'Iepazīsti' };
    }
    if (t.includes('izveidot profilu') || t.includes('kā sākt') || t.includes('kā iegūt') || t.includes('piekļū')) {
        return { Icon: UserPlus, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800', label: 'Profila izveide' };
    }
    if (t.includes('stiprās puses') || t.includes('idejas') || t.includes('praktiskais padoms') || t.includes('pro padoms') || t.includes('alternatīvas')) {
        return { Icon: Sparkles, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800', label: 'Stiprās puses' };
    }
    if (t.includes('ko darīt') || t.includes('uzdevums') || t.includes('publicē forumā') || t.includes('ko publicēt')) {
        return { Icon: Target, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800', label: 'Tavs uzdevums' };
    }
    // fallback by letter order
    const fallbacks = [
        { Icon: Building2, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800', label: 'Iepazīsti' },
        { Icon: UserPlus, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800', label: 'Soļi' },
        { Icon: Sparkles, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800', label: 'Padomi' },
        { Icon: Target, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800', label: 'Uzdevums' },
    ];
    const idx = Math.max(0, letter.charCodeAt(0) - 'A'.charCodeAt(0)) % fallbacks.length;
    return fallbacks[idx];
}

export function PillarPraktibaView({ pillar, totalXp, currentLevel, ghlLevel, forumProgress }: Props) {
    const meta = PILLAR_META[pillar];
    const catalogKey = PILLAR_TO_CATALOG[pillar];

    const [tasks, setTasks] = useState<Task[]>([]);
    const [subs, setSubs] = useState<Submission[]>([]);
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);
    const [claimingId, setClaimingId] = useState<string | null>(null);
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
                setClaims(data.claims || []);
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

    const claimMap = useMemo(() => {
        const m = new Map<string, { base?: Claim; bonus?: Claim }>();
        for (const c of claims) {
            const entry = m.get(c.task_id) || {};
            if (c.claim_type === 'base') entry.base = c;
            else if (c.claim_type === 'bonus') entry.bonus = c;
            m.set(c.task_id, entry);
        }
        return m;
    }, [claims]);

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

    // Stats — "completed" now means ANY XP claim (base or bonus) exists on the task
    const totalTasks = tasks.length;
    const approvedCount = tasks.filter((t) => {
        const c = claimMap.get(t.id);
        return c?.base || c?.bonus;
    }).length;
    // Unclaimed bonuses = tasks where base XP is claimed (user engaged) but
    // the bigger bonus is still on the table — the actionable "finish me" count.
    const unclaimedBonusCount = tasks.filter((t) => {
        const c = claimMap.get(t.id);
        return !!c?.base && !c?.bonus;
    }).length;

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

    const claim = async (taskId: string) => {
        setClaimingId(taskId);
        setError(null);
        try {
            const res = await fetch('/api/tasks/claim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task_id: taskId }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Kļūda');
                return;
            }
            setSuccessMsg(data.message || 'Bāze iegūta');
            await load();
        } finally {
            setClaimingId(null);
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
                            <p className="text-xl font-black text-amber-500">{unclaimedBonusCount}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Nesaņemts Bonuss</p>
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
                                if (p === 'all') {
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
                                            Visi provideri
                                            <span className={`ml-1.5 text-[10px] ${active ? 'opacity-80' : 'opacity-50'}`}>({count})</span>
                                        </button>
                                    );
                                }
                                const { Logo, label, tint } = PROVIDER_META[p];
                                return (
                                    <button
                                        key={p}
                                        onClick={() => setProviderFilter(p)}
                                        className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                                            active
                                                ? 'text-white border-transparent'
                                                : `bg-white border-gray-200 hover:border-gray-400 dark:bg-[var(--color-dark-surface)] dark:border-[var(--color-dark-border)] text-gray-700 ${tint}`
                                        }`}
                                        style={active ? { backgroundColor: meta.accent } : undefined}
                                    >
                                        <span className={active ? 'text-white' : ''}>
                                            <Logo size={13} />
                                        </span>
                                        <span className={active ? 'text-white' : 'text-gray-700'}>{label}</span>
                                        <span className={`text-[10px] ${active ? 'text-white opacity-80' : 'text-gray-400'}`}>({count})</span>
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
                                                const claim = claimMap.get(task.id) || {};
                                                const baseClaimed = !!claim.base;
                                                const bonusClaimed = !!claim.bonus;
                                                const fullyDone = baseClaimed && bonusClaimed;
                                                const status = sub?.status;
                                                const isPending = status === 'pending' && !bonusClaimed;
                                                const isRejected = status === 'rejected' && !bonusClaimed;
                                                const baseXp = Number(task.base_xp ?? 0);
                                                const bonusXp = Number(task.bonus_xp ?? task.xp_amount ?? 0);
                                                return (
                                                    <button
                                                        key={task.id}
                                                        onClick={() => !fullyDone && openModal(task)}
                                                        disabled={fullyDone}
                                                        className={`text-left p-4 rounded-2xl border transition-all ${
                                                            fullyDone
                                                                ? 'bg-emerald-50/40 dark:bg-emerald-900/10 border-emerald-200/60 dark:border-emerald-800/40 opacity-80 cursor-default'
                                                                : bonusClaimed
                                                                ? 'bg-emerald-50/40 dark:bg-emerald-900/10 border-emerald-300 dark:border-emerald-700'
                                                                : 'bg-white dark:bg-[var(--color-dark-surface)] border-gray-100 dark:border-[var(--color-dark-border)] hover:border-emerald-300 hover:shadow-sm'
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between mb-1">
                                                            <div className="flex items-start gap-2 min-w-0">
                                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                                                                    fullyDone ? 'bg-emerald-500 text-white'
                                                                    : bonusClaimed || baseClaimed ? 'bg-emerald-100 text-emerald-600'
                                                                    : isPending ? 'bg-amber-100 text-amber-600'
                                                                    : isRejected ? 'bg-red-100 text-red-600'
                                                                    : 'bg-gray-100 text-gray-400 dark:bg-[var(--color-dark-border)]'
                                                                }`}>
                                                                    {fullyDone ? <CheckCircle2 size={14} /> :
                                                                     bonusClaimed || baseClaimed ? <CheckCircle2 size={14} /> :
                                                                     isPending ? <Clock size={14} /> :
                                                                     isRejected ? <XCircle size={14} /> :
                                                                     <Sparkles size={14} />}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className={`text-sm font-bold ${fullyDone ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                                                        {task.title_lv}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-end shrink-0 ml-2 gap-0.5">
                                                                <span className={`text-[10px] font-black ${baseClaimed ? 'text-emerald-500' : 'text-gray-400'}`}>
                                                                    {baseClaimed ? `✓ +${baseXp}` : `+${baseXp} bāze`}
                                                                </span>
                                                                <span className={`text-[10px] font-black ${bonusClaimed ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                                    {bonusClaimed ? `✓ +${bonusXp}` : `+${bonusXp} bonuss`}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {task.description_lv && !fullyDone && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-9 line-clamp-2">{task.description_lv}</p>
                                                        )}
                                                        {isPending && (
                                                            <p className="text-[10px] font-bold text-amber-600 mt-2 ml-9 flex items-center gap-1"><Clock size={10} /> Bonuss gaida admin pārbaudi</p>
                                                        )}
                                                        {isRejected && (
                                                            <p className="text-[10px] font-bold text-red-600 mt-2 ml-9">
                                                                Bonuss noraidīts{sub?.admin_notes ? ` · ${sub.admin_notes}` : ''} — iesniedz atkārtoti
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
            {selected && (() => {
                const sc = claimMap.get(selected.id) || {};
                return (
                    <TaskModal
                        task={selected}
                        proof={proof}
                        setProof={setProof}
                        submitting={submitting}
                        claiming={claimingId === selected.id}
                        baseClaimed={!!sc.base}
                        bonusClaimed={!!sc.bonus}
                        bonusPending={subMap.get(selected.id)?.status === 'pending'}
                        error={error}
                        successMsg={successMsg}
                        onClose={closeModal}
                        onSubmit={submit}
                        onClaim={() => claim(selected.id)}
                    />
                );
            })()}
        </>
    );
}

interface TaskModalProps {
    task: Task;
    proof: string;
    setProof: (s: string) => void;
    submitting: boolean;
    claiming: boolean;
    baseClaimed: boolean;
    bonusClaimed: boolean;
    bonusPending: boolean;
    error: string | null;
    successMsg: string | null;
    onClose: () => void;
    onSubmit: () => void;
    onClaim: () => void;
}

function TaskModal({ task, proof, setProof, submitting, claiming, baseClaimed, bonusClaimed, bonusPending, error, successMsg, onClose, onSubmit, onClaim }: TaskModalProps) {
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
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
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
                        <h3 className="text-lg md:text-xl font-black text-gray-900 mt-1">{task.title_lv}</h3>
                    </div>
                    <div className="flex flex-col items-end shrink-0 gap-1">
                        <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${baseClaimed ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                            {baseClaimed ? `✓ Bāze +${task.base_xp ?? 0}` : `Bāze +${task.base_xp ?? 0}`}
                        </span>
                        <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${bonusClaimed ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700'}`}>
                            {bonusClaimed ? `✓ Bonuss +${task.bonus_xp ?? 0}` : `Bonuss +${task.bonus_xp ?? 0}`}
                        </span>
                    </div>
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
                            <div className="p-3 md:p-4 bg-white dark:bg-[var(--color-dark-surface)] space-y-3">
                                {(() => {
                                    const sections = parseWizardSections(task.instructions_lv!);
                                    if (sections.length === 0) {
                                        return (
                                            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-700 dark:text-gray-300 font-sans">
                                                {task.instructions_lv}
                                            </pre>
                                        );
                                    }
                                    return sections.map((s, i) => {
                                        const { Icon, color, bg, label } = wizardIconFor(s.letter, s.title);
                                        return (
                                            <div key={s.letter + i} className={`rounded-xl border ${bg} p-3`}>
                                                <div className="flex items-start gap-2.5">
                                                    <div className={`w-7 h-7 rounded-full bg-white dark:bg-gray-900/40 flex items-center justify-center shrink-0 ${color}`}>
                                                        <Icon size={14} />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>
                                                                Solis {i + 1} · {label}
                                                            </span>
                                                        </div>
                                                        <p className="text-[13px] font-bold text-gray-900 mt-0.5 leading-snug">
                                                            {s.title}
                                                        </p>
                                                        {s.body && (
                                                            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-700 font-sans mt-2">
                                                                {s.body}
                                                            </pre>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
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

                {/* Base claim — instant XP for learning the material */}
                <div className={`mb-4 rounded-2xl border p-4 ${
                    baseClaimed
                        ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-700'
                        : 'border-emerald-200 bg-white dark:bg-[var(--color-dark-surface)] dark:border-[var(--color-dark-border)]'
                }`}>
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-widest">
                                1. solis · Mācies
                            </p>
                            <p className="text-sm font-bold text-gray-900 mt-1">
                                {baseClaimed
                                    ? `Bāzes XP saņemti — ${task.base_xp ?? 0} XP`
                                    : `Izlasi materiālu augstāk, tad saņem ${task.base_xp ?? 0} XP uzreiz.`}
                            </p>
                            {!baseClaimed && (
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                                    Bez pierādījuma, bez admin pārbaudes — tikai izpratne.
                                </p>
                            )}
                        </div>
                        <button
                            onClick={onClaim}
                            disabled={baseClaimed || claiming}
                            className={`px-4 py-2 rounded-xl text-xs font-black shrink-0 transition-all ${
                                baseClaimed
                                    ? 'bg-emerald-500 text-white cursor-default'
                                    : 'bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-60'
                            }`}
                        >
                            {baseClaimed ? `✓ +${task.base_xp ?? 0} XP` : claiming ? 'Pieprasa...' : `Esmu apguvis · +${task.base_xp ?? 0} XP`}
                        </button>
                    </div>
                </div>

                {/* Bonus claim — forum post for the bigger reward */}
                {task.forum_url && (
                    <div className="mb-4 rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/60 dark:bg-amber-900/10 p-4">
                        <p className="text-[10px] font-black text-amber-700 dark:text-amber-300 uppercase tracking-widest mb-1">
                            🎁 2. solis · Bonuss forumā · +{task.bonus_xp ?? 0} XP
                        </p>
                        <p className="text-sm font-bold text-gray-900 mb-3">
                            {bonusClaimed
                                ? `Bonuss iegūts — ${task.bonus_xp ?? 0} XP par foruma postu.`
                                : bonusPending
                                    ? 'Tavs foruma posts pārbaudē pie administratora.'
                                    : 'Publicē savu pieredzi, pārdomas vai jautājumu forumā un saņem lielāku atlīdzību.'}
                        </p>
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

                {/* Proof input — only shown when bonus not yet claimed */}
                {!bonusClaimed && (
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
                            {task.proof_type === 'tx_hash' ? 'Transakcijas hash' : 'Pierādījuma URL (bonusam)'}
                            <Info size={11} className="text-gray-300" />
                        </label>
                        <input
                            type="text"
                            value={proof}
                            onChange={(e) => setProof(e.target.value)}
                            placeholder={task.proof_hint_lv || 'https://...'}
                            className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-[var(--color-dark-bg)] text-gray-900 focus:outline-none focus:ring-2 text-sm transition-colors ${
                                proofWarning
                                    ? 'border-amber-400 focus:ring-amber-200 focus:border-amber-500'
                                    : 'border-gray-200 dark:border-[var(--color-dark-border)] focus:ring-amber-300 focus:border-amber-400'
                            }`}
                        />
                        {proofWarning ? (
                            <p className="text-[11px] font-medium text-amber-600 mt-1.5">⚠ {proofWarning}</p>
                        ) : task.proof_hint_lv ? (
                            <p className="text-[10px] text-gray-400 mt-1.5">{task.proof_hint_lv}</p>
                        ) : null}
                    </div>
                )}

                {!task.auto_approve && !bonusClaimed && (
                    <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-2">
                        <Lock size={14} className="text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                            Bonusu pārbauda administrators. Bonus XP tiek piešķirts pēc apstiprinājuma.
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
                    >{bonusClaimed ? 'Aizvērt' : 'Atcelt'}</button>
                    {!bonusClaimed && (
                        <button
                            onClick={onSubmit}
                            disabled={submitting || !proofLooksValid}
                            className="flex-1 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 disabled:opacity-50"
                        >{submitting ? 'Iesniedz...' : `Iesniegt bonusam · +${task.bonus_xp ?? 0} XP`}</button>
                    )}
                </div>
            </div>
        </div>
    );
}
