"use client";

import { useRef, useState, useCallback } from "react";
import type { ReactNode, MouseEvent } from "react";

interface SpotlightProps {
    children: ReactNode;
    className?: string;
    spotlightColor?: string;
    spotlightSize?: number;
}

export function Spotlight({
    children,
    className = "",
    spotlightColor = "rgba(89, 182, 135, 0.08)",
    spotlightSize = 400,
}: SpotlightProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            setPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        },
        []
    );

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div
                className="pointer-events-none absolute -inset-px transition-opacity duration-500 z-0"
                style={{
                    opacity: isHovering ? 1 : 0,
                    background: `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
                }}
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
}
