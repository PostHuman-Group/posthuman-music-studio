import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Video, Sparkles, Loader2, Download, Zap, Layout } from 'lucide-react';

export interface Asset {
    id: string;
    type: 'image' | 'video';
    prompt: string;
    url: string;
    status: 'ready' | 'generating' | 'failed';
    createdAt: string;
}

interface AssetStudioProps {
    onSelectAsset?: (asset: Asset) => void;
}

export const AssetStudio: React.FC<AssetStudioProps> = ({ onSelectAsset }) => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [theme, setTheme] = useState('');
    const [generationType, setGenerationType] = useState<'image' | 'video'>('image');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        const fetchAssets = async () => {
            try {
                const response = await fetch('/.netlify/functions/get-assets');
                if (response.ok) {
                    const json = await response.json();
                    setAssets(json.data || []);
                }
            } catch (error) {
                console.error('Failed to fetch assets:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAssets();
    }, []);

    const generateAsset = async () => {
        if (!theme) return;
        setIsGenerating(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 3000));

            const generatedUrl = generationType === 'image'
                ? `https://picsum.photos/seed/${Math.random()}/1920/1080`
                : `https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-at-night-with-bright-neon-lights-44534-preview.mp4`;

            const res = await fetch('/.netlify/functions/save-asset', {
                method: 'POST',
                body: JSON.stringify({
                    type: generationType,
                    prompt: theme,
                    url: generatedUrl,
                }),
            });

            if (res.ok) {
                const json = await res.json();
                setAssets([json.data, ...assets]);
            }
            setTheme('');
        } catch (error) {
            console.error('Failed to generate or save asset:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="glass-panel p-6 flex flex-col gap-6 h-full font-sans">
            <header className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-dim border border-primary rounded-sm">
                        {generationType === 'image' ? <ImageIcon size={20} className="text-primary" /> : <Video size={20} className="text-primary" />}
                    </div>
                    <div>
                        <h2 className="text-xl font-header tracking-widest text-header uppercase">Asset Neural-Forge</h2>
                        <span className="tech-text text-[10px]">Matrix Layer: 04 // Priority: High</span>
                    </div>
                </div>

                <div className="flex bg-panel-solid p-1 border border-main rounded-sm">
                    <button
                        onClick={() => setGenerationType('image')}
                        className={`px-4 py-1.5 rounded-sm transition-all font-header text-[10px] uppercase ${
                            generationType === 'image' ? 'bg-primary text-bg-deep' : 'text-text-dim hover:text-primary'
                        }`}
                    >
                        Static
                    </button>
                    <button
                        onClick={() => setGenerationType('video')}
                        className={`px-4 py-1.5 rounded-sm transition-all font-header text-[10px] uppercase ${
                            generationType === 'video' ? 'bg-primary text-bg-deep' : 'text-text-dim hover:text-primary'
                        }`}
                    >
                        Motion
                    </button>
                </div>
            </header>

            <div className="flex gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        placeholder="Define visual aesthetic..."
                        className="w-full bg-panel-solid border border-main p-4 font-sans text-sm text-header focus:border-primary focus:outline-none transition-all placeholder:text-text-dim/50"
                    />
                    <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30 w-5 h-5" />
                </div>
                <button
                    onClick={generateAsset}
                    disabled={isGenerating || !theme}
                    className="btn-cyber flex items-center gap-2 px-8 min-w-[160px] justify-center"
                >
                    {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Zap className="w-5 h-5" />}
                    Generate
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="animate-spin text-primary w-8 h-8" />
                    </div>
                ) : assets.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                        <Layout size={48} className="mb-4" />
                        <p className="font-header text-xs tracking-[0.3em] uppercase">No Assets Synthesized</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <AnimatePresence mode="popLayout">
                            {assets.map((asset) => (
                                <motion.div
                                    key={asset.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="group relative aspect-video bg-panel-solid border border-main rounded-sm overflow-hidden"
                                >
                                    {asset.type === 'image' ? (
                                        <img src={asset.url} alt={asset.prompt} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    ) : (
                                        <video src={asset.url} autoPlay loop muted className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    )}
                                    
                                    <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                        <p className="text-[10px] tech-text text-header mb-2 line-clamp-1">{asset.prompt}</p>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => onSelectAsset?.(asset)}
                                                className="btn-cyber text-[8px] py-1 px-3 flex-1"
                                            >
                                                Select
                                            </button>
                                            <a 
                                                href={asset.url} 
                                                download 
                                                className="p-2 bg-panel-solid border border-main text-text-dim hover:text-primary transition-colors"
                                            >
                                                <Download size={14} />
                                            </a>
                                        </div>
                                    </div>
                                    
                                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-bg-deep/80 border border-primary/30 rounded-sm">
                                        <span className="text-[8px] tech-text text-primary lowercase">{asset.type}</span>
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
