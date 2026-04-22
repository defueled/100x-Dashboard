"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Script from "next/script";
import { Sparkles, Lock } from "lucide-react";

export const dynamic = "force-dynamic";

export default function SubscribePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/");
            return;
        }
        // If they're already a subscriber, skip the paywall.
        if (status === "authenticated" && (session?.user as any)?.is_subscribed === true) {
            router.replace("/app");
        }
    }, [status, session, router]);

    if (status === "loading") {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#F8FAF9]">
                <div className="w-8 h-8 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAF9] px-4 py-10 md:py-16">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 md:mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold mb-4">
                        <Lock size={12} />
                        Piekļuve tikai Abonementa dalībniekiem
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
                        <span className="text-brand-dark">Sveiks, </span>
                        <span className="text-gradient-premium">{session?.user?.name?.split(" ")[0] || "Biedri"}!</span>
                    </h1>
                    <p className="text-brand-dark/60 text-base md:text-lg max-w-md mx-auto">
                        Lai ienāktu 100x komūnā, izvēlies savu atbalstu. Pēc apmaksas dashboard atveras automātiski.
                    </p>
                </div>

                {/* Value props */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                    {[
                        { icon: Sparkles, text: "Pilna AI/DeFi/TradFi/Kultūras piekļuve" },
                        { icon: Sparkles, text: "Mintiņš airdrop reizinātājs" },
                        { icon: Sparkles, text: "Ikdienas GM + XP gamifikācija" },
                    ].map((v, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
                            <v.icon size={16} className="text-emerald-500 shrink-0" />
                            <span className="text-xs font-bold text-gray-700">{v.text}</span>
                        </div>
                    ))}
                </div>

                {/* Embedded GHL checkout form */}
                <div className="rounded-[2rem] overflow-hidden shadow-premium bg-white">
                    <iframe
                        src="https://updates.maverick.lv/widget/form/o29v27nzeMeAkOqO8Pwj"
                        style={{ width: "100%", height: "1054px", border: "none" }}
                        id="inline-o29v27nzeMeAkOqO8Pwj"
                        title="100x pievienoties"
                    />
                    <Script src="https://updates.maverick.lv/js/form_embed.js" strategy="afterInteractive" />
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline"
                    >
                        Iziet no konta
                    </button>
                </div>
            </div>
        </div>
    );
}
