import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, CheckCircle2, Circle, Clock, Flame, ChevronRight, Plus, Home, LayoutList, Calendar, Users, Video, Bot, Settings, LogOut, Bell, Search, Image as ImageIcon, Scissors, Type, Monitor, Twitter, Tv, Sun, Moon, Briefcase, Youtube, Mic, Sparkles, Palette, Landmark, Building2, Cpu, TrendingUp, Lightbulb, Globe, ExternalLink, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [isDark, setIsDark] = useState(true);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [activeTab, setActiveTab] = useState('goals');
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) {
      if (stored === 'light') {
        setIsDark(false);
        document.documentElement.classList.remove('dark');
      } else {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      }
    } else {
      // No theme stored, show modal
      setShowThemeModal(true);
    }
  }, []);

  const selectTheme = (theme: 'light' | 'dark') => {
    if (theme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setShowThemeModal(false);
  };

  useEffect(() => {
    if (activeTab === 'goals') return;

    const rssFeeds: Record<string, string> = {
      tech: 'https://www.theverge.com/rss/index.xml',
      investment: 'https://finance.yahoo.com/news/rssindex',
      innovation: 'https://www.wired.com/feed/category/science/latest/rss',
      politics: 'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml',
      other: 'https://feeds.bbci.co.uk/news/world/rss.xml'
    };

    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        // Izmantojam rss2json API, kas ir daudz stabilāks par Reddit proxy
        const rssUrl = rssFeeds[activeTab];
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
        
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Network response was not ok');
        
        const data = await res.json();
        
        if (data && data.status === 'ok' && data.items) {
          setNews(data.items.slice(0, 15));
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (e) {
        console.error("Failed to fetch news:", e);
        setError("Neizdevās ielādēt ziņas. Iespējams, API ir pārslogots. Lūdzu, mēģini nedaudz vēlāk.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [activeTab]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <div className="flex h-screen bg-brand-black text-brand-light font-sans overflow-hidden">
      
      {/* Leftmost Icon Sidebar */}
      <aside className="w-16 border-r border-brand-border bg-brand-black flex flex-col items-center py-4 gap-4 z-20 shrink-0">
        <img 
          src="https://assets.cdn.filesafe.space/7BzDyeAg6b6h8O2AK97O/media/68497393d851446c00e00ce5.png" 
          alt="100x Logo" 
          className="w-10 h-10 rounded-xl object-cover mb-2"
        />
        <div className="flex flex-col gap-2 w-full px-2">
          <IconSidebarItem icon={<Target size={20} />} label="Mērķi (Goals)" active={activeTab === 'goals'} onClick={() => setActiveTab('goals')} />
          <div className="w-8 h-[1px] bg-brand-border mx-auto my-1" />
          <IconSidebarItem icon={<Cpu size={20} />} label="Tech News" active={activeTab === 'tech'} onClick={() => setActiveTab('tech')} />
          <IconSidebarItem icon={<TrendingUp size={20} />} label="Investment" active={activeTab === 'investment'} onClick={() => setActiveTab('investment')} />
          <IconSidebarItem icon={<Lightbulb size={20} />} label="Innovation" active={activeTab === 'innovation'} onClick={() => setActiveTab('innovation')} />
          <IconSidebarItem icon={<Landmark size={20} />} label="Politics" active={activeTab === 'politics'} onClick={() => setActiveTab('politics')} />
          <IconSidebarItem icon={<Globe size={20} />} label="Other News" active={activeTab === 'other'} onClick={() => setActiveTab('other')} />
        </div>
      </aside>

      {/* Secondary Sidebar */}
      <aside className="w-64 border-r border-brand-border bg-brand-dark flex flex-col h-full overflow-y-auto custom-scrollbar shrink-0">
        
        {/* Profile Section */}
        <div className="p-6 border-b border-brand-border">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src="https://media.licdn.com/dms/image/v2/D4D03AQH3_wMvXHWUeQ/profile-displayphoto-scale_100_100/B4DZle7FUOJQAc-/0/1758234175658?e=1773878400&v=beta&t=OyP8a7sUXnE4uDAGYkF32jeDinxONkET8e9dgo3RLvQ" 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover border border-brand-border"
            />
            <div>
              <div className="font-semibold">Master User</div>
              <div className="text-xs text-brand-light/50">@100x.lv</div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={toggleTheme} className="text-brand-light/50 hover:text-brand-light transition-colors">
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button className="text-brand-light/50 hover:text-brand-light transition-colors">
                <Bell size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1 bg-brand-gray border border-brand-border rounded-xl p-2 flex flex-col items-center justify-center">
              <Flame size={16} className="text-brand-accent mb-1" />
              <div className="text-sm font-semibold">1,240</div>
              <div className="text-[10px] text-brand-light/50 uppercase">Score</div>
            </div>
            <div className="flex-1 bg-brand-gray border border-brand-border rounded-xl p-2 flex flex-col items-center justify-center">
              <Target size={16} className="text-brand-light/70 mb-1" />
              <div className="text-sm font-semibold">12</div>
              <div className="text-[10px] text-brand-light/50 uppercase">Mērķi</div>
            </div>
            <div className="flex-1 bg-brand-gray border border-brand-border rounded-xl p-2 flex flex-col items-center justify-center">
              <CheckCircle2 size={16} className="text-brand-light/70 mb-1" />
              <div className="text-sm font-semibold">84</div>
              <div className="text-[10px] text-brand-light/50 uppercase">Uzdevumi</div>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-4 space-y-6 flex-grow">
          
          <NavSection title="LIFE OS">
            <NavItem icon={<Home size={16} />} label="Dashboard" active />
            <NavItem icon={<Target size={16} />} label="Mērķi" />
            <NavItem icon={<LayoutList size={16} />} label="Uzdevumi" />
            <NavItem icon={<Calendar size={16} />} label="Ieradumi" />
          </NavSection>

          <NavSection title="KOPIENA">
            <NavItem icon={<Users size={16} />} label="Forums" />
            <NavItem icon={<Mic size={16} />} label="Brīvais Mikrofons" />
          </NavSection>

          <NavSection title="RESURSI">
            <NavItem icon={<Video size={16} />} label="Video Kursi" />
            <NavItem icon={<Bot size={16} />} label="100x AI" />
          </NavSection>

        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-brand-border flex gap-2">
          <Link to="/" className="flex-1 flex items-center justify-center gap-2 bg-brand-gray hover:bg-brand-border border border-brand-border py-2 rounded-xl text-sm font-medium transition-colors">
            <LogOut size={16} /> Iziet
          </Link>
          <button className="flex-1 flex items-center justify-center gap-2 bg-brand-gray hover:bg-brand-border border border-brand-border py-2 rounded-xl text-sm font-medium transition-colors">
            <Settings size={16} /> Iestatījumi
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto bg-brand-black p-8">
        <div className="max-w-5xl mx-auto">
          
          {activeTab === 'goals' ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Mērķi</h1>
                <button className="bg-brand-accent text-brand-black px-4 py-2 rounded-xl font-semibold hover:bg-brand-accent-hover transition-colors flex items-center gap-2">
                  <Plus size={20} /> Pievienot Mērķi
                </button>
              </div>

              {/* Goals Content */}
              <div className="grid grid-cols-1 gap-4">
                <ToolCard 
                  icon={<Target size={20} />}
                  title="Aktīvais Mērķis: SaaS MVP"
                  description="Pabeigt Landing lapas dizainu un integrēt Supabase Auth. Termiņš: 30 dienas."
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold tracking-tight capitalize">{activeTab} News</h1>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="animate-spin text-brand-accent" size={40} />
                </div>
              ) : error ? (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-2xl text-center">
                  <p className="font-medium">{error}</p>
                  <button 
                    onClick={() => setActiveTab(activeTab)} 
                    className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-colors text-sm"
                  >
                    Mēģināt vēlreiz
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {news.map((article, index) => {
                    // Extract domain from link for display
                    const domain = article.link ? new URL(article.link).hostname.replace('www.', '') : '';
                    
                    // Try to find a thumbnail image
                    let thumbnail = article.thumbnail || article.enclosure?.link;
                    
                    // If no explicit thumbnail, try to extract from content or description
                    if (!thumbnail) {
                      const imgRegex = /<img[^>]+src="([^">]+)"/i;
                      const contentMatch = article.content?.match(imgRegex);
                      if (contentMatch && contentMatch[1]) {
                        thumbnail = contentMatch[1];
                      } else {
                        const descMatch = article.description?.match(imgRegex);
                        if (descMatch && descMatch[1]) {
                          thumbnail = descMatch[1];
                        }
                      }
                    }
                    
                    return (
                      <a 
                        key={article.guid || index} 
                        href={article.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-brand-dark border border-brand-border rounded-2xl p-6 hover:border-brand-light/20 transition-colors group flex gap-4"
                      >
                        {thumbnail && (
                          <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-brand-gray hidden sm:block">
                            <img 
                              src={thumbnail} 
                              alt="" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        <div className="flex flex-col gap-3 flex-grow">
                          <div className="flex justify-between items-start gap-4">
                            <h3 className="text-lg font-semibold group-hover:text-brand-accent transition-colors leading-snug">
                              {article.title}
                            </h3>
                            <ExternalLink size={18} className="text-brand-light/30 group-hover:text-brand-accent shrink-0" />
                          </div>
                          <div className="flex items-center gap-4 text-xs text-brand-light/50 font-medium mt-auto">
                            <span className="bg-brand-gray px-2 py-1 rounded-md">{domain}</span>
                            <span className="flex items-center gap-1"><Clock size={14} className="text-brand-light/40"/> {new Date(article.pubDate).toLocaleDateString('lv-LV')}</span>
                            {article.author && <span className="truncate max-w-[150px]">{article.author}</span>}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </>
          )}

        </div>
      </main>

      {/* Theme Selection Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-brand-dark border border-brand-border p-8 rounded-3xl max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2 text-center">Izvēlies tēmu</h2>
            <p className="text-brand-light/50 text-center mb-8 text-sm">Kāds izskats tev patīk labāk? To vēlāk varēsi mainīt iestatījumos.</p>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => selectTheme('dark')}
                className="flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-brand-border hover:border-brand-accent transition-all bg-[#0A0A0A] group"
              >
                <div className="w-16 h-16 rounded-full bg-[#1A1A1A] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Moon size={32} className="text-white" />
                </div>
                <span className="font-semibold text-white">Tumšā</span>
              </button>
              
              <button 
                onClick={() => selectTheme('light')}
                className="flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-brand-border hover:border-brand-accent transition-all bg-white group"
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sun size={32} className="text-gray-900" />
                </div>
                <span className="font-semibold text-gray-900">Gaišā</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="text-[10px] font-semibold text-brand-light/40 uppercase tracking-widest mb-2 px-2">
        {title}
      </div>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

function NavItem({ icon, label, active }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-brand-gray text-brand-light' : 'text-brand-light/60 hover:bg-brand-gray/50 hover:text-brand-light'}`}>
      <span className={active ? 'text-brand-accent' : 'text-brand-light/40'}>{icon}</span>
      {label}
    </button>
  );
}

function ToolCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-brand-dark border border-brand-border rounded-2xl p-6 hover:border-brand-light/20 transition-colors group cursor-pointer flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-black flex items-center justify-center">
          {icon}
        </div>
        <ChevronRightIcon />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-brand-light/50 text-sm leading-relaxed flex-grow">
        {description}
      </p>
    </div>
  );
}

function IconSidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <div className="relative group flex justify-center w-full">
      <button 
        onClick={onClick}
        className={`p-3 rounded-xl transition-colors w-full flex justify-center ${active ? 'bg-brand-gray text-brand-light' : 'text-brand-light/50 hover:bg-brand-gray hover:text-brand-light'}`}
      >
        {icon}
      </button>
      {/* Tooltip */}
      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-brand-gray border border-brand-border rounded text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
        {label}
      </div>
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-light/30 group-hover:text-brand-light transition-colors">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
