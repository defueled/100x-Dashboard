export const GHL_LEVELS = [
    { level: 1, title: 'Iesācējs', emoji: '🌱' },
    { level: 2, title: 'Vērotājs', emoji: '👀' },
    { level: 3, title: 'Entuziasts', emoji: '🚀' },
    { level: 4, title: 'Pētnieks', emoji: '🔍' },
    { level: 5, title: 'Meistars', emoji: '🎯' },
    { level: 6, title: 'Eksperts', emoji: '💡' },
    { level: 7, title: 'Ietekmētājs', emoji: '🌐' },
    { level: 8, title: 'Līderis', emoji: '🥇' },
    { level: 9, title: 'Guru', emoji: '👑' },
];

export function getGhlLevelFromTags(tags: string[] = []): number {
    let highestLevel = 1;
    for (const tag of tags) {
        const match = tag.match(/lvl(?: |)?(\d+)/i);
        if (match) {
            const level = parseInt(match[1], 10);
            if (level > highestLevel) highestLevel = level;
        }
    }
    return Math.min(highestLevel, 9);
}
