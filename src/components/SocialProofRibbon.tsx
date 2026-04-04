import { Users, Star, TrendingUp } from "lucide-react";

export function SocialProofRibbon() {
    return (
        <section className="relative z-20 -mt-10 mb-20 px-4 md:px-0 max-w-5xl mx-auto">
            <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-premium">

                {/* User Avatars & Count */}
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-brand-blue/20 flex items-center justify-center overflow-hidden">
                            <img src="https://i.pravatar.cc/100?img=1" alt="Member" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-brand-green/20 flex items-center justify-center overflow-hidden">
                            <img src="https://i.pravatar.cc/100?img=5" alt="Member" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-brand-orange/20 flex items-center justify-center overflow-hidden">
                            <img src="https://i.pravatar.cc/100?img=8" alt="Member" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-brand-dark/10 flex items-center justify-center text-xs font-bold text-brand-dark">
                            +500
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-brand-dark">Pievienojies viedajai komūnai</p>
                        <p className="text-xs text-brand-dark/60 font-medium">Uzņēmēji, investori un tech entuziasti</p>
                    </div>
                </div>

                <div className="hidden md:block w-px h-12 bg-brand-dark/10"></div>

                {/* Rating */}
                <div className="flex items-center gap-3">
                    <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18} fill="currentColor" strokeWidth={1} />
                        ))}
                    </div>
                    <div className="text-sm font-bold text-brand-dark">
                        4.9/5 <span className="font-normal text-brand-dark/60">Novērtējums</span>
                    </div>
                </div>

                <div className="hidden md:block w-px h-12 bg-brand-dark/10"></div>

                {/* Result Highlight */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-brand-dark">Pārbaudītas metodikas</p>
                        <p className="text-xs text-brand-dark/60 font-medium">Praktiski soļi un AI rīki</p>
                    </div>
                </div>

            </div>
        </section>
    );
}
