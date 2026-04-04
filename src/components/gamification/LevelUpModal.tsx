"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles, X } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface LevelUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    level: number;
    unlockedFeats?: string[];
}

export function LevelUpModal({ isOpen, onClose, level, unlockedFeats = [] }: LevelUpModalProps) {
    const { width, height } = useWindowSize();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"
                    />

                    <Confetti
                        width={width}
                        height={height}
                        recycle={false}
                        numberOfPieces={200}
                        colors={['#188bf6', '#59b687', '#f6ad55']}
                    />

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md glass-card rounded-[2.5rem] p-8 overflow-hidden text-center"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} className="text-gray-400" />
                        </button>

                        <div className="flex justify-center mb-6">
                            <motion.div
                                animate={{
                                    rotate: [0, -10, 10, -10, 10, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="w-24 h-24 bg-gradient-to-br from-brand-green to-brand-blue rounded-3xl flex items-center justify-center shadow-glow-green"
                            >
                                <Trophy size={48} className="text-white" />
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-3xl font-black text-brand-dark mb-2">JAUNS LĪMENIS!</h2>
                            <p className="text-brand-green font-bold tracking-widest uppercase text-sm mb-6 flex items-center justify-center gap-2">
                                <Sparkles size={16} /> LĪMENIS {level} SASNIEGTS <Sparkles size={16} />
                            </p>
                        </motion.div>

                        <div className="space-y-3 mb-8">
                            <p className="text-gray-500 text-sm">Tu esi kļuvis vēl spēcīgāks 100x Komūnā. Atbloķētās iespējas:</p>
                            <div className="grid grid-cols-1 gap-2">
                                {unlockedFeats.map((feat, i) => (
                                    <motion.div
                                        key={feat}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + (i * 0.1) }}
                                        className="flex items-center gap-3 bg-white/50 p-3 rounded-2xl border border-white"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                                            <Star size={16} className="text-brand-blue" fill="currentColor" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-700">{feat}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-brand-dark text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-black/10"
                        >
                            Turpināt Izaugsmi
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
