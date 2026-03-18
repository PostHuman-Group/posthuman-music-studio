import React, { useState, useCallback } from 'react';
import { Radio, StopCircle, PlayCircle, Settings, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * BroadcastEngine Sub-module
 * Handles the operational broadcast pipeline: FFmpeg on GCP + Silent OBS Fallback.
 */

interface BroadcastEngineProps {
    uplinkUrl?: string; 
}

export const BroadcastEngine: React.FC<BroadcastEngineProps> = ({ 
    uplinkUrl = '/.netlify/functions/trigger-ffmpeg' 
}) => {
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'initializing' | 'streaming' | 'error' | 'fallback'>('idle');

    const handleIngestFailure = useCallback((errorMsg: string) => {
        setError(errorMsg);
        setStatus('fallback');
        
        // TODO: Silently trigger OBS Fallback logic
        console.warn('FFmpeg Broadcast Failed. Initializing Silent OBS Fallback...');
        
        // For MVP, set status to fallback
        setIsStreaming(false);
    }, []);

    const startStreaming = useCallback(async () => {
        setStatus('initializing');
        setError(null);

        try {
            // Trigger FFmpeg build on GCP via netlify function
            // const response = await fetch(uplinkUrl, { method: 'POST' });
            // if (!response.ok) throw new Error('Uplink rejected');
            
            // Mock delay for UI
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            setIsStreaming(true);
            setStatus('streaming');

        } catch (err: any) {
            console.error('Failed to establish uplink:', err);
            handleIngestFailure(err.message || 'Uplink unavailable');
        }
    }, [uplinkUrl, handleIngestFailure]);

    const stopStreaming = useCallback(async () => {
        setIsStreaming(false);
        setStatus('idle');
        // TODO: fetch('/.netlify/functions/stop-ffmpeg');
    }, []);

    return (
        <div className="bg-panel-solid border border-main p-6 rounded-lg glass-panel relative overflow-hidden group">
            {/* Background Status Glow */}
            <div className={`absolute inset-0 transition-opacity duration-500 opacity-5 ${
                status === 'streaming' ? 'bg-success' : 
                status === 'fallback' ? 'bg-amber-500' :
                status === 'error' ? 'bg-error' : 'bg-primary'
            }`} />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                            status === 'streaming' ? 'bg-success/20 text-success' : 
                            status === 'fallback' ? 'bg-amber-500/20 text-amber-500' :
                            'bg-primary/20 text-primary'
                        }`}>
                            <Radio size={20} className={status === 'streaming' ? 'animate-pulse' : ''} />
                        </div>
                        <div>
                            <h3 className="font-header text-sm tracking-widest text-white uppercase">BROADCAST_ENGINE</h3>
                            <span className="tech-text text-[10px] text-text-dim">
                                {status === 'fallback' ? 'FALLBACK_ACTIVE // OBS_SILENT' : 'GCP_E2_MICRO // FFMPEG_CORE'}
                            </span>
                        </div>
                    </div>

                    <div className="tech-text text-[10px] bg-main/30 px-3 py-1 border border-main rounded uppercase">
                        {status}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        {!isStreaming && status !== 'fallback' ? (
                            <button
                                onClick={startStreaming}
                                disabled={status === 'initializing'}
                                className="flex-1 bg-primary hover:bg-primary-glow text-bg-deep font-header text-xs py-3 px-6 rounded skew-x-[-12deg] transition-all flex items-center justify-center gap-2 group/btn"
                            >
                                <PlayCircle size={16} />
                                <span>{status === 'initializing' ? 'INITIALIZING...' : 'ESTABLISH_UPLINK'}</span>
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
                        {status === 'fallback' && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded text-[11px] text-amber-500 tech-text"
                            >
                                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                <span>FALLBACK_ENGAGED: FFmpeg Core Failed. OBS redundant link active.</span>
                            </motion.div>
                        )}
                        {error && status !== 'fallback' && (
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
                                <span className="text-xs font-header text-white">720P_STABLE</span>
                            </div>
                            <div className="p-3 bg-main/20 border border-main rounded">
                                <span className="tech-text text-[9px] text-text-dim uppercase block mb-1">Target Endpoint</span>
                                <span className="text-xs font-header text-success">YouTube_RTMP</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tech Decoration */}
            <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-40 transition-opacity">
                <span className="tech-text text-[7px] block">ENGINE: GCP_E2_MICRO</span>
                <span className="tech-text text-[7px] block">FAILOVER: OBS_SILENT</span>
            </div>
        </div>
    );
};
