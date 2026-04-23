"use client";

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, XCircle, Target, Lock, Sparkles, Loader2 } from 'lucide-react';

type ProofType = 'url' | 'tx_hash' | 'admin_review';
type Status = 'pending' | 'approved' | 'rejected';

interface Task {
    id: string;
    pillar: 'ai' | 'defi' | 'tradfi' | 'culture' | 'global';
    tier: 1 | 2 | 3;
    title_lv: string;
    description_lv: string | null;
    xp_amount: number;
    proof_type: ProofType;
    proof_hint_lv: string | null;
    auto_approve: boolean;
    position: number;
}

interface Submission {
    task_id: string;
    status: Status;
    proof_url: string;
    submitted_at: string;
    reviewed_at: string | null;
    admin_notes: string | null;
}

const PILLAR_COLORS: Record<string, { bg: string; text: string; label: string }> = {
    ai: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'AI' },
    defi: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'DeFi' },
    tradfi: { bg: 'bg-indigo-50', text: 'text-indigo-700', label: 'TradFi' },
    culture: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Kultūra' },
    global: { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Global' },
};

const TIER_LABELS: Record<number, string> = { 1: 'Iesācējs', 2: 'Pētnieks', 3: 'Meistars' };

export function QuestsView() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [subs, setSubs] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
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
                setTasks(data.tasks || []);
                setSubs(data.submissions || []);
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { load(); }, []);

    const subMap = useMemo(() => {
        const m = new Map<string, Submission>();
        for (const s of subs) m.set(s.task_id, s);
        return m;
    }, [subs]);

    const grouped = useMemo(() => {
        const by: Record<string, Record<number, Task[]>> = {};
        for (const t of tasks) {
            by[t.pillar] ||= { 1: [], 2: [], 3: [] };
            by[t.pillar][t.tier].push(t);
        }
        return by;
    }, [tasks]);

    const openModal = (task: Task) => {
        setSelected(task);
        setProof('');
        setError(null);
        setSuccessMsg(null);
    };
    const closeModal = () => { setSelected(null); setProof(''); setError(null); };

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

    if (loading) {
        return (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 bg-[#F8FAF9]/50">
                <div className="max-w-5xl mx-auto flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-gray-300" size={32} />
                </div>
            </div>
        );
    }

    const pillarOrder: Array<Task['pillar']> = ['ai', 'defi', 'tradfi', 'culture'];

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 bg-[#F8FAF9]/50">
            <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-2">
                        <Target className="text-emerald-500" size={24} /> Uzdevumi un Pratības
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Katrā pīlārā 3 līmeņi — no vienkāršiem līdz dziļiem. Iesniedz pierādījumu, saņem XP.</p>
                </div>

                {pillarOrder.map((pillar) => {
                    const block = grouped[pillar];
                    if (!block) return null;
                    const color = PILLAR_COLORS[pillar];
                    return (
                        <section key={pillar} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-black text-gray-900">{color.label}</h2>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${color.bg} ${color.text}`}>
                                    {(block[1]?.length || 0) + (block[2]?.length || 0) + (block[3]?.length || 0)} uzdevumi
                                </span>
                            </div>
                            <div className="space-y-5">
                                {[1, 2, 3].map((tier) => {
                                    const list = block[tier] || [];
                                    if (list.length === 0) return null;
                                    return (
                                        <div key={tier}>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tier {tier} · {TIER_LABELS[tier]}</p>
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
                                                                    ? 'bg-gray-50/50 border-gray-100 opacity-60 cursor-default'
                                                                    : 'bg-white border-gray-100 hover:border-emerald-300 hover:shadow-sm'
                                                            }`}
                                                        >
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div className="flex items-start gap-2">
                                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                                                                        isApproved ? 'bg-emerald-500 text-white'
                                                                        : isPending ? 'bg-amber-100 text-amber-600'
                                                                        : isRejected ? 'bg-red-100 text-red-600'
                                                                        : 'bg-gray-100 text-gray-400'
                                                                    }`}>
                                                                        {isApproved ? <CheckCircle2 size={14} /> :
                                                                         isPending ? <Clock size={14} /> :
                                                                         isRejected ? <XCircle size={14} /> :
                                                                         <Sparkles size={14} />}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className={`text-sm font-bold ${isApproved ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.title_lv}</p>
                                                                        {task.description_lv && (
                                                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{task.description_lv}</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <span className={`text-[10px] font-black shrink-0 ml-2 ${isApproved ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                                    {isApproved ? 'IEGŪTS' : `+${task.xp_amount} XP`}
                                                                </span>
                                                            </div>
                                                            {isPending && (
                                                                <p className="text-[10px] font-bold text-amber-600 mt-1 flex items-center gap-1"><Clock size={10} /> Pārbauda administrators</p>
                                                            )}
                                                            {isRejected && (
                                                                <p className="text-[10px] font-bold text-red-600 mt-1">Noraidīts{sub?.admin_notes ? ` · ${sub.admin_notes}` : ''} — iesniedz atkārtoti</p>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* Submission modal */}
            {selected && (
                <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeModal}>
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tier {selected.tier} · {PILLAR_COLORS[selected.pillar]?.label}</p>
                                <h3 className="text-lg font-black text-gray-900 mt-1">{selected.title_lv}</h3>
                            </div>
                            <span className="text-sm font-black text-amber-500 shrink-0 ml-3">+{selected.xp_amount} XP</span>
                        </div>
                        {selected.description_lv && (
                            <p className="text-sm text-gray-600 mb-4">{selected.description_lv}</p>
                        )}
                        <div className="mb-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                                {selected.proof_type === 'tx_hash' ? 'Transakcijas hash' : 'Pierādījuma URL'}
                            </label>
                            <input
                                type="text"
                                value={proof}
                                onChange={(e) => setProof(e.target.value)}
                                placeholder={selected.proof_hint_lv || 'https://...'}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-sm"
                                autoFocus
                            />
                            {selected.proof_hint_lv && (
                                <p className="text-[10px] text-gray-400 mt-1.5">{selected.proof_hint_lv}</p>
                            )}
                        </div>
                        {!selected.auto_approve && (
                            <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
                                <Lock size={14} className="text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-800 font-medium">Šo pārbauda administrators. XP tiek piešķirts pēc apstiprinājuma.</p>
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
                                onClick={closeModal}
                                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50"
                            >Atcelt</button>
                            <button
                                onClick={submit}
                                disabled={submitting || !proof.trim()}
                                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 disabled:opacity-50"
                            >{submitting ? 'Iesniedz...' : 'Iesniegt'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
