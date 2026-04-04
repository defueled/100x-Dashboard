"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { LogIn, LogOut } from "lucide-react";

export function LoginButton() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/50 bg-[#1a1a1a] rounded-full cursor-not-allowed border border-white/10 transition-colors">
                <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                Loading...
            </button>
        );
    }

    if (session) {
        return (
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    {session.user?.image && (
                        <img
                            src={session.user.image}
                            alt="Profile"
                            className="w-8 h-8 rounded-full border border-white/20"
                        />
                    )}
                    <span className="text-sm font-medium text-brand-dark/80 hidden md:block">
                        {session.user?.name}
                    </span>
                </div>
                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-full border border-red-400/20 transition-all hover:scale-105"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        );
    }

    return null;
}
