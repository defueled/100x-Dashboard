"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Target, Zap, Users } from 'lucide-react';

interface OnboardingWizardProps {
    userName: string;
    onComplete: () => void;
}

const GOALS = [
    { id: 'web3', label: '🔗 Web3 & DeFi', desc: 'Iemācīties kriptovalūtas un decentralizētās finanšu' },
    { id: 'ai', label: '🤖 AI & Automatizācija', desc: 'Apgūt mākslīgo intelektu un automatizācijas rīkus' },
    { id: 'trading', label: '📈 Trading & Ieguldījumi', desc: 'Tirgot un ieguldīt digitālajos aktīvos' },
    { id: 'building', label: '🛠 Veidot Projektus', desc: 'Būvēt produktus un startupus' },
    { id: 'community', label: '🌍 Komunity & Networking', desc: 'Atrast līdzīgi domājošus cilvēkus' },
];

const SKILL_LEVELS = [
    { id: 'beginner', label: '🌱 Iesācējs', desc: 'Es tikko sāku iepazīties ar tēmu' },
    { id: 'intermediate', label: '⚡ Vidējs', desc: 'Man ir pamatzināšanas, gribu dziļāk' },
    { id: 'advanced', label: '🔥 Pieredzējis', desc: 'Esmu aktīvi iesaistīts, gribu vēl vairāk' },
];

const REFERRAL_SOURCES = [
    { id: 'friend', label: '👥 Draugs vai kolēģis' },
    { id: 'social', label: '📱 Sociālie mediji' },
    { id: 'telegram', label: '✈️ Telegram' },
    { id: 'google', label: '🔍 Google meklēšana' },
    { id: 'event', label: '🎤 Pasākums vai konference' },
    { id: 'other', label: '🌐 Cits' },
];

const TOTAL_STEPS = 4;

export function OnboardingWizard({ userName, onComplete }: OnboardingWizardProps) {
    const [step, setStep] = useState(0);
    const [displayName, setDisplayName] = useState(userName || '');
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [skillLevel, setSkillLevel] = useState('');
    const [referralSource, setReferralSource] = useState('');
    const [saving, setSaving] = useState(false);

    const toggleGoal = (id: string) => {
        setSelectedGoals(prev =>
            prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
        );
    };

    const canProceed = () => {
        if (step === 0) return displayName.trim().length > 0;
        if (step === 1) return selectedGoals.length > 0;
        if (step === 2) return skillLevel !== '';
        if (step === 3) return referralSource !== '';
        return false;
    };

    const handleFinish = async () => {
        setSaving(true);
        try {
            await fetch('/api/onboarding/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    display_name: displayName.trim(),
                    goals: selectedGoals,
                    skill_level: skillLevel,
                    referral_source: referralSource,
                }),
            });
            onComplete();
        } finally {
            setSaving(false);
        }
    };

    const steps = [
        // Step 0: Name
        <motion.div key="name" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-6">
            <div className="text-center space-y-2">
                <div className="text-5xl mb-4">👋</div>
                <h2 className="text-2xl font-black text-brand-dark">Laipni lūdzam, {userName.split(' ')[0]}!</h2>
                <p className="text-gray-500 text-sm">Pirms sākam, pastāsti mums nedaudz par sevi</p>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Kā tevi saukt komūnā?</label>
                <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Tavs vārds vai nick..."
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/80 text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-all"
                    autoFocus
                />
            </div>
        </motion.div>,

        // Step 1: Goals
        <motion.div key="goals" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-4">
            <div className="text-center space-y-2">
                <Target className="w-10 h-10 text-brand-blue mx-auto mb-2" />
                <h2 className="text-2xl font-black text-brand-dark">Kādi ir tavi mērķi?</h2>
                <p className="text-gray-500 text-sm">Izvēlies visu, kas atbilst (var izvēlēties vairākus)</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
                {GOALS.map(goal => (
                    <button
                        key={goal.id}
                        onClick={() => toggleGoal(goal.id)}
                        className={`flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all ${
                            selectedGoals.includes(goal.id)
                                ? 'border-brand-green bg-brand-green/10 shadow-sm'
                                : 'border-gray-200 bg-white/60 hover:border-gray-300'
                        }`}
                    >
                        <span className="text-lg">{goal.label.split(' ')[0]}</span>
                        <div>
                            <div className="text-sm font-bold text-brand-dark">{goal.label.slice(3)}</div>
                            <div className="text-xs text-gray-500">{goal.desc}</div>
                        </div>
                        {selectedGoals.includes(goal.id) && (
                            <div className="ml-auto w-5 h-5 rounded-full bg-brand-green flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </motion.div>,

        // Step 2: Skill level
        <motion.div key="skill" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-4">
            <div className="text-center space-y-2">
                <Zap className="w-10 h-10 text-brand-green mx-auto mb-2" />
                <h2 className="text-2xl font-black text-brand-dark">Kāds ir tavs līmenis?</h2>
                <p className="text-gray-500 text-sm">Esam godīgi — nav pareizas vai nepareizas atbildes</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
                {SKILL_LEVELS.map(level => (
                    <button
                        key={level.id}
                        onClick={() => setSkillLevel(level.id)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                            skillLevel === level.id
                                ? 'border-brand-blue bg-brand-blue/10 shadow-sm'
                                : 'border-gray-200 bg-white/60 hover:border-gray-300'
                        }`}
                    >
                        <span className="text-2xl">{level.label.split(' ')[0]}</span>
                        <div>
                            <div className="text-sm font-bold text-brand-dark">{level.label.slice(3)}</div>
                            <div className="text-xs text-gray-500">{level.desc}</div>
                        </div>
                        {skillLevel === level.id && (
                            <div className="ml-auto w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </motion.div>,

        // Step 3: Referral
        <motion.div key="referral" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-4">
            <div className="text-center space-y-2">
                <Users className="w-10 h-10 text-brand-green mx-auto mb-2" />
                <h2 className="text-2xl font-black text-brand-dark">Kā tu atradis 100x?</h2>
                <p className="text-gray-500 text-sm">Palīdzi mums saprast, kas strādā</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {REFERRAL_SOURCES.map(src => (
                    <button
                        key={src.id}
                        onClick={() => setReferralSource(src.id)}
                        className={`flex items-center gap-2 p-3 rounded-2xl border-2 text-left transition-all ${
                            referralSource === src.id
                                ? 'border-brand-green bg-brand-green/10 shadow-sm'
                                : 'border-gray-200 bg-white/60 hover:border-gray-300'
                        }`}
                    >
                        <span className="text-base">{src.label.split(' ')[0]}</span>
                        <span className="text-xs font-medium text-brand-dark">{src.label.slice(3)}</span>
                    </button>
                ))}
            </div>
            <div className="mt-4 p-4 rounded-2xl bg-brand-green/10 border border-brand-green/20 text-center">
                <p className="text-xs text-brand-green font-bold flex items-center justify-center gap-2">
                    <Sparkles size={14} />
                    Pabeidz onboarding un saņem +50 XP!
                    <Sparkles size={14} />
                </p>
            </div>
        </motion.div>,
    ];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-brand-dark/50 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
                {/* Progress bar */}
                <div className="h-1.5 bg-gray-100">
                    <motion.div
                        className="h-full bg-gradient-to-r from-brand-green to-brand-blue"
                        animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>

                <div className="p-8">
                    {/* Step counter */}
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {step + 1} / {TOTAL_STEPS}
                        </span>
                        <div className="flex gap-1.5">
                            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 w-6 rounded-full transition-all ${
                                        i <= step ? 'bg-brand-green' : 'bg-gray-200'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Step content */}
                    <div className="min-h-[340px]">
                        <AnimatePresence mode="wait">
                            {steps[step]}
                        </AnimatePresence>
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-3 mt-6">
                        {step > 0 && (
                            <button
                                onClick={() => setStep(s => s - 1)}
                                className="px-5 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:border-gray-300 transition-all"
                            >
                                Atpakaļ
                            </button>
                        )}
                        <button
                            onClick={step < TOTAL_STEPS - 1 ? () => setStep(s => s + 1) : handleFinish}
                            disabled={!canProceed() || saving}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-brand-dark text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-black/10"
                        >
                            {saving ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : step < TOTAL_STEPS - 1 ? (
                                <>Turpināt <ArrowRight size={16} /></>
                            ) : (
                                <>Sākt 100x pieredzi! <Sparkles size={16} /></>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
