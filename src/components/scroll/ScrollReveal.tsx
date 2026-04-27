"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type RevealVariant = "fadeUp" | "fadeIn" | "blurFadeIn" | "scaleUp" | "slideLeft" | "slideRight" | "liftUp";

const variants: Record<RevealVariant, Variants> = {
    fadeUp: {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0 },
    },
    fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    },
    blurFadeIn: {
        hidden: { opacity: 0, filter: "blur(12px)", y: 30 },
        visible: { opacity: 1, filter: "blur(0px)", y: 0 },
    },
    scaleUp: {
        hidden: { opacity: 0, scale: 0.92 },
        visible: { opacity: 1, scale: 1 },
    },
    slideLeft: {
        hidden: { opacity: 0, x: -80 },
        visible: { opacity: 1, x: 0 },
    },
    slideRight: {
        hidden: { opacity: 0, x: 80 },
        visible: { opacity: 1, x: 0 },
    },
    liftUp: {
        hidden: { opacity: 0, y: 40, rotateX: 8 },
        visible: { opacity: 1, y: 0, rotateX: 0 },
    },
};

interface ScrollRevealProps {
    children: ReactNode;
    variant?: RevealVariant;
    delay?: number;
    duration?: number;
    className?: string;
    once?: boolean;
    amount?: number;
}

export function ScrollReveal({
    children,
    variant = "fadeUp",
    delay = 0,
    duration = 0.7,
    className = "",
    once = true,
    amount = 0.2,
}: ScrollRevealProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount }}
            variants={variants[variant]}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.4, 0.25, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
