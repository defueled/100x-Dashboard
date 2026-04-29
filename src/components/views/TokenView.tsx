"use client";

import React from 'react';
import { Coins, Vote, GraduationCap, Users, Shield, ArrowUpRight, ExternalLink } from 'lucide-react';
import { MintinaMarketCard } from '../mintins/MintinaStats';

const POOL_ADDRESS = '0xc4067dfc12e67ee1b8b2e6c24b7214f63232ee40';
const TOKEN_ADDRESS = '0xDE65f89596F88F02bE141B663cae662ed32cb08F';

export function TokenView() {
    return (
        <div className="flex flex-col h-full bg-[#F8FAF9]/50 dark:bg-[var(--color-dark-bg)]">
            <header className="h-16 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[var(--color-dark-surface)] flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10"><Coins size={18} className="text-emerald-600" /></div>
                    <h1 className="text-lg font-bold dark:text-gray-100">Mūsu Žetons — Mintiņš</h1>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Live market card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MintinaMarketCard />
                    </div>

                    {/* GeckoTerminal embedded chart */}
                    <div className="bg-white dark:bg-[var(--color-dark-surface)] rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <h2 className="font-bold text-gray-900 dark:text-gray-100">Cenas grafiks</h2>
                            <a
                                href={`https://www.geckoterminal.com/base/pools/${POOL_ADDRESS}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                            >
                                GeckoTerminal <ExternalLink size={12} />
                            </a>
                        </div>
                        <iframe
                            src={`https://www.geckoterminal.com/base/pools/${POOL_ADDRESS}?embed=1&info=0&swaps=0&grayscale=0&light_chart=1`}
                            title="Mintiņš live chart"
                            className="w-full h-[500px] border-0"
                            allow="clipboard-write"
                            allowFullScreen
                        />
                    </div>

                    {/* Pievienojies! CTA — directly under the chart */}
                    <section className="bg-indigo-50 dark:bg-indigo-500/5 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-500/20 space-y-3">
                        <h3 className="font-bold text-lg text-indigo-900 dark:text-indigo-300">🤝 Pievienojies!</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Ja tev jau ir Mintiņi tavā makā, tu vari balsot Snapshot platformā un ietekmēt 100x DAO virzību jau šodien.
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Ja vēl neesi iesaistījies — aicinām kļūt par aktīvu biedru, mācīties un kopā veidot nākotni!
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <a
                                href={`https://www.geckoterminal.com/base/pools/${POOL_ADDRESS}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-colors"
                            >
                                Cenas grafiks <ArrowUpRight size={14} />
                            </a>
                            <a
                                href={`https://app.uniswap.org/swap?chain=base&outputCurrency=${TOKEN_ADDRESS}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 font-bold text-xs uppercase tracking-widest rounded-full transition-colors"
                            >
                                Iegādāties Uniswap <ArrowUpRight size={14} />
                            </a>
                        </div>
                    </section>

                    {/* What is the DAO + Mintiņš's role */}
                    <article className="bg-white dark:bg-[var(--color-dark-surface)] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm space-y-6">
                        <header>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-2">🚀 Kas ir DAO un kā darbojas mūsējais?</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Mintiņa loma 100x DAO ekosistēmā</p>
                        </header>

                        <section className="space-y-3">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">💡 Kas ir DAO?</h3>
                            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                DAO jeb <strong>Decentralizēta Autonomā Organizācija</strong> ir jauns, digitāls organizācijas veids, kas darbojas uz blokķēdes tehnoloģijas pamata. Tā vietā, lai lēmumus pieņemtu viens cilvēks vai neliela grupa, tos pieņem visa kopiena – katrs dalībnieks ar savām balsstiesībām.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">🧠 DAO pamatelementi</h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300">DAO ir kā digitāla kopiena vai uzņēmums, kur:</p>
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-none pl-0">
                                <li className="flex gap-2"><Vote size={16} className="text-emerald-600 mt-0.5 shrink-0" /> Lēmumus pieņem paši dalībnieki, balsojot</li>
                                <li className="flex gap-2"><Shield size={16} className="text-emerald-600 mt-0.5 shrink-0" /> Balsis tiek skaitītas automātiski caur blokķēdes viedajiem līgumiem</li>
                                <li className="flex gap-2"><Users size={16} className="text-emerald-600 mt-0.5 shrink-0" /> Visa darbība ir caurspīdīga un redzama ikvienam</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">⚙️ Kā darbojas DAO?</h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300">DAO funkcijas nosaka <strong>viedie līgumi</strong> — programmas blokķēdē, kas reglamentē:</p>
                            <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300 list-disc pl-6">
                                <li>Kas var iesniegt priekšlikumus</li>
                                <li>Kā notiek balsošana</li>
                                <li>Kā tiek sadalīti līdzekļi un atalgojums</li>
                            </ul>
                            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                Piemēram, draugu grupa var kopīgi finansēt projektu un kopīgi balsot par līdzekļu izmantošanu – bez vadītāja vai starpniekiem.
                            </p>
                        </section>

                        <section className="space-y-3 bg-emerald-50 dark:bg-emerald-500/5 -mx-2 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                            <h3 className="font-bold text-lg text-emerald-900 dark:text-emerald-300">🚀 Kas ir mūsu &ldquo;100xAbc&rdquo; DAO eksperiments un kāds ir tā mērķis?</h3>
                            <p className="text-sm font-bold text-emerald-900 dark:text-emerald-300">100x DAO ir pirmais izglītības DAO Latvijā!</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Tā mērķis ir:</p>
                            <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300 list-disc pl-6">
                                <li>Apvienot kripto un Web3 izglītību</li>
                                <li>Veicināt finanšu pratību</li>
                                <li>Radīt kopienu, kur ikviens var piedalīties lēmumu pieņemšanā un projektu virzībā</li>
                                <li>Izveidot reālu praksē pārbaudītu piemēru valstiskā līmenī</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">🧭 Kas veido mūsu DAO balsošanas spēku?</h3>

                            <div className="space-y-2">
                                <p className="font-bold text-gray-900 dark:text-gray-100">1️⃣ Balsošanas tiesības</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">Lai piedalītos publiskajos DAO balsojumos, tev jābūt mūsu tokeniem tavā DeFi makā. Mēs izsniedzam divu veidu tokenus bez maksas aktīviem biedriem:</p>
                                <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300 list-none pl-0">
                                    <li className="flex gap-2"><GraduationCap size={16} className="text-indigo-500 mt-0.5 shrink-0" /> <span><strong>🎓 NFT</strong> – mūsu Pratības līmeņu NFT, kas apliecina tavu zināšanu līmeni</span></li>
                                    <li className="flex gap-2"><Coins size={16} className="text-emerald-500 mt-0.5 shrink-0" /> <span><strong>🗳️ &ldquo;Mintiņi&rdquo;</strong> – balsošanas tokeni jeb governance tokens</span></li>
                                </ul>
                                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Vismaz 1 Mintiņš = Balsstiesība</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Šos tokenus var saņemt, aktīvi piedaloties un sasniedzot noteiktus Pratības līmeņus.</p>
                            </div>

                            <div className="space-y-2 mt-4">
                                <p className="font-bold text-gray-900 dark:text-gray-100">2️⃣ Ietekmes veidošana</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">Lai ne tikai balsotu, bet arī iesniegtu priekšlikumus un veidotu iniciatīvas, nepieciešams:</p>
                                <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300 list-disc pl-6">
                                    <li>Būt 100x Pratības portāla abonementam</li>
                                    <li>Sasniegt 4. Pratības līmeni ar regulāru iesaisti portāla procesos</li>
                                </ul>
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">💬 Kur tu vari iesaistīties?</h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Atīsti savu pratības līmeni <strong>100x DeFi</strong> sadaļā iekš portāla un kļūsti par pilntiesīgu DAO biedru:
                            </p>
                            <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300 list-disc pl-6">
                                <li>Tur tiek apspriesti jauni priekšlikumi</li>
                                <li>Plānotas iniciatīvas un balsojumi</li>
                                <li>Izvērtēts, kā izmantot DAO resursus un atalgojumu</li>
                            </ul>
                        </section>

                    </article>
                </div>
            </div>
        </div>
    );
}
