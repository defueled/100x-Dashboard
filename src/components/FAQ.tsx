"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from "./scroll";
import { useLang } from "@/i18n/LangProvider";

type FaqItem = { question: string; answer: string };

const FAQS_EN: FaqItem[] = [
    { question: "What is 100x.lv?", answer: "100x.lv is a Latvian smart community and skills portal built to help you master AI, Web3 and FinTech tools in a safe, structured environment. We combine video courses, live Zoom sessions, a private forum, and a gamification system." },
    { question: "Do I need prior experience to join?", answer: "No. Our \"AI Beginner's Path\" module is designed specifically for people without prior experience. We walk through the basics step by step and help you apply them in practice." },
    { question: "What is the difference between TradFi and DeFi?", answer: "TradFi (Traditional Finance) covers classic financial institutions — banks, brokers, insurers — that act as intermediaries and charge fees. DeFi (Decentralised Finance) is an open financial ecosystem on blockchain where loans, swaps and investments happen automatically through smart contracts, with no intermediaries. In the 100x community we teach how to use both safely." },
    { question: "Where is the real business value of AI?", answer: "AI is the most powerful productivity tool in a modern operator's arsenal. It lets you automate repetitive tasks (emails, reports, customer support), generate marketing content in seconds, analyse data and make better decisions. A human with AI is 10x more productive — and at 100x we teach how to apply it in practice." },
    { question: "How long does it take to learn the crypto and Web3 basics?", answer: "With our structured courses you can grasp the basics in 2–4 weeks, spending 1–2 hours per day. We recommend starting with the \"Crypto Beginner's Path\" module — it provides a solid theoretical base you can apply immediately with small risk." },
    { question: "How does the XP / Level Up system work?", answer: "Every completed lesson and task awards XP. Once you accumulate enough you level up and unlock new perks: deeper courses, masterclasses, 1-on-1 consultations, and even DAO voting rights starting at Level 4." },
    { question: "What is the DAO and how can I participate?", answer: "A DAO (Decentralised Autonomous Organisation) is a community governance model where decisions are made by members, not a single person. The 100x.lv DAO uses Snapshot — you propose ideas and vote on others. It's an exclusive perk for Level 4+ members." },
    { question: "How do I access the private forum?", answer: "The private forum is exclusive to our registered members. You get access as soon as you join the platform. The forum hosts weekly market analysis, strategy sharing, and evaluation discussions with experienced investors." },
    { question: "Are there in-person meetups?", answer: "Yes! The 100x DAO runs regular meetups in Latvia and trips to international crypto conferences. These are great opportunities to build real connections, share experience, and witness the Web3 movement up close." },
];

const faqs: FaqItem[] = [
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
    const { locale, t } = useLang();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const items: FaqItem[] = locale === "en" ? FAQS_EN : faqs;

    // Schema.org struktūrdati (JSON-LD) priekš AEO (Answer Engine Optimization)
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": items.map((faq) => ({
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
                    {t("faq.h2")}
                </h2>
                <p className="text-xl font-medium text-brand-dark/60">
                    {t("faq.subtitle")}
                </p>
            </ScrollReveal>

            <StaggerContainer className="space-y-4" staggerDelay={0.08}>
                {items.map((faq, index) => (
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
