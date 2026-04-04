import { PlayCircle, FileText, CheckCircle, ArrowRight } from "lucide-react";

export function CurriculumScroll() {
    return (
        <section className="py-24 px-6 md:px-0 max-w-6xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">

                {/* Text Content - Left Side */}
                <div className="w-full md:w-1/2 space-y-8">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-brand-green/30 bg-brand-green/10 text-brand-green text-sm font-bold tracking-wide uppercase mb-2">
                        Izglītības Moduļi
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-dark leading-tight">
                        No pamatiem līdz <span className="text-gradient-premium">pro līmenim.</span>
                    </h2>
                    <p className="text-xl text-brand-dark/70 font-medium leading-relaxed">
                        Iegūsti strukturētas zināšanas un apgūsti praktiskus rīkus. Mūsu kursi ved soli pa solim – sākot ar Web3 un kripto pamatiem, līdz pat DeFi, NFT un Mākslīgajam intelektam (AI).
                    </p>

                    <ul className="space-y-5">
                        <li className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0 mt-1">
                                <PlayCircle size={20} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-brand-dark">Vairāk kā 20h video materiālu</h4>
                                <p className="text-brand-dark/60 font-medium">Tiešsaistes kursi un meistarklases ar video un prezentācijām.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0 mt-1">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-brand-dark">Pārbaudītas metodikas</h4>
                                <p className="text-brand-dark/60 font-medium">DeFi aplikāciju un AI palīgrīku konkrētas, praktiskas pamācības.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0 mt-1">
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-brand-dark">Praktiski uzdevumi</h4>
                                <p className="text-brand-dark/60 font-medium">Mazāk teorijas, vairāk rīcības. Praktiski soļi, kas palīdz augt tavam portfelim.</p>
                            </div>
                        </li>
                    </ul>

                    <button className="group mt-8 bg-brand-dark text-white px-8 py-3.5 rounded-full font-bold text-lg flex items-center gap-3 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-brand-dark/20">
                        Abonēt ekosistēmas pieeju
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Visual Content - Right Side */}
                <div className="w-full md:w-1/2 relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-green/20 to-brand-blue/20 blur-3xl rounded-full -z-10"></div>
                    <div className="glass-card rounded-3xl p-6 border border-white/20 shadow-premium relative transform translate-x-4 md:-translate-y-4">
                        <div className="w-full h-48 bg-brand-dark/5 rounded-xl mb-4 overflow-hidden relative">
                            {/* Mock Video Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-brand-dark/60 flex items-center justify-center backdrop-blur-sm cursor-pointer hover:scale-110 transition-transform">
                                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-white border-b-8 border-b-transparent ml-1"></div>
                                </div>
                            </div>
                        </div>
                        <h4 className="font-bold text-brand-dark text-lg mb-2">Modulis: AI Iesācēja Ceļš</h4>
                        <div className="w-full bg-brand-dark/10 rounded-full h-2 mb-2">
                            <div className="bg-brand-green h-2 rounded-full w-[45%]"></div>
                        </div>
                        <p className="text-xs text-brand-dark/60 font-medium text-right">Progress: 45%</p>
                    </div>

                    <div className="glass-card rounded-3xl p-4 border border-white/20 shadow-premium absolute bottom-[-10%] left-[-10%] w-2/3 backdrop-blur-xl animate-float-delayed">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-brand-orange/20 flex items-center justify-center text-brand-orange">
                                <FileText size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-brand-dark">Izpildīts Uzdevums!</p>
                                <p className="text-xs text-brand-green font-bold">+50 XP iegūti</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
