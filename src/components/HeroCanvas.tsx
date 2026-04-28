"use client";

import { useRef } from "react";
import { useScroll, useSpring, useTransform, motion, type MotionValue } from "framer-motion";
import { useT } from "@/i18n/LangProvider";

/* ────────────────────────────────────────────────────────────
   COSMOS-STYLE ORBITAL LOGO HERO

   Center: 100x logo (full color) + brand tagline
   4 concentric orbital rings (AI / TradFi / DeFi / Tech)
   Inner ring = smallest logos, outer = biggest
   Scroll-driven rotation + random color pulse + hover tooltips
──────────────────────────────────────────────────────────── */

const ORBITAL_RINGS = [
    {
        label: "AI",
        direction: "cw" as const,
        rotateRange: 400,
        radius: 155,
        logoSize: 22,
        logos: [
            { src: "/assets/logos/anthropic.svg", alt: "Anthropic" },
            { src: "/assets/logos/openai.png", alt: "OpenAI" },
            { src: "/assets/logos/xai.svg", alt: "xAI" },
            { src: "/assets/logos/google.svg", alt: "Google" },
            { src: "/assets/logos/meta.svg", alt: "Meta" },
            { src: "/assets/logos/nvidia.svg", alt: "Nvidia" },
            { src: "/assets/logos/microsoft.png", alt: "Microsoft" },
            { src: "/assets/logos/ibm.png", alt: "IBM" },
            { src: "/assets/logos/figma.svg", alt: "Figma" },
            { src: "/assets/logos/github.svg", alt: "GitHub" },
            { src: "/assets/logos/notion.svg", alt: "Notion" },
        ],
    },
    {
        label: "TradFi",
        direction: "ccw" as const,
        rotateRange: 300,
        radius: 255,
        logoSize: 26,
        logos: [
            { src: "/assets/logos/blackrock.png", alt: "BlackRock" },
            { src: "/assets/logos/jpmorganchase.png", alt: "JPMorgan" },
            { src: "/assets/logos/goldmansachs.png", alt: "Goldman Sachs" },
            { src: "/assets/logos/fidelity.png", alt: "Fidelity" },
            { src: "/assets/logos/vanguard.png", alt: "Vanguard" },
            { src: "/assets/logos/visa.svg", alt: "Visa" },
            { src: "/assets/logos/mastercard.svg", alt: "Mastercard" },
            { src: "/assets/logos/americanexpress.svg", alt: "Amex" },
            { src: "/assets/logos/paypal.svg", alt: "PayPal" },
            { src: "/assets/logos/revolut.svg", alt: "Revolut" },
            { src: "/assets/logos/stripe.svg", alt: "Stripe" },
            { src: "/assets/logos/wise.svg", alt: "Wise" },
            { src: "/assets/logos/robinhood.png", alt: "Robinhood" },
        ],
    },
    {
        label: "DeFi",
        direction: "cw" as const,
        rotateRange: 350,
        radius: 355,
        logoSize: 28,
        logos: [
            { src: "/assets/logos/bitcoin.png", alt: "Bitcoin" },
            { src: "/assets/logos/ethereum.png", alt: "Ethereum" },
            { src: "/assets/logos/solana.png", alt: "Solana" },
            { src: "/assets/logos/coinbase.svg", alt: "Coinbase" },
            { src: "/assets/logos/metamask.png", alt: "MetaMask" },
            { src: "/assets/logos/binance.png", alt: "Binance" },
            { src: "/assets/logos/kraken.png", alt: "Kraken" },
            { src: "/assets/logos/link.png", alt: "Chainlink" },
            { src: "/assets/logos/uni.png", alt: "Uniswap" },
            { src: "/assets/logos/avax.png", alt: "Avalanche" },
            { src: "/assets/logos/xrp.png", alt: "XRP" },
            { src: "/assets/logos/dot.png", alt: "Polkadot" },
            { src: "/assets/logos/matic.png", alt: "Polygon" },
            { src: "/assets/logos/ada.png", alt: "Cardano" },
        ],
    },
    {
        label: "Tech",
        direction: "ccw" as const,
        rotateRange: 260,
        radius: 460,
        logoSize: 32,
        logos: [
            { src: "/assets/logos/tesla.svg", alt: "Tesla" },
            { src: "/assets/logos/apple.svg", alt: "Apple" },
            { src: "/assets/logos/spacex.svg", alt: "SpaceX" },
            { src: "/assets/logos/netflix.svg", alt: "Netflix" },
            { src: "/assets/logos/spotify.svg", alt: "Spotify" },
            { src: "/assets/logos/discord.svg", alt: "Discord" },
            { src: "/assets/logos/telegram.svg", alt: "Telegram" },
            { src: "/assets/logos/uber.svg", alt: "Uber" },
            { src: "/assets/logos/samsung.svg", alt: "Samsung" },
            { src: "/assets/logos/shopify.svg", alt: "Shopify" },
            { src: "/assets/logos/amazon.png", alt: "Amazon" },
            { src: "/assets/logos/adobe.png", alt: "Adobe" },
            { src: "/assets/logos/x.png", alt: "X" },
            { src: "/assets/logos/instagram.svg", alt: "Instagram" },
            { src: "/assets/logos/youtube.svg", alt: "YouTube" },
        ],
    },
];

export function HeroCanvas() {
    const containerRef = useRef<HTMLDivElement>(null);
    const t = useT();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const springScroll = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 30,
        restDelta: 0.001,
    });

    // Brand beat
    const brandOpacity = useTransform(springScroll, [0, 0.12, 0.22], [1, 1, 0]);
    const brandY = useTransform(springScroll, [0, 0.22], [0, -50]);
    const brandScale = useTransform(springScroll, [0, 0.22], [1, 0.95]);
    const brandBlur = useTransform(springScroll, [0.12, 0.22], [0, 12]);

    // Logo orbits
    const orbitsOpacity = useTransform(springScroll, [0.1, 0.22], [0, 1]);
    const orbitsScale = useTransform(springScroll, [0.1, 0.25], [0.88, 1]);

    // Wire rings
    const wireRingOpacity = useTransform(springScroll, [0, 0.15, 0.3], [0.6, 0.3, 0.08]);
    const wireRingScale = useTransform(springScroll, [0, 0.3], [1, 0.55]);

    // Center logo — phase 1 sits above the heading so it's not buried,
    // slides to true center by phase 2 when the brand text has faded out.
    const centerLogoScale = useTransform(springScroll, [0, 0.25], [1, 0.7]);
    const centerLogoOpacity = useTransform(springScroll, [0, 0.15, 0.25], [1, 1, 0.9]);
    const centerLogoY = useTransform(springScroll, [0, 0.18], [-280, 0]);

    // Indicators
    const indicatorOpacity = useTransform(springScroll, [0, 0.08], [1, 0]);
    const progressWidth = useTransform(springScroll, [0, 1], ["0%", "100%"]);

    return (
        <div ref={containerRef} className="relative w-full h-[300vh] bg-[var(--color-background)]">
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-[var(--color-background)]">

                {/* Wire orbital rings */}
                <motion.div
                    className="absolute inset-0 pointer-events-none flex items-center justify-center"
                    style={{ scale: wireRingScale, opacity: wireRingOpacity }}
                >
                    <WireRings />
                </motion.div>

                {/* 100x logo — FULL COLOR. Sits above the heading on load,
                    slides to center as the brand text fades out (phase 2). */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
                    style={{ scale: centerLogoScale, opacity: centerLogoOpacity, y: centerLogoY }}
                >
                    <img src="/assets/logos/100x-refined-logo.png" alt="100x" className="w-20 md:w-24 h-auto drop-shadow-md" />
                </motion.div>

                {/* Brand beat */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                    style={{
                        opacity: brandOpacity,
                        y: brandY,
                        scale: brandScale,
                        filter: useTransform(brandBlur, (v) => `blur(${v}px)`),
                    }}
                >
                    <div className="flex flex-col items-center text-center px-6 max-w-3xl">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] border border-brand-green/30 bg-brand-green/10 text-brand-dark mb-6">
                            {t("hero.tagline")}
                        </span>
                        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-brand-dark leading-[1.1] mb-6">
                            {t("hero.title.line1")} {t("hero.title.line2")}{"\n"}{t("hero.title.line3")}
                        </h2>
                        <p className="text-lg md:text-xl font-medium text-brand-dark/60 max-w-xl leading-relaxed">
                            {t("hero.subtitle")}
                        </p>
                    </div>
                </motion.div>

                {/* Orbital logo rings */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center z-[15] scale-[0.52] sm:scale-[0.65] md:scale-[0.8] lg:scale-100"
                    style={{ opacity: orbitsOpacity, scale: orbitsScale }}
                >
                    {ORBITAL_RINGS.map((ring, i) => (
                        <OrbitalLogoRing
                            key={ring.label}
                            ring={ring}
                            ringIndex={i}
                            scrollProgress={springScroll}
                        />
                    ))}
                </motion.div>

                {/* Radial vignette */}
                <div
                    className="absolute inset-0 pointer-events-none z-[16]"
                    style={{
                        background: "radial-gradient(ellipse 65% 65% at 50% 50%, transparent 45%, var(--color-background) 100%)",
                    }}
                />

                {/* Scroll indicators */}
                <motion.div
                    style={{ opacity: useTransform(springScroll, [0, 0.06], [0.6, 0]) }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center z-30"
                >
                    <div className="w-[1.5px] h-10 bg-gradient-to-t from-brand-green via-brand-green/50 to-transparent" />
                    <span className="text-[9px] uppercase tracking-[0.4em] text-brand-green/70 font-bold mt-2">{t("hero.scroll.up")}</span>
                </motion.div>

                <motion.div
                    style={{ opacity: indicatorOpacity }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center z-30"
                >
                    <span className="text-[9px] uppercase tracking-[0.4em] text-brand-green/70 font-bold mb-4">{t("hero.scroll.down")}</span>
                    <div className="w-[1.5px] h-16 bg-gradient-to-b from-brand-green via-brand-green/50 to-transparent" />
                </motion.div>

                <motion.div
                    className="absolute top-0 left-0 h-[2px] bg-brand-green/40 z-30"
                    style={{ width: progressWidth }}
                />
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   Orbital Logo Ring — logos orbit around center on scroll
   + random color pulse + hover tooltip
═══════════════════════════════════════════════════════════ */
function OrbitalLogoRing({
    ring,
    ringIndex,
    scrollProgress,
}: {
    ring: (typeof ORBITAL_RINGS)[number];
    ringIndex: number;
    scrollProgress: MotionValue<number>;
}) {
    const ringRotation = useTransform(
        scrollProgress,
        [0.12, 1],
        ring.direction === "cw" ? [0, ring.rotateRange] : [0, -ring.rotateRange]
    );

    const counterRotation = useTransform(ringRotation, (v) => -v);

    const staggerStart = 0.12 + ringIndex * 0.04;
    const ringOpacity = useTransform(scrollProgress, [staggerStart, staggerStart + 0.08], [0, 1]);

    const count = ring.logos.length;
    const r = ring.radius;
    const halfLogo = ring.logoSize / 2;

    return (
        <motion.div
            className="absolute"
            style={{
                width: 0,
                height: 0,
                opacity: ringOpacity,
                rotate: ringRotation,
            }}
        >
            {ring.logos.map((logo, i) => {
                const angleDeg = (360 / count) * i;
                const angleRad = (angleDeg * Math.PI) / 180;
                const x = Math.cos(angleRad) * r - halfLogo;
                const y = Math.sin(angleRad) * r - halfLogo;

                // Deterministic pseudo-random pulse timing per logo
                const pulseDuration = 6 + ((i * 7 + ringIndex * 11) % 9);
                const pulseDelay = ((i * 5 + ringIndex * 13) % 17) * 0.6;

                return (
                    <motion.div
                        key={logo.alt}
                        className="absolute group"
                        style={{
                            left: x,
                            top: y,
                            width: ring.logoSize,
                            height: ring.logoSize,
                            rotate: counterRotation,
                        }}
                    >
                        <img
                            src={logo.src}
                            alt={logo.alt}
                            className="w-full h-full object-contain animate-logo-pulse hover:!opacity-90 hover:!grayscale-0 hover:!scale-125 transition-transform duration-200"
                            style={{
                                animationDuration: `${pulseDuration}s`,
                                animationDelay: `${pulseDelay}s`,
                            }}
                            loading="lazy"
                            draggable={false}
                        />
                        {/* Hover tooltip */}
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-bold text-brand-dark/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none select-none">
                            {logo.alt}
                        </span>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════════
   Wire Rings — decorative 3D orbital wires
═══════════════════════════════════════════════════════════ */
function WireRings() {
    return (
        <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
        >
            <motion.div
                animate={{ rotateX: 65, rotateZ: [0, 360] }}
                transition={{ rotateZ: { duration: 25, repeat: Infinity, ease: "linear" }, rotateX: { duration: 0 } }}
                className="absolute w-[320px] md:w-[420px] h-[320px] md:h-[420px] rounded-full"
                style={{ transformStyle: "preserve-3d", border: "2px solid rgba(89,182,135,0.2)", boxShadow: "0 0 15px rgba(89,182,135,0.06)" }}
            />
            <motion.div
                animate={{ rotateX: 70, rotateY: 10, rotateZ: [0, -360] }}
                transition={{ rotateZ: { duration: 35, repeat: Infinity, ease: "linear" }, rotateX: { duration: 0 }, rotateY: { duration: 0 } }}
                className="absolute w-[420px] md:w-[550px] h-[420px] md:h-[550px] rounded-full"
                style={{ transformStyle: "preserve-3d", borderTop: "1.5px solid rgba(89,182,135,0.15)", borderBottom: "1px solid rgba(89,182,135,0.05)", borderLeft: "1px solid rgba(89,182,135,0.02)", borderRight: "1px solid rgba(89,182,135,0.02)" }}
            />
            <motion.div
                animate={{ rotateX: 72, rotateY: -5, rotateZ: [0, 360] }}
                transition={{ rotateZ: { duration: 50, repeat: Infinity, ease: "linear" }, rotateX: { duration: 0 }, rotateY: { duration: 0 } }}
                className="absolute w-[540px] md:w-[700px] h-[540px] md:h-[700px] rounded-full"
                style={{ transformStyle: "preserve-3d", border: "1px solid rgba(89,182,135,0.06)" }}
            />
            <motion.div
                animate={{ rotateX: 68, scale: [1, 1.06, 1], opacity: [0.08, 0.2, 0.08] }}
                transition={{ scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }, rotateX: { duration: 0 } }}
                className="absolute w-[260px] md:w-[350px] h-[260px] md:h-[350px] rounded-full"
                style={{ border: "1.5px solid rgba(89,182,135,0.15)", boxShadow: "0 0 25px rgba(89,182,135,0.08)" }}
            />
        </div>
    );
}
