// Wizard content (educational slides + quiz) keyed by task_catalog.id.
// A task without an entry here keeps using the legacy modal flow.
// Authoring: keep slides short (3–6 cards), 4–5 quiz questions, options 3–4 each.

export interface WizardSlide {
    title: string;
    body: string; // multi-paragraph plain text or simple markdown-ish bullets
    imageUrl?: string;
    bullets?: string[];
}

export interface WizardQuestion {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation?: string; // shown on result screen if user got it wrong
}

export interface WizardPrakse {
    /** Short title of the practical action (rendered as Step 7 heading). */
    title: string;
    /** Why this practice matters — paragraph above the action steps. */
    intro: string;
    /** Concrete steps the user takes in the real world. */
    steps: string[];
    /** Forum-bound proof: the wizard reads task_catalog.forum_url + forum_template_lv;
     *  this `forum_hint` is just the in-wizard copy explaining what to post. */
    forum_hint?: string;
}

export interface WizardContent {
    tool: string; // matches PILLAR_TOOLS[pillar][n].id
    slides: WizardSlide[];
    quiz: WizardQuestion[];
    /**
     * Optional hands-on practice step. Unlocks ONLY when quiz score === total.
     * When present: bonus_xp is gated behind successful proof submission via
     * /api/tasks/submit (forum URL or admin review per task_catalog.proof_type).
     * When absent: bonus_xp auto-awards at 100% quiz score (current behaviour).
     */
    prakse?: WizardPrakse;
}

// Pilot content. Replace `task_id` keys with real task_catalog.id once user picks pilots.
// `demo-*` keys are usable by the dev preview page only.
export const PRATIBA_WIZARD_CONTENT: Record<string, WizardContent> = {
    'demo-chatgpt-basics': {
        tool: 'chatbot',
        slides: [
            {
                title: 'Kas ir ChatGPT?',
                body: 'ChatGPT ir OpenAI veidots sarunu AI, kas ģenerē atbildes uz dabīgu valodu. Tas saprot kontekstu, var rakstīt kodu, apkopot tekstus un palīdzēt domāt cauri problēmām.',
                bullets: [
                    'Tekstā balstīts AI, ko vada t.s. „prompti” (ievades tekstu)',
                    'Bezmaksas versijā GPT-4o-mini — pietiek 80% lietojumu',
                    'Plus plāns ($20/mēn) atbloķē GPT-5, attēlus, balsi un Custom GPTs',
                ],
            },
            {
                title: 'Pirmais labs prompts',
                body: 'Slikts prompts: "Uzraksti par budžetu". Labs prompts: "Tu esi finanšu konsultants. Uzraksti 5 punktu plānu, kā 25 gadus vecam latvietim ar 1500€/mēn ienākumiem sākt taupīt 20%."',
                bullets: [
                    '1) Loma: kas tev jākļūst (eksperts, koderis, redaktors)',
                    '2) Konteksts: kas tu esi, kāda situācija',
                    '3) Uzdevums: kas konkrēti jāizdara',
                    '4) Formāts: punkti, tabula, e-pasts, kods',
                ],
            },
            {
                title: 'Ko NEdarīt',
                body: 'ChatGPT bieži „halucinē” — pārliecināti raksta nepareizu informāciju. Vienmēr pārbaudi konkrētus faktus (datumus, likumus, summas) ārējos avotos.',
                bullets: [
                    'Nelikt iekšā paroles, bankas datus, slepenas API atslēgas',
                    'Neuzticēt finanšu/juridiskiem padomiem bez pārbaudes',
                    'Nesūtīt klientu personas datus bez piekrišanas (GDPR)',
                ],
            },
            {
                title: 'Kā paātrināt darbu',
                body: 'Custom GPT ļauj saglabāt savu „lomu” — piem., 100x Latvijas mentoru — un nepārrakstīt to katru reizi. Vēl viens triks: pievieno failus (PDF, xlsx) un lūdz analizēt.',
                bullets: [
                    'Saglabā bieži lietotos promptus kā Custom GPT',
                    'Pievieno PDF/xlsx → ātra analīze un kopsavilkums',
                    'Lūdz „step by step” → mazāk halucināciju',
                ],
            },
        ],
        quiz: [
            {
                prompt: 'Kura no šīm ir LABA prompta sastāvdaļa?',
                options: [
                    'Pasakot AI tā lomu (piem., "tu esi koderis")',
                    'Lūgt atbildi vienā vārdā bez konteksta',
                    'Nelikt nekādu mērķi vai formātu',
                    'Rakstīt tikai jautājuma zīmi',
                ],
                correctIndex: 0,
                explanation: 'Loma + konteksts + skaidrs uzdevums dod kvalitatīvāku atbildi.',
            },
            {
                prompt: 'Kas ir „halucinācija” ChatGPT kontekstā?',
                options: [
                    'Servera kļūda',
                    'AI pārliecināti pasniegta nepareiza informācija',
                    'Lēna atbilde',
                    'Pārāk gara atbilde',
                ],
                correctIndex: 1,
                explanation: 'Halucinācija = AI izdomā kaut ko, kas izklausās ticami, bet nav patiess.',
            },
            {
                prompt: 'Kuru informāciju NEDRĪKST likt ChatGPT?',
                options: [
                    'Publisku rakstu',
                    'Atvērta koda fragmentu',
                    'Bankas paroli vai klientu personas datus',
                    'Mācību piezīmes',
                ],
                correctIndex: 2,
                explanation: 'Slepeni dati var nokļūt mācību kopās. Nekad nelikt iekšā paroles, kartes, klientu PII.',
            },
            {
                prompt: 'Cik maksā ChatGPT Plus mēnesī?',
                options: ['Bezmaksas', '$20', '$50', '$100'],
                correctIndex: 1,
                explanation: 'Plus plāns ir aptuveni $20/mēnesī; tas atbloķē jaunākos modeļus.',
            },
            {
                prompt: 'Ko vislabāk darīt, kad ChatGPT atbild ļoti pārliecināti par konkrētu skaitli vai datumu?',
                options: [
                    'Aklu uzticēties',
                    'Pārbaudīt avotā',
                    'Nelikt nekādu nozīmi',
                    'Aizvērt sarunu',
                ],
                correctIndex: 1,
                explanation: 'Ja fakts ir kritisks (likums, summa, datums) — vienmēr pārbaudi ārējā avotā.',
            },
        ],
        prakse: {
            title: 'Prakse forumā',
            intro: 'Tagad tu zini teoriju — laiks pielietot. Pamēģini ChatGPT reālā uzdevumā un padalies ar rezultātu komūnā. Tas atbloķē bonusu un palīdz citiem mācīties no tava piemēra.',
            steps: [
                'Izveido ChatGPT promptu kādam savam reālam uzdevumam (e-pasts, plāns, koda fragments)',
                'Izlabo promptu pēc 1. slaida kārtulām: loma + konteksts + uzdevums + formāts',
                'Saglabā labākās 2 atbildes vai screenshot',
                'Publicē forumā: ko centies, kas strādāja, kas nē',
            ],
            forum_hint: 'Pierādījumam jābūt forumā — saite uz tavu postu platformā 100x.lv. Bonus XP tiek piešķirts pēc admin pārbaudes (vai automātiski, ja uzdevums atļauj).',
        },
    },
};

export function getWizardContent(taskId: string): WizardContent | null {
    return PRATIBA_WIZARD_CONTENT[taskId] || null;
}

export function hasWizardContent(taskId: string): boolean {
    return taskId in PRATIBA_WIZARD_CONTENT;
}
