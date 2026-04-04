"use client";

export function DashboardButton() {
    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-4 py-2 bg-brand-green/10 text-brand-green font-semibold rounded-full hover:bg-brand-green/20 transition-colors text-xs md:text-sm"
        >
            Dashboard
        </button>
    );
}
