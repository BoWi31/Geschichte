
import React, { useState, useEffect, useMemo } from 'react';
import { ConfigData, PageEntry } from './types';

const App: React.FC = () => {
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('./pages.json');
        if (!response.ok) {
          throw new Error(`Die Datei "pages.json" wurde nicht gefunden oder konnte nicht geladen werden.`);
        }
        const data: ConfigData = await response.json();
        setConfig(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Fehler beim Lesen der Konfigurationsdatei.");
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const filteredPages = useMemo(() => {
    if (!config?.pages) return [];
    const query = search.toLowerCase().trim();
    if (!query) return config.pages;
    
    return config.pages.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(query)))
    );
  }, [config, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-500">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-medium">Lernraum wird vorbereitet...</p>
        </div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-10 bg-white rounded-3xl shadow-2xl border-2 border-red-50">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-red-100 rounded-2xl text-red-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Keine Seiten eingetragen</h2>
        </div>
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
          Es wurden noch keine Inhalte konfiguriert oder die Datei <code className="bg-slate-100 px-2 py-1 rounded">pages.json</code> fehlt.
        </p>
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Nächste Schritte:
          </h4>
          <ul className="space-y-3 text-blue-800">
            <li className="flex gap-2"><span>1.</span> Erstelle eine Datei namens <strong>pages.json</strong> im Hauptverzeichnis.</li>
            <li className="flex gap-2"><span>2.</span> Füge dort deine Unterseiten im JSON-Format hinzu.</li>
            <li className="flex gap-2"><span>3.</span> Lade die Seite mit <strong>F5</strong> neu.</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 pt-16 pb-12 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">{config.title}</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">{config.subtitle}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl w-full mx-auto p-6 md:p-12">
        {/* Search Bar - Only show if pages exist */}
        {config.pages.length > 0 && (
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="relative group">
              <input
                type="text"
                placeholder="Thema oder Schlagwort suchen..."
                className="w-full px-6 py-5 pl-14 bg-white border-2 border-slate-200 rounded-3xl shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg className="w-7 h-7 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )}

        {/* Dashboard Logic */}
        {config.pages.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 shadow-inner">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 rounded-full mb-6 text-slate-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Noch keine Inhalte verfügbar</h3>
            <p className="text-slate-500 mt-3 text-lg max-w-md mx-auto">
              Trage deine Unterseiten in die <code className="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">pages.json</code> ein, damit sie hier erscheinen.
            </p>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
            <p className="text-xl text-slate-400 italic font-medium">Keine passenden Themen für "{search}" gefunden.</p>
            <button 
              onClick={() => setSearch("")}
              className="mt-6 text-blue-600 font-bold hover:underline"
            >
              Suche zurücksetzen
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPages.map((page, idx) => (
              <a
                key={idx}
                href={page.path}
                className="group bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col h-full ring-1 ring-slate-200/50"
              >
                <div className="flex-grow">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {page.tags?.map((tag, tIdx) => (
                      <span key={tIdx} className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                    {page.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-lg">
                    {page.description}
                  </p>
                </div>
                
                <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between text-blue-600 font-black text-lg">
                  <span className="group-hover:mr-2 transition-all tracking-wide uppercase text-sm">Inhalt öffnen</span>
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 text-center bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm font-medium">
          <p>&copy; {new Date().getFullYear()} • {config.title}</p>
          <div className="flex gap-6">
             <span>Statische Strukturseite</span>
             <span className="hidden md:inline">•</span>
             <span>Optimiert für Cloudflare Pages</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
