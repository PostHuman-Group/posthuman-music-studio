import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Zap, Shield, Activity } from 'lucide-react';
import { Visualizer } from '../../components/Visualizer';

/**
 * CleanFeed Component
 * The operational visual output intended for OBS capture or OME ingest.
 * This is the "Clean Feed" mentioned in the PRD.
 */

export const CleanFeed = () => {
    const [state, setState] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchState = async () => {
            try {
                // Fetching from simulated stream state bridge
                const response = await fetch('/.netlify/functions/get-stream-state');
                if (response.ok) {
                    const json = await response.json();
                    setState(json.data);
                } else {
                    // Fallback mock state for visual testing
                    setState({
                        genre: 'DARK_AMBIENT_DRONE',
                        complexity: 75,
                        gain: 45,
                        id: 'FEED_x01'
                    });
                }
            } catch (error) {
                console.error('Broadcast fetch error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const interval = setInterval(fetchState, 5000);
        fetchState();
        return () => clearInterval(interval);
    }, []);

    if (isLoading && !state) {
        return (
            <div className="fixed inset-0 bg-deep flex flex-col items-center justify-center gap-4">
                <Radio className="text-primary animate-pulse" size={48} />
                <span className="tech-text text-primary text-sm tracking-[0.5em] animate-pulse">SYNCHRONIZING_CLEAN_FEED...</span>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-deep overflow-hidden cursor-none">
            {/* Global Post-Processing Effects */}
            <div className="scanline-effect opacity-30 pointer-events-none" />
            <div className="crt-vignette opacity-60 pointer-events-none" />

            {/* Background Synthesis Layer */}
            <div className="absolute inset-0 z-0 scale-105">
                <Visualizer 
                    isActive={true} 
                    backgroundAsset={state?.backgroundUrl ? { url: state.backgroundUrl, type: state.backgroundType } : undefined} 
                />
            </div>

            {/* Broadcast Overlay Layer */}
            <div className="absolute inset-0 flex flex-col justify-between p-12 z-10 pointer-events-none">
                
                {/* Header: Stream Metadata */}
                <header className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-primary border-2 border-primary shadow-[0_0_20px_var(--primary)] text-bg-deep flex items-center justify-center font-header text-3xl skew-x-[-12deg]">
                            PH
                        </div>
                        <div>
                            <h1 className="text-4xl font-header text-white tracking-tighter leading-none mb-2 uppercase">Neural_Feed_01</h1>
                            <div className="flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_10px_var(--success)]`} />
                                <span className="tech-text text-sm text-success tracking-widest uppercase">Live // Encrypted_Link_Established</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 text-primary opacity-60 uppercase">
                        <div className="flex items-center gap-2">
                            <span className="tech-text text-[10px]">SYNC_ID: {state?.id}</span>
                            <Shield size={12} />
                        </div>
                        <div className="tech-text text-[10px]">ENCODING: 1080P_RAW_60FPS</div>
                    </div>
                </header>

                {/* Footer: Dynamic Lower Thirds */}
                <footer className="flex justify-between items-end gap-12">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-panel-solid/80 backdrop-blur-md border border-main p-8 min-w-[500px] border-l-8 border-l-primary rounded-r"
                    >
                        <span className="tech-text text-xs text-text-dim block mb-3 uppercase tracking-[0.3em]">Currently Synthesizing</span>
                        <h2 className="text-5xl font-header text-primary tracking-wide uppercase mb-4 glitch-text">{state?.genre || 'Initializing...'}</h2>
                        
                        <div className="flex items-center gap-8">
                            <div className="flex flex-col gap-1">
                                <span className="tech-text text-[10px] text-text-dim uppercase">Complexity</span>
                                <div className="flex gap-[2px]">
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} className={`h-1.5 w-4 ${i < (state?.complexity / 10) ? 'bg-primary shadow-[0_0_5px_var(--primary)]' : 'bg-main'}`} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="tech-text text-[10px] text-secondary uppercase">Neural Gain</span>
                                <div className="flex gap-[2px]">
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} className={`h-1.5 w-4 ${i < (state?.gain / 10) ? 'bg-secondary shadow-[0_0_5px_var(--secondary)]' : 'bg-main'}`} />
                                    ))}
                                </div>
                            </div>
                            <div className="ml-auto">
                                <Activity className="text-primary animate-pulse" size={24} />
                            </div>
                        </div>
                    </motion.div>

                    <div className="flex flex-col items-end gap-4">
                        <div className="bg-panel-solid/50 px-6 py-3 border border-main flex items-center gap-4 rounded">
                            <Zap size={18} className="text-secondary" />
                            <div className="text-right">
                                <div className="text-[10px] tech-text text-text-dim uppercase">Broadcast Integrity</div>
                                <div className="text-xl font-header text-white">99.9% UPTIME</div>
                            </div>
                        </div>
                        <div className="tech-text text-[12px] text-primary/50 tracking-[0.5em] uppercase italic">
                            POSTHUMAN_STUDIO // STREAM_MODULE_v1
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};
