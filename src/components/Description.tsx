import { Bot, BarChart3, Globe, Users } from "lucide-react";

export function Description() {
    return (
        <section className="py-24 px-6 md:px-0 max-w-6xl mx-auto relative overflow-hidden z-10">
            {/* Background Colorful Clouds */}
            <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] bg-brand-green/15 blur-[120px] rounded-full animate-float pointer-events-none -z-10" />
            <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] bg-brand-blue/15 blur-[100px] rounded-full animate-float-delayed pointer-events-none -z-10" />

            <div className="text-center mb-16 relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-dark mb-4">
                    Tavs ceļvedis nākotnes tehnoloģijām
                </h2>
                <p className="text-xl font-medium text-brand-dark/70 max-w-2xl mx-auto">
                    Mēs apvienojam AI, FinTech un Web3.0 vienuviet, piedāvājot strukturētas mācības un slēgtu komūnu.
                </p>
            </div>

            {/* Bento Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 relative z-10">

                {/* 1. Kārts: AI Optimizācija (Plašāka) */}
                <div className="glass-card rounded-3xl p-8 md:col-span-2 md:row-span-1 shadow-premium hover:shadow-glow-green overflow-hidden relative group transition-all duration-300">
                    <div className="absolute top-0 right-0 p-8 text-brand-blue/10 group-hover:text-brand-blue/20 transition-colors duration-300 transform group-hover:scale-110">
                        <Bot size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue mb-6">
                            <Bot size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-brand-dark mb-3">AI Produktivitāte</h3>
                        <p className="text-brand-dark/70 font-medium max-w-sm">
                            Kā praktiski integrēt ChatGPT, Claude un citus AI rīkus tavā biznesā un ikdienā. No promptu inženierijas līdz lokalizācijai.
                        </p>
                    </div>
                </div>

                {/* 2. Kārts: Slēgtais Forums */}
                <div className="glass-card rounded-3xl p-8 md:col-span-1 md:row-span-2 shadow-premium hover:-translate-y-1 overflow-hidden relative group transition-all duration-300 flex flex-col">
                    <div className="relative z-10 flex-grow">
                        <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange mb-6">
                            <Users size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-brand-dark mb-3">Viedā Komūna</h3>
                        <p className="text-brand-dark/70 font-medium mb-8">
                            Droša vieta, kur dalīties pieredzē, uzdot jautājumus un saņemt atbalstu no zinošiem ekspertiem un citiem dalībniekiem slēgtā forumā.
                        </p>
                    </div>

                    {/* Visual element representing forum activity */}
                    <div className="mt-auto pt-6 border-t border-brand-dark/10 space-y-4">
                        <div className="flex gap-3 items-center opacity-80">
                            <div className="w-8 h-8 rounded-full bg-brand-dark/10 shrink-0"></div>
                            <div className="h-4 w-3/4 bg-brand-dark/10 rounded-full"></div>
                        </div>
                        <div className="flex gap-3 items-center opacity-60">
                            <div className="w-8 h-8 rounded-full bg-brand-dark/10 shrink-0"></div>
                            <div className="h-4 w-1/2 bg-brand-dark/10 rounded-full"></div>
                        </div>
                        <div className="flex gap-3 items-center opacity-40">
                            <div className="w-8 h-8 rounded-full bg-brand-dark/10 shrink-0"></div>
                            <div className="h-4 w-2/3 bg-brand-dark/10 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* 3. Kārts: FinTech / DeFi */}
                <div className="glass-card rounded-3xl p-8 md:col-span-1 md:row-span-1 shadow-premium hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute -bottom-8 -right-8 text-brand-green/10 group-hover:text-brand-green/20 transition-colors duration-300">
                        <BarChart3 size={150} />
                    </div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green mb-6">
                            <BarChart3 size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-brand-dark mb-2">DeFi & FinTech</h3>
                        <p className="text-sm font-medium text-brand-dark/70">
                            Decentralizētās finanses un tradicionālie finanšu rīki modernai labklājībai.
                        </p>
                    </div>
                </div>

                {/* 4. Kārts: Web 3.0 */}
                <div className="glass-card rounded-3xl p-8 md:col-span-1 md:row-span-1 shadow-premium hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute -bottom-8 -right-8 text-brand-dark/5 group-hover:text-brand-dark/10 transition-colors duration-300">
                        <Globe size={150} />
                    </div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-brand-dark/5 flex items-center justify-center text-brand-dark mb-6">
                            <Globe size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-brand-dark mb-2">Web 3.0 Pasaule</h3>
                        <p className="text-sm font-medium text-brand-dark/70">
                            Droša ienākšana kriptovalūtu, viedo līgumu un digitālo aktīvu ekosistēmā.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
