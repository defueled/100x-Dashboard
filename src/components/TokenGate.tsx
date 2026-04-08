"use client";

import React, { useState, useEffect } from 'react';
import { Coins, Lock, Wallet, ExternalLink } from 'lucide-react';

interface TokenGateProps {
    evmAddress?: string;
    /** Minimum MNTŠ to unlock. Default: 1 (any balance unlocks) */
    minBalance?: number;
    /** Label shown in locked state CTA */
    featureName?: string;
    children: React.ReactNode;
}

export function TokenGate({ evmAddress, minBalance = 1, featureName = 'šo sekciju', children }: TokenGateProps) {
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (!evmAddress) { setChecked(true); return; }
        setLoading(true);
        fetch(`/api/mintins/balance?address=${evmAddress}`)
            .then(r => r.json())
            .then(d => typeof d.balance === 'number' && setBalance(d.balance))
            .catch(() => {})
            .finally(() => { setLoading(false); setChecked(true); });
    }, [evmAddress]);

    // Loading state
    if (!checked || loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#F8FAF9]/50">
                <div className="w-8 h-8 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            </div>
        );
    }

    // Unlocked
    if (evmAddress && balance !== null && balance >= minBalance) {
        return <>{children}</>;
    }

    // Locked — no wallet
    if (!evmAddress) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#F8FAF9]/50 p-8 text-center">
                <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 flex items-center justify-center mb-6 shadow-xl shadow-indigo-100">
                    <Wallet size={36} className="text-indigo-400" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Pievieno Maciņu</h2>
                <p className="text-sm text-gray-500 max-w-xs mb-8 leading-relaxed">
                    Lai piekļūtu {featureName}, tev nepieciešams savienot EVM maciņu un turēt vismaz{' '}
                    <span className="font-bold text-indigo-600">{minBalance} MNTŠ</span>.
                </p>
                <a
                    href="/dashboard/profile"
                    className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                    Savienot Maciņu →
                </a>
            </div>
        );
    }

    // Locked — wallet connected but insufficient balance
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#F8FAF9]/50 p-8 text-center">
            <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 flex items-center justify-center mb-6 shadow-xl shadow-indigo-100 relative">
                <Coins size={36} className="text-indigo-400" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <Lock size={14} className="text-red-500" />
                </div>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Nepietiek MNTŠ</h2>
            <p className="text-sm text-gray-500 max-w-xs mb-2 leading-relaxed">
                Tev ir <span className="font-bold text-gray-700">{balance?.toLocaleString() ?? 0} MNTŠ</span>.
                Nepieciešams vismaz <span className="font-bold text-indigo-600">{minBalance.toLocaleString()} MNTŠ</span> lai atbloķētu {featureName}.
            </p>
            <p className="text-xs text-gray-400 mb-8">Token: Mintiņš · Base Network</p>
            <a
                href="https://dexscreener.com/base/0xDE65f89596F88F02bE141B663cae662ed32cb08F"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
                Iegūt MNTŠ <ExternalLink size={14} />
            </a>
        </div>
    );
}
