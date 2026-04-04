"use client";

import Image from "next/image";

export function Header() {
    return (
        <header className="sticky top-0 z-[100] px-6 py-6 flex items-center justify-between border-y border-brand-dark/5 bg-[var(--color-background)]/80 backdrop-blur-md">
            {/* Logo area */}
            <div className="flex items-center gap-3">
                <Image
                    src="/assets/logos/100x-refined-logo.png"
                    alt="100x.lv"
                    width={100}
                    height={40}
                    className="h-8 w-auto"
                />
            </div>



            {/* Action button */}
            <div>
                <button className="bg-[#59b687] text-white px-6 py-2 rounded-full font-bold text-sm tracking-wide hover:scale-105 transition-transform duration-300">
                    Ienākt portālā
                </button>
            </div>
        </header>
    );
}
