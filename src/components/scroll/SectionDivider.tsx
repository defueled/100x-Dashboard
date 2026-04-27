"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface SectionDividerProps {
    color?: string;
    height?: number;
}

export function SectionDivider({ color = "rgba(89, 182, 135, 0.08)", height = 120 }: SectionDividerProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const scaleX = useTransform(scrollYProgress, [0, 0.5], [0.3, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.6, 0.6, 0]);

    return (
        <div ref={ref} className="relative overflow-hidden" style={{ height }}>
            <motion.div
                className="absolute top-1/2 left-0 right-0 h-px origin-center"
                style={{
                    scaleX,
                    opacity,
                    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                }}
            />
        </div>
    );
}
