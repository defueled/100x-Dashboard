// Mastering tool definitions per pillar.
// AI reuses the existing `provider` enum from task_catalog (openai/anthropic/grok/gemini).
// Other pillars need user-confirmed canonical lists — current values are placeholders
// usable for the wizard scaffolding; replace `id` strings only after task_catalog rows
// gain a `tool` field (or content is keyed by tool independently).

export type PillarKey = 'ai' | 'tradfi' | 'defi' | 'culture';

export interface ToolOption {
    id: string;
    label: string;
    blurb: string;
    emoji: string;
}

export const PILLAR_TOOLS: Record<PillarKey, ToolOption[]> = {
    ai: [
        { id: 'openai', label: 'ChatGPT (OpenAI)', blurb: 'Universālais AI asistents', emoji: '🟢' },
        { id: 'anthropic', label: 'Claude (Anthropic)', blurb: 'Garu tekstu un koda meistars', emoji: '🟠' },
        { id: 'grok', label: 'Grok (xAI)', blurb: 'Reāllaika tīkla AI', emoji: '⚡' },
        { id: 'gemini', label: 'Gemini (Google)', blurb: 'Multimodāls Google AI', emoji: '✨' },
    ],
    // TODO: confirm canonical tools with user before authoring real content
    defi: [
        { id: 'metamask', label: 'MetaMask', blurb: 'Pirmais self-custody maks', emoji: '🦊' },
        { id: 'uniswap', label: 'Uniswap', blurb: 'Decentralizēta birža', emoji: '🦄' },
        { id: 'aave', label: 'Aave', blurb: 'On-chain lending tirgus', emoji: '👻' },
    ],
    tradfi: [
        { id: 'spreadsheet', label: 'Spreadsheet', blurb: 'Personīgais budžets un bilance', emoji: '📊' },
        { id: 'banking', label: 'Bankas aplikācija', blurb: 'Ikdienas finanšu rīks', emoji: '🏦' },
        { id: 'broker', label: 'Brokeris', blurb: 'Akciju un ETF tirdzniecība', emoji: '📈' },
    ],
    culture: [
        { id: 'substack', label: 'Substack', blurb: 'Lasi un raksti newsletter', emoji: '📰' },
        { id: 'spotify', label: 'Podkāsti', blurb: 'Nozaru sarunas', emoji: '🎙️' },
        { id: 'forum', label: '100x forums', blurb: 'Komūnas balss', emoji: '💬' },
    ],
};

export const PILLAR_LABEL: Record<PillarKey, string> = {
    ai: 'AI',
    tradfi: 'TradFi',
    defi: 'DeFi',
    culture: 'Kultūra',
};

export const PILLAR_ACCENT: Record<PillarKey, string> = {
    ai: '#59b687',
    tradfi: '#4A9EE5',
    defi: '#188bf6',
    culture: '#F5A623',
};

export const PILLAR_SUBTITLE: Record<PillarKey, string> = {
    ai: 'Mākslīgais intelekts — no pirmā prompta līdz uzbūvētiem rīkiem.',
    tradfi: 'Tradicionālās finanses — tirgi, analīze un riska vadība.',
    defi: 'Decentralizētas finanses — maki, swap, yield un on-chain pratība.',
    culture: 'Komūna un kultūra — cilvēki, sarunas un radīšana.',
};
