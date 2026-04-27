"use client";

import type { ReactNode } from "react";

interface ShimmerCardProps {
    children: ReactNode;
    className?: string;
}

export function ShimmerCard({ children, className = "" }: ShimmerCardProps) {
    return (
        <div className={`group relative overflow-hidden ${className}`}>
            {/* Shimmer sweep overlay */}
            <div
                className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-10"
                style={{
                    background:
                        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.15) 55%, transparent 100%)",
                }}
            />
            {children}
        </div>
    );
}
