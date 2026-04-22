import React, { useState, useEffect } from 'react';
import { CalendarDays, ShoppingBag, CheckCircle2, Lock, Zap, Clock, ShieldAlert, Sparkles, TrendingUp, Cpu } from 'lucide-react';
import { useSession } from 'next-auth/react';

type Tab = 'active' | 'marketplace';

interface CalendarProduct {
    id: string;
    title: string;
    desc: string;
    price: string | 'Bezmaksas';
    duration: string;
    icon: React.ElementType;
    color: string;
    isLocked?: boolean;
    features: string[];
    icsUrl?: string;
}

const MARKETPLACE_PRODUCTS: CalendarProduct[] = [
    {
        id: '100x-forum',
        title: '100x Forums ( Brīvais Mikrofons )',
        desc: 'Globālais iknedēļas tiešsaistes zvans kopienai. Pievienojies platforma.100x.lv/login',
        price: 'Bezmaksas',
        duration: 'Nepārtraukts',
        icon: CalendarDays,
        color: '#8b5cf6', // Violet/Indigo tone
        features: ['Iknedēļas trešdienās 19:00', 'Kopienas jaunumi', 'Tiešā saite uz platformu'],
        icsUrl: 'queqo60camsb2j65dg5qm4hf2vbtt2d4@import.calendar.google.com' // Mock ICS for now, user will replace
    },
    {
        id: 'ai-fast-track',
        title: 'AI Fast Track (Rīti)',
        desc: '15 minūšu mikro-uzdevumi un "Prompt of the Day" tieši tavā WhatsApp un E-pastā katru rītu.',
        price: 'Bezmaksas',
        duration: '14 Dienas',
        icon: Cpu,
        color: '#59b687',
        features: ['14 dzinējspēka paziņojumi', 'Ikdienas Prompt piemēri', 'Rīta motivācija pirms darba'],
        icsUrl: 'queqo60camsb2j65dg5qm4hf2vbtt2d4@import.calendar.google.com' // Mock ICS/ID for the iframe integration
    },
    {
        id: 'defi-dca',
        title: 'DeFi & DCA Ritms',
        desc: 'Automātiski atgādinājumi par optimālajiem pirkšanas logiem un tirgus makro apskati katru piektdienu.',
        price: '€10.00 / mēn',
        duration: 'Nepārtraukts',
        icon: TrendingUp,
        color: '#4A9EE5',
        isLocked: true,
        features: ['Makro tirgus pārskats piektdienās', 'DCA atgādinājumi (Algām)', 'Gāzes formu optimālie laiki'],
        icsUrl: ''
    },
    {
        id: 'burnout-shield',
        title: 'Burnout Shield (Vakari)',
        desc: 'Psiholoģiski izveidots vakara atslodzes ritms. No-code un pasīvās uztveres materiāli, kad smadzenes ir nogurušas.',
        price: '€5.00 / mēn',
        duration: 'Nepārtraukts',
        icon: ShieldAlert,
        color: '#F5A623',
        isLocked: true,
        features: ['Vakara "Wind-down" paziņojumi', 'Podcast un Video ieteikumi', '0% spiediena, tikai pasīva izaugsme'],
        icsUrl: ''
    }
];

export function CalendarView() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<Tab>('marketplace');
    const [activeCalendars, setActiveCalendars] = useState<string[]>([]);
    const [activationLoading, setActivationLoading] = useState<string | null>(null);
    const [ghlEvents, setGhlEvents] = useState<any[]>([]);
    const [eventsLoading, setEventsLoading] = useState(false);

    useEffect(() => {
        setEventsLoading(true);
        fetch('/api/events')
            .then(r => r.json())
            .then(d => setGhlEvents(d.events || []))
            .catch(() => {})
            .finally(() => setEventsLoading(false));
    }, []);

    const handleActivate = async (productId: string, icsUrl?: string) => {
        setActivationLoading(productId);

        // Mocking the GHL Webhook call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setActiveCalendars(prev => [...prev, productId]);
        setActivationLoading(null);
        setActiveTab('active');

        // Quick-Add to Google Calendar Strategy:
        if (icsUrl) {
            // Encode the ICS URL for the Google Calendar 1-click subscribe link
            const googleCalUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(icsUrl)}`;
            // Open in new tab so they can immediately subscribe
            window.open(googleCalUrl, '_blank');
        }

        // In reality, here we would post to our backend which hits GHL:
        // fetch('/api/ghl/add-tag', { method: 'POST', body: JSON.stringify({ email: session?.user?.email, tags: [`[Calendar] ${productId}`] }) })
    };

    return (
        <div className="flex flex-col h-full bg-[#F8FAF9]/50">
            <header className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-500/10"><CalendarDays size={18} className="text-indigo-600" /></div>
                    <h1 className="text-lg font-bold">Overlays Veikals</h1>
                </div>

                {/* Tabs */}
                <div className="bg-gray-100 p-1 rounded-xl flex text-xs font-bold">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-2 ${activeTab === 'active' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <Zap size={14} className={activeTab === 'active' ? 'text-emerald-500' : ''} /> Mani Laiki
                        {activeCalendars.length > 0 && <span className="bg-emerald-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px]">{activeCalendars.length}</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('marketplace')}
                        className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-2 ${activeTab === 'marketplace' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <ShoppingBag size={14} className={activeTab === 'marketplace' ? 'text-indigo-500' : ''} /> Veikals
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8">
                <div className="max-w-5xl mx-auto">

                    {/* MARKETPLACE TAB */}
                    {activeTab === 'marketplace' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Pievieno izaugsmi savai ikdienai</h2>
                                <p className="text-gray-500">Abonē 100x Kalendāra pārklājumus. Mūsu AI Organizer nosūtīs tev precīzi aprēķinātus uzdevumus tādā laikā, kad esi visspējīgākais tos izpildīt.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {MARKETPLACE_PRODUCTS.map(product => {
                                    const isActive = activeCalendars.includes(product.id);

                                    return (
                                        <div key={product.id} className={`bg-white rounded-3xl p-6 border transition-all flex flex-col h-full ${product.isLocked ? 'border-gray-100 opacity-70 grayscale hover:grayscale-0' : 'border-gray-200 hover:border-indigo-200 shadow-sm hover:shadow-md'}`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="p-3 rounded-2xl" style={{ backgroundColor: `${product.color}15`, color: product.color }}>
                                                    <product.icon size={24} />
                                                </div>
                                                <div className="text-right">
                                                    <span className="block text-sm font-bold text-gray-900">{product.price}</span>
                                                    <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest flex items-center justify-end gap-1"><Clock size={10} /> {product.duration}</span>
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-900 mb-2">{product.title}</h3>
                                            <p className="text-sm text-gray-500 mb-6 flex-1 leading-relaxed">{product.desc}</p>

                                            <div className="space-y-2 mb-6 text-xs text-gray-600 border-t border-gray-50 pt-4">
                                                {product.features.map((feature, i) => (
                                                    <div key={i} className="flex items-start gap-2">
                                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                                        <span>{feature}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {isActive ? (
                                                <div className="w-full py-3 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-xl text-center border border-emerald-100 flex items-center justify-center gap-2">
                                                    <CheckCircle2 size={16} /> Ir Aktivizēts
                                                </div>
                                            ) : product.isLocked ? (
                                                <button className="w-full py-3 bg-gray-100 text-gray-400 text-sm font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                                                    <Lock size={16} /> Slēgts Līmenis
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleActivate(product.id, product.icsUrl)}
                                                    disabled={activationLoading === product.id}
                                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                                                >
                                                    {activationLoading === product.id ? (
                                                        <span className="animate-pulse">Aktivizē...</span>
                                                    ) : (
                                                        <>1-Click Pievienot Kalendāram <Sparkles size={16} /></>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ACTIVE TAB */}
                    {activeTab === 'active' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tavs Reāllaika Ritms</h2>
                                <p className="text-gray-500">Šeit tu pārvaldi aktīvos kalendārus un sazinies ar AI Aģentu. Paziņojumi pienāks automātiski visos pieslēgtajos kanālos (E-pasts, WhatsApp).</p>
                            </div>

                            {/* UPCOMING GHL EVENTS */}
                            <div className="mb-8">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <CalendarDays size={14} /> Gaidāmie Kopienas Pasākumi
                                </h3>
                                {eventsLoading ? (
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center text-sm text-gray-400">Ielādē...</div>
                                ) : ghlEvents.length === 0 ? (
                                    <div className="bg-white rounded-2xl border border-dashed border-gray-100 p-6 text-center text-sm text-gray-400">
                                        Nav ieplānotu pasākumu nākamajās 30 dienās
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {ghlEvents.slice(0, 5).map((ev: any) => {
                                            const start = new Date(ev.start);
                                            return (
                                                <div key={ev.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex flex-col items-center justify-center shrink-0">
                                                        <span className="text-[10px] font-black text-indigo-400 uppercase">{start.toLocaleString('lv-LV', { month: 'short' })}</span>
                                                        <span className="text-lg font-black text-indigo-700 leading-none">{start.getDate()}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-gray-900 truncate">{ev.title}</p>
                                                        <p className="text-[11px] text-gray-400 font-medium">
                                                            {start.toLocaleString('lv-LV', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {activeCalendars.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                        <CalendarDays size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Pievieno savu pirmo Ritmu</h3>
                                    <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">Vēl neesi aktivizējis nevienu Overaly no Veikala. Sāc ar "AI Fast Track" pilnīgi bez maksas.</p>
                                    <button
                                        onClick={() => setActiveTab('marketplace')}
                                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors"
                                    >
                                        Uz Veikalu
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {activeCalendars.map(id => {
                                        const product = MARKETPLACE_PRODUCTS.find(p => p.id === id);
                                        if (!product) return null;

                                        return (
                                            <div key={id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
                                                <div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${product.color}15`, color: product.color }}>
                                                    <product.icon size={40} />
                                                </div>
                                                <div className="flex-1 text-center md:text-left">
                                                    <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                                                        <h3 className="text-xl font-bold text-gray-900">{product.title}</h3>
                                                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 uppercase px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 size={10} /> Aktīvs</span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 leading-relaxed mb-3 max-w-lg">{product.desc}</p>
                                                    <div className="flex items-center gap-4 justify-center md:justify-start">
                                                        <div className="text-xs text-gray-400 flex items-center gap-1.5 font-medium"><Clock size={14} /> Atlikuši sūtījumi: <span className="text-gray-900 font-bold">14 no 14</span></div>
                                                    </div>
                                                </div>
                                                <div className="shrink-0 flex gap-2 w-full md:w-auto mt-4 md:mt-0 flex-col sm:flex-row">
                                                    <button
                                                        onClick={() => window.open(`https://calendar.google.com/calendar/r?cid=${encodeURIComponent(product.icsUrl || '')}`, '_blank')}
                                                        className="flex-1 md:flex-none border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 font-bold px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                    >
                                                        Resync Google
                                                    </button>
                                                    <button className="flex-1 md:flex-none bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                                                        Pārvaldīt Ritmu <Sparkles size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Built-in Google Calendar Embedded view */}
                                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mt-10">
                                        <div className="flex items-center justify-between mb-6">
                                            <h4 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                                <CalendarDays size={20} className="text-indigo-600" /> Vizuālais Pārskats (Global 100x Events)
                                            </h4>
                                        </div>
                                        {/* Integrating user's specific calendar dynamically if available, or the master CRM calendar */}
                                        <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 h-[600px] flex">
                                            <iframe
                                                src="https://calendar.google.com/calendar/embed?src=queqo60camsb2j65dg5qm4hf2vbtt2d4%40import.calendar.google.com&ctz=Europe%2FRiga&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0&mode=WEEK"
                                                style={{ border: 0, width: '100%', height: '100%', minHeight: '600px' }}
                                                frameBorder="0"
                                                scrolling="no"
                                            ></iframe>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-4 leading-relaxed max-w-2xl">
                                            Šis ir tiešais pārskats no tava pievienotā AI Fast Track Overlay. Kad mākslīgais intelekts nosūta atjauninājumu satura arhitektūrā, tas automātiski parādās šajā skatā un tavā personīgajā ierīcē.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
