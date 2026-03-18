import React, { useState, useCallback } from 'react';
import OvenLiveKit from 'ovenlivekit';
import { Radio, StopCircle, PlayCircle, Settings, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StreamBroadcasterProps {
    streamId?: string;
    ovenUrl?: string; // e.g., ws://localhost:3333/app/stream
}

export const StreamBroadcaster: React.FC<StreamBroadcasterProps> = ({ 
    ovenUrl = 'ws://localhost:3333/app/ph_live' 
}) => {
    const [isStreaming, setIsStreaming] = useState(false);
    const [broadcaster, setBroadcaster] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'initializing' | 'streaming' | 'error'>('idle');

    const startStreaming = useCallback(async () => {
        setStatus('initializing');
        setError(null);

        try {
            // Initialize OvenLiveKit for Web
            const kit = OvenLiveKit.create();
            
            // Capture the whole window/tab for the clean feed
            // For production, we might want to capture a specific element or the current tab
            const stream = await (navigator.mediaDevices as any).getDisplayMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    frameRate: { ideal: 30 }
                },
                audio: true
            });

            await kit.startStreaming(ovenUrl, {
                stream: stream
            });

            setBroadcaster(kit);
            setIsStreaming(true);
            setStatus('streaming');

            kit.on('error', (err: any) => {
                console.error('OvenLiveKit error:', err);
                setError(err.message || 'Streaming failed');
                setStatus('error');
                setIsStreaming(false);
            });

        } catch (err: any) {
            console.error('Failed to start stream:', err);
            setError(err.message || 'Permission denied or OME unavailable');
            setStatus('error');
        }
    }, [ovenUrl]);

    const stopStreaming = useCallback(() => {
        if (broadcaster) {
            broadcaster.stopStreaming();
            setBroadcaster(null);
        }
        setIsStreaming(false);
        setStatus('idle');
    }, [broadcaster]);

    return (
        <div className="bg-panel-solid border border-main p-6 rounded-lg glass-panel relative overflow-hidden group">
            {/* Background Status Glow */}
            <div className={`absolute inset-0 transition-opacity duration-500 opacity-5 ${
                status === 'streaming' ? 'bg-success' : status === 'error' ? 'bg-error' : 'bg-primary'
            }`} />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                            status === 'streaming' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'
                        }`}>
                            <Radio size={20} className={status === 'streaming' ? 'animate-pulse' : ''} />
                        </div>
                        <div>
                            <h3 className="font-header text-sm tracking-widest text-white uppercase">STREAM_BROADCAST_ENGINE</h3>
                            <span className="tech-text text-[10px] text-text-dim">OME_CORE // SILENT_OBS_FALLBACK</span>
                        </div>
                    </div>

                    <div className="tech-text text-[10px] bg-main/30 px-3 py-1 border border-main rounded uppercase">
                        {status}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        {!isStreaming ? (
                            <button
                                onClick={startStreaming}
                                disabled={status === 'initializing'}
                                className="flex-1 bg-primary hover:bg-primary-glow text-bg-deep font-header text-xs py-3 px-6 rounded skew-x-[-12deg] transition-all flex items-center justify-center gap-2 group/btn"
                            >
                                <PlayCircle size={16} />
                                <span>{status === 'initializing' ? 'INITIALIZING...' : 'INITIALIZE_UPLINK'}</span>
                            </button>
                        ) : (
                            <button
                                onClick={stopStreaming}
                                className="flex-1 bg-error/20 hover:bg-error/30 text-error border border-error/50 font-header text-xs py-3 px-6 rounded skew-x-[-12deg] transition-all flex items-center justify-center gap-2"
                            >
                                <StopCircle size={16} />
                                <span>TERMINATE_UPLINK</span>
                            </button>
                        )}
                        <button className="p-3 bg-panel border border-main rounded hover:bg-main transition-colors text-text-dim hover:text-white">
                            <Settings size={18} />
                        </button>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-start gap-2 p-3 bg-error/10 border border-error/30 rounded text-[11px] text-error tech-text"
                            >
                                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                <span>CORE_ERROR: {error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isStreaming && (
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="p-3 bg-main/20 border border-main rounded">
                                <span className="tech-text text-[9px] text-text-dim uppercase block mb-1">Source Resolution</span>
                                <span className="text-xs font-header text-white">1080P_LINK</span>
                            </div>
                            <div className="p-3 bg-main/20 border border-main rounded">
                                <span className="tech-text text-[9px] text-text-dim uppercase block mb-1">Latency</span>
                                <span className="text-xs font-header text-success">SUB_SECOND</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Matrix Decorative Elements */}
            <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-40 transition-opacity">
                <span className="tech-text text-[7px] block">REF_ID: Ph_x01</span>
                <span className="tech-text text-[7px] block">PROT: WebRTC</span>
            </div>
        </div>
    );
};
