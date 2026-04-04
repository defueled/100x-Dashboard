"use client";

import React, { useState } from 'react';
import {
    LayoutDashboard,
    Target,
    ListChecks,
    CalendarDays,
    MessageCircle,
    Mic,
    MonitorPlay,
    Bot,
    TrendingUp,
    Landmark,
    Palette,
    Bell,
    Moon,
    Sparkles,
    Zap,
    Shield,
    Coins,
    Users,
    BookOpen,
    Music,
    Swords,
    Flag,
    CheckCircle2,
    Circle,
    Lock,
    Star,
    Trophy,
    Flame,
    Crown,
    Gem,
    Scroll,
    Map,
    Compass,
    Brain,
    Crosshair,
    ArrowRightLeft,
    Wallet,
    BarChart3,
    Rocket,
    Heart,
    Globe,
    ArrowRight,
    Newspaper,
    Code2
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import { useEffect, useCallback } from 'react';
import { LevelUpModal } from './gamification/LevelUpModal';
import { OnboardingWizard } from './OnboardingWizard';
import { GHL_LEVELS, getGhlLevelFromTags } from '@/lib/ghlLevels';

const XP_PER_LEVEL = 1000;

const calculateLevel = (totalXp: number) => Math.floor(totalXp / XP_PER_LEVEL) + 1;


type ViewId = 'dashboard' | 'ai' | 'tredfi' | 'defi' | 'culture' | 'profile' | 'calendar' | 'news' | 'vibe';
type QuestStatus = 'completed' | 'active' | 'locked';

interface Quest {
    title: string;
    desc: string;
    xp: number;
    status: QuestStatus;
    progress?: number;
    icon: React.ElementType;
    color: string;
    // New wiki fields
    goal?: string;
    milestone?: string;
    terms?: { label: string; desc: string }[];
    tasks?: { id: string; text: string; xp: number }[];
    personalChallenge?: string;
    promptExample?: { label: string; text: string };
}

type SectionId = 'ai' | 'tredfi' | 'defi' | 'culture';

interface SectionNavItem {
    icon: React.ElementType;
    label: string;
    view: ViewId;
    badge?: string;
}

const SECTION_NAV: Record<SectionId, { label: string; items: SectionNavItem[] }> = {
    ai: {
        label: 'AI & Rīki',
        items: [
            { icon: Bot, label: 'Pratību', view: 'ai' },
            { icon: Code2, label: 'VibeCoding', view: 'vibe' },
            { icon: CalendarDays, label: 'Kalendāri', view: 'calendar', badge: 'Beta' },
        ],
    },
    tredfi: {
        label: 'TradFi',
        items: [
            { icon: TrendingUp, label: 'TredFi Arena', view: 'tredfi' },
        ],
    },
    defi: {
        label: 'DeFi',
        items: [
            { icon: Landmark, label: 'DeFi Dungeon', view: 'defi' },
        ],
    },
    culture: {
        label: 'Kultūra',
        items: [
            { icon: Palette, label: 'Culture Guild', view: 'culture' },
        ],
    },
};

// Kopiena forums — swap in real URLs when ready
const KOPIENA_FORUMS = [
    { label: 'AI Forums', url: 'https://community.100x.lv' },
    { label: 'TradFi Forums', url: 'https://community.100x.lv' },
    { label: 'DeFi Forums', url: 'https://community.100x.lv' },
    { label: 'Culture Forums', url: 'https://community.100x.lv' },
];

const iconSidebarItems: { icon: React.ElementType; label: string; id: SectionId; defaultView: ViewId }[] = [
    { icon: Bot, label: 'AI', id: 'ai', defaultView: 'ai' },
    { icon: TrendingUp, label: 'Tredfi', id: 'tredfi', defaultView: 'tredfi' },
    { icon: Landmark, label: 'DeFi', id: 'defi', defaultView: 'defi' },
    { icon: Palette, label: 'Culture', id: 'culture', defaultView: 'culture' },
];

// ─── QUEST STATUS BADGE ─────────────────────────────────────
function QuestBadge({ status }: { status: QuestStatus }) {
    if (status === 'completed') return (
        <span className="flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 uppercase">
            <CheckCircle2 size={10} /> Pabeigts
        </span>
    );
    if (status === 'active') return (
        <span className="flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-600 uppercase animate-pulse">
            <Flame size={10} /> Aktīvs
        </span>
    );
    return (
        <span className="flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-400 uppercase">
            <Lock size={10} /> Bloķēts
        </span>
    );
}

// ─── PROGRESS BAR ───────────────────────────────────────────
function ProgressBar({ value, color }: { value: number; color: string }) {
    return (
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, background: color }} />
        </div>
    );
}

// ─── QUEST CARD ─────────────────────────────────────────────
// ─── QUEST CARD ─────────────────────────────────────────────
interface QuestCardProps {
    quest: Quest;
    isExpanded?: boolean;
    onToggle?: () => void;
    onComplete?: (questId: string, xp: number) => void;
    onTaskComplete?: (questId: string, taskId: string, xp: number) => void;
    isSyncing?: boolean;
    dbProgress?: any[];
}

function QuestCard({ quest, isExpanded, onToggle, onComplete, onTaskComplete, isSyncing, dbProgress = [] }: QuestCardProps) {
    const isLocked = quest.status === 'locked';

    return (
        <div
            onClick={!isLocked ? onToggle : undefined}
            className={`bg-white rounded-2xl p-5 border shadow-sm transition-all overflow-hidden ${isLocked ? 'border-gray-100 opacity-50 grayscale select-none cursor-not-allowed' :
                isExpanded ? 'border-emerald-500 ring-1 ring-emerald-500/20 shadow-md' :
                    'border-gray-200 hover:border-emerald-200 hover:shadow-md hover:scale-[1.01] cursor-pointer'
                }`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-xl" style={{ background: `${quest.color}15` }}>
                    <quest.icon size={20} style={{ color: isLocked ? '#ccc' : quest.color }} />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5">
                        <Star size={10} fill="currentColor" /> {quest.xp} XP
                    </span>
                    <QuestBadge status={quest.status} />
                </div>
            </div>

            <h4 className={`font-bold text-sm mb-1 ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>{quest.title}</h4>
            <p className="text-xs text-gray-500 mb-3">{quest.desc}</p>

            {!isExpanded && quest.progress !== undefined && !isLocked && (
                <>
                    <ProgressBar value={quest.progress} color={quest.status === 'completed' ? '#59b687' : quest.color} />
                    <p className="text-[10px] text-gray-400 mt-1 text-right">{quest.progress}%</p>
                </>
            )}

            {isExpanded && !isLocked && (
                <div className="mt-6 pt-6 border-t border-emerald-50 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                            <h5 className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Mērķis</h5>
                            <p className="text-xs text-emerald-900 leading-relaxed">{quest.goal}</p>
                        </div>
                        <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                            <h5 className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Milestone</h5>
                            <p className="text-xs text-blue-900 leading-relaxed">{quest.milestone}</p>
                        </div>
                    </div>

                    {quest.terms && (
                        <div>
                            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <BookOpen size={10} /> Galvenie termini
                            </h5>
                            <div className="grid grid-cols-1 gap-1.5">
                                {quest.terms.map(term => (
                                    <div key={term.label} className="text-xs">
                                        <span className="font-bold text-gray-700">{term.label}</span> — <span className="text-gray-500">{term.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {quest.tasks && (
                        <div>
                            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Uzdevumi</h5>
                            <div className="space-y-2">
                                {quest.tasks.map((task: any) => {
                                    const isCompleted = dbProgress.some(p => p.quest_id === task.id);
                                    return (
                                        <div key={task.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-emerald-50/50 transition-colors">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300'}`}>
                                                    {isCompleted && <CheckCircle2 size={10} />}
                                                </div>
                                                <span className={isCompleted ? 'text-gray-400 line-through' : ''}>{task.text}</span>
                                            </div>
                                            {!isCompleted && onTaskComplete && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onTaskComplete(quest.title, task.id, task.xp); }}
                                                    className="text-[9px] font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-widest"
                                                >
                                                    Claim +{task.xp} XP
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {quest.promptExample && (
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 font-mono text-[11px]">
                            <h5 className="text-[9px] font-bold text-gray-400 uppercase mb-2 font-sans">{quest.promptExample.label}</h5>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap italic">
                                "{quest.promptExample.text}"
                            </p>
                        </div>
                    )}

                    {quest.personalChallenge && (
                        <div className="p-4 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-200">
                            <h5 className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">Personīgais izaicinājums</h5>
                            <p className="text-xs font-medium leading-relaxed">{quest.personalChallenge}</p>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                            Uzzināt vairāk <ArrowRight size={14} />
                        </button>
                        {quest.status !== 'completed' && onComplete && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onComplete(quest.title, quest.xp);
                                }}
                                disabled={isSyncing}
                                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                            >
                                {isSyncing ? 'Sinhronizē...' : (
                                    <>Pabeigt soli <CheckCircle2 size={14} /></>
                                )}
                            </button>
                        )}
                    </div>

                    <button
                        onClick={onToggle}
                        className="w-full text-[10px] font-bold text-gray-400 uppercase hover:text-gray-600 transition-colors"
                    >
                        Aizvērt ↑
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── SECTION HEADER ─────────────────────────────────────────
function SectionHeader({ icon: Icon, title, count, color }: { icon: React.ElementType; title: string; count: number; color: string }) {
    return (
        <div className="flex items-center gap-2 mb-4">
            <Icon size={16} style={{ color }} />
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">{count}</span>
        </div>
    );
}

// ─── AI VIEW ────────────────────────────────────────────────
interface BaseViewProps {
    session?: any;
    dbProgress?: any[];
    syncProgress?: any;
    getQuestStatus?: any;
    getQuestProgressValue?: any;
    totalXp: number;
    currentLevel: number;
    ghlLevel: number;
}

function AIView({ session, dbProgress = [], syncProgress, getQuestStatus, getQuestProgressValue, totalXp, currentLevel, ghlLevel }: BaseViewProps) {
    const [expandedTitle, setExpandedTitle] = useState<string | null>(null);
    const [isSyncing, setIsSyncing] = useState<string | null>(null);

    const handleComplete = async (questTitle: string, xp: number) => {
        const idMap: Record<string, string> = {
            '1. solis — Prompting pamati': 'ai_step_1',
            '2. solis — Text-to-Image': 'ai_step_2',
            '3. solis — Satura radīšana': 'ai_step_3',
            '4. solis — Automatizācija': 'ai_step_4',
            '5. solis — AI kā ienākumu rīks': 'ai_step_5',
        };
        const questId = idMap[questTitle];
        if (!questId) return;

        setIsSyncing(questId);
        await syncProgress(questId, 100, xp);
        setIsSyncing(null);
    };

    const handleTaskComplete = async (questTitle: string, taskId: string, xp: number) => {
        setIsSyncing(taskId);
        await syncProgress(taskId, 100, xp);
        setIsSyncing(null);
    };

    const steps: Quest[] = [
        {
            title: '1. solis — Prompting pamati',
            desc: 'Saprast, kā darbojas mākslīgais intelekts un kā pareizi veidot pieprasījumus.',
            xp: 500,
            status: getQuestStatus('ai_step_1', 'active'),
            progress: getQuestProgressValue('ai_step_1', 0),
            icon: MessageCircle,
            color: '#59b687',
            goal: 'Saprast, kā darbojas AI un kā pareizi veidot pieprasījumus (promptus).',
            milestone: 'Spēj izveidot skaidru un strukturētu promptu, kas dod paredzamu rezultātu.',
            terms: [
                { label: 'Prompt', desc: 'instrukcija vai jautājums AI' },
                { label: 'Context', desc: 'papildu informācija, kas palīdz AI saprast uzdevumu' },
                { label: 'Role prompting', desc: 'lūdz AI ieņemt konkrētu lomu (piem., "esi eksperts")' },
                { label: 'Constraints', desc: 'formāts, garums, tonis' },
                { label: 'Iterācija', desc: 'rezultāta uzlabošana vairākos soļos' },
            ],
            tasks: [
                { id: 'ai_1_1', text: 'Uzraksti vienu ļoti vienkāršu promptu.', xp: 50 },
                { id: 'ai_1_2', text: 'Pārveido to par strukturētu promptu.', xp: 100 },
                { id: 'ai_1_3', text: 'Salīdzini rezultātus.', xp: 50 }
            ],
            personalChallenge: 'Uzraksti 5 dažādus promptus vienam un to pašu mērķim un analizē, kurš strādā vislabāk.',
            promptExample: {
                label: 'Labs prompt piemērs',
                text: 'Esi digitālā mārketinga eksperts.\nPalīdzi man izveidot 3 biznesa idejas AI jomā Latvijā.\nMērķauditorija: mazie uzņēmēji.\nAtbildi tabulas formātā ar plusiem un mīnusiem.'
            }
        },
        {
            title: '2. solis — Text-to-Image',
            desc: 'Iemācīties ģenerēt kvalitatīvus attēlus ar AI.',
            xp: 750,
            status: getQuestStatus('ai_step_2', 'locked'),
            progress: getQuestProgressValue('ai_step_2', 0),
            icon: Palette,
            color: '#4A9EE5',
            goal: 'Iemācīties ģenerēt kvalitatīvus attēlus ar AI.',
            milestone: 'Spēj izveidot detalizētu vizuālu aprakstu, kas rasa precīzu attēlu.',
            tasks: [
                { id: 'ai_2_1', text: 'Izveido vienkāršu attēla promptu.', xp: 50 },
                { id: 'ai_2_2', text: 'Uzlabo to ar stilu un gaismu.', xp: 100 },
                { id: 'ai_2_3', text: 'Pievieno proporcijas (16:9).', xp: 50 }
            ],
            personalChallenge: 'Izveido vienu un to pašu attēlu 3 dažādos stilos (realistisks, anime, minimālistisks).',
            promptExample: {
                label: 'Attēla prompt struktūra',
                text: 'Futūristiska Rīgas iela 2050. gadā, neon gaismas, kiberpanka stils, lietains vakars, kinofilmas kvalitāte, 16:9, augsta detalizācija.'
            }
        },
        {
            title: '3. solis — Satura radīšana',
            desc: 'Iemācīties izmantot AI rakstīšanai, idejām un analīzei.',
            xp: 600,
            status: getQuestStatus('ai_step_3', 'locked'),
            progress: getQuestProgressValue('ai_step_3', 0),
            icon: Scroll,
            color: '#F5A623',
            tasks: [
                { id: 'ai_3_1', text: 'Uzraksti 300 vārdu rakstu.', xp: 100 },
                { id: 'ai_3_2', text: 'Palūdz AI to saīsināt.', xp: 50 },
                { id: 'ai_3_3', text: 'Pārvērt to par LinkedIn ierakstu.', xp: 100 }
            ],
            personalChallenge: 'Izveido vienu ideju un pārvērt to 5 dažādos formātos (raksts, Twitter, skripts, e-pasts, teksts).',
        },
        {
            title: '4. solis — Automatizācija',
            desc: 'Izmantot AI, lai taupītu laiku un uzlabotu produktivitāti.',
            xp: 900,
            status: getQuestStatus('ai_step_4', 'locked'),
            progress: getQuestProgressValue('ai_step_4', 0),
            icon: Rocket,
            color: '#9B59B6',
            tasks: [
                { id: 'ai_4_1', text: 'Nosaki vienu atkārtojošu uzdevumu.', xp: 100 },
                { id: 'ai_4_2', text: 'Sagatavo automatizācijas promptu.', xp: 200 }
            ],
            personalChallenge: 'Samazini savu darba laiku par 20%, izmantojot AI.',
        },
        {
            title: '5. solis — AI kā ienākumu rīks',
            desc: 'Saprast, kā AI var kļūt par monetizējamu prasmi.',
            xp: 1200,
            status: getQuestStatus('ai_step_5', 'locked'),
            progress: getQuestProgressValue('ai_step_5', 0),
            icon: Gem,
            color: '#E74C3C',
            tasks: [
                { id: 'ai_5_1', text: 'Izvēlies vienu nišu.', xp: 100 },
                { id: 'ai_5_2', text: 'Izveido savu piedāvājumu.', xp: 200 }
            ],
            personalChallenge: '30 dienu laikā nopelni pirmos €100 ar AI.',
        }
    ];

    const ghlObj = GHL_LEVELS.find(l => l.level === ghlLevel) || GHL_LEVELS[0];
    const forumQuest: Quest = {
        title: 'Foruma Aktivitātes Atlīdzība (AI)',
        desc: `Sasniedz 3. līmeni GHL forumā, lai atbloķētu masīvu AI XP bonusu! Tavs pašreizējais GHL līmenis: ${ghlObj.emoji} ${ghlObj.title} (Lvl ${ghlLevel})`,
        xp: 1500,
        status: ghlLevel >= 3 ? 'completed' : 'active',
        progress: Math.min((ghlLevel / 3) * 100, 100),
        icon: Crown,
        color: '#F5A623',
    };

    return (
        <>
            <header className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#59b687]/10"><Bot size={18} className="text-[#59b687]" /></div>
                    <h1 className="text-lg font-bold">AI Iesācēja Ceļš</h1>
                    <span className="text-[10px] font-bold bg-emerald-500 text-white px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1"><Flame size={10} /> Lvl {currentLevel}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Trophy size={14} className="text-amber-500" />
                    <span className="font-bold">{totalXp} XP</span>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#F8FAF9]/50">
                <div className="max-w-4xl mx-auto space-y-6">
                    {!session && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Zap className="text-amber-500" size={20} />
                                <p className="text-xs text-amber-900 font-medium">Ielogojies, lai saglabātu savu progresu un pelnītu XP!</p>
                            </div>
                            <button
                                onClick={() => signIn('google')}
                                className="bg-white border border-amber-200 px-4 py-2 rounded-lg text-xs font-bold text-amber-700 hover:bg-amber-100 transition-colors"
                            >
                                Ienākt tūlīt
                            </button>
                        </div>
                    )}

                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                            <Brain size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">AI Quest — Seko soļiem</h2>
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Gada izaicinājums • 5 soļi</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <QuestCard
                            quest={forumQuest}
                            isExpanded={expandedTitle === forumQuest.title}
                            onToggle={() => setExpandedTitle(expandedTitle === forumQuest.title ? null : forumQuest.title)}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {steps.map((step) => (
                            <QuestCard
                                key={step.title}
                                quest={step}
                                isExpanded={expandedTitle === step.title}
                                onToggle={() => setExpandedTitle(expandedTitle === step.title ? null : step.title)}
                                onComplete={handleComplete}
                                onTaskComplete={handleTaskComplete}
                                isSyncing={isSyncing === step.title}
                                dbProgress={dbProgress}
                            />
                        ))}
                    </div>

                    {/* Cheat Sheet */}
                    <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles size={18} className="text-amber-500" />
                            <h3 className="text-lg font-bold text-gray-900">🔥 Mini Prompt Cheat Sheet (Iesācējiem)</h3>
                        </div>
                        <div className="bg-gray-900 rounded-xl p-6 text-gray-100 font-mono text-sm leading-relaxed">
                            <p className="text-amber-400 mb-4 font-sans text-xs uppercase tracking-widest font-bold">Universālā formula:</p>
                            <div className="border-l-2 border-emerald-500 pl-4 space-y-1">
                                <span className="block italic opacity-60 font-sans text-xs"># Uzruna un loma</span>
                                <span className="block font-bold">Esi [loma].</span>
                                <span className="block italic opacity-60 font-sans text-xs mt-3"># Mērķis</span>
                                <span className="block font-bold text-emerald-400">Mans mērķis ir [rezultāts].</span>
                                <span className="block italic opacity-60 font-sans text-xs mt-3"># Detaļas</span>
                                <span className="block">Konteksts: [informācija].</span>
                                <span className="block">Ierobežojumi: [garums, tonis, formāts].</span>
                                <span className="block mt-4 text-blue-400 underline decoration-blue-800 underline-offset-4">Uzdod precizējošus jautājumus, ja nepieciešams.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// ─── TREDFI VIEW ────────────────────────────────────────────
function TredfiView({ totalXp, currentLevel, ghlLevel }: BaseViewProps) {
    const mainQuests: Quest[] = [
        { title: 'Tirgus Mednieks', desc: 'Veiksmīgi identificē 5 tirdzniecības signālus', xp: 600, status: 'active', progress: 0, icon: Crosshair, color: '#59b687' },
        { title: 'Riska Menedžeris', desc: 'Izveido un ievēro savu riska vadības plānu', xp: 800, status: 'locked', progress: 0, icon: Shield, color: '#E74C3C' },
    ];
    const sideQuests: Quest[] = [
        { title: 'Grafiku Lasītājs', desc: 'Analizē 10 dažādus grafikus', xp: 100, status: 'active', progress: 0, icon: TrendingUp, color: '#59b687' },
        { title: 'Ziņu Sekotājs', desc: 'Izlasi 5 tirgus analīzes rakstus', xp: 120, status: 'active', progress: 0, icon: BookOpen, color: '#4A9EE5' },
        { title: 'Stratēģijas Testētājs', desc: 'Izpildi 3 demo tirdzniecības darījumus', xp: 200, status: 'active', progress: 0, icon: Map, color: '#F5A623' },
    ];
    const tasks: Quest[] = [
        { title: 'Izveido watchlist', desc: 'Pievieno 5 aktīvus pārus savam sarakstam', xp: 15, status: 'active', icon: Star, color: '#59b687' },
        { title: 'Iestati price alert', desc: 'Uzstādi cenas paziņojumu BTC/USDT', xp: 20, status: 'locked', progress: 0, icon: Bell, color: '#F5A623' },
        { title: 'Izpēti indikātorus', desc: 'Iepazīsties ar RSI un MACD', xp: 25, status: 'locked', progress: 0, icon: BarChart3, color: '#4A9EE5' },
        { title: 'Pirmais demo trade', desc: 'Veic pirmo virtuālo darījumu', xp: 30, status: 'locked', icon: Coins, color: '#9B59B6' },
    ];

    const ghlObj = GHL_LEVELS.find(l => l.level === ghlLevel) || GHL_LEVELS[0];
    const forumQuest: Quest = {
        title: 'Foruma Aktivitātes Atlīdzība (Tredfi)',
        desc: `Sasniedz 4. līmeni GHL forumā, lai atbloķētu Tredfi bonusus! Tavs GHL līmenis: ${ghlObj.emoji} ${ghlObj.title} (Lvl ${ghlLevel})`,
        xp: 1500,
        status: ghlLevel >= 4 ? 'completed' : 'active',
        progress: Math.min((ghlLevel / 4) * 100, 100),
        icon: Crown,
        color: '#F5A623',
    };

    return (
        <>
            <header className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#59b687]/10"><TrendingUp size={18} className="text-[#59b687]" /></div>
                    <h1 className="text-lg font-bold">Tredfi Arena</h1>
                    <span className="text-[10px] font-bold bg-blue-500 text-white px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1"><Swords size={10} /> Lvl {currentLevel}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Trophy size={14} className="text-amber-500" />
                    <span className="font-bold">{totalXp} XP</span>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div>
                    <SectionHeader icon={Crown} title="Galvenie Kvesti" count={mainQuests.length + 1} color="#59b687" />
                    <div className="grid grid-cols-2 gap-4">
                        <QuestCard quest={forumQuest} />
                        {mainQuests.map(q => <QuestCard key={q.title} quest={q} />)}
                    </div>
                </div>
                <div>
                    <SectionHeader icon={Compass} title="Papildus Kvesti" count={sideQuests.length} color="#F5A623" />
                    <div className="grid grid-cols-3 gap-4">{sideQuests.map(q => <QuestCard key={q.title} quest={q} />)}</div>
                </div>
                <div>
                    <SectionHeader icon={Flag} title="Uzdevumi" count={tasks.length} color="#4A9EE5" />
                    <div className="grid grid-cols-2 gap-3">{tasks.map(q => <QuestCard key={q.title} quest={q} />)}</div>
                </div>
            </div>
        </>
    );
}

// ─── DEFI VIEW ──────────────────────────────────────────────
function DeFiView({ totalXp, currentLevel, ghlLevel }: BaseViewProps) {
    const mainQuests: Quest[] = [
        { title: 'DeFi Pētnieks', desc: 'Izpēti 5 dažādus DeFi protokolus', xp: 500, status: 'active', progress: 0, icon: Globe, color: '#4A9EE5' },
        { title: 'Yield Farmers', desc: 'Saprot yield farming un iemācies stratēģijas', xp: 900, status: 'locked', progress: 0, icon: Coins, color: '#F5A623' },
    ];
    const sideQuests: Quest[] = [
        { title: 'Maciņa Meistars', desc: 'Izveido un nosargā savu kripto maciņu', xp: 80, status: 'active', progress: 0, icon: Wallet, color: '#59b687' },
        { title: 'Swap Speciālists', desc: 'Veic 3 veiksmīgus token swap', xp: 150, status: 'locked', progress: 0, icon: ArrowRightLeft, color: '#FF007A' },
        { title: 'Likviditātes Sniedzējs', desc: 'Pievieno likviditāti vienā baseinā', xp: 250, status: 'locked', progress: 0, icon: Gem, color: '#9B59B6' },
    ];
    const tasks: Quest[] = [
        { title: 'Izveido maciņu', desc: 'Uzstādi savu pirmo Web3 maciņu', xp: 10, status: 'active', icon: Wallet, color: '#59b687' },
        { title: 'Saņem testnet tokenus', desc: 'Pieprasi bezmaksas test tokenus', xp: 15, status: 'locked', icon: Coins, color: '#4A9EE5' },
        { title: 'Pirmais swap', desc: 'Apmini vienu tokenu pret citu', xp: 25, status: 'locked', progress: 0, icon: ArrowRightLeft, color: '#F5A623' },
        { title: 'Izpēti smart contract', desc: 'Izlasi vienu smart contract kodu', xp: 30, status: 'locked', icon: Scroll, color: '#9B59B6' },
    ];

    const ghlObj = GHL_LEVELS.find(l => l.level === ghlLevel) || GHL_LEVELS[0];
    const forumQuest: Quest = {
        title: 'Foruma Aktivitātes Atlīdzība (DeFi)',
        desc: `Sasniedz 5. līmeni GHL forumā, lai atbloķētu DeFi bonusus! Tavs GHL līmenis: ${ghlObj.emoji} ${ghlObj.title} (Lvl ${ghlLevel})`,
        xp: 1500,
        status: ghlLevel >= 5 ? 'completed' : 'active',
        progress: Math.min((ghlLevel / 5) * 100, 100),
        icon: Crown,
        color: '#F5A623',
    };

    return (
        <>
            <header className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#4A9EE5]/10"><Landmark size={18} className="text-[#4A9EE5]" /></div>
                    <h1 className="text-lg font-bold">DeFi Dungeon</h1>
                    <span className="text-[10px] font-bold bg-purple-500 text-white px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1"><Gem size={10} /> Lvl {currentLevel}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Trophy size={14} className="text-amber-500" />
                    <span className="font-bold">{totalXp} XP</span>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div>
                    <SectionHeader icon={Crown} title="Galvenie Kvesti" count={mainQuests.length + 1} color="#4A9EE5" />
                    <div className="grid grid-cols-2 gap-4">
                        <QuestCard quest={forumQuest} />
                        {mainQuests.map(q => <QuestCard key={q.title} quest={q} />)}
                    </div>
                </div>
                <div>
                    <SectionHeader icon={Compass} title="Papildus Kvesti" count={sideQuests.length} color="#F5A623" />
                    <div className="grid grid-cols-3 gap-4">{sideQuests.map(q => <QuestCard key={q.title} quest={q} />)}</div>
                </div>
                <div>
                    <SectionHeader icon={Flag} title="Uzdevumi" count={tasks.length} color="#4A9EE5" />
                    <div className="grid grid-cols-2 gap-3">{tasks.map(q => <QuestCard key={q.title} quest={q} />)}</div>
                </div>
            </div>
        </>
    );
}

// ─── CULTURE VIEW ───────────────────────────────────────────
function CultureView({ totalXp, currentLevel, ghlLevel }: BaseViewProps) {
    const mainQuests: Quest[] = [
        { title: 'Kopienas Līderis', desc: 'Piedalies 10 kopienas diskusijās un palīdzi citiem', xp: 700, status: 'active', progress: 0, icon: Crown, color: '#F5A623' },
        { title: 'Satura Veidotājs', desc: 'Izveido un publicē 3 oriģinālus ierakstus', xp: 1000, status: 'locked', progress: 0, icon: Rocket, color: '#E74C3C' },
    ];
    const sideQuests: Quest[] = [
        { title: 'Pirmais ieraksts', desc: 'Publicē savu pirmo kopienas ierakstu', xp: 50, status: 'active', progress: 0, icon: Scroll, color: '#59b687' },
        { title: 'Pasākumu dalībnieks', desc: 'Piedalies 2 kopienas pasākumos', xp: 150, status: 'locked', progress: 0, icon: Users, color: '#4A9EE5' },
        { title: 'Mentors', desc: 'Palīdzi 3 jauniem dalībniekiem ar padomu', xp: 200, status: 'locked', progress: 0, icon: Heart, color: '#E74C3C' },
    ];
    const tasks: Quest[] = [
        { title: 'Iepazīsties', desc: 'Uzraksti savu pirmo iepazīšanās ziņu', xp: 10, status: 'active', icon: MessageCircle, color: '#59b687' },
        { title: 'Noklausies podkāstu', desc: 'Noklausies vienu 100x podkāsta epizodi', xp: 15, status: 'locked', icon: Music, color: '#9B59B6' },
        { title: 'Apmeklē AMA', desc: 'Piedalies dzīvajā AMA sesijā', xp: 25, status: 'locked', progress: 0, icon: Mic, color: '#F5A623' },
        { title: 'Iesaki draugu', desc: 'Uzaicini vienu draugu pievienoties 100x', xp: 50, status: 'locked', icon: Globe, color: '#4A9EE5' },
    ];

    const ghlObj = GHL_LEVELS.find(l => l.level === ghlLevel) || GHL_LEVELS[0];
    const forumQuest: Quest = {
        title: 'Foruma Aktivitātes Atlīdzība (Culture)',
        desc: `Sasniedz 2. līmeni GHL forumā, lai atbloķētu Culture bonusus! Tavs GHL līmenis: ${ghlObj.emoji} ${ghlObj.title} (Lvl ${ghlLevel})`,
        xp: 1500,
        status: ghlLevel >= 2 ? 'completed' : 'active',
        progress: Math.min((ghlLevel / 2) * 100, 100),
        icon: Crown,
        color: '#F5A623',
    };

    return (
        <>
            <header className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#F5A623]/10"><Palette size={18} className="text-[#F5A623]" /></div>
                    <h1 className="text-lg font-bold">Culture Guild</h1>
                    <span className="text-[10px] font-bold bg-orange-500 text-white px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1"><Heart size={10} /> Lvl {currentLevel}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Trophy size={14} className="text-amber-500" />
                    <span className="font-bold">{totalXp} XP</span>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div>
                    <SectionHeader icon={Crown} title="Galvenie Kvesti" count={mainQuests.length + 1} color="#F5A623" />
                    <div className="grid grid-cols-2 gap-4">
                        <QuestCard quest={forumQuest} />
                        {mainQuests.map(q => <QuestCard key={q.title} quest={q} />)}
                    </div>
                </div>
                <div>
                    <SectionHeader icon={Compass} title="Papildus Kvesti" count={sideQuests.length} color="#F5A623" />
                    <div className="grid grid-cols-3 gap-4">{sideQuests.map(q => <QuestCard key={q.title} quest={q} />)}</div>
                </div>
                <div>
                    <SectionHeader icon={Flag} title="Uzdevumi" count={tasks.length} color="#4A9EE5" />
                    <div className="grid grid-cols-2 gap-3">{tasks.map(q => <QuestCard key={q.title} quest={q} />)}</div>
                </div>
            </div>
        </>
    );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────
import { CalendarView } from './CalendarView';
import { TreasureGem } from './gamification/TreasureGem';
import { ProfileSettings } from './profile/ProfileSettings';
import { NewsView } from './news/NewsView';
import { DashboardHome } from './DashboardHome';
import { VibeView } from './vibe/VibeView';

export function DashboardEmbed() {
    const { data: session } = useSession();
    const [activeView, setActiveView] = useState<ViewId>('dashboard');
    const [activeSection, setActiveSection] = useState<SectionId>('ai');
    const [dbProgress, setDbProgress] = useState<any[]>([]);
    const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);
    const [newLevel, setNewLevel] = useState(1);

    const [profileData, setProfileData] = useState<any>(null);
    const [showOnboarding, setShowOnboarding] = useState(false);

    const fetchProgress = useCallback(async () => {
        if (!session?.user?.email) return;

        // Fetch from all necessary tables
        const [progressRes, claimsRes, profileRes] = await Promise.all([
            supabase.from('user_progress').select('*').eq('user_email', session.user.email),
            supabase.from('xp_claims').select('*').eq('user_email', session.user.email),
            supabase.from('profiles').select('gm_streak, total_xp, onboarding_complete, display_name, wallet_address').eq('email', session.user.email).single()
        ]);

        const combinedProgress = [
            ...(progressRes.data || []),
            ...(claimsRes.data || []).map(c => ({
                id: c.id,
                quest_id: c.task_id,
                xp_earned: c.xp_amount,
                status: 'completed',
                progress: 100
            }))
        ];

        setDbProgress(combinedProgress);
        if (profileRes.data) {
            setProfileData(profileRes.data);
            if (!profileRes.data.onboarding_complete) {
                setShowOnboarding(true);
            }
        }
    }, [session]);

    // Fetch progress from Supabase
    useEffect(() => {
        fetchProgress();
    }, [fetchProgress]);

    const totalXp = dbProgress.reduce((sum: number, p: any) => sum + (p.xp_earned || 0), 0);
    const currentLevel = calculateLevel(totalXp);
    const ghlLevel = getGhlLevelFromTags((session?.user as any)?.ghl_tags || []);
    const completedQuestsCount = dbProgress.filter(p => p.status === 'completed').length;

    // GHL abonement bonus added to the season multiplier.
    // Higher community engagement tier = bigger Mintiņš airdrop multiplier.
    // Formula: seasonMultiplier = gmStreak + ghlLevelBonus (minimum 1x)
    const GHL_MULTIPLIER_BONUS: Record<number, number> = {
        1: 0, 2: 0, 3: 1, 4: 2, 5: 5,
        6: 10, 7: 15, 8: 20, 9: 30,
    };
    const gmStreak = profileData?.gm_streak || 0;
    const ghlBonus = GHL_MULTIPLIER_BONUS[ghlLevel] ?? 0;
    const seasonMultiplier = Math.max(gmStreak + ghlBonus, 1);

    // Sidebar stats
    const ghlObj = GHL_LEVELS.find(l => l.level === ghlLevel) || GHL_LEVELS[0];
    const dynamicStats = [
        { value: (totalXp || 0).toLocaleString(), label: 'XP', icon: '⚡' },
        { value: (completedQuestsCount || 0).toString(), label: 'TASKS', icon: '✓' },
        { value: `${seasonMultiplier}x`, label: 'MULTIPLIER', icon: '🚀' },
    ];

    // Update quest status based on DB
    const getQuestStatus = (questId: string, defaultStatus: QuestStatus): QuestStatus => {
        const prog = dbProgress.find(p => p.quest_id === questId);
        return (prog?.status as QuestStatus) || defaultStatus;
    };

    const getQuestProgressValue = (questId: string, defaultProgress: number): number => {
        const prog = dbProgress.find(p => p.quest_id === questId);
        return prog?.progress ?? defaultProgress;
    };

    const syncProgress = async (questId: string, progress: number, xp: number) => {
        if (!session?.user?.email) return;

        const { error } = await supabase
            .from('user_progress')
            .upsert({
                user_email: session.user.email,
                quest_id: questId,
                progress,
                xp_earned: xp,
                status: progress === 100 ? 'completed' : 'active',
                updated_at: new Date().toISOString()
            });

        if (!error) {
            // Update local state
            const { data } = await supabase
                .from('user_progress')
                .select('*')
                .eq('user_email', session.user.email);

            if (data) {
                const newTotalXp = data.reduce((sum: number, p: any) => sum + (p.xp_earned || 0), 0);
                const nextLevel = calculateLevel(newTotalXp);

                if (nextLevel > currentLevel) {
                    setNewLevel(nextLevel);
                    setIsLevelUpOpen(true);
                }
                setDbProgress(data);
            }

            // Optional: Trigger GHL Sync via background fetch
            fetch('/api/sync-ghl', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: session.user.email, questId, progress, xp })
            }).catch(err => console.error('GHL sync error:', err));

            // NEW: Trigger XP Airdrop check
            fetch('/api/xp/claim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskId: questId, xpAmount: xp })
            }).catch(err => console.error('XP claim error:', err));
        }
    };

    return (
        <div className="w-full h-full bg-[#f8fafc] text-[#1a1a2e] flex overflow-hidden font-sans">
            {/* Onboarding wizard — shown only on first login */}
            {showOnboarding && (
                <OnboardingWizard
                    userName={session?.user?.name || profileData?.display_name || 'Komūnas biedrs'}
                    onComplete={() => {
                        setShowOnboarding(false);
                        fetchProgress();
                    }}
                />
            )}
            {/* ... sidebar 1 */}
            <aside className="w-16 bg-white border-r border-gray-100 flex flex-col items-center py-6 gap-1 shrink-0">
                <div className="mb-6 flex items-center justify-center">
                    <Image src="/assets/logos/100x-refined-logo.png" alt="100x" width={36} height={36} className="w-9 h-auto" />
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                    {iconSidebarItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveSection(item.id); setActiveView(item.defaultView); }}
                            className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-all ${activeSection === item.id ? 'bg-[#59b687]/10 text-[#59b687]' : 'text-gray-300 hover:text-gray-500 hover:bg-gray-50'}`}
                            title={item.label}
                        >
                            <item.icon size={18} strokeWidth={activeSection === item.id ? 2.5 : 1.5} />
                            <span className="text-[7px] font-bold mt-0.5 uppercase tracking-wider">{item.label}</span>
                        </button>
                    ))}
                </div>
                <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-all">
                    <Bell size={20} strokeWidth={1.5} />
                </button>
            </aside>

            {/* Expanded Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-100 flex flex-col shrink-0">
                <div className="p-6 pb-4">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#59b687]/30 flex items-center justify-center bg-gray-50">
                                {session?.user?.image ? (
                                    <Image src={session.user.image} alt="User" width={48} height={48} className="object-cover" />
                                ) : (
                                    <span className="text-lg">👤</span>
                                )}
                            </div>
                            {session && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                            )}
                        </div>
                        <div className="flex-1">
                            {session ? (
                                <>
                                    <h3 className="font-bold text-sm truncate max-w-[120px]">{session.user?.name}</h3>
                                    <button
                                        onClick={() => signOut()}
                                        className="text-[10px] text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        Izlogoties
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h3 className="font-bold text-sm">Viesis</h3>
                                    <button
                                        onClick={() => signIn('google')}
                                        className="text-[10px] text-emerald-600 font-bold hover:underline"
                                    >
                                        Ienākt ar Google
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="flex gap-1.5">
                            <button 
                                onClick={() => setActiveView('profile')}
                                className={`p-1.5 rounded-lg hover:bg-gray-50 transition-all ${activeView === 'profile' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-300'}`}
                            >
                                <Users size={16} />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-300 transition-all"><Moon size={16} /></button>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {dynamicStats.map(stat => (
                            <div key={stat.label} className="flex-1 bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                                <div className="text-[10px] text-[#59b687] mb-0.5">{stat.icon}</div>
                                <p className="font-bold text-base leading-tight">{stat.value}</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto px-4 pb-4">
                    {/* Dashboard — always first */}
                    <div className="mb-2">
                        <nav>
                            <button
                                onClick={() => setActiveView('dashboard')}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${activeView === 'dashboard' ? 'bg-emerald-50 text-emerald-600 font-semibold' : 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-50/50'}`}
                            >
                                <LayoutDashboard size={18} strokeWidth={activeView === 'dashboard' ? 2 : 1.5} />
                                <span>Dashboard</span>
                            </button>
                        </nav>
                    </div>

                    {/* Dynamic section — changes with active icon */}
                    <div className="mb-5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] px-3 mb-2">
                            {SECTION_NAV[activeSection].label}
                        </p>
                        <nav className="space-y-0.5">
                            {SECTION_NAV[activeSection].items.map(item => (
                                <button
                                    key={item.view}
                                    onClick={() => setActiveView(item.view)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${activeView === item.view ? 'bg-emerald-50 text-emerald-600 font-semibold' : 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-50/50'}`}
                                >
                                    <item.icon size={18} strokeWidth={activeView === item.view ? 2 : 1.5} />
                                    <span className="flex items-center gap-1.5">
                                        {item.label}
                                        {item.badge && (
                                            <span className="text-[8px] uppercase bg-indigo-500 text-white px-1.5 py-0.5 rounded">
                                                {item.badge}
                                            </span>
                                        )}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Kopiena — always fixed */}
                    <div className="mb-5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] px-3 mb-2">Kopiena</p>
                        <nav className="space-y-0.5">
                            {KOPIENA_FORUMS.map(forum => (
                                <button
                                    key={forum.label}
                                    onClick={() => window.open(forum.url, '_blank')}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm text-gray-400 hover:text-emerald-600 hover:bg-emerald-50/50"
                                >
                                    <MessageCircle size={18} strokeWidth={1.5} />
                                    <span>{forum.label}</span>
                                </button>
                            ))}
                            <button
                                onClick={() => setActiveView('news')}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${activeView === 'news' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50/50'}`}
                            >
                                <Newspaper size={18} strokeWidth={activeView === 'news' ? 2 : 1.5} />
                                <span className="flex items-center gap-1.5">
                                    Ziņas
                                    <span className="text-[8px] uppercase bg-orange-500 text-white px-1.5 py-0.5 rounded">Šodien</span>
                                </span>
                            </button>
                            <a
                                href="https://t.me/+AzkOgTHpNENmYjU0"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm text-gray-400 hover:text-[#229ED9] hover:bg-blue-50/50"
                            >
                                <svg className="w-[18px] h-[18px] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                </svg>
                                <span>Telegram Grupa</span>
                            </a>
                        </nav>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden flex flex-col">
                {activeView === 'dashboard' && (
                    <DashboardHome
                        session={session}
                        dbProgress={dbProgress}
                        profileData={profileData}
                        seasonMultiplier={seasonMultiplier}
                        onGmClaim={fetchProgress}
                    />
                )}
                {activeView === 'ai' && (
                    <AIView
                        session={session}
                        dbProgress={dbProgress}
                        syncProgress={syncProgress}
                        getQuestStatus={getQuestStatus}
                        getQuestProgressValue={getQuestProgressValue}
                        totalXp={totalXp}
                        currentLevel={currentLevel}
                        ghlLevel={ghlLevel}
                    />
                )}
                {activeView === 'tredfi' && <TredfiView totalXp={totalXp} currentLevel={currentLevel} ghlLevel={ghlLevel} />}
                {activeView === 'defi' && <DeFiView totalXp={totalXp} currentLevel={currentLevel} ghlLevel={ghlLevel} />}
                {activeView === 'culture' && <CultureView totalXp={totalXp} currentLevel={currentLevel} ghlLevel={ghlLevel} />}
                {activeView === 'calendar' && <CalendarView />}
                {activeView === 'profile' && <ProfileSettings />}
                {activeView === 'news' && <NewsView initialCategory="ai" />}
                {activeView === 'vibe' && (
                    <VibeView
                        session={session}
                        dbProgress={dbProgress}
                        syncProgress={syncProgress}
                    />
                )}
            </main>
            <Toaster position="bottom-right" toastOptions={{ style: { fontSize: '12px', fontWeight: 600 } }} />

            <TreasureGem 
                treasureId="mintiņš_secret_01" 
                userEmail={session?.user?.email} 
            />

            <LevelUpModal
                isOpen={isLevelUpOpen}
                onClose={() => setIsLevelUpOpen(false)}
                level={newLevel}
                unlockedFeats={[
                    "Jauna titula nozīme",
                    "Piekļuve slēgtajam forumam",
                    "Paaugstināts XP koeficients"
                ]}
            />
        </div>
    );
}
