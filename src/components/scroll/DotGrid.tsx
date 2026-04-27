"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface DotGridProps {
    className?: string;
    dotColor?: string;
    dotSize?: number;
    gap?: number;
}

export function DotGrid({
    className = "",
    dotColor = "rgba(89, 182, 135, 0.15)",
    dotSize = 1.5,
    gap = 28,
}: DotGridProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -40]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

    return (
        <motion.div
            ref={ref}
            className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
            style={{ opacity }}
        >
            <motion.div
                className="absolute inset-[-20%] w-[140%] h-[140%]"
                style={{
                    y,
                    backgroundImage: `radial-gradient(circle, ${dotColor} ${dotSize}px, transparent ${dotSize}px)`,
                    backgroundSize: `${gap}px ${gap}px`,
                }}
            />
        </motion.div>
    );
}
