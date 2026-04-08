"use client";

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
        }
        // @ts-ignore
        if (status === "authenticated" && !session?.user?.is_subscribed) {
            router.replace("/");
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

    // @ts-ignore
    if (!session || !session?.user?.is_subscribed) return null;

    return (
        <Web3Provider>
            <DashboardEmbed />
        </Web3Provider>
    );
}
