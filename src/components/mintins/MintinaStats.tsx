"use client";

import React, { useState, useEffect } from 'react';
import { Coins, Gem } from 'lucide-react';
import { useConnectModal } from '@rainbow-me/rainbowkit';

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
    const { openConnectModal } = useConnectModal();

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
            <button
                onClick={openConnectModal}
                className="px-4 py-2 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center gap-2 hover:bg-indigo-50 hover:border-indigo-300 transition-colors cursor-pointer"
            >
                <Coins size={16} className="text-gray-300" />
                <span className="text-xs font-bold text-gray-400">Pievieno maku → MNTŠ</span>
            </button>
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
                <h3 className="text-lg font-black text-gray-900 mb-1 leading-tight">Mintiņš Airdrop</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Paredzamais (S1)</p>
            </div>
            <div className="space-y-1">
                <p className="text-3xl font-black text-gray-900">{estimatedAirdrop.toLocaleString()}</p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500">
                    <Gem size={14} />
                    <span>Reizinātājs: {displayMultiplier} 🚀</span>
                </div>
            </div>
        </div>
    );
}

export function MintinaMarketCard() {
    const [marketData, setMarketData] = useState<any>(null);

    useEffect(() => {
        fetch('https://api.dexscreener.com/latest/dex/tokens/0xDE65f89596F88F02bE141B663cae662ed32cb08F')
            .then(r => r.json())
            .then(d => { if (d.pairs?.[0]) setMarketData(d.pairs[0]); })
            .catch(() => {});
    }, []);

    return (
        <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white md:col-span-2 overflow-hidden relative">
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-black text-white text-sm">$M</div>
                        <div>
                            <h3 className="font-black italic tracking-tight">MINTIŅŠ STATUS</h3>
                            <p className="text-[10px] text-gray-400 tracking-widest uppercase font-bold">100x Token · Base</p>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        marketData
                            ? ((marketData.priceChange?.h24 || 0) >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400')
                            : 'bg-white/10 text-white/50'
                    }`}>
                        {marketData ? `${marketData.priceChange?.h24 || '0'}% (24H)` : 'Live Dex'}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Cena</p>
                        <p className="text-2xl font-black italic tracking-tighter">
                            {marketData?.priceUsd ? `$${parseFloat(marketData.priceUsd).toFixed(6)}` : '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Market Cap</p>
                        <p className="text-2xl font-black italic tracking-tighter">
                            {marketData?.fdv ? `$${(marketData.fdv / 1000).toFixed(1)}K` : '—'}
                        </p>
                    </div>
                </div>
                <a
                    href="https://dexscreener.com/base/0xDE65f89596F88F02bE141B663cae662ed32cb08F"
                    target="_blank"
                    rel="noreferrer"
                    className="py-3 bg-emerald-500 text-gray-900 rounded-xl text-xs font-black uppercase tracking-widest text-center hover:bg-emerald-400 transition-colors block"
                >
                    DexScreener ↗
                </a>
            </div>
            <div className="absolute inset-0 opacity-10 pointer-events-none flex items-end">
                <svg className="w-full h-1/2" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <path d="M0,80 Q50,70 100,20 T200,50 T300,10 T400,60" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
            </div>
        </div>
    );
}
