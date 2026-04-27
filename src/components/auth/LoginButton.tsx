"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useT } from "@/i18n/LangProvider";

export function LoginButton() {
    const { data: session, status } = useSession();
    const t = useT();

    if (status === "loading") {
        return (
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-dark/40 bg-brand-dark/5 rounded-full cursor-not-allowed border border-brand-dark/10 transition-colors">
                <div className="w-4 h-4 rounded-full border-2 border-brand-dark/20 border-t-brand-green animate-spin" />
                Ielādē...
            </button>
        );
    }

    if (session) {
        return (
            <div className="flex items-center gap-3">
                {session.user?.image && (
                    <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-8 h-8 rounded-full border border-brand-dark/10"
                    />
                )}
                <span className="text-sm font-medium text-brand-dark/80 hidden md:block">
                    {session.user?.name}
                </span>
                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-full border border-red-400/20 transition-all"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    {t("header.signout")}
                </button>
            </div>
        );
    }

    // Not authenticated — show login button
    return (
        <button
            onClick={() => signIn("google", { callbackUrl: "/app" })}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-brand-dark hover:bg-brand-dark/90 rounded-full transition-all hover:-translate-y-0.5 shadow-sm"
        >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 bg-white p-0.5 rounded-full" />
            {t("header.signin")}
        </button>
    );
}
