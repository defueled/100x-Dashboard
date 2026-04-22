"use client";

export const dynamic = 'force-dynamic';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardEmbed } from "@/components/DashboardEmbed";
import { Web3Provider } from "@/components/providers/Web3Provider";

export default function AppPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/");
            return;
        }
        // Non-subscribers → paywall. Subscriber state is set in the NextAuth
        // session callback from the real GHL `abonements💰` tag.
        if (status === "authenticated" && (session?.user as any)?.is_subscribed === false) {
            router.replace("/subscribe");
        }
    }, [status, session, router]);

    if (status === "loading") {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#F8FAF9]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                    <p className="text-xs font-medium text-gray-400">Ielādē...</p>
                </div>
            </div>
        );
    }

    if (!session) return null;

    return (
        <Web3Provider>
            <DashboardEmbed />
        </Web3Provider>
    );
}
