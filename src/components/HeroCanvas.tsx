"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useSpring, useTransform, motion } from "framer-motion";

export function HeroCanvas() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const FRAME_COUNT = 120;

    // Preload images
    useEffect(() => {
        let loadedCount = 0;
        const loadedImages: HTMLImageElement[] = [];

        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            img.src = `/sequence/${String(i).padStart(4, "0")}.jpg`;
            img.onload = () => {
                loadedCount++;
                setLoadingProgress((loadedCount / FRAME_COUNT) * 100);
                if (loadedCount === FRAME_COUNT) {
                    setIsLoaded(true);
                }
            };
            loadedImages.push(img);
        }

        setImages(loadedImages);
    }, []);

    // Framer Motion Scroll
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const springScroll = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    // Main canvas drawing logic
    useEffect(() => {
        if (!isLoaded || images.length !== FRAME_COUNT) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Handle high DPI displays for sharp rendering
        const dpr = window.devicePixelRatio || 1;
        // Set fixed logical size for 16:9
        const logicalWidth = 1920;
        const logicalHeight = 1080;

        // Scale canvas backing store
        canvas.width = logicalWidth * dpr;
        canvas.height = logicalHeight * dpr;

        // We rely on CSS for the layout size (w-full h-full object-cover/contain)
        ctx.scale(dpr, dpr);

        let animationFrameId: number;

        const render = () => {
            const progress = springScroll.get();
            const frameIndex = Math.min(
                FRAME_COUNT - 1,
                Math.max(0, Math.floor(progress * FRAME_COUNT))
            );

            const img = images[frameIndex];

            if (img && img.complete) {
                ctx.clearRect(0, 0, logicalWidth, logicalHeight);

                // Draw image scaled to fit
                const hRatio = logicalWidth / img.width;
                const vRatio = logicalHeight / img.height;
                const ratio = Math.min(hRatio, vRatio); // contain equivalent
                // const ratio = Math.max(hRatio, vRatio); // cover equivalent

                const centerShift_x = (logicalWidth - img.width * ratio) / 2;
                const centerShift_y = (logicalHeight - img.height * ratio) / 2;

                // Pure white/light background matching requirements
                ctx.fillStyle = '#F8FAF9';
                ctx.fillRect(0, 0, logicalWidth, logicalHeight);

                ctx.drawImage(
                    img,
                    0, 0, img.width, img.height,
                    centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
                );
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [springScroll, images, isLoaded]);

    // Overlay Opacities derived from scroll progress
    // Beat A: 0 - 20%
    const opacityBeatA = useTransform(springScroll, [0, 0.15, 0.20], [1, 1, 0]);
    // Beat B: 25 - 45%
    const opacityBeatB = useTransform(springScroll, [0.2, 0.25, 0.4, 0.45], [0, 1, 1, 0]);
    // Beat C: 50 - 70%
    const opacityBeatC = useTransform(springScroll, [0.45, 0.5, 0.65, 0.7], [0, 1, 1, 0]);
    // Beat D: 75% onwards
    const opacityBeatD = useTransform(springScroll, [0.7, 0.75, 1], [0, 1, 1]);

    // Scroll indicator fade
    const opacityIndicator = useTransform(springScroll, [0, 0.1], [1, 0]);

    return (
        <div ref={containerRef} className="relative w-full h-[400vh] bg-[var(--color-background)]">
            {/* Loading Block */}
            {!isLoaded && (
                <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center bg-[var(--color-background)] z-50 text-brand-dark font-sans">
                    <div className="w-64 h-1 bg-brand-dark/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-brand-blue transition-all duration-300 ease-out"
                            style={{ width: `${loadingProgress}%` }}
                        />
                    </div>
                    <p className="mt-4 text-xs tracking-widest uppercase text-brand-dark/50">Ielādē portālu {Math.round(loadingProgress)}%</p>
                </div>
            )}

            {/* Sticky Canvas Container */}
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-[var(--color-background)]">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-contain"
                />

                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-8">
                    {/* Saturn-style Elliptical Orbital Rings */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center" style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
                        {/* Ring 1: Inner tight orbit — tilted 65° like Saturn's main ring */}
                        <motion.div
                            animate={{ rotateX: 65, rotateZ: [0, 360] }}
                            transition={{ rotateZ: { duration: 25, repeat: Infinity, ease: "linear" }, rotateX: { duration: 0 } }}
                            className="absolute w-[420px] h-[420px] rounded-full"
                            style={{
                                transformStyle: 'preserve-3d',
                                border: '2px solid rgba(89, 182, 135, 0.35)',
                                boxShadow: '0 0 20px rgba(89, 182, 135, 0.1)',
                            }}
                        />
                        {/* Ring 2: Medium orbit — tilted 70°, counter-rotate */}
                        <motion.div
                            animate={{ rotateX: 70, rotateY: 10, rotateZ: [0, -360] }}
                            transition={{ rotateZ: { duration: 35, repeat: Infinity, ease: "linear" }, rotateX: { duration: 0 }, rotateY: { duration: 0 } }}
                            className="absolute w-[550px] h-[550px] rounded-full"
                            style={{
                                transformStyle: 'preserve-3d',
                                borderTop: '2px solid rgba(89, 182, 135, 0.25)',
                                borderBottom: '1px solid rgba(89, 182, 135, 0.1)',
                                borderLeft: '1px solid rgba(89, 182, 135, 0.05)',
                                borderRight: '1px solid rgba(89, 182, 135, 0.05)',
                            }}
                        />
                        {/* Ring 3: Wide outer orbit — slightly different tilt */}
                        <motion.div
                            animate={{ rotateX: 72, rotateY: -5, rotateZ: [0, 360] }}
                            transition={{ rotateZ: { duration: 50, repeat: Infinity, ease: "linear" }, rotateX: { duration: 0 }, rotateY: { duration: 0 } }}
                            className="absolute w-[700px] h-[700px] rounded-full"
                            style={{
                                transformStyle: 'preserve-3d',
                                border: '1px solid rgba(89, 182, 135, 0.12)',
                                boxShadow: '0 0 30px rgba(89, 182, 135, 0.05)',
                            }}
                        />
                        {/* Ring 4: Inclined cross-orbit — tilted at a different plane for depth */}
                        <motion.div
                            animate={{ rotateX: 55, rotateY: 25, rotateZ: [0, -360] }}
                            transition={{ rotateZ: { duration: 40, repeat: Infinity, ease: "linear" }, rotateX: { duration: 0 }, rotateY: { duration: 0 } }}
                            className="absolute w-[500px] h-[500px] rounded-full"
                            style={{
                                transformStyle: 'preserve-3d',
                                borderTop: '1.5px solid rgba(89, 182, 135, 0.2)',
                                borderBottom: '1px solid rgba(89, 182, 135, 0.08)',
                                borderLeft: 'none',
                                borderRight: 'none',
                            }}
                        />
                        {/* Ring 5: Pulsing glow ring — breathing effect on tight orbit */}
                        <motion.div
                            animate={{ rotateX: 68, scale: [1, 1.08, 1], opacity: [0.15, 0.35, 0.15] }}
                            transition={{ scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }, rotateX: { duration: 0 } }}
                            className="absolute w-[350px] h-[350px] rounded-full"
                            style={{
                                border: '1.5px solid rgba(89, 182, 135, 0.3)',
                                boxShadow: '0 0 40px rgba(89, 182, 135, 0.15), inset 0 0 40px rgba(89, 182, 135, 0.05)',
                            }}
                        />
                        {/* Ring 6: Very wide faint outer halo */}
                        <motion.div
                            animate={{ rotateX: 75, rotateZ: [0, 360], opacity: [0.05, 0.12, 0.05] }}
                            transition={{ rotateZ: { duration: 60, repeat: Infinity, ease: "linear" }, opacity: { duration: 8, repeat: Infinity, ease: "easeInOut" }, rotateX: { duration: 0 } }}
                            className="absolute w-[850px] h-[850px] rounded-full"
                            style={{
                                transformStyle: 'preserve-3d',
                                border: '1px solid rgba(89, 182, 135, 0.06)',
                            }}
                        />
                    </div>
                </div>

                {/* Scroll Indicators */}
                <motion.div
                    style={{ opacity: useTransform(springScroll, [0, 0.1], [0.6, 0]) }}
                    className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center"
                >
                    <div className="w-[1.5px] h-16 bg-gradient-to-t from-brand-green via-brand-green/50 to-transparent" />
                    <span className="text-[9px] uppercase tracking-[0.4em] text-brand-green/70 font-bold mt-4">Ritināt</span>
                </motion.div>

                <motion.div
                    style={{ opacity: opacityIndicator }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center"
                >
                    <span className="text-[9px] uppercase tracking-[0.4em] text-brand-green/70 font-bold mb-4">Atklāt</span>
                    <div className="w-[1.5px] h-16 bg-gradient-to-b from-brand-green via-brand-green/50 to-transparent" />
                </motion.div>

                {/* Flying Keywords Sequence */}
                <FlyingKeywords scrollProgress={springScroll} />
            </div>
        </div>
    );
}

// Sub-component to handle the complex keyword timing
function FlyingKeywords({ scrollProgress }: { scrollProgress: any }) {
    const keywords = [
        "MĀKSLĪGAIS INTELEKTS",
        "AĢENTI",
        "WEB3",
        "KRIPTO",
        "INVESTĪCIJAS",
        "BLOKĶĒDES",
        "TRADFI",
        "NEOBANKAS"
    ];

    // Total scroll space to divide among words. We want them to happen between 0.1 and 0.9 of scroll progress
    const startScroll = 0.1;
    const endScroll = 0.9;
    const step = (endScroll - startScroll) / keywords.length;

    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-20">
            {keywords.map((word, index) => {
                // Word's specific active window
                const wordStart = startScroll + (index * step);
                const wordHoldStart = wordStart + (step * 0.15); // Fly in takes 15% of its time slot
                const wordHoldEnd = wordStart + (step * 0.75);   // Hold for 60% of time slot
                const wordEnd = wordStart + step;                // Fly out takes last 25%

                // 1. Z-axis translation (Scale equivalent via translateZ for depth)
                // Starts way behind screen (-2000px), stops at nice readable size (0px), then flies way past screen (+1500px)
                const z = useTransform(
                    scrollProgress,
                    [wordStart, wordHoldStart, wordHoldEnd, wordEnd],
                    [-4000, 0, 0, 3000]
                );

                // 2. Opacity
                // Fades in quickly, stays full opacity while holding, fades out rapidly as it flies past
                const opacity = useTransform(
                    scrollProgress,
                    [wordStart, wordHoldStart, wordHoldEnd, wordEnd],
                    [0, 1, 1, 0]
                );

                // 3. Optional: slight rotation or drift during the 'hold' phase 
                // Alternatively, give each word a random but fixed angle
                // For simplicity, we'll keep them centered and readable.

                return (
                    <motion.div
                        key={word}
                        className="absolute text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter mix-blend-overlay text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-green/80"
                        style={{
                            translateZ: z,
                            opacity,
                            transformStyle: "preserve-3d",
                            perspective: "1000px" // Required for translateZ to have extreme depth feeling
                        }}
                    >
                        <span className="stroke-white/50 relative" style={{ WebkitTextStroke: '2px rgba(89,182,135,0.4)', color: 'transparent' }}>
                            {word}
                        </span>
                    </motion.div>
                );
            })}
        </div>
    );
}
