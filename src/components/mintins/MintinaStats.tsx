"use client";

import React, { useState, useEffect } from 'react';
import { Coins, Gem } from 'lucide-react';
import { Wallet } from 'lucide-react';

function formatTokenPrice(priceStr: string): string {
    const n = parseFloat(priceStr);
    if (!isFinite(n) || n <= 0) return '—';
    if (n >= 1) return `$${n.toFixed(2)}`;
    if (n >= 0.01) return `$${n.toFixed(4)}`;
    if (n >= 0.0001) return `$${n.toFixed(6)}`;
    // Sub-cent micro-cap prices: keep 3 significant digits without scientific
    // notation (e.g. 0.000002422 → "$0.00000242"). Compute decimals needed.
    const significantDigits = 3;
    const magnitude = Math.floor(Math.log10(n));
    const decimals = Math.min(20, significantDigits - magnitude - 1);
    return `$${n.toFixed(decimals)}`;
}

function formatMarketCap(fdv: number): string {
    if (!isFinite(fdv) || fdv <= 0) return '—';
    if (fdv >= 1e9) return `$${(fdv / 1e9).toFixed(2)}B`;
    if (fdv >= 1e6) return `$${(fdv / 1e6).toFixed(2)}M`;
    if (fdv >= 1e3) return `$${(fdv / 1e3).toFixed(1)}K`;
    return `$${fdv.toFixed(0)}`;
}

interface MintinaStatsProps {
    evmAddress?: string;
    totalXp: number;
    seasonMultiplier: number;
}

export function MintinaStats({ evmAddress, totalXp, seasonMultiplier }: MintinaStatsProps) {
    const [marketData, setMarketData] = useState<any>(null);
    const [mintinsBalance, setMintinsBalance] = useState<number | null>(null);
    const [balanceLoading, setBalanceLoading] = useState(false);

    const estimatedAirdrop = totalXp * seasonMultiplier;
    const displayMultiplier = `${seasonMultiplier}x`;

    useEffect(() => {
        fetch('https://api.dexscreener.com/latest/dex/tokens/0xDE65f89596F88F02bE141B663cae662ed32cb08F')
            .then(r => r.json())
            .then(d => { if (d.pairs?.[0]) setMarketData(d.pairs[0]); })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!evmAddress) return;
        setBalanceLoading(true);
        fetch(`/api/mintins/balance?address=${evmAddress}`)
            .then(r => r.json())
            .then(d => { if (typeof d.balance === 'number') setMintinsBalance(d.balance); })
            .catch(() => {})
            .finally(() => setBalanceLoading(false));
    }, [evmAddress]);

    return (
        <>
            {/* BALANCE CHIP — rendered inline in header, exported separately */}
            {/* Use <MintinaBalanceChip> for header, <MintinaAirdropCard> and <MintinaMarketCard> for grid */}
        </>
    );
}

export function MintinaBalanceChip({ evmAddress }: { evmAddress?: string }) {
    const [mintinsBalance, setMintinsBalance] = useState<number | null>(null);
    const [balanceLoading, setBalanceLoading] = useState(false);

    useEffect(() => {
        if (!evmAddress) return;
        setBalanceLoading(true);
        fetch(`/api/mintins/balance?address=${evmAddress}`)
            .then(r => r.json())
            .then(d => { if (typeof d.balance === 'number') setMintinsBalance(d.balance); })
            .catch(() => {})
            .finally(() => setBalanceLoading(false));
    }, [evmAddress]);

    if (!evmAddress) {
        return (
            <div className="px-4 py-2 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center gap-2">
                <Wallet size={16} className="text-gray-300" />
                <span className="text-xs font-bold text-gray-400">Pievieno maku profilā → MNTŠ</span>
            </div>
        );
    }

    return (
        <div className="px-4 py-2 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-sm flex items-center gap-2">
            <Coins size={16} className="text-indigo-500" />
            <span className="text-xs font-bold text-indigo-700">
                {balanceLoading ? '…' : mintinsBalance !== null ? `${mintinsBalance.toLocaleString()} MNTŠ` : '— MNTŠ'}
            </span>
        </div>
    );
}

export function MintinaAirdropCard({ totalXp, seasonMultiplier }: { totalXp: number; seasonMultiplier: number }) {
    const estimatedAirdrop = totalXp * seasonMultiplier;
    const displayMultiplier = `${seasonMultiplier}x`;

    return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                    <Coins className="text-indigo-500" size={24} />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1 leading-tight">Airdrop Reizinātājs</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Mintiņš · Sezona 1</p>
            </div>
            <div className="space-y-1">
                <p className="text-3xl font-black text-gray-900">{estimatedAirdrop.toLocaleString()}</p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500">
                    <Gem size={14} />
                    <span>Airdrop reizinātājs: {displayMultiplier} 🚀</span>
                </div>
            </div>
        </div>
    );
}

export function MintinaMarketCard() {
    const [marketData, setMarketData] = useState<{ priceUsd?: string; priceChangeH24?: number; fdv?: number } | null>(null);

    useEffect(() => {
        // GeckoTerminal indexes the Mintiņš/WETH pool on Base; DexScreener
        // doesn't yet (liquidity below their threshold). Try GT first, then
        // fall back to DexScreener so the card auto-recovers if/when they
        // index the pair.
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch('https://api.geckoterminal.com/api/v2/networks/base/tokens/0xDE65f89596F88F02bE141B663cae662ed32cb08F/pools');
                const d = await res.json();
                const pool = d?.data?.[0]?.attributes;
                if (pool && !cancelled) {
                    setMarketData({
                        priceUsd: pool.base_token_price_usd,
                        priceChangeH24: parseFloat(pool.price_change_percentage?.h24 ?? '0'),
                        fdv: parseFloat(pool.fdv_usd ?? '0'),
                    });
                    return;
                }
            } catch {}
            try {
                const res = await fetch('https://api.dexscreener.com/latest/dex/tokens/0xDE65f89596F88F02bE141B663cae662ed32cb08F');
                const d = await res.json();
                const pair = d?.pairs?.[0];
                if (pair && !cancelled) {
                    setMarketData({
                        priceUsd: pair.priceUsd,
                        priceChangeH24: parseFloat(pair.priceChange?.h24 ?? '0'),
                        fdv: pair.fdv,
                    });
                }
            } catch {}
        })();
        return () => { cancelled = true; };
    }, []);

    return (
        <div className="bg-emerald-50/60 rounded-[2.5rem] p-8 border border-emerald-100 md:col-span-2 overflow-hidden relative">
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-black text-white text-sm">$M</div>
                        <div>
                            <h3 className="font-black italic tracking-tight text-emerald-900">MINTIŅŠ STATUS</h3>
                            <p className="text-[10px] text-emerald-600/70 tracking-widest uppercase font-bold">100x Token · Base</p>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        marketData
                            ? ((marketData.priceChangeH24 ?? 0) >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700')
                            : 'bg-emerald-100/60 text-emerald-700/60'
                    }`}>
                        {marketData ? `${(marketData.priceChangeH24 ?? 0).toFixed(1)}% (24H)` : 'Live Dex'}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <p className="text-[10px] text-emerald-700/60 uppercase font-black tracking-widest mb-1">Cena</p>
                        <p className="text-2xl font-black italic tracking-tighter text-emerald-900">
                            {marketData?.priceUsd ? formatTokenPrice(marketData.priceUsd) : '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] text-emerald-700/60 uppercase font-black tracking-widest mb-1">Market Cap</p>
                        <p className="text-2xl font-black italic tracking-tighter text-emerald-900">
                            {marketData?.fdv ? formatMarketCap(marketData.fdv) : '—'}
                        </p>
                    </div>
                </div>
                <a
                    href="https://dexscreener.com/base/0xDE65f89596F88F02bE141B663cae662ed32cb08F"
                    target="_blank"
                    rel="noreferrer"
                    className="self-start inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-bold rounded-full transition-colors"
                >
                    DexScreener ↗
                </a>
            </div>
            <div className="absolute inset-0 opacity-10 pointer-events-none flex items-end text-emerald-700">
                <svg className="w-full h-1/2" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <path d="M0,80 Q50,70 100,20 T200,50 T300,10 T400,60" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
            </div>
        </div>
    );
}
