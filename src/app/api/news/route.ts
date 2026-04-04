import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

const TOPICS = {
    ai: [
        'https://techcrunch.com/category/artificial-intelligence/feed/',
        'https://venturebeat.com/category/ai/feed/',
        'https://www.wired.com/feed/tag/ai/latest/rss',
        'https://news.google.com/rss/search?q=artificial+intelligence+AI+LLM&hl=en-US&gl=US&ceid=US:en'
    ],
    tradfi: [
        'https://www.cnbc.com/id/10000664/device/rss/rss.html',
        'https://fortune.com/feed',
        'https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml',
        'https://news.google.com/rss/search?q=stock+market+finance+economy&hl=en-US&gl=US&ceid=US:en'
    ],
    web3: [
        'https://www.coindesk.com/arc/outboundfeeds/rss/',
        'https://cointelegraph.com/rss',
        'https://decrypt.co/feed',
        'https://news.google.com/rss/search?q=crypto+web3+blockchain+bitcoin+ethereum&hl=en-US&gl=US&ceid=US:en'
    ]
};

// Simple memory cache (reset on redeploy, suitable for news)
let cache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_TTL = 3600 * 1000; // 1 hour

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category') || 'ai';

        const feeds = TOPICS[category as keyof typeof TOPICS];
        if (!feeds) {
            return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
        }

        // Check Cache
        if (cache[category] && (Date.now() - cache[category].timestamp < CACHE_TTL)) {
            return NextResponse.json(cache[category].data);
        }

        // Fetch all feeds in parallel
        const feedResults = await Promise.all(
            feeds.map(url => parser.parseURL(url).catch(e => ({ items: [] })))
        );
        
        // Merge and sort
        const news = feedResults.flatMap((feed: any) => 
            feed.items.map((item: any) => ({
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                contentSnippet: item.contentSnippet,
                source: item.source || feed.title || 'News Source',
                sentiment: Math.random() > 0.6 ? 'bullish' : Math.random() > 0.4 ? 'neutral' : 'bearish'
            }))
        )
        .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
        .slice(0, 24); // Top 24 stories for a better grid

        // Update Cache
        cache[category] = {
            data: news,
            timestamp: Date.now()
        };

        return NextResponse.json(news);

    } catch (error: any) {
        console.error("[News API Error]:", error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
