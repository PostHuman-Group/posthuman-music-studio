import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, FastForward, Radio, Sparkles, Waves, ExternalLink } from 'lucide-react';
import { MetadataManager } from './MetadataManager';

export const StreamEngine = () => {
    const [isStreaming, setIsStreaming] = useState(false);
    const [genre, setGenre] = useState('Cyberpunk Ambient');
    const [complexity, setComplexity] = useState(75);
    const [gain, setGain] = useState(45);
    const [blendProgress, setBlendProgress] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);
    const lastUpdate = useRef<number>(0);

    // Sync state to DB
    useEffect(() => {
        const syncState = async () => {
            if (Date.now() - lastUpdate.current < 2000) return; // Debounce sync
            
            setIsSyncing(true);
            try {
                await fetch('/.netlify/functions/update-stream-state', {
                    method: 'POST',
                    body: JSON.stringify({ 
                        genre, 
                        complexity, 
                        gain,
                        isStreaming 
                    }),
                });
                lastUpdate.current = Date.now();
            } catch (error) {
                console.error('State sync error:', error);
            } finally {
                setTimeout(() => setIsSyncing(false), 500);
            }
        };

        syncState();
    }, [genre, complexity, gain, isStreaming]);

    // Simulate genre blending animation
    useEffect(() => {
        if (isStreaming) {
            const interval = setInterval(() => {
                setBlendProgress((prev) => (prev + 0.5) % 100);
            }, 100);
            return () => clearInterval(interval);
        }
    }, [isStreaming]);

    const openBroadcast = () => {
        window.open('/broadcast', 'PH_BROADCAST', 'width=1920,height=1080');
    };

    return (
        <div className="flex flex-col gap-6 h-full font-sans">
            <div className="glass-panel p-6 flex flex-col gap-6">
                <header className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-sm border transition-all duration-500 ${
                            isStreaming ? 'bg-success-dim border-success shadow-[0_0_15px_var(--success)]' : 'bg-primary-dim border-primary'
                        }`}>
                            <Radio size={20} className={isStreaming ? 'text-success animate-pulse' : 'text-primary'} />
                        </div>
                        <div>
                            <h2 className="text-xl font-header tracking-widest text-header uppercase">Neural Stream Engine</h2>
                            <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-success animate-pulse' : 'bg-text-dim opacity-50'}`} />
                                <span className="tech-text text-[10px]">{isStreaming ? 'LIVE // BROADCASTING' : 'STANDBY // LINK READY'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {isSyncing && <span className="tech-text text-[8px] text-primary animate-pulse">SYNCING...</span>}
                        <button 
                            onClick={openBroadcast}
                            className="p-2 hover:bg-main/20 rounded-full transition-colors group"
                            title="Open Clean Feed for OBS"
                        >
                            <ExternalLink size={18} className="text-text-dim group-hover:text-primary" />
                        </button>
                    </div>
                </header>

                <div className="bg-panel-solid border border-main p-6 rounded-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                    <span className="tech-text text-[9px] text-text-dim block mb-2 tracking-[0.2em]">Current Synthesis Layer</span>
                    <input 
                        type="text"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        className="bg-transparent border-none text-2xl font-header text-primary tracking-wider mb-4 group-hover:glitch-text cursor-text w-full outline-none"
                    />
                    
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="tech-text text-[8px]">Genre Blend Matrix</span>
                            <span className="tech-text text-[8px] text-primary">{Math.round(blendProgress)}%</span>
                        </div>
                        <div className="h-1 bg-deep rounded-full overflow-hidden border border-main/50">
                            <motion.div 
                                className="h-full bg-primary shadow-[0_0_10px_var(--primary)]"
                                animate={{ width: `${blendProgress}%` }}
                                transition={{ type: "spring", bounce: 0, duration: 0.1 }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6 justify-center">
                    <div className="flex justify-center items-center gap-8">
                        <button className="text-text-dim hover:text-header transition-colors">
                            <FastForward size={24} className="rotate-180" />
                        </button>
                        <button
                            onClick={() => setIsStreaming(!isStreaming)}
                            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                                isStreaming 
                                    ? 'bg-danger-dim border-danger text-danger hover:scale-105 shadow-[0_0_30px_rgba(255,100,100,0.2)]' 
                                    : 'bg-primary-dim border-primary text-primary hover:scale-105 shadow-[0_0_20px_var(--primary-dim)]'
                            }`}
                        >
                            {isStreaming ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                        </button>
                        <button className="text-text-dim hover:text-header transition-colors">
                            <FastForward size={24} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-main/30">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-text-dim">
                                <Sparkles size={14} className="text-accent" />
                                <span className="tech-text text-[10px]">Complexity</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100"
                                value={complexity}
                                onChange={(e) => setComplexity(parseInt(e.target.value))}
                                className="w-full accent-primary bg-deep border-none cursor-pointer" 
                            />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-text-dim">
                                <Waves size={14} className="text-secondary" />
                                <span className="tech-text text-[10px]">Neural Gain</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100"
                                value={gain}
                                onChange={(e) => setGain(parseInt(e.target.value))}
                                className="w-full accent-secondary bg-deep border-none cursor-pointer" 
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-4 flex justify-between items-center opacity-40">
                    <span className="tech-text text-[8px]">ID: PH-ENGINE-01</span>
                    <span className="tech-text text-[8px]">BUFFER: 1024MS</span>
                </div>
            </div>

            {/* Neural SEO Section */}
            <MetadataManager genre={genre} />
        </div>
    );
};
