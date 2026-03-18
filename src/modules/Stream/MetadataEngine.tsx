import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Check, Info, TrendingUp, Image as ImageIcon, Layout } from 'lucide-react';

/**
 * MetadataEngine Sub-module
 * Handles AI-native metadata generation and scene design strategy.
 */

interface Metadata {
    title: string;
    description: string;
    tags: string[];
    thumbnailPrompt: string;
    strategy: string;
}

export const MetadataEngine = ({ genre }: { genre: string }) => {
    const [metadata, setMetadata] = useState<Metadata | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const generateMetadata = async () => {
        setIsGenerating(true);
        try {
            // Placeholder for Gemini-powered SEO generation
            const response = await fetch('/.netlify/functions/generate-stream-metadata', {
                method: 'POST',
                body: JSON.stringify({ genre }),
            });
            const json = await response.json();
            setMetadata(json.data);
        } catch (error) {
            console.error('Failed to generate metadata:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="bg-panel-solid/30 border border-main p-6 space-y-6 rounded-lg glass-panel">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-header text-white flex items-center gap-3">
                        <TrendingUp size={20} className="text-primary" />
                        METADATA_ENGINE
                    </h3>
                    <p className="text-xs text-text-dim tech-text tracking-widest mt-1">
                        GEMINI_POWERED // ALGORITHM_OPTIMIZED
                    </p>
                </div>
                <button 
                    onClick={generateMetadata}
                    disabled={isGenerating}
                    className="bg-primary hover:bg-primary-glow text-bg-deep font-header text-xs py-2 px-6 rounded skew-x-[-12deg] transition-all flex items-center gap-2 group"
                >
                    <Sparkles size={16} className={isGenerating ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'} />
                    {isGenerating ? 'ANALYZING_CORE...' : 'ESTABLISH_PLAN'}
                </button>
            </div>

            <AnimatePresence mode="wait">
                {metadata ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        {/* Title & Description */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] tech-text text-primary uppercase">Algorithm Title</label>
                                    <button onClick={() => copyToClipboard(metadata.title, 'title')} className="text-text-dim hover:text-white transition-colors">
                                        {copiedField === 'title' ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                                    </button>
                                </div>
                                <div className="bg-deep/50 border border-main p-3 text-sm text-white font-mono rounded">
                                    {metadata.title}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] tech-text text-primary uppercase">Optimized Description</label>
                                    <button onClick={() => copyToClipboard(metadata.description, 'desc')} className="text-text-dim hover:text-white transition-colors">
                                        {copiedField === 'desc' ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                                    </button>
                                </div>
                                <div className="bg-deep/50 border border-main p-3 text-xs text-text-dim font-mono max-h-24 overflow-y-auto rounded whitespace-pre-wrap">
                                    {metadata.description}
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail & Scene Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-secondary/5 border border-secondary/20 p-4 space-y-3 rounded">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-secondary">
                                        <ImageIcon size={16} />
                                        <span className="text-[10px] tech-text uppercase tracking-widest">Nano Banana 2 // Thumbnail</span>
                                    </div>
                                    <button onClick={() => copyToClipboard(metadata.thumbnailPrompt, 'thumb')} className="text-text-dim hover:text-white">
                                        {copiedField === 'thumb' ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                                    </button>
                                </div>
                                <p className="text-xs text-white/80 leading-relaxed italic border-l-2 border-secondary pl-3">
                                    "{metadata.thumbnailPrompt}"
                                </p>
                            </div>

                            <div className="bg-success/5 border border-success/20 p-4 space-y-3 rounded">
                                <div className="flex items-center gap-2 text-success">
                                    <Layout size={16} />
                                    <span className="text-[10px] tech-text uppercase tracking-widest">AI Scene Selection</span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 p-2 bg-success/10 border border-success/30 text-[9px] tech-text text-center rounded opacity-50">SCENE_A: CYBER_LOFI</div>
                                    <div className="flex-1 p-2 bg-success/20 border border-success/50 text-[9px] tech-text text-center rounded font-bold">SCENE_B: POST_HUMAN</div>
                                </div>
                            </div>
                        </div>

                        {/* Strategy Insight */}
                        <div className="flex gap-3 p-3 bg-primary/5 border border-primary/20 rounded">
                            <Info size={16} className="text-primary shrink-0" />
                            <div className="space-y-1">
                                <span className="text-[10px] tech-text text-primary uppercase">Algorithm Insight</span>
                                <p className="text-[11px] text-text-dim leading-snug">
                                    {metadata.strategy}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="h-32 border border-dashed border-main flex items-center justify-center rounded">
                        <p className="tech-text text-xs text-text-dim animate-pulse">
                            AWAITING_INGEST_PARAMETERS...
                        </p>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
