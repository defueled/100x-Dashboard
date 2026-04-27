"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useSpring, useMotionValue, motion } from "framer-motion";

interface SpringCounterProps {
    target: number;
    suffix?: string;
    prefix?: string;
    className?: string;
    duration?: number;
}

export function SpringCounter({
    target,
    suffix = "",
    prefix = "",
    className = "",
    duration = 1.5,
}: SpringCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const [displayValue, setDisplayValue] = useState(0);

    const motionValue = useMotionValue(0);
    const spring = useSpring(motionValue, {
        stiffness: 80,
        damping: 20,
        restDelta: 0.5,
    });

    useEffect(() => {
        if (isInView) {
            motionValue.set(target);
        }
    }, [isInView, target, motionValue]);

    useEffect(() => {
        const unsubscribe = spring.on("change", (latest) => {
            setDisplayValue(Math.round(latest));
        });
        return unsubscribe;
    }, [spring]);

    return (
        <motion.span
            ref={ref}
            className={className}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
            {prefix}{displayValue}{suffix}
        </motion.span>
    );
}
