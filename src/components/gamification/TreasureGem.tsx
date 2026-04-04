"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface TreasureGemProps {
    treasureId: string;
    userEmail?: string | null;
}

export function TreasureGem({ treasureId, userEmail }: TreasureGemProps) {
    const [isFound, setIsFound] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);

    const handleClaim = async () => {
        if (!userEmail) {
            toast.error("Please log in to claim your Mintiņš reward!");
            return;
        }

        if (isFound || isClaiming) return;

        setIsClaiming(true);

        try {
            const { error } = await supabase
                .from('treasure_claims')
                .insert({
                    user_email: userEmail,
                    treasure_id: treasureId,
                    status: 'pending'
                });

            if (error) {
                // Duplicate claim (unique constraint violation)
                if (error.code === '23505') {
                    setIsFound(true);
                    toast("Tu jau atradi šo Mintiņš noslēpumu! 😎", { icon: '🦞' });
                    return;
                }
                console.error("Claim DB error:", JSON.stringify({ code: error.code, message: error.message, details: error.details, hint: error.hint }));
                throw new Error(error.message || error.code || 'Unknown Supabase error');
            }

            setIsFound(true);
            toast.success("Mintiņš Secret Found! Your reward is being processed. 💎", {
                duration: 5000,
                icon: '🦞'
            });
        } catch (err: any) {
            console.error("Claim error:", err?.message ?? err?.code ?? JSON.stringify(err, Object.getOwnPropertyNames(err)));
            toast.error("Oops! Mintiņš missed that. Try again later.");
        } finally {
            setIsClaiming(false);
        }
    };

    if (isFound) return null;

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
                scale: [1, 1.1, 1],
                opacity: 1,
                rotate: [0, -5, 5, 0]
            }}
            transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            whileHover={{ scale: 1.2, cursor: 'pointer' }}
            onClick={handleClaim}
            className="fixed bottom-10 right-10 z-[80] group"
        >
            <div className="relative">
                <div className="absolute inset-0 bg-brand-green/20 rounded-full blur-xl group-hover:bg-brand-green/40 transition-all duration-300" />
                <div className="relative w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-glow-green border border-brand-green/20">
                    <Sparkles className="text-brand-green w-6 h-6" />
                </div>
                
                {/* Floating Swag UI */}
                <div className="absolute -top-12 -left-12 bg-dark-bg text-white text-[10px] font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 shadow-xl">
                    Mintiņš Secret! 🤫
                </div>
            </div>
        </motion.div>
    );
}
