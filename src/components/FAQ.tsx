"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from "./scroll";

const faqs = [
    {
        question: "Kas ir 100x.lv?",
        answer: "100x.lv ir Latvijas viedā komūna un pratības portāls, kas izveidots, lai palīdzētu apgūt mākslīgā intelekta (AI), Web3 un FinTech rīkus drošā un strukturētā vidē. Mēs apvienojam video kursus, dzīvās Zoom sesijas, slēgto forumu un gamifikācijas sistēmu."
    },
    {
        question: "Vai man ir nepieciešamas priekšzināšanas, lai pievienotos?",
        answer: "Nē. Mūsu mācību modulis 'AI Iesācēja Ceļš' ir veidots tieši cilvēkiem bez iepriekšējas pieredzes. Mēs soli pa solim izstādīsim pamatus un palīdzēsim tos pielietot praksē. Viss tiek skaidrots vienkāršā un saprotamā Latviešu valodā."
    },
    {
        question: "Kāda ir atšķirība starp TradFi un DeFi?",
        answer: "TradFi (Tradicionālās Finanses) ir klasiskas finanšu iestādes — bankas, brokeri, apdrošinātāji — kas darbojas kā starpnieki un iekasē komisijas. DeFi (Decentralizētās Finanses) ir atvērts finanšu ekosistēma uz blockchain, kurā aizdevumi, mijmaiņa un ieguldījumi notiek automātiski caur gudrajiem līgumiem (Smart Contracts) bez starpniekiem. 100x komūnā mēs mācam, kā droši izmantot abus."
    },
    {
        question: "Kur slēpjas AI patiesā biznesa vērtība?",
        answer: "AI ir spēcīgākais produktivitātes rīks mūsdienu uzņēmēja arsenālā. Tas ļauj: automatizēt atkārtojošos uzdevumus (e-pasti, atskaites, klientu apkalpošana), ģenerēt mārketinga saturu sekunžu laikā, analizēt datus un pieņemt labākus biznesa lēmumus. Cilvēks ar AI ir 10x produktīvāks nekā bez tā — un 100x mēs māca to lietot praksē."
    },
    {
        question: "Cik ilgs laiks nepieciešams, lai apgūtu kripto un Web3 pamatus?",
        answer: "Ar mūsu strukturētajiem kursiem pamatus var apgūt 2-4 nedēļu laikā, veltot 1-2 stundas dienā. Mēs iesakām sākt ar 'Kripto iesācēja ceļu' moduli, kas nodrošina stabilu teorētisko bāzi, ko uzreiz var pielietot praksē ar maziem riska apmēriem."
    },
    {
        question: "Kā darbojas 'Level Up' jeb XP sistēma?",
        answer: "Katrs apgūtais materiāls un izpildītais uzdevums dod tev XP punktus. Sakrājot noteiktu skaitu, tu paceļ savu līmeni un atbloķē jaunas privilēģijas: padziļinātus kursus, meistarklases, 1-pret-1 konsultācijas un pat DAO (Decentralizētas autonomas organizācijas) balsstiesības no 4. līmeņa."
    },
    {
        question: "Kas ir DAO un kā es varu piedalīties?",
        answer: "DAO (Decentralizēta Autonoma Organizācija) ir kopienas vadīšanas modelis, kur lēmumus pieņem biedri, nevis viena persona. 100x.lv DAO izmanto Snapshot balsošanas platformu — tu ierosini idejas un balso par citu priekšlikumiem. Tas ir ekskluzīvs 4. līmeņa biedru privilēģija."
    },
    {
        question: "Kā es varu piekļūt slēgtajam forumam?",
        answer: "Slēgtais forums ir ekskluzīva vide mūsu reģistrētajiem biedriem. Tu saņemsi piekļuvi tiklīdz pievienosies portālam. Forumā notiek iknedēļas tirgus analīze, stratēģiju apmaiņa un vērtēšanas diskusijas ar citiem pieredzējušiem investoriem."
    },
    {
        question: "Vai ir pieejamas klātienes tikšanās?",
        answer: "Jā! 100x DAO organizē regulārus meet-up pasākumus Latvijā un ceļojumus uz starptautiskajām kripto konferencēm. Šīs tikšanās ir vērtīgas iespējas veidot reālus kontaktus, dalīties pieredzē un piedzīvot Web3 kustību no pirmavota."
    }
];


export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    // Schema.org struktūrdati (JSON-LD) priekš AEO (Answer Engine Optimization)
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <section className="py-24 px-6 md:px-0 max-w-4xl mx-auto relative z-10">
            {/* Iekļauj struktūrdatus SEO un ChatGPT optimizācijai */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <ScrollReveal variant="blurFadeIn" className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-dark mb-4">
                    Biežāk Uzdotie Jautājumi
                </h2>
                <p className="text-xl font-medium text-brand-dark/60">
                    Viss, kas tev jāzina par 100x.lv platformu un komūnu.
                </p>
            </ScrollReveal>

            <StaggerContainer className="space-y-4" staggerDelay={0.08}>
                {faqs.map((faq, index) => (
                    <StaggerItem key={index}>
                    <div
                        className="glass-card rounded-2xl overflow-hidden transition-all duration-300"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                        >
                            <h3 className="text-lg font-bold text-brand-dark pr-8">{faq.question}</h3>
                            <ChevronDown
                                className={`text-brand-green transition-transform duration-300 shrink-0 ${openIndex === index ? 'rotate-180' : ''}`}
                                size={24}
                            />
                        </button>
                        <div
                            className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <p className="p-6 pt-0 text-brand-dark/70 font-medium leading-relaxed">
                                {faq.answer}
                            </p>
                        </div>
                    </div>
                    </StaggerItem>
                ))}
            </StaggerContainer>
        </section>
    );
}
