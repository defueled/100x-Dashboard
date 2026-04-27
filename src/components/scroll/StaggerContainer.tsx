"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.6,
            ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
        },
    },
};

interface StaggerContainerProps {
    children: ReactNode;
    className?: string;
    once?: boolean;
    amount?: number;
    staggerDelay?: number;
}

export function StaggerContainer({
    children,
    className = "",
    once = true,
    amount = 0.15,
    staggerDelay = 0.12,
}: StaggerContainerProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount }}
            variants={{
                ...containerVariants,
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                        delayChildren: 0.1,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div variants={itemVariants} className={className}>
            {children}
        </motion.div>
    );
}
