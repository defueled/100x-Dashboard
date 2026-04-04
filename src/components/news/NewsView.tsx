"use client";

import React, { useState, useEffect } from 'react';
import { 
    Newspaper, 
    TrendingUp, 
    Bot, 
    Landmark, 
    ExternalLink, 
    Clock, 
    MessageSquare,
    Loader2,
    RefreshCw,
    TrendingDown,
    Minus
} from 'lucide-react';

type Category = 'ai' | 'tradfi' | 'web3';

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    contentSnippet: string;
    source: string;
    sentiment: 'bullish' | 'bearish' | 'neutral';
}

export function NewsView({ initialCategory = 'ai' }: { initialCategory?: Category }) {
    const [category, setCategory] = useState<Category>(initialCategory);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchNews();
    }, [category]);

    const fetchNews = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        
        try {
            const res = await fetch(`/api/news?category=${category}`);
            const data = await res.json();
            setNews(data);
        } catch (error) {
            console.error('Failed to fetch news:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const categories = [
        { id: 'ai', label: 'AI & Tehnoloģijas', icon: Bot, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { id: 'tradfi', label: 'TradFi & Finanses', icon: Landmark, icon2: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 'web3', label: 'Web3 & Kripto', icon: Newspaper, icon2: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' }
    ];

    const getSentimentBadge = (sentiment: string) => {
        switch (sentiment) {
            case 'bullish': return <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider"><TrendingUp size={10} /> Bullish</span>;
            case 'bearish': return <span className="flex items-center gap-1 text-[9px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full uppercase tracking-wider"><TrendingDown size={10} /> Bearish</span>;
            default: return <span className="flex items-center gap-1 text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full uppercase tracking-wider"><Minus size={10} /> Neutral</span>;
        }
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAF9]/50 overflow-hidden">
            {/* Header */}
            <header className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gray-100"><Newspaper size={18} className="text-gray-500" /></div>
                    <h1 className="text-lg font-black text-gray-900">Mintiņš News Feed</h1>
                </div>
                <button 
                    onClick={() => fetchNews(true)}
                    className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-400 transition-all flex items-center gap-2 text-xs font-bold"
                >
                    <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                    {refreshing ? 'Atjauno...' : 'Atjaunot'}
                </button>
            </header>

            {/* Category Switcher */}
            <div className="px-8 pt-6">
                <div className="flex gap-2 p-1.5 bg-white border border-gray-100 rounded-2xl w-fit shadow-sm">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id as Category)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                category === cat.id 
                                ? `${cat.bg} ${cat.color} shadow-sm` 
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <cat.icon size={14} />
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 pt-4">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="animate-spin text-emerald-500" size={32} />
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Apkopojam jaunākās ziņas...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        {news.map((item, i) => (
                            <a 
                                key={i}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/20 transition-all flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-gray-50 text-gray-400">
                                            <Newspaper size={12} />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter truncate max-w-[120px]">
                                            {item.source}
                                        </span>
                                    </div>
                                    {getSentimentBadge(item.sentiment)}
                                </div>

                                <h3 className="font-bold text-sm text-gray-900 leading-snug mb-3 group-hover:text-emerald-600 transition-colors line-clamp-3">
                                    {item.title}
                                </h3>

                                <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 mb-6 opacity-80 italic">
                                    {item.contentSnippet}
                                </p>

                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                                        <Clock size={10} />
                                        {new Date(item.pubDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                                        Lasīt vairāk <ExternalLink size={10} />
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}

                {/* Mintiņš Insight Placeholder */}
                {!loading && (
                    <div className="mt-12 bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden max-w-7xl mx-auto shadow-2xl shadow-emerald-900/10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
                        <div className="relative z-10 flex items-start gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                                <Bot size={32} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Mintiņš AI Insight</h4>
                                <h3 className="text-xl font-bold tracking-tight text-white mb-2">Šodienas Focus: {category === 'ai' ? 'LLM modeļi kļūst mazāki un efektīvāki' : category === 'tradfi' ? 'Centrālās bankas saglabā piesardzību' : 'Layer 2 tīkli sasniedz jaunus rekordu'}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">
                                    "Analizējot pēdējās 24 stundas, redzams skaidrs trends virzienā uz efektivitāti. Tirgus reaģē uz fundamentālām izmaiņām, nevis tikai spekulāciju. Mana rekomendācija: seko līdzi nevis ziņu virsrakstiem, bet reālajam protokolu pielietojumam."
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
