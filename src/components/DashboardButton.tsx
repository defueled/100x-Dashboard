"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

export function DashboardButton() {
    const { data: session } = useSession();
    const router = useRouter();

    if (session) {
        return (
            <button
                onClick={() => router.push("/app")}
                className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white font-bold rounded-full hover:bg-brand-green/90 transition-all hover:-translate-y-0.5 shadow-sm text-xs md:text-sm"
            >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
            </button>
        );
    }

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-4 py-2 bg-brand-green/10 text-brand-green font-semibold rounded-full hover:bg-brand-green/20 transition-colors text-xs md:text-sm"
        >
            Dashboard
        </button>
    );
}
