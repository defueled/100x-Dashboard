"use client";

import { motion, useTransform, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Zap, Trophy, Flame, LayoutDashboard } from "lucide-react";

// Lightweight fake dashboard preview — renders fast, no heavy bundle
function DashboardPreview() {
    return (
        <div className="w-full h-full bg-[#F8FAF9] flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 shrink-0 bg-white border-r border-gray-100 p-5 flex flex-col gap-3">
                <div className="h-8 w-28 bg-gray-100 rounded-xl mb-4" />
                {[80, 60, 72, 55, 68].map((w, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gray-100" />
                        <div className={`h-3 bg-gray-100 rounded-full`} style={{ width: `${w}%` }} />
                    </div>
                ))}
            </div>
            {/* Main content */}
            <div className="flex-1 p-8 overflow-hidden">
                <div className="h-8 w-48 bg-gray-200 rounded-xl mb-6" />
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="col-span-2 h-48 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[2rem] opacity-80" />
                    <div className="h-48 bg-white rounded-[2rem] border border-gray-100 flex items-center justify-center">
                        <Trophy className="text-amber-400" size={36} />
                    </div>
                    <div className="h-48 bg-white rounded-[2rem] border border-gray-100 flex items-center justify-center">
                        <Zap className="text-indigo-400" size={36} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 bg-white rounded-[2rem] border border-gray-100 p-5">
                        <div className="h-3 w-24 bg-gray-100 rounded-full mb-3" />
                        <div className="h-3 w-32 bg-gray-100 rounded-full mb-2" />
                        <div className="h-3 w-20 bg-gray-100 rounded-full" />
                    </div>
                    <div className="h-32 bg-gray-900 rounded-[2rem] flex items-center justify-center">
                        <Flame className="text-emerald-400" size={32} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Magic Looking Glass Overlay ---
function LookingGlassSection({ sectionRef, children }: { sectionRef: React.RefObject<HTMLElement | null>; children: React.ReactNode }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothX = useSpring(mouseX, { stiffness: 500, damping: 40 });
    const smoothY = useSpring(mouseY, { stiffness: 500, damping: 40 });
    const holeSize = useSpring(0, { stiffness: 300, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    const maskImage = useMotionTemplate`radial-gradient(circle ${holeSize}px at ${mouseX}px ${mouseY}px, transparent 0%, black 100%)`;

    return (
        <section
            ref={sectionRef}
            className="h-screen w-full relative bg-[#f8fafc] flex items-center justify-center overflow-hidden cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => holeSize.set(180)}
            onMouseLeave={() => holeSize.set(0)}
        >
            {/* Blurred dashboard preview underneath — bumped opacity so it
                peeks through the glass mask even before the user hovers. */}
            <div className="absolute inset-0 p-4 md:p-8 pointer-events-none select-none opacity-70 grayscale-[0.15]">
                <div className="w-full h-full border-2 border-brand-green/20 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <DashboardPreview />
                </div>
            </div>

            {/* Glassmorphism mask — translucent enough that the dashboard
                shape is visible at rest, fully transparent under the hole. */}
            <motion.div
                className="absolute inset-0 bg-white/45 backdrop-blur-md z-10 pointer-events-none"
                style={{ WebkitMaskImage: maskImage, maskImage }}
            />

            {/* The physical looking glass with green hue */}
            <motion.div
                className="absolute pointer-events-none z-30 rounded-full border-2 border-white shadow-[inset_0_0_40px_rgba(255,255,255,0.9),0_10px_50px_rgba(0,0,0,0.15)] flex items-center justify-center overflow-hidden"
                style={{
                    width: useTransform(holeSize, (s) => s * 2),
                    height: useTransform(holeSize, (s) => s * 2),
                    left: smoothX,
                    top: smoothY,
                    x: "-50%",
                    y: "-50%",
                    opacity: useTransform(holeSize, (s) => s > 10 ? 1 : 0),
                }}
            >
                <div className="w-full h-full rounded-full border border-white/30 absolute scale-[1.05]" />
                <div className="absolute inset-0 bg-brand-green/10 mix-blend-color-dodge rounded-full blur-[20px]" />
            </motion.div>

            {/* CTA panel */}
            <div className="relative z-40 flex flex-col items-center justify-center p-10 text-center bg-white/60 backdrop-blur-md rounded-3xl border border-white/80 shadow-2xl max-w-lg mx-4">
                {children}
            </div>
        </section>
    );
}

export function DashboardSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const router = useRouter();
    const { data: session, status } = useSession();

    // Show login button immediately — no 3s wait
    if (status === "loading" || !session) {
        return (
            <LookingGlassSection sectionRef={sectionRef}>
                <div className="w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center mb-6">
                    <Lock className="w-10 h-10 text-brand-blue" />
                </div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-green mb-4">
                    Dashboard Piekļuve
                </h2>
                <p className="text-gray-600 font-medium mb-8">
                    Pievieno savu Google kontu, lai piekļūtu 100x Komūnas dashboardam.
                </p>
                <button
                    onClick={() => signIn("google", { callbackUrl: "/app" })}
                    className="flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-black hover:bg-black/80 rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,0,0,0.1)]"
                >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 bg-white p-0.5 rounded-full" />
                    Ieiet ar Google
                </button>
            </LookingGlassSection>
        );
    }

    // Logged in — show dashboard CTA
    return (
        <LookingGlassSection sectionRef={sectionRef}>
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 shadow-xl rounded-3xl flex items-center justify-center mb-6">
                <LayoutDashboard className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Tavs Dashboard
            </h2>
            <p className="text-gray-500 font-medium mb-8">
                Visi tavi XP, Mintiņš un komūnas dati — vienā vietā.
            </p>
            <button
                onClick={() => router.push("/app")}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-full hover:scale-105 transition-transform shadow-lg shadow-emerald-200 text-lg"
            >
                Atvērt Dashboard →
            </button>
        </LookingGlassSection>
    );
}
