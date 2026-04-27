export type Locale = "lv" | "en";
export const DEFAULT_LOCALE: Locale = "lv";
export const LOCALES: Locale[] = ["lv", "en"];

export const dictionary = {
    lv: {
        "meta.title": "100x.lv | Viedā Komūna",
        "meta.description": "Apvienojam AI, FinTech un Web3.0 tehnoloģijas vienuviet.",

        "header.dashboard": "Dashboard",
        "header.signin": "Ieiet ar Google",
        "header.signout": "Iziet",

        "hero.tagline": "VIEDĀ KOMŪNA",
        "hero.title.line1": "Tavs ceļvedis",
        "hero.title.line2": "nākotnes",
        "hero.title.line3": "tehnoloģijām",
        "hero.subtitle": "AI, Web3 un FinTech — vienuviet. Strukturētas mācības, slēgta komūna un gamifikācija.",
        "hero.cta.primary": "Pievienoties komūnai",
        "hero.cta.telegram": "Telegram Kopiena",
        "hero.scroll.up": "UZ AUGŠU",
        "hero.scroll.down": "UZ LEJU",

        "social.community": "Pievienojies viedajai komūnai",
        "social.community.sub": "Uzņēmēji, investori un tech entuziasti",
        "social.rating": "Novērtējums",
        "social.methods": "Pārbaudītas metodikas",
        "social.methods.sub": "Praktiski soļi un AI riki",

        "cta.title": "Laiks celt savu",
        "cta.title.accent": "vērtību.",
        "cta.subtitle": "Kļūsti par daļu no inovatoru, investoru un tech entuziastu komūnas.\nIzglītojies un pelni ar AI un Web3.",
        "cta.primary": "Pievienoties komūnai",
        "cta.telegram": "Telegram Kopiena",

        "footer.tagline": "© 2026 Pratības Portāls.",
        "footer.join": "Pievienojies kopienai:",
        "footer.rights": "© 2026 100x.lv. Visas tiesības aizsargātas.",
        "footer.terms": "Noteikumi",
        "footer.privacy": "Privātums",

        "lang.toggle": "EN",
        "lang.toggle.aria": "Switch to English",
    },
    en: {
        "meta.title": "100x.lv | Smart Community",
        "meta.description": "We bring AI, FinTech and Web3.0 technologies under one roof.",

        "header.dashboard": "Dashboard",
        "header.signin": "Sign in with Google",
        "header.signout": "Sign out",

        "hero.tagline": "SMART COMMUNITY",
        "hero.title.line1": "Your guide to",
        "hero.title.line2": "the future",
        "hero.title.line3": "of technology",
        "hero.subtitle": "AI, Web3 and FinTech — in one place. Structured lessons, a private community, and gamification.",
        "hero.cta.primary": "Join the community",
        "hero.cta.telegram": "Telegram channel",
        "hero.scroll.up": "SCROLL UP",
        "hero.scroll.down": "SCROLL DOWN",

        "social.community": "Join the smart community",
        "social.community.sub": "Founders, investors and tech enthusiasts",
        "social.rating": "Average rating",
        "social.methods": "Proven methods",
        "social.methods.sub": "Practical steps and AI tools",

        "cta.title": "Time to build your",
        "cta.title.accent": "value.",
        "cta.subtitle": "Become part of a community of innovators, investors and tech enthusiasts.\nLearn and earn with AI and Web3.",
        "cta.primary": "Join the community",
        "cta.telegram": "Telegram channel",

        "footer.tagline": "© 2026 Skills Portal.",
        "footer.join": "Join the community:",
        "footer.rights": "© 2026 100x.lv. All rights reserved.",
        "footer.terms": "Terms",
        "footer.privacy": "Privacy",

        "lang.toggle": "LV",
        "lang.toggle.aria": "Pārslēgt uz latviešu",
    },
} as const;

export type DictKey = keyof typeof dictionary["lv"];
