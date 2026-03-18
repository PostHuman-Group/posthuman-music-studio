import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, Download, Trash2, Sparkles, Music, Loader2, Zap, Layout } from 'lucide-react';
import { formatDate } from '../lib/localization';

interface Sample {
  id: string;
  name: string;
  theme: string;
  duration: string;
  type: 'synth' | 'drum' | 'loop' | 'fx' | 'vocal';
  createdAt: string;
  url?: string;
}

export const SampleLibrary = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    try {
      const res = await fetch('/.netlify/functions/get-samples');
      const json = await res.json();
      if (json.data) {
        setSamples(json.data.map((s: any) => ({
          id: s.id,
          name: s.name,
          theme: s.theme || s.prompt,
          duration: s.duration || '0:30',
          type: s.type || 'loop',
          createdAt: formatDate(new Date(s.createdAt)),
          url: s.url
        })));
      }
    } catch (error) {
      console.error('Failed to fetch samples:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);

    try {
      // Logic for AI generation would go here
      await new Promise(resolve => setTimeout(resolve, 3000));

      const newSample: Sample = {
        id: Math.random().toString(36).substr(2, 9),
        name: prompt.split(' ').slice(0, 2).join(' ') || 'Neural Sample',
        theme: prompt,
        duration: '0:30',
        type: 'loop',
        createdAt: formatDate(new Date())
      };
      setSamples([newSample, ...samples]);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
      setPrompt('');
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const res = await fetch('/.netlify/functions/delete-sample', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setSamples(samples.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Error deleting sample:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredSamples = samples.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.theme.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="glass-panel p-6 flex flex-col gap-6 h-full font-sans">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-secondary-dim border border-secondary rounded-sm">
            <Music size={20} className="text-secondary" />
          </div>
          <div>
            <h2 className="text-xl font-header tracking-widest text-header uppercase">Neural-Sonic Vault</h2>
            <span className="tech-text text-[10px]">Registry Layer: 09 // Audio Samples</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-panel-solid border border-main rounded-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_5px_var(--success)]" />
          <span className="tech-text text-[10px]">Cloud Sync: Active</span>
        </div>
      </header>

      {/* Input Section */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe neural audio pattern..."
            className="w-full bg-panel-solid border border-main p-4 font-sans text-sm text-header focus:border-secondary focus:outline-none transition-all placeholder:text-text-dim/50"
          />
          <Zap className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/30 w-5 h-5" />
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt}
          className="btn-cyber btn-cyber-secondary flex items-center gap-2 px-8 min-w-[160px] justify-center"
        >
          {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          Synthesize
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim w-4 h-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter registry..."
          className="w-full bg-deep/50 border border-main pl-12 pr-4 py-2 font-mono text-[10px] uppercase tracking-wider text-text-dim focus:border-primary focus:outline-none transition-all"
        />
      </div>

      {/* Samples Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-primary w-8 h-8" />
          </div>
        ) : filteredSamples.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
            <Layout size={48} className="mb-4" />
            <p className="font-header text-xs tracking-[0.3em] uppercase">Registry Empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredSamples.map((sample) => (
                <motion.div
                  key={sample.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-panel-solid border border-main p-4 rounded-sm border-l-2 border-l-secondary hover:bg-secondary-dim/10 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="text-xs font-header tracking-wider truncate mb-1 text-header">{sample.name}</h3>
                      <p className="text-[10px] text-text-dim truncate lowercase line-clamp-1">{sample.theme}</p>
                    </div>
                    <span className="tech-text text-[9px] text-secondary opacity-60">[{sample.type}]</span>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <button className="w-8 h-8 rounded-full bg-primary-dim border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-bg-deep transition-all">
                        <Play size={14} fill="currentColor" />
                      </button>
                      <div>
                        <span className="tech-text text-[9px] block text-text-dim/80">{sample.duration}</span>
                        <span className="tech-text text-[8px] block opacity-40">{sample.createdAt}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={sample.url}
                        download
                        className="p-1.5 text-text-dim hover:text-primary transition-colors"
                      >
                        <Download size={16} />
                      </a>
                      <button
                        onClick={() => handleDelete(sample.id)}
                        disabled={isDeleting === sample.id}
                        className="p-1.5 text-text-dim hover:text-danger transition-colors"
                      >
                        {isDeleting === sample.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
