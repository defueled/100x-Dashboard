"use client";

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

function readStoredTheme(): Theme {
    if (typeof window === 'undefined') return 'light';
    const stored = window.localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored;
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
}

function applyTheme(theme: Theme) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
}

export function ThemeToggle({ className = '' }: { className?: string }) {
    const [theme, setTheme] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const initial = readStoredTheme();
        setTheme(initial);
        applyTheme(initial);
        setMounted(true);
    }, []);

    const toggle = () => {
        const next: Theme = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        applyTheme(next);
        try { window.localStorage.setItem('theme', next); } catch {}
    };

    // Render a neutral icon during SSR / first paint to avoid hydration mismatch.
    const Icon = !mounted ? Moon : theme === 'dark' ? Sun : Moon;
    const label = !mounted ? 'Tēmas poga' : theme === 'dark' ? 'Ieslēgt gaišo' : 'Ieslēgt tumšo';

    return (
        <button
            onClick={toggle}
            aria-label={label}
            title={label}
            className={`p-1.5 rounded-lg transition-all text-gray-300 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-[var(--color-dark-surface)] ${className}`}
        >
            <Icon size={16} />
        </button>
    );
}
