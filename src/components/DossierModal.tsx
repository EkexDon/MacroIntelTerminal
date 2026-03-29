'use client';

import { useEffect, useState } from 'react';

interface DossierModalProps {
  keyword: string;
  sourceLink: string;
  onClose: () => void;
}

export default function DossierModal({ keyword, sourceLink, onClose }: DossierModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWiki = async () => {
      try {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(keyword)}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          setData({ notFound: true });
        }
      } catch (err) {
        setData({ notFound: true });
      } finally {
        setLoading(false);
      }
    };
    fetchWiki();
  }, [keyword]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="glass-panel w-full max-w-2xl bg-surface/90 border-primary/30 shadow-[0_0_50px_rgba(0,255,136,0.1)] relative z-10 animate-in fade-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <h3 className="font-mono text-primary tracking-widest uppercase text-sm font-bold">
              AUTONOMOUS DOSSIER: {keyword}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxwYXRoIGQ9Ik0wLDBGMTAsMTBMMjAsMEwzMCwxMEw0MCwwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiIGZpbGw9Im5vbmUiIC8+Cjwvc3ZnPg==')] opacity-20 pointer-events-none" />
          
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="font-mono text-xs tracking-widest text-primary uppercase animate-pulse">
                QUERYING WIKIPEDIA CORE ARCHIVES...
              </p>
            </div>
          ) : data?.notFound ? (
            <div className="text-center py-10">
              <p className="text-danger font-mono text-sm tracking-widest uppercase">
                ERROR: SUBJECT NOT FOUND IN ARCHIVES.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex flex-col md:flex-row gap-6">
                {data?.thumbnail && (
                  <img 
                    src={data.thumbnail.source} 
                    alt={keyword} 
                    className="w-32 h-32 object-cover rounded border border-white/20 shadow-lg shrink-0"
                  />
                )}
                <div>
                  <h4 className="text-2xl font-['Outfit'] font-bold text-white mb-2">{data?.title}</h4>
                  <p className="text-sm font-mono text-gray-400 mb-4">{data?.description}</p>
                  <p className="text-gray-300 leading-relaxed font-['Inter'] text-sm">
                    {data?.extract}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex justify-between items-center">
          <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">
            SECURE INTEL DB: WIKIPEDIA REST V1
          </span>
          <a 
            href={sourceLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/50 text-primary rounded font-mono text-xs tracking-widest uppercase transition-colors"
          >
            PROCEED TO SOURCE DECRYPT ⇲
          </a>
        </div>
      </div>
    </div>
  );
}
