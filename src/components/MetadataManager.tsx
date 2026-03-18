import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Check, Info, TrendingUp, Image as ImageIcon } from 'lucide-react';

interface Metadata {
    title: string;
    description: string;
    tags: string[];
    thumbnailPrompt: string;
    strategy: string;
}

export const MetadataManager = ({ genre }: { genre: string }) => {
    const [metadata, setMetadata] = useState<Metadata | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const generateMetadata = async () => {
        setIsGenerating(true);
        try {
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
        <div className="bg-panel-solid/30 border border-main p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-header text-white flex items-center gap-3">
                        <TrendingUp size={20} className="text-primary" />
                        NEURAL_SEO_ENGINE
                    </h3>
                    <p className="text-xs text-text-dim tech-text tracking-widest mt-1">
                        OPTIMIZING_FOR_YOUTUBE_ALGORITHM_2026
                    </p>
                </div>
                <button 
                    onClick={generateMetadata}
                    disabled={isGenerating}
                    className="tech-button py-2 px-6 flex items-center gap-2 group"
                >
                    <Sparkles size={16} className={isGenerating ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'} />
                    {isGenerating ? 'ANALYZING_TRENDS...' : 'GENERATE_META'}
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
                        {/* Title Section */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] tech-text text-primary uppercase">Optimized Title</label>
                                <button onClick={() => copyToClipboard(metadata.title, 'title')} className="text-text-dim hover:text-white transition-colors">
                                    {copiedField === 'title' ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                                </button>
                            </div>
                            <div className="bg-deep/50 border border-main p-3 text-sm text-white font-mono break-all">
                                {metadata.title}
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] tech-text text-primary uppercase">Optimized Description</label>
                                <button onClick={() => copyToClipboard(metadata.description, 'desc')} className="text-text-dim hover:text-white transition-colors">
                                    {copiedField === 'desc' ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                                </button>
                            </div>
                            <div className="bg-deep/50 border border-main p-3 text-xs text-text-dim font-mono max-h-32 overflow-y-auto whitespace-pre-wrap">
                                {metadata.description}
                            </div>
                        </div>

                        {/* Thumbnail Prompt Section */}
                        <div className="bg-secondary/5 border border-secondary/20 p-4 space-y-3">
                            <div className="flex items-center gap-2 text-secondary">
                                <ImageIcon size={16} />
                                <span className="text-[10px] tech-text uppercase tracking-widest">Thumbnail Strategy</span>
                            </div>
                            <p className="text-xs text-white/80 leading-relaxed italic border-l-2 border-secondary pl-3">
                                "{metadata.thumbnailPrompt}"
                            </p>
                            <button 
                                onClick={() => copyToClipboard(metadata.thumbnailPrompt, 'thumb')}
                                className="text-[10px] tech-text text-secondary hover:underline flex items-center gap-1"
                            >
                                {copiedField === 'thumb' ? 'COPIED_PROMPT' : 'COPY_THUMBNAIL_PROMPT'}
                            </button>
                        </div>

                        {/* Strategy Note */}
                        <div className="flex gap-3 p-3 bg-primary/5 border border-primary/20">
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
                    <div className="h-48 border border-dashed border-main flex items-center justify-center">
                        <p className="tech-text text-xs text-text-dim animate-pulse">
                            AWAITING_GENRE_INPUT_FOR_RESEARCH...
                        </p>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
