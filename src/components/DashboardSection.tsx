"use client";

import { DashboardEmbed } from "./DashboardEmbed";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { Lock } from "lucide-react";

// --- Custom Wrapper for the Magic Looking Glass Overlay ---
function LockedDashboardLayout({ children, sectionRef }: { children: React.ReactNode, sectionRef: React.RefObject<HTMLElement | null> }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothX = useSpring(mouseX, { stiffness: 500, damping: 40 });
    const smoothY = useSpring(mouseY, { stiffness: 500, damping: 40 });

    // Animate the hole size so it smoothly opens and closes
    const holeSize = useSpring(0, { stiffness: 300, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    const handleMouseEnter = () => holeSize.set(180);
    const handleMouseLeave = () => holeSize.set(0);

    // Creates a transparent hole where the mouse is, surrounded by black (which preserves the backdrop-blur)
    const maskImage = useMotionTemplate`radial-gradient(circle ${holeSize}px at ${mouseX}px ${mouseY}px, transparent 0%, black 100%)`;

    return (
        <section
            ref={sectionRef}
            className="h-screen w-full relative bg-[#f8fafc] flex items-center justify-center overflow-hidden cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* 1. Underlying Fake Dashboard - Faded but present */}
            <div className="absolute inset-0 p-4 md:p-8 pointer-events-none select-none opacity-40 grayscale-[0.3]">
                <div className="w-full h-full border-2 border-brand-green/20 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <DashboardEmbed />
                </div>
            </div>

            {/* 2. dynamic glassmorphism overlay masking */}
            <motion.div
                className="absolute inset-0 bg-white/70 backdrop-blur-xl z-10 pointer-events-none"
                style={{
                    WebkitMaskImage: maskImage,
                    maskImage: maskImage
                }}
            />

            {/* 3. The Physical "Looking Glass" Element with Green Hue */}
            <motion.div
                className="absolute pointer-events-none z-30 rounded-full border-2 border-white shadow-[inset_0_0_40px_rgba(255,255,255,0.9),0_10px_50px_rgba(0,0,0,0.15)] flex items-center justify-center overflow-hidden"
                style={{
                    width: useTransform(holeSize, (s) => s * 2),
                    height: useTransform(holeSize, (s) => s * 2),
                    left: smoothX,
                    top: smoothY,
                    x: "-50%",
                    y: "-50%",
                    opacity: useTransform(holeSize, (s) => s > 10 ? 1 : 0)
                }}
            >
                {/* Outer Glass Ring */}
                <div className="w-full h-full rounded-full border border-white/30 absolute scale-[1.05]" />

                {/* Soft Brand Green Exposure Hue - sits cleanly inside the glass ring */}
                <div className="absolute inset-0 bg-brand-green/10 mix-blend-color-dodge rounded-full blur-[20px]" />
            </motion.div>

            {/* 4. The Locked UI Panel */}
            <div className="relative z-40 flex flex-col items-center justify-center p-10 text-center bg-white/60 backdrop-blur-md rounded-3xl border border-white/80 shadow-2xl max-w-lg mx-4">
                {children}
            </div>
        </section>
    );
}

export function DashboardSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const { data: session, status } = useSession();
    const [isTimedOut, setIsTimedOut] = useState(false);

    // Safety timeout for the loading state to prevent hanging
    useEffect(() => {
        if (status === "loading") {
            const timer = setTimeout(() => {
                setIsTimedOut(true);
            }, 3000); // 3 seconds timeout
            return () => clearTimeout(timer);
        }
    }, [status]);

    // Loading Auth State (with timeout safety)
    if (status === "loading" && !isTimedOut) {
        return (
            <section ref={sectionRef} className="h-screen w-full relative bg-[#f8fafc] z-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 rounded-full border-4 border-brand-green/20 border-t-brand-green animate-spin" />
                    <p className="text-xs font-medium text-muted">Checking access...</p>
                </div>
            </section>
        );
    }

    // Not Logged In
    if (!session) {
        return (
            <LockedDashboardLayout sectionRef={sectionRef}>
                <div className="w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center mb-6">
                    <Lock className="w-10 h-10 text-brand-blue" />
                </div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-green mb-4">
                    Dashboard Piekļuve Slēgta
                </h2>
                <p className="text-gray-600 font-medium mb-8">
                    Lūdzu, autorizējieties ar savu Google kontu, lai piekļūtu 100x Komūnas dashboardam un izpētītu platformu.
                </p>
                <button
                    onClick={() => signIn("google")}
                    className="flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-black hover:bg-black/80 rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_30px_rgba(0,0,0,0.2)]"
                >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 bg-white p-0.5 rounded-full" />
                    Sign in with Google
                </button>
            </LockedDashboardLayout>
        );
    }

    // @ts-ignore - is_subscribed is injected from our custom next-auth callback
    const isSubscribed = session?.user?.is_subscribed;

    // Logged In, but No Subscription
    if (!isSubscribed) {
        return (
            <LockedDashboardLayout sectionRef={sectionRef}>
                <div className="w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center mb-6 border-2 border-red-500/20">
                    <Lock className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Nav Aktīva Abonementa
                </h2>
                <p className="text-gray-600 font-medium mb-8">
                    Hmm... izskatās, ka šim epastam <strong className="text-brand-dark">({session.user?.email || "Nezināms epasts"})</strong> vēl nav piesaistīts aktīvs 100x Komūnas abonements.
                </p>
                <button className="px-8 py-4 bg-gradient-to-r from-brand-blue to-brand-green text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-brand-green/20">
                    Iegādāties Abonementu
                </button>
            </LockedDashboardLayout>
        );
    }

    // Logged In & Subscribed (Dashboard unlocked)
    return (
        <section ref={sectionRef} className="h-screen w-full relative bg-[#f8fafc] z-50">
            <motion.div
                style={{ scale, opacity }}
                className="w-full h-full p-4 md:p-8"
            >
                <div className="w-full h-full border-2 border-brand-green/20 rounded-[2.5rem] overflow-hidden shadow-2vw shadow-brand-green/5">
                    <DashboardEmbed />
                </div>
            </motion.div>
        </section>
    );
}
