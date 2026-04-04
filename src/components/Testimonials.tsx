"use client";

import { useState } from "react";

const testimonials = [
    {
        quote: "100x komūnā esmu jau no pirmsākumiem. Esmu gan mācījusies vairākos kursos, kā arī abonēju 100x platformu, lai turpinātu izglītoties un komunikētu ar līdzīgi domājošiem investoriem, kā arī katru nedēļu notiek online interesantas diskusijas, viedokļu apmaiņa, kā arī jaunākās informācijas izklāsts, atkarībā no tā brīža tirgus tendencēm un situācijām. Noteikti iesaku, gan tiem, kas ir tikai pirmsākumos sevis izglītošanā par investīcijām, gan pieredzējušākiem. Tikai komūna ir spēks 👍",
        author: "Kristine Vasara",
        timeAgo: "pirms 11 mēnešiem",
    },
    {
        quote: "Kopumā jāatzīmē komūna ar lieliem plusiem. Ieguvumi no komūnas ir papildus izpratne par kripto sfēru kā tādu, tās daudzveidību un iespējamiem ieguvumiem, kurus katrs pats priekš sevis var iegūt. Pamata uzsvars uz investīcijām, kuras laika gaitā var dot lielu atdevi, bet lai tas vispār būtu iespējams jāsaprot kā vērtēt projektus, kam pievērst uzmanību un kas ir tā saucamie sarkanie karogi, kuru gadījumā jāapdomā, vai konkrētais projekts ir pietiekami perspektīvs, lai tajā investētos. Īsāk sakot komūna, kura palīdz izprast finanšu pasauli, crypto un palīdzēs ar padomu.",
        author: "Andris Mactams",
        timeAgo: "pirms 10 mēnešiem",
    },
    {
        quote: "Šī komūna man ir atvērusi jaunu finanšu pasauli, kas neizbēgami ir mūsu nākotne. Izmācoties kursus, esmu kļuvusi par investoru, un nav jābūt lielam kapitālam, lai par tādu kļūtu kripto nozarē. Iknedēļas zoomi ir ļoti izglītojošī un atbalsts no mentoriem šajā ceļā ir amazing foršs. Ja vēlies ielekt vilcienā, kurš tik tikko izbrauc, tad šis ir īstais laiks. 🤩🚀",
        author: "Ilze Silina",
        timeAgo: "pirms 9 mēnešiem",
    },
    {
        quote: "100x mācības platformas kursi sniedza stipri padzīņātu izpratni par tirgus likviditāti un to manipulācijām, kas ļauj kripto projektus analizēt daudz profesionālāk un izvērtēt ieguldījuma potenciālu. Ikdienā 100x sniedz atbalstu uz visiem neskaidrajiem jautājumiem, tirgus jaunumiem un dod pārliecību par savu ieguldījumu stratēģiju, lai nepieņemtu emocionālus un neracionālas lēmumus. Iknedēļas zvanos notiek interesantas un vērtīgas diskusijas, kā arī ārpus komūnas nav daudz cilvēku, kas spēj runāt / apspriest saturīgu kripto ieguldījumu saturu. Komūna ir apvienojusi spēcīgus investorus, kas iegulda ne tikai kripto un dalās ar savu pieredzi.",
        author: "Arnis Namatēvs",
        timeAgo: "pirms 11 mēnešiem",
    },
];

export function Testimonials() {
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

    return (
        <section className="bg-transparent py-32 px-6 relative overflow-hidden">
            {/* Background Colorful Clouds */}
            <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-brand-orange/10 blur-[120px] rounded-full animate-float-delayed pointer-events-none" />
            <div className="absolute bottom-0 left-[-5%] w-[30vw] h-[30vw] bg-brand-green/10 blur-[100px] rounded-full animate-float pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-[2px] bg-brand-green/40" />
                    <span className="text-xs font-bold text-brand-green tracking-[0.3em] uppercase">Kopienas balss</span>
                    <div className="w-12 h-[2px] bg-brand-green/40" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4 text-center">
                    Atsauksmes
                </h3>
                <p className="text-center text-brand-dark/40 text-sm mb-16 max-w-lg mx-auto">
                    Reālas atsauksmes no mūsu kopienas dalībniekiem
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonials.map((t, idx) => {
                        const isExpanded = expandedIdx === idx;
                        const isLong = t.quote.length > 200;
                        const displayQuote = isLong && !isExpanded
                            ? t.quote.substring(0, 200) + "..."
                            : t.quote;

                        return (
                            <div
                                key={idx}
                                className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-brand-dark/5 shadow-sm hover:shadow-lg hover:border-brand-green/20 transition-all duration-300"
                            >
                                {/* Facebook icon */}
                                <div className="absolute top-6 right-6">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#1877F2]">
                                        <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.47h-2.796v8.385C19.612 22.954 24 17.99 24 12z" fill="currentColor" />
                                    </svg>
                                </div>

                                {/* Quote mark */}
                                <div className="text-brand-green/20 text-6xl font-serif leading-none mb-2 select-none">&ldquo;</div>

                                {/* Quote text */}
                                <p className="text-[15px] text-brand-dark/80 leading-relaxed mb-6">
                                    {displayQuote}
                                </p>

                                {isLong && (
                                    <button
                                        onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                                        className="text-xs font-bold text-brand-green hover:text-brand-green/70 mb-6 transition-colors uppercase tracking-wider"
                                    >
                                        {isExpanded ? "Rādīt mazāk ↑" : "Lasīt vairāk →"}
                                    </button>
                                )}

                                {/* Author */}
                                <div className="flex items-center gap-3 pt-4 border-t border-brand-dark/5">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-green/20 to-brand-blue/20 flex items-center justify-center text-sm font-bold text-brand-dark/60">
                                        {t.author.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-brand-dark">{t.author}</p>
                                        <p className="text-[11px] text-brand-dark/40">{t.timeAgo}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
