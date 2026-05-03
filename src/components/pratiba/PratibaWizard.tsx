"use client";

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, ArrowLeft, Sparkles, X, CheckCircle2, XCircle,
    BookOpen, Award, RotateCcw, Trophy,
    Lock, MessageSquare, ExternalLink, Copy, Hammer, Clock,
} from 'lucide-react';
import {
    PILLAR_TOOLS, PILLAR_ACCENT,
    type PillarKey, type ToolOption,
} from '@/data/pillarTools';
import { type WizardContent } from '@/data/pratibaWizardContent';

type WizardStep = 'tool' | 'slides' | 'quiz' | 'result' | 'prakse';

interface MinimalTask {
    id: string;
    title_lv: string;
    description_lv?: string | null;
    base_xp?: number | null;
    bonus_xp?: number | null;
    /** Read from task_catalog when wiring through PillarPraktibaView; powers Prakse proof submission. */
    proof_type?: 'url' | 'tx_hash' | 'admin_review';
    proof_hint_lv?: string | null;
    auto_approve?: boolean;
    forum_url?: string | null;
    forum_label?: string | null;
    forum_template_lv?: string | null;
    requires_forum_proof?: boolean;
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
    // Wizard always opens from a pillar tab (AI/TradFi/DeFi/Culture sidebar),
    // so pillar comes pre-set via initialPillar. Step 1 is the tool screen.
    const [step, setStep] = useState<WizardStep>('tool');
    const [pillar] = useState<PillarKey | null>(initialPillar ?? 'ai');
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
    const hasPrakse = !!content.prakse;
    const perfect = score === total && total > 0;
    const prakseUnlocked = perfect && hasPrakse;
    const projectedBase = Math.round(fraction * baseXp);
    // When Prakse is defined, bonus is GATED — it only awards via /api/tasks/submit
    // after the user posts to the forum. Without Prakse, bonus auto-awards at 100%.
    const projectedBonus = perfect && !hasPrakse ? bonusXp : 0;
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
                body: JSON.stringify({ task_id: task.id, score, total, has_prakse: hasPrakse }),
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

    // Prakse proof submission — reuses legacy /api/tasks/submit which handles
    // forum proof validation, auto_approve, admin_review and the bonus XP claim.
    const [prakseProof, setPrakseProof] = useState('');
    const [prakseSubmitting, setPrakseSubmitting] = useState(false);
    const [prakseError, setPrakseError] = useState<string | null>(null);
    const [prakseResult, setPrakseResult] = useState<{ success: boolean; status?: string; awardedXp?: number; message?: string } | null>(null);

    const handlePrakseSubmit = async () => {
        if (!prakseProof.trim()) return;
        setPrakseSubmitting(true);
        setPrakseError(null);
        try {
            const res = await fetch('/api/tasks/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task_id: task.id, proof: prakseProof.trim() }),
            });
            const data = await res.json();
            if (!res.ok) {
                setPrakseError(data.error || `Kļūda (${res.status})`);
                return;
            }
            setPrakseResult({
                success: true,
                status: data.status,           // 'approved' | 'pending'
                awardedXp: data.awardedXp,     // present when auto-approved
                message: data.message,
            });
            if (data.awardedXp) onClaimed?.(data.awardedXp);
        } catch (e) {
            setPrakseError(e instanceof Error ? e.message : 'Tīkla kļūda');
        } finally {
            setPrakseSubmitting(false);
        }
    };

    const stepOrder = (['tool', 'slides', 'quiz', 'result', 'prakse'] as const);
    const stepIndex = stepOrder.indexOf(step);
    const totalSteps = hasPrakse ? 5 : 4;
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
                <div className="flex items-center justify-between px-5 md:px-7 pt-4 gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">
                            Pratība · {stepIndex + 1} / {totalSteps}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[var(--color-dark-bg)] transition-colors shrink-0"
                        aria-label="Aizvērt"
                    >
                        <X size={16} className="text-gray-400" />
                    </button>
                </div>

                {/* Step content */}
                <div className="px-5 md:px-7 pb-6 pt-2 min-h-[420px]">
                    <AnimatePresence mode="wait">
                        {step === 'tool' && pillar && (
                            <StepTool
                                key="tool"
                                pillar={pillar}
                                value={tool}
                                taskTitle={task.title_lv}
                                onPick={(t) => { setTool(t); setStep('slides'); }}
                                onBack={onClose}
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
                                hasPrakse={hasPrakse}
                                prakseUnlocked={prakseUnlocked}
                                claimResult={claimResult}
                                claiming={claiming}
                                claimError={claimError}
                                onRetake={retake}
                                onClaim={handleClaim}
                                onGoPrakse={() => setStep('prakse')}
                                onClose={onClose}
                            />
                        )}

                        {step === 'prakse' && content.prakse && (
                            <StepPrakse
                                key="prakse"
                                task={task}
                                prakse={content.prakse}
                                bonusXp={bonusXp}
                                proof={prakseProof}
                                setProof={setPrakseProof}
                                submitting={prakseSubmitting}
                                result={prakseResult}
                                error={prakseError}
                                accent={accent}
                                onSubmit={handlePrakseSubmit}
                                onBack={() => setStep('result')}
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
    hasPrakse, prakseUnlocked,
    claimResult, claiming, claimError, onRetake, onClaim, onGoPrakse, onClose,
}: {
    task: MinimalTask;
    content: WizardContent;
    answers: Array<number | null>;
    score: number;
    total: number;
    projectedBase: number;
    projectedBonus: number;
    projectedTotal: number;
    hasPrakse: boolean;
    prakseUnlocked: boolean;
    claimResult: ClaimResponse | null;
    claiming: boolean;
    claimError: string | null;
    onRetake: () => void;
    onClaim: () => void;
    onGoPrakse: () => void;
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
                {hasPrakse ? (
                    <Row
                        label="Bonuss · caur Praksi"
                        value={perfect ? `+${bonusXp} pieejams` : '—'}
                        sub={perfect
                            ? `Atbloķēts! Padalies forumā, lai iekasētu +${bonusXp} XP`
                            : `Vajag visas atbildes pareizas, lai atbloķētu Praksi`}
                        accent={perfect ? '#f59e0b' : '#9ca3af'}
                        muted={!perfect}
                    />
                ) : (
                    <Row
                        label="Bonuss · 100% pareizi"
                        value={perfect ? `+${claimed ? claimResult!.bonusAward : projectedBonus}` : '—'}
                        sub={perfect ? `Pilns bonuss (${bonusXp} XP) atbloķēts` : `Vajag visas atbildes pareizas, lai iegūtu +${bonusXp}`}
                        accent={perfect ? '#f59e0b' : '#9ca3af'}
                        muted={!perfect}
                    />
                )}
                <Row
                    label="Kopā šajā mēģinājumā"
                    value={`+${claimed ? claimResult!.awardedXp : projectedTotal} XP`}
                    sub={claimed ? `Jaunais total: ${claimResult!.totalXp} XP · Lvl ${claimResult!.level}` : 'Pieprasi, lai iekasētu'}
                    accent="#1f2937"
                    bold
                />
            </div>

            {/* Prakse unlock banner — appears only when quiz is 100% AND task has Prakse */}
            {prakseUnlocked && (
                <div className="rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/60 dark:bg-amber-900/10 p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <Hammer size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-300">
                                🎁 Prakse atbloķēta
                            </p>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-1">
                                {content.prakse?.title || 'Prakse'}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {content.prakse?.intro}
                            </p>
                            <button
                                onClick={onGoPrakse}
                                className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-black transition-colors"
                            >
                                Sākt Praksi · +{bonusXp} XP <ArrowRight size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

function StepPrakse({
    task, prakse, bonusXp, proof, setProof, submitting, result, error, accent, onSubmit, onBack, onClose,
}: {
    task: MinimalTask;
    prakse: { title: string; intro: string; steps: string[]; forum_hint?: string };
    bonusXp: number;
    proof: string;
    setProof: (s: string) => void;
    submitting: boolean;
    result: { success: boolean; status?: string; awardedXp?: number; message?: string } | null;
    error: string | null;
    accent: string;
    onSubmit: () => void;
    onBack: () => void;
    onClose: () => void;
}) {
    const [copied, setCopied] = useState(false);
    const copy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {}
    };

    const proofLooksValid = (() => {
        const p = proof.trim();
        if (!p) return false;
        if (task.proof_type === 'tx_hash') return /^0x[0-9a-fA-F]{64}$/.test(p);
        if (/^0x[0-9a-fA-F]{40}$/.test(p)) return true;
        try {
            const u = new URL(p);
            if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
            if (task.requires_forum_proof && u.hostname !== 'platforma.100x.lv') return false;
            return true;
        } catch {
            return false;
        }
    })();

    const proofWarning = (() => {
        const p = proof.trim();
        if (!p || !task.requires_forum_proof || task.proof_type === 'tx_hash') return null;
        if (/^0x[0-9a-fA-F]{40}$/.test(p)) return null;
        try {
            const u = new URL(p);
            if (u.hostname !== 'platforma.100x.lv') return 'Šim uzdevumam pierādījumam jābūt no platforma.100x.lv';
        } catch {
            return 'Pārbaudi URL formātu';
        }
        return null;
    })();

    // Submission state — server returns 'approved' (auto_approve) or 'pending' (admin_review)
    if (result?.success) {
        const approved = result.status === 'approved';
        return (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5 pt-2 text-center">
                <div className="text-5xl mb-2">{approved ? '🎁' : '⏳'}</div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100">
                    {approved ? `+${result.awardedXp ?? bonusXp} bonus XP iekasēts!` : 'Iesniegts admin pārbaudei'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                    {approved
                        ? 'Paldies par dalīšanos forumā — bonus XP jau ir tavā kontā.'
                        : 'Tavs foruma posts iesniegts. Bonus XP tiks piešķirts pēc administratora apstiprinājuma.'}
                </p>
                <button
                    onClick={onClose}
                    className="mt-2 w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm flex items-center justify-center gap-2"
                >
                    <CheckCircle2 size={16} /> Aizvērt
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 pt-1">
            <div className="flex items-center gap-2">
                <Hammer size={14} style={{ color: accent }} />
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: accent }}>
                    Prakse · +{bonusXp} XP bonuss
                </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-gray-100 leading-tight">
                {prakse.title}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {prakse.intro}
            </p>

            {/* Action steps */}
            <ol className="space-y-2 pt-1">
                {prakse.steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                        <span
                            className="mt-0.5 w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center shrink-0 text-white"
                            style={{ backgroundColor: accent }}
                        >
                            {i + 1}
                        </span>
                        <span>{s}</span>
                    </li>
                ))}
            </ol>

            {/* Forum CTA + template (reuses task_catalog.forum_url + forum_template_lv) */}
            {task.forum_url && (
                <div className="rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-50/60 dark:bg-blue-900/10 p-3.5">
                    <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-200">
                            <MessageSquare size={14} /> Padalies forumā
                        </span>
                        <a
                            href={task.forum_url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                        >
                            <ExternalLink size={11} /> {task.forum_label || 'Atvērt forumu'}
                        </a>
                    </div>
                    {task.forum_template_lv && (
                        <div className="relative mt-2">
                            <pre className="whitespace-pre-wrap text-[11px] leading-relaxed text-gray-700 dark:text-gray-300 bg-white dark:bg-[var(--color-dark-bg)] rounded-lg p-3 border border-blue-200 dark:border-blue-800 max-h-40 overflow-y-auto font-mono">
                                {task.forum_template_lv}
                            </pre>
                            <button
                                onClick={() => copy(task.forum_template_lv!)}
                                className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white dark:bg-[var(--color-dark-surface)] border border-gray-200 dark:border-[var(--color-dark-border)] text-[10px] font-bold text-gray-600 dark:text-gray-400 hover:text-emerald-600"
                            >
                                {copied ? <CheckCircle2 size={10} className="text-emerald-500" /> : <Copy size={10} />}
                                {copied ? 'Nokopēts' : 'Kopēt'}
                            </button>
                        </div>
                    )}
                    {prakse.forum_hint && (
                        <p className="text-[11px] text-blue-800 dark:text-blue-300 mt-2 leading-snug">{prakse.forum_hint}</p>
                    )}
                </div>
            )}

            {/* Proof input */}
            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                    Saite uz tavu foruma postu
                </label>
                <input
                    type="text"
                    value={proof}
                    onChange={(e) => setProof(e.target.value)}
                    placeholder={task.proof_hint_lv || 'https://platforma.100x.lv/...'}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-[var(--color-dark-bg)] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 text-sm transition-colors ${
                        proofWarning
                            ? 'border-amber-400 focus:ring-amber-200 focus:border-amber-500'
                            : 'border-gray-200 dark:border-[var(--color-dark-border)] focus:ring-amber-300 focus:border-amber-400'
                    }`}
                />
                {proofWarning && <p className="text-[11px] font-medium text-amber-600 mt-1.5">⚠ {proofWarning}</p>}
            </div>

            {!task.auto_approve && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-2">
                    <Lock size={14} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                        Bonusu pārbauda administrators. Bonus XP tiek piešķirts pēc apstiprinājuma.
                    </p>
                </div>
            )}

            {error && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700 text-center">
                    {error}
                </div>
            )}

            <div className="flex gap-2 pt-1">
                <button
                    onClick={onBack}
                    disabled={submitting}
                    className="px-4 py-2.5 rounded-2xl border-2 border-gray-200 dark:border-[var(--color-dark-border)] text-gray-600 dark:text-gray-400 font-bold text-sm hover:border-gray-400 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                    <ArrowLeft size={14} /> Atpakaļ
                </button>
                <button
                    onClick={onSubmit}
                    disabled={submitting || !proofLooksValid}
                    className="flex-1 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {submitting ? (
                        <Clock size={14} className="animate-spin" />
                    ) : (
                        <><Award size={14} /> Iesniegt · +{bonusXp} XP</>
                    )}
                </button>
            </div>
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
