"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, ExternalLink, Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

interface Row {
    id: string;
    user_email: string;
    task_id: string;
    proof_url: string;
    status: "pending" | "approved" | "rejected";
    submitted_at: string;
    admin_notes: string | null;
    task: { title_lv: string; xp_amount: number; pillar: string; tier: number } | null;
}

export default function AdminTasksPage() {
    const { data: session, status } = useSession();
    const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [notes, setNotes] = useState<Record<string, string>>({});

    const load = async (f = filter) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/admin/tasks?status=${f}`, { cache: "no-store" });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Failed to load");
                setRows([]);
                return;
            }
            setRows(data.submissions || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated") load(filter);
    }, [status, filter]);

    const review = async (id: string, action: "approve" | "reject") => {
        setBusy(id);
        try {
            const res = await fetch("/api/admin/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ submission_id: id, action, notes: notes[id] || "" }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Error");
                return;
            }
            await load();
        } finally {
            setBusy(null);
        }
    };

    if (status === "loading") {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }
    if (status === "unauthenticated") {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Sign in required.</div>;
    }

    return (
        <div className="min-h-screen bg-[#F8FAF9] p-6 md:p-10">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Task submissions — admin review</h1>
                <p className="text-sm text-gray-400 mb-6">{session?.user?.email}</p>

                <div className="flex gap-2 mb-6">
                    {(["pending", "approved", "rejected"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                                filter === f
                                    ? "bg-gray-900 text-white"
                                    : "bg-white text-gray-500 border border-gray-200 hover:border-gray-400"
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                        {error} — must be on ADMIN_EMAILS env list or have the `admin👑` tag in GHL.
                    </div>
                )}

                {loading ? (
                    <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-gray-300" /></div>
                ) : rows.length === 0 ? (
                    <p className="text-center py-12 text-sm text-gray-400">No submissions in this bucket.</p>
                ) : (
                    <div className="space-y-3">
                        {rows.map((r) => (
                            <div key={r.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                {r.task?.pillar} · T{r.task?.tier}
                                            </span>
                                            <span className="text-[10px] font-black text-amber-500">+{r.task?.xp_amount} XP</span>
                                        </div>
                                        <p className="font-bold text-gray-900">{r.task?.title_lv || r.task_id}</p>
                                        <p className="text-xs text-gray-500 mt-1">{r.user_email} · {new Date(r.submitted_at).toLocaleString("lv-LV")}</p>
                                        <a
                                            href={r.proof_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-emerald-600 hover:underline break-all"
                                        >
                                            <ExternalLink size={12} /> {r.proof_url}
                                        </a>
                                        {r.admin_notes && (
                                            <p className="text-xs text-gray-500 mt-2 italic">Notes: {r.admin_notes}</p>
                                        )}
                                    </div>
                                </div>
                                {filter === "pending" && (
                                    <div className="mt-4 flex flex-col md:flex-row gap-2">
                                        <input
                                            type="text"
                                            placeholder="Admin notes (optional)"
                                            value={notes[r.id] || ""}
                                            onChange={(e) => setNotes({ ...notes, [r.id]: e.target.value })}
                                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs"
                                        />
                                        <button
                                            onClick={() => review(r.id, "approve")}
                                            disabled={busy === r.id}
                                            className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-50"
                                        >
                                            <CheckCircle2 size={14} /> Apstiprināt
                                        </button>
                                        <button
                                            onClick={() => review(r.id, "reject")}
                                            disabled={busy === r.id}
                                            className="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-50"
                                        >
                                            <XCircle size={14} /> Noraidīt
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
