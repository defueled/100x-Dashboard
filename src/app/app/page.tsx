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

    // Only explicit `true` counts as "subscribed". Anything else (false, null,
    // undefined, stale/error session) sends the user to the paywall — fail
    // closed, not open. Subscriber state is written in the NextAuth session
    // callback from the real GHL `abonements💰` tag. Admins (ADMIN_EMAILS env)
    // bypass the paywall entirely.
    const user = session?.user as { is_subscribed?: boolean; is_admin?: boolean } | undefined;
    const isSubscribed = user?.is_subscribed === true;
    const isAdmin = user?.is_admin === true;
    const hasAccess = isSubscribed || isAdmin;

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/");
            return;
        }
        if (status === "authenticated" && !hasAccess) {
            router.replace("/subscribe");
        }
    }, [status, hasAccess, router]);

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

    // Hide the dashboard while the paywall redirect is in flight — prevents
    // a flash of /app content before the router navigates to /subscribe.
    if (!session || !hasAccess) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#F8FAF9]">
                <div className="w-8 h-8 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <Web3Provider>
            <DashboardEmbed />
        </Web3Provider>
    );
}
