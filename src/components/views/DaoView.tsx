"use client";

import React from 'react';
import { Vote, Sparkles, Users, MessageCircle, ShieldAlert } from 'lucide-react';

interface LevelRow {
    level: number;
    emoji: string;
    title: string;
    points: number;
    note?: string;
}

const LEVELS: LevelRow[] = [
    { level: 1, emoji: '🌱', title: 'Iesācējs', points: 0 },
    { level: 2, emoji: '👀', title: 'Vērotājs', points: 5, note: 'Pieeja visiem Zoom ierakstiem' },
    { level: 3, emoji: '🚀', title: 'Entuziasts', points: 20, note: 'Pieeja padziļinātai informācijai' },
    { level: 4, emoji: '🔍', title: 'Pētnieks', points: 65, note: 'Kļūsti par pilntiesīgu DAO biedru' },
    { level: 5, emoji: '🎯', title: 'Meistars', points: 155, note: 'Sāc veidot DAO priekšlikumus' },
    { level: 6, emoji: '💡', title: 'Eksperts', points: 515 },
    { level: 7, emoji: '🌐', title: 'Ietekmētājs', points: 2015, note: 'Kļūsti par DAO kodola biedru' },
    { level: 8, emoji: '🏅', title: 'Līderis', points: 8015 },
    { level: 9, emoji: '👑', title: 'Guru', points: 33015, note: 'Pieeja DAO kasei' },
];

export function DaoView() {
    return (
        <div className="flex flex-col h-full bg-[#F8FAF9]/50 dark:bg-[var(--color-dark-bg)]">
            <header className="h-16 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[var(--color-dark-surface)] flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-500/10"><Vote size={18} className="text-indigo-600" /></div>
                    <h1 className="text-lg font-bold dark:text-gray-100">DAO — Tavs Ceļš</h1>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8">
                <div className="max-w-4xl mx-auto space-y-8">

                    <article className="bg-white dark:bg-[var(--color-dark-surface)] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm space-y-6">
                        <header>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-2">
                                Tavs &ldquo;Ceļš uz DAO&rdquo; sākas šeit!
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Līmeņu sistēma · Kā strādā punkti</p>
                        </header>

                        <section className="space-y-3">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2"><Sparkles size={18} className="text-amber-500" /> Punkti</h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                Tu nopelni punktus automātiski, kad citi kopienas biedri nospiež &ldquo;patīk&rdquo; (like) uz taviem ierakstiem vai komentāriem.
                            </p>
                            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">1 &ldquo;patīk&rdquo; = 1 punkts.</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Šī sistēma motivē dalībniekus radīt kvalitatīvu saturu un aktīvi piedalīties diskusijās.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2"><Users size={18} className="text-indigo-500" /> Līmeņi</h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                Punktiem pieaugot, tu sasniedz jaunus līmeņus, kas tiek attēloti tavā profilā pie avatara. Progresu uz nākamo līmeni vari redzēt &ldquo;Leaderboard&rdquo; sadaļā (katrā kategorijā ir sava līmeņu sistēma). Katrā sadaļā sava pratības skala pēc kuras vari mērīt savu attīstību portāla ietvaros.
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Šī komūna ir paredzēta zināšanu apguvei, aktīvai iesaistei un savstarpējam atbalstam. Piedaloties diskusijās — nevien iegūsi atbildes uz saviem jautājumiem, bet veidojot saturu, tu vari nopelnīt punktus, kas ļauj sasniegt jaunus līmeņus un atbloķēt dažādus bonusus. Jo aktīvāk iesaisties, jo vairāk iespēju tev tiek atvērtas!
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Vienkāršākais veids, kā sākt pelnīt punktus, ja nezini, par ko rakstīt oriģinālu saturu — atbildi uz saviem jautājumiem, uzdodot tos mums!
                            </p>
                            <p className="text-sm bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl px-4 py-3 text-amber-900 dark:text-amber-200">
                                <strong>P.s.</strong> Ja noklausīsies <strong>100x DeFi → Ievadkurss</strong>, automaģiski saņemsi <strong>5 PUNKTUS</strong> un ielēksi 2. līmenī!
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Līmeņu sistēmas sadalījums</h3>
                            <div className="space-y-2">
                                {LEVELS.map((l) => (
                                    <div
                                        key={l.level}
                                        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800"
                                    >
                                        <div className="flex items-center gap-3 min-w-[180px]">
                                            <span className="text-xl">{l.emoji}</span>
                                            <div>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Level {l.level}</p>
                                                <p className="font-bold text-gray-900 dark:text-gray-100">{l.title}</p>
                                            </div>
                                        </div>
                                        <div className="flex-1 flex items-center gap-3">
                                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold whitespace-nowrap">
                                                {l.points.toLocaleString('lv-LV')} punkti
                                            </span>
                                            {l.note && (
                                                <span className="text-xs text-gray-600 dark:text-gray-400">{l.note}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">No 2. līdz 9. līmenim</h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Veido saturu &ldquo;<strong>100x DeFi</strong>&rdquo; Forumā → biedri spiež &ldquo;Like&rdquo; → Krāj punktus → Atkārto.
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                                Jo augstāks līmenis, jo lielāki ieguvumi! 🚀 (tuvākajā laikā iegūsiet vēl papildus informāciju, ko saņem katrs līmenis)
                            </p>
                        </section>
                    </article>

                    {/* Community guidelines */}
                    <article className="bg-white dark:bg-[var(--color-dark-surface)] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm space-y-5">
                        <header className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-rose-500/10"><ShieldAlert size={20} className="text-rose-600" /></div>
                            <h2 className="text-xl font-black text-gray-900 dark:text-gray-100">Kopienas vadlīnijas</h2>
                        </header>

                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Lai uzturētu kvalitatīvu un draudzīgu vidi, lūdzam ievērot šīs vadlīnijas:
                        </p>

                        <ul className="space-y-3 text-sm">
                            <li className="flex gap-3">
                                <span className="text-emerald-600 shrink-0">✅</span>
                                <span className="text-gray-700 dark:text-gray-300"><strong>Esam cieņpilni</strong> – cienīsim viens otru un izturēsimies ar sapratni. Nav pieļaujami uzbrukumi, ņirgāšanās vai personīgi aizvainojumi.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-rose-500 shrink-0">🚫</span>
                                <span className="text-gray-700 dark:text-gray-300"><strong>Bez nevajadzīgas spamošanas</strong> – punktu sistēmu nedrīkst izmantot ļaunprātīgi (piemēram, veidojot bezjēdzīgus vai zemas kvalitātes ierakstus tikai punktu vākšanai). Moderatori var dzēst saturu, kas neatbilst kopienas standartiem.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-rose-500 shrink-0">❌</span>
                                <span className="text-gray-700 dark:text-gray-300"><strong>Neizturamies augstprātīgi</strong> – visi ir šeit, lai mācītos un dalītos ar zināšanām. Ja kāds uzdod &ldquo;vienkāršu&rdquo; jautājumu, atbildi ar cieņu vai nekomentē, ja nevari palīdzēt. Gudrīšu tēlošana un augstprātīgi komentāri tiks dzēsti.</span>
                            </li>
                        </ul>

                        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4 text-sm">
                            <p className="font-bold text-amber-900 dark:text-amber-200 mb-2">⚠️ Moderatori patur tiesības dzēst:</p>
                            <ul className="list-disc pl-5 space-y-1 text-amber-900 dark:text-amber-200">
                                <li>Nepieņemamas atbildes uz citu cilvēku jautājumiem</li>
                                <li>Neētisku, maldinošu vai kaitīgu saturu</li>
                                <li>Nevajadzīgus atkārtotus ierakstus, spam vai nesaskaņotus &ldquo;ieteikuma mārketinga&rdquo; (referral) saites</li>
                            </ul>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                            <MessageCircle size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                            <span>Ja tev ir jautājumi par noteikumiem vai neskaidrības par kādu situāciju, droši sazinies ar moderatoriem. Kopīgi veidojam kvalitatīvu un vērtīgu vidi visiem dalībniekiem! 🚀</span>
                        </p>
                    </article>
                </div>
            </div>
        </div>
    );
}
