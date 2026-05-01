"use client";

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, ArrowLeft, Sparkles, X, CheckCircle2, XCircle,
    BookOpen, Award, RotateCcw, Bot, TrendingUp, Landmark, Palette, Trophy,
} from 'lucide-react';
import {
    PILLAR_TOOLS, PILLAR_LABEL, PILLAR_ACCENT, PILLAR_SUBTITLE,
    type PillarKey, type ToolOption,
} from '@/data/pillarTools';
import { type WizardContent } from '@/data/pratibaWizardContent';

type DifficultyKey = 'iesacejs' | 'petnieks' | 'meistars';
type WizardStep = 'difficulty' | 'pillar' | 'tool' | 'slides' | 'quiz' | 'result';

const DIFFICULTIES: Array<{ id: DifficultyKey; label: string; emoji: string; blurb: string; maxTier: 1 | 2 | 3 }> = [
    { id: 'iesacejs', label: 'Iesācējs', emoji: '🌱', blurb: 'Tikko sāku, gribu pamatus', maxTier: 1 },
    { id: 'petnieks', label: 'Pētnieks', emoji: '🔍', blurb: 'Pamatos jūtos droši, gribu dziļāk', maxTier: 2 },
    { id: 'meistars', label: 'Meistars', emoji: '🔥', blurb: 'Aktīvi lietoju, gribu izaicinājumu', maxTier: 3 },
];

const PILLAR_ICONS: Record<PillarKey, React.ElementType> = {
    ai: Bot,
    tradfi: TrendingUp,
    defi: Landmark,
    culture: Palette,
};

interface MinimalTask {
    id: string;
    title_lv: string;
    description_lv?: string | null;
    base_xp?: number | null;
    bonus_xp?: number | null;
}

interface Props {
    task: MinimalTask;
    content: WizardContent;
    initialPillar?: PillarKey;
    /** Called when user clicks the final Claim XP button after server confirms. */
    onClaimed?: (awardedXp: number) => void;
    /** Called when user dismisses the wizard. */
    onClose: () => void;
}

interface ClaimResponse {
    success: boolean;
    awardedXp: number;
    baseAward: number;
    bonusAward: number;
    totalXp: number;
    level: number;
    error?: string;
}

export function PratibaWizard({ task, content, initialPillar, onClaimed, onClose }: Props) {
    // The user picks difficulty/pillar/tool inside the wizard (per spec).
    // initialPillar lets us pre-select the pillar when launched from a pillar tab —
    // but the user can still re-pick. They cannot navigate away from the task itself.
    const [step, setStep] = useState<WizardStep>('difficulty');
    const [difficulty, setDifficulty] = useState<DifficultyKey | null>(null);
    const [pillar, setPillar] = useState<PillarKey | null>(initialPillar ?? null);
    const [tool, setTool] = useState<string | null>(content.tool); // pre-fill tool from content for v1 pilot
    const [slideIdx, setSlideIdx] = useState(0);
    const [quizIdx, setQuizIdx] = useState(0);
    const [answers, setAnswers] = useState<Array<number | null>>(() =>
        Array(content.quiz.length).fill(null)
    );
    const [claiming, setClaiming] = useState(false);
    const [claimError, setClaimError] = useState<string | null>(null);
    const [claimResult, setClaimResult] = useState<ClaimResponse | null>(null);

    const score = useMemo<number>(
        () => answers.reduce<number>(
            (acc, ans, i) => acc + (ans === content.quiz[i].correctIndex ? 1 : 0),
            0
        ),
        [answers, content.quiz]
    );
    const total = content.quiz.length;
    const fraction = total > 0 ? score / total : 0;
    const baseXp = Number(task.base_xp ?? 0);
    const bonusXp = Number(task.bonus_xp ?? 0);
    const projectedBase = Math.round(fraction * baseXp);
    const projectedBonus = score === total && total > 0 ? bonusXp : 0;
    const projectedTotal = projectedBase + projectedBonus;

    const currentSlide = content.slides[slideIdx];
    const currentQuestion = content.quiz[quizIdx];
    const allAnswered = answers.every((a) => a !== null);

    const goNextSlide = () => {
        if (slideIdx < content.slides.length - 1) setSlideIdx((i) => i + 1);
        else setStep('quiz');
    };
    const goPrevSlide = () => {
        if (slideIdx > 0) setSlideIdx((i) => i - 1);
        else setStep('tool');
    };

    const pickAnswer = (optIdx: number) => {
        if (answers[quizIdx] !== null) return; // lock once chosen
        const next = [...answers];
        next[quizIdx] = optIdx;
        setAnswers(next);
    };
    const goNextQuestion = () => {
        if (quizIdx < total - 1) setQuizIdx((i) => i + 1);
        else setStep('result');
    };
    const goPrevQuestion = () => {
        if (quizIdx > 0) setQuizIdx((i) => i - 1);
        else setStep('slides');
    };

    const retake = () => {
        setAnswers(Array(total).fill(null));
        setQuizIdx(0);
        setStep('slides');
        setSlideIdx(0);
        setClaimError(null);
        setClaimResult(null);
    };

    const handleClaim = async () => {
        setClaiming(true);
        setClaimError(null);
        try {
            const res = await fetch('/api/tasks/quiz-claim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task_id: task.id, score, total }),
            });
            const data: ClaimResponse = await res.json();
            if (!res.ok) {
                setClaimError(data.error || `Kļūda (${res.status})`);
                return;
            }
            setClaimResult(data);
            onClaimed?.(data.awardedXp);
        } catch (e) {
            setClaimError(e instanceof Error ? e.message : 'Tīkla kļūda');
        } finally {
            setClaiming(false);
        }
    };

    const stepIndex = (['difficulty', 'pillar', 'tool', 'slides', 'quiz', 'result'] as const).indexOf(step);
    const totalSteps = 6;
    const accent = pillar ? PILLAR_ACCENT[pillar] : '#59b687';

    return (
        <div
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-start md:items-center justify-center p-3 md:p-6 overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-2xl bg-white dark:bg-[var(--color-dark-surface)] rounded-3xl shadow-2xl overflow-hidden my-4 md:my-0"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Progress bar */}
                <div className="h-1.5 bg-gray-100 dark:bg-[var(--color-dark-bg)]">
                    <motion.div
                        className="h-full"
                        style={{ background: `linear-gradient(90deg, ${accent}, #4A9EE5)` }}
                        animate={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 md:px-7 pt-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Pratība · {stepIndex + 1} / {totalSteps}
                    </span>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[var(--color-dark-bg)] transition-colors"
                        aria-label="Aizvērt"
                    >
                        <X size={16} className="text-gray-400" />
                    </button>
                </div>

                {/* Step content */}
                <div className="px-5 md:px-7 pb-6 pt-2 min-h-[420px]">
                    <AnimatePresence mode="wait">
                        {step === 'difficulty' && (
                            <StepDifficulty
                                key="difficulty"
                                value={difficulty}
                                onPick={(d) => { setDifficulty(d); setStep('pillar'); }}
                            />
                        )}

                        {step === 'pillar' && (
                            <StepPillar
                                key="pillar"
                                value={pillar}
                                onPick={(p) => { setPillar(p); setStep('tool'); }}
                                onBack={() => setStep('difficulty')}
                            />
                        )}

                        {step === 'tool' && pillar && (
                            <StepTool
                                key="tool"
                                pillar={pillar}
                                value={tool}
                                taskTitle={task.title_lv}
                                onPick={(t) => { setTool(t); setStep('slides'); }}
                                onBack={() => setStep('pillar')}
                            />
                        )}

                        {step === 'slides' && currentSlide && (
                            <StepSlides
                                key={`slide-${slideIdx}`}
                                slide={currentSlide}
                                index={slideIdx}
                                total={content.slides.length}
                                accent={accent}
                                onNext={goNextSlide}
                                onPrev={goPrevSlide}
                            />
                        )}

                        {step === 'quiz' && currentQuestion && (
                            <StepQuiz
                                key={`q-${quizIdx}`}
                                question={currentQuestion}
                                index={quizIdx}
                                total={total}
                                selected={answers[quizIdx]}
                                accent={accent}
                                onPick={pickAnswer}
                                onNext={goNextQuestion}
                                onPrev={goPrevQuestion}
                                allAnswered={allAnswered}
                            />
                        )}

                        {step === 'result' && (
                            <StepResult
                                key="result"
                                task={task}
                                content={content}
                                answers={answers}
                                score={score}
                                total={total}
                                projectedBase={projectedBase}
                                projectedBonus={projectedBonus}
                                projectedTotal={projectedTotal}
                                claimResult={claimResult}
                                claiming={claiming}
                                claimError={claimError}
                                onRetake={retake}
                                onClaim={handleClaim}
                                onClose={onClose}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

/* ============ Step components (inline, OnboardingWizard pattern) ============ */

function StepDifficulty({
    value, onPick,
}: { value: DifficultyKey | null; onPick: (d: DifficultyKey) => void }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5 pt-2">
            <div className="text-center space-y-1">
                <div className="text-4xl mb-2">🎯</div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-gray-100">Kāds ir tavs līmenis?</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Godīgi — nav pareizas atbildes. Vari mainīt vēlāk.</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
                {DIFFICULTIES.map((d) => (
                    <button
                        key={d.id}
                        onClick={() => onPick(d.id)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                            value === d.id
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm'
                                : 'border-gray-200 dark:border-[var(--color-dark-border)] bg-white dark:bg-[var(--color-dark-bg)] hover:border-emerald-300'
                        }`}
                    >
                        <span className="text-3xl">{d.emoji}</span>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-black text-gray-900 dark:text-gray-100">{d.label}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{d.blurb}</div>
                        </div>
                        <ArrowRight size={16} className="text-gray-300 shrink-0" />
                    </button>
                ))}
            </div>
        </motion.div>
    );
}

function StepPillar({
    value, onPick, onBack,
}: { value: PillarKey | null; onPick: (p: PillarKey) => void; onBack: () => void }) {
    const pillars: PillarKey[] = ['ai', 'tradfi', 'defi', 'culture'];
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5 pt-2">
            <div className="text-center space-y-1">
                <div className="text-4xl mb-2">🧭</div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-gray-100">Kuru jomu apgūsim?</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Izvēlies vienu — vari atgriezties citai vēlāk.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {pillars.map((p) => {
                    const Icon = PILLAR_ICONS[p];
                    const accent = PILLAR_ACCENT[p];
                    const active = value === p;
                    return (
                        <button
                            key={p}
                            onClick={() => onPick(p)}
                            className={`p-4 rounded-2xl border-2 text-left transition-all ${
                                active ? 'shadow-sm' : 'hover:shadow-sm'
                            }`}
                            style={{
                                borderColor: active ? accent : 'rgba(0,0,0,0.08)',
                                backgroundColor: active ? `${accent}10` : undefined,
                            }}
                        >
                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
                                style={{ backgroundColor: `${accent}1f`, color: accent }}
                            >
                                <Icon size={18} />
                            </div>
                            <div className="text-sm font-black text-gray-900 dark:text-gray-100">{PILLAR_LABEL[p]}</div>
                            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-snug line-clamp-2">
                                {PILLAR_SUBTITLE[p]}
                            </div>
                        </button>
                    );
                })}
            </div>
            <NavBar onBack={onBack} />
        </motion.div>
    );
}

function StepTool({
    pillar, value, taskTitle, onPick, onBack,
}: {
    pillar: PillarKey;
    value: string | null;
    taskTitle: string;
    onPick: (t: string) => void;
    onBack: () => void;
}) {
    const tools: ToolOption[] = PILLAR_TOOLS[pillar];
    const accent = PILLAR_ACCENT[pillar];
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5 pt-2">
            <div className="text-center space-y-1">
                <div className="text-4xl mb-2">🛠️</div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-gray-100">Kuru rīku apgūsim?</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Sāksim ar vienkāršāko līmeni. Pirmais uzdevums: <span className="font-bold text-gray-700 dark:text-gray-200">{taskTitle}</span>
                </p>
            </div>
            <div className="grid grid-cols-1 gap-3">
                {tools.map((t) => {
                    const active = value === t.id;
                    return (
                        <button
                            key={t.id}
                            onClick={() => onPick(t.id)}
                            className="flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all"
                            style={{
                                borderColor: active ? accent : 'rgba(0,0,0,0.08)',
                                backgroundColor: active ? `${accent}10` : undefined,
                            }}
                        >
                            <span className="text-2xl">{t.emoji}</span>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-black text-gray-900 dark:text-gray-100">{t.label}</div>
                                <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{t.blurb}</div>
                            </div>
                            <ArrowRight size={16} className="text-gray-300 shrink-0" />
                        </button>
                    );
                })}
            </div>
            <NavBar onBack={onBack} />
        </motion.div>
    );
}

function StepSlides({
    slide, index, total, accent, onNext, onPrev,
}: {
    slide: { title: string; body: string; bullets?: string[]; imageUrl?: string };
    index: number;
    total: number;
    accent: string;
    onNext: () => void;
    onPrev: () => void;
}) {
    const isLast = index === total - 1;
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 pt-1">
            <div className="flex items-center gap-2">
                <BookOpen size={14} style={{ color: accent }} />
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: accent }}>
                    Slaids {index + 1} / {total}
                </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-gray-100 leading-tight">
                {slide.title}
            </h2>
            {slide.imageUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                    src={slide.imageUrl}
                    alt=""
                    className="w-full rounded-2xl border border-gray-100 dark:border-[var(--color-dark-border)]"
                />
            )}
            <p className="text-sm md:text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {slide.body}
            </p>
            {slide.bullets && slide.bullets.length > 0 && (
                <ul className="space-y-2 pt-1">
                    {slide.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                            <span
                                className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: accent }}
                            />
                            <span>{b}</span>
                        </li>
                    ))}
                </ul>
            )}
            <div className="flex gap-1.5 pt-2 justify-center">
                {Array.from({ length: total }).map((_, i) => (
                    <div
                        key={i}
                        className="h-1.5 rounded-full transition-all"
                        style={{
                            width: i === index ? 20 : 8,
                            backgroundColor: i <= index ? accent : 'rgba(0,0,0,0.1)',
                        }}
                    />
                ))}
            </div>
            <NavBar
                onBack={onPrev}
                onNext={onNext}
                nextLabel={isLast ? 'Sākt testu' : 'Turpināt'}
                nextIcon={isLast ? <Sparkles size={14} /> : <ArrowRight size={14} />}
                accent={accent}
            />
        </motion.div>
    );
}

function StepQuiz({
    question, index, total, selected, accent, onPick, onNext, onPrev, allAnswered,
}: {
    question: { prompt: string; options: string[]; correctIndex: number };
    index: number;
    total: number;
    selected: number | null;
    accent: string;
    onPick: (i: number) => void;
    onNext: () => void;
    onPrev: () => void;
    allAnswered: boolean;
}) {
    const isLast = index === total - 1;
    const locked = selected !== null;
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 pt-1">
            <div className="flex items-center gap-2">
                <Sparkles size={14} style={{ color: accent }} />
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: accent }}>
                    Tests · Jautājums {index + 1} / {total}
                </span>
            </div>
            <h3 className="text-base md:text-lg font-black text-gray-900 dark:text-gray-100 leading-snug">
                {question.prompt}
            </h3>
            <div className="space-y-2">
                {question.options.map((opt, i) => {
                    const isSelected = selected === i;
                    const isCorrect = i === question.correctIndex;
                    let cls = 'border-gray-200 dark:border-[var(--color-dark-border)] bg-white dark:bg-[var(--color-dark-bg)] hover:border-gray-400';
                    if (locked && isSelected && isCorrect) cls = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
                    else if (locked && isSelected && !isCorrect) cls = 'border-red-400 bg-red-50 dark:bg-red-900/20';
                    else if (locked && !isSelected && isCorrect) cls = 'border-emerald-300 bg-emerald-50/40 dark:bg-emerald-900/10';
                    else if (locked) cls = 'border-gray-200 dark:border-[var(--color-dark-border)] bg-gray-50 dark:bg-[var(--color-dark-bg)] opacity-70';
                    return (
                        <button
                            key={i}
                            onClick={() => onPick(i)}
                            disabled={locked}
                            className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${cls} ${locked ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                            <span className="w-7 h-7 rounded-full bg-white dark:bg-[var(--color-dark-surface)] border border-gray-200 dark:border-[var(--color-dark-border)] flex items-center justify-center text-xs font-black text-gray-500 shrink-0">
                                {String.fromCharCode(65 + i)}
                            </span>
                            <span className="flex-1 text-sm text-gray-800 dark:text-gray-200">{opt}</span>
                            {locked && isSelected && isCorrect && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
                            {locked && isSelected && !isCorrect && <XCircle size={16} className="text-red-500 shrink-0" />}
                            {locked && !isSelected && isCorrect && <CheckCircle2 size={16} className="text-emerald-400 shrink-0 opacity-70" />}
                        </button>
                    );
                })}
            </div>

            <NavBar
                onBack={onPrev}
                onNext={locked ? onNext : undefined}
                nextLabel={isLast ? (allAnswered ? 'Skatīt rezultātu' : 'Turpināt') : 'Nākamais jautājums'}
                nextDisabled={!locked}
                nextIcon={isLast ? <Trophy size={14} /> : <ArrowRight size={14} />}
                accent={accent}
            />
        </motion.div>
    );
}

function StepResult({
    task, content, answers, score, total, projectedBase, projectedBonus, projectedTotal,
    claimResult, claiming, claimError, onRetake, onClaim, onClose,
}: {
    task: MinimalTask;
    content: WizardContent;
    answers: Array<number | null>;
    score: number;
    total: number;
    projectedBase: number;
    projectedBonus: number;
    projectedTotal: number;
    claimResult: ClaimResponse | null;
    claiming: boolean;
    claimError: string | null;
    onRetake: () => void;
    onClaim: () => void;
    onClose: () => void;
}) {
    const perfect = score === total && total > 0;
    const claimed = claimResult?.success === true;
    const baseXp = Number(task.base_xp ?? 0);
    const bonusXp = Number(task.bonus_xp ?? 0);
    const wrong = answers
        .map((ans, i) => ({ ans, i, q: content.quiz[i] }))
        .filter((x) => x.ans !== x.q.correctIndex);

    return (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="space-y-5 pt-2">
            <div className="text-center space-y-1">
                <div className="text-5xl mb-2">{perfect ? '🏆' : score > total / 2 ? '✨' : '📚'}</div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100">
                    {claimed ? 'XP iekasēts!' : perfect ? 'Perfekti!' : score > 0 ? 'Labi padarīts!' : 'Pamēģini vēlreiz'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pareizās atbildes: <span className="font-black text-gray-900 dark:text-gray-200">{score} / {total}</span>
                </p>
            </div>

            {/* XP breakdown */}
            <div className="rounded-2xl border border-gray-100 dark:border-[var(--color-dark-border)] bg-white dark:bg-[var(--color-dark-surface)] divide-y divide-gray-100 dark:divide-[var(--color-dark-border)]">
                <Row
                    label={`Bāzes XP · ${score}/${total} pareizi`}
                    value={`+${claimed ? claimResult!.baseAward : projectedBase}`}
                    sub={`${total > 0 ? Math.round((score / total) * 100) : 0}% no ${baseXp} bāzes XP`}
                    accent="#10b981"
                />
                <Row
                    label="Bonuss · 100% pareizi"
                    value={perfect ? `+${claimed ? claimResult!.bonusAward : projectedBonus}` : '—'}
                    sub={perfect ? `Pilns bonuss (${bonusXp} XP) atbloķēts` : `Vajag visas atbildes pareizas, lai iegūtu +${bonusXp}`}
                    accent={perfect ? '#f59e0b' : '#9ca3af'}
                    muted={!perfect}
                />
                <Row
                    label="Kopā šajā mēģinājumā"
                    value={`+${claimed ? claimResult!.awardedXp : projectedTotal} XP`}
                    sub={claimed ? `Jaunais total: ${claimResult!.totalXp} XP · Lvl ${claimResult!.level}` : 'Pieprasi, lai iekasētu'}
                    accent="#1f2937"
                    bold
                />
            </div>

            {/* Wrong answers review */}
            {!claimed && wrong.length > 0 && (
                <details className="rounded-2xl border border-gray-100 dark:border-[var(--color-dark-border)] bg-gray-50 dark:bg-[var(--color-dark-bg)] p-3">
                    <summary className="text-xs font-black uppercase tracking-widest text-gray-500 cursor-pointer">
                        Pārskati nepareizos jautājumus ({wrong.length})
                    </summary>
                    <div className="mt-3 space-y-3">
                        {wrong.map(({ q, ans, i }) => (
                            <div key={i} className="text-xs">
                                <p className="font-bold text-gray-800 dark:text-gray-200">{i + 1}. {q.prompt}</p>
                                <p className="mt-1 text-red-600 dark:text-red-400">
                                    Tava atbilde: {ans !== null ? q.options[ans] : '—'}
                                </p>
                                <p className="text-emerald-600 dark:text-emerald-400">
                                    Pareizā: {q.options[q.correctIndex]}
                                </p>
                                {q.explanation && (
                                    <p className="text-gray-500 dark:text-gray-400 mt-1 italic">{q.explanation}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </details>
            )}

            {claimError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700 text-center">
                    {claimError}
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-2">
                {claimed ? (
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-2xl bg-emerald-500 text-white font-black text-sm hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                    >
                        <CheckCircle2 size={16} /> Aizvērt
                    </button>
                ) : (
                    <>
                        <button
                            onClick={onRetake}
                            disabled={claiming}
                            className="flex-1 py-3 rounded-2xl border-2 border-gray-200 dark:border-[var(--color-dark-border)] text-gray-700 dark:text-gray-300 font-bold text-sm hover:border-gray-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <RotateCcw size={14} /> Mēģināt vēlreiz
                        </button>
                        <button
                            onClick={onClaim}
                            disabled={claiming || projectedTotal <= 0}
                            className="flex-1 py-3 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-sm hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {claiming ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-gray-300 dark:border-t-gray-900 rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Award size={14} />
                                    {projectedTotal > 0 ? `Iekasēt +${projectedTotal} XP` : 'Vajag pareizāk'}
                                </>
                            )}
                        </button>
                    </>
                )}
            </div>
            {!claimed && projectedTotal > 0 && (
                <p className="text-[10px] text-center text-gray-400">
                    Iekasējot, šis uzdevums tiek slēgts. Mēģinājumi pirms iekasēšanas — bez ierobežojuma.
                </p>
            )}
        </motion.div>
    );
}

/* ============ Shared bits ============ */

function Row({
    label, value, sub, accent, muted, bold,
}: { label: string; value: string; sub?: string; accent: string; muted?: boolean; bold?: boolean }) {
    return (
        <div className={`flex items-center justify-between p-3.5 ${muted ? 'opacity-60' : ''}`}>
            <div className="min-w-0">
                <p className={`text-xs ${bold ? 'font-black text-gray-900 dark:text-gray-100' : 'font-bold text-gray-700 dark:text-gray-300'}`}>
                    {label}
                </p>
                {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
            </div>
            <span
                className={`text-sm shrink-0 ml-3 ${bold ? 'font-black text-base' : 'font-black'}`}
                style={{ color: accent }}
            >
                {value}
            </span>
        </div>
    );
}

function NavBar({
    onBack, onNext, nextLabel = 'Turpināt', nextIcon, nextDisabled, accent = '#1f2937',
}: {
    onBack?: () => void;
    onNext?: () => void;
    nextLabel?: string;
    nextIcon?: React.ReactNode;
    nextDisabled?: boolean;
    accent?: string;
}) {
    return (
        <div className="flex gap-2 pt-2">
            {onBack && (
                <button
                    onClick={onBack}
                    className="px-4 py-2.5 rounded-2xl border-2 border-gray-200 dark:border-[var(--color-dark-border)] text-gray-600 dark:text-gray-400 font-bold text-sm hover:border-gray-400 transition-all flex items-center gap-1.5"
                >
                    <ArrowLeft size={14} /> Atpakaļ
                </button>
            )}
            {onNext && (
                <button
                    onClick={onNext}
                    disabled={nextDisabled}
                    className="flex-1 py-2.5 rounded-2xl text-white font-black text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                    style={{ backgroundColor: accent }}
                >
                    {nextLabel} {nextIcon ?? <ArrowRight size={14} />}
                </button>
            )}
        </div>
    );
}
