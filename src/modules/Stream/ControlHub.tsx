import { useState, useEffect } from 'react';
import { Radio, Sparkles, Waves, Activity, ExternalLink, Terminal, BarChart3, ShieldCheck } from 'lucide-react';

/**
 * ControlHub Sub-module
 * Handles real-time stream health, analytics, and chat-based command processing.
 */

export const ControlHub = () => {
    const [isStreaming, _setIsStreaming] = useState(false);
    const [streamHealth, _setStreamHealth] = useState('OPTIMAL');
    const [concurrentViewers, setConcurrentViewers] = useState(0);
    const [watchHours, _setWatchHours] = useState(124.5);
    const [_isSyncing, _setIsSyncing] = useState(false);
    
    // Neural Parameters
    const [complexity, setComplexity] = useState(75);
    const [gain, setGain] = useState(45);

    // Simulated real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            if (isStreaming) {
                setConcurrentViewers(Math.floor(Math.random() * 50) + 10);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [isStreaming]);

    const openBroadcast = () => {
        window.open('/broadcast', 'PH_BROADCAST', 'width=1920,height=1080');
    };

    return (
        <div className="flex flex-col gap-6 h-full font-sans">
            {/* Main Control Panel */}
            <div className="glass-panel p-6 flex flex-col gap-6 rounded-lg border border-main">
                <header className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-sm border transition-all duration-500 ${
                            isStreaming ? 'bg-success/20 border-success shadow-[0_0_15px_rgba(0,255,100,0.2)]' : 'bg-primary/20 border-primary'
                        }`}>
                            <Activity size={20} className={isStreaming ? 'text-success animate-pulse' : 'text-primary'} />
                        </div>
                        <div>
                            <h2 className="text-xl font-header tracking-widest text-header uppercase">STREAM_CONTROL_HUB</h2>
                            <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-success animate-pulse' : 'bg-text-dim opacity-50'}`} />
                                <span className="tech-text text-[10px] text-text-dim uppercase">
                                    {isStreaming ? 'TRANSCEIVER_ACTIVE' : 'READY_FOR_UPLINK'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={openBroadcast}
                            className="p-2 hover:bg-main/20 rounded border border-transparent hover:border-main transition-all group"
                            title="Open Clean Feed"
                        >
                            <ExternalLink size={18} className="text-text-dim group-hover:text-primary" />
                        </button>
                    </div>
                </header>

                {/* Health & Analytics Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-panel-solid border border-main rounded group">
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck size={12} className="text-success" />
                            <span className="tech-text text-[9px] text-text-dim uppercase">Health</span>
                        </div>
                        <span className="text-xs font-header text-success tracking-wider">{streamHealth}</span>
                    </div>
                    <div className="p-3 bg-panel-solid border border-main rounded">
                        <div className="flex items-center gap-2 mb-1">
                            <Radio size={12} className="text-primary" />
                            <span className="tech-text text-[9px] text-text-dim uppercase">Viewers</span>
                        </div>
                        <span className="text-xs font-header text-white tracking-wider">{concurrentViewers}</span>
                    </div>
                    <div className="p-3 bg-panel-solid border border-main rounded">
                        <div className="flex items-center gap-2 mb-1">
                            <BarChart3 size={12} className="text-accent" />
                            <span className="tech-text text-[9px] text-text-dim uppercase">Watch Time</span>
                        </div>
                        <span className="text-xs font-header text-white tracking-wider">{watchHours}H</span>
                    </div>
                    <div className="p-3 bg-panel-solid border border-main rounded">
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles size={12} className="text-primary" />
                            <span className="tech-text text-[9px] text-text-dim uppercase">Monetization</span>
                        </div>
                        <div className="h-1 bg-main/30 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '3.1%' }} />
                        </div>
                    </div>
                </div>

                {/* Command Center Simulator */}
                <div className="bg-deep/50 border border-main p-4 rounded-sm font-mono relative group">
                    <div className="flex items-center gap-2 mb-3 text-primary">
                        <Terminal size={14} />
                        <span className="tech-text text-[10px] uppercase">Chat Command Interface</span>
                    </div>
                    <div className="space-y-1 opacity-60 overflow-hidden h-20 text-[10px] text-text-dim">
                        <p className="glitch-text-sm">&gt;&gt;&gt; ANALYZING_SESSION_METRICS...</p>
                        <p>&gt;&gt;&gt; GAIN_ESTABLISHED: 45DB</p>
                        <p>&gt;&gt;&gt; WAIT_FOR_USER_COMMAND</p>
                    </div>
                    <div className="absolute bottom-2 right-4 flex gap-2">
                        <button className="px-3 py-1 bg-primary/10 border border-primary/30 text-[9px] text-primary hover:bg-primary/20 rounded">RESTART_STREAM</button>
                        <button className="px-3 py-1 bg-error/10 border border-error/30 text-[9px] text-error hover:bg-error/20 rounded">KILL_SIGNAL</button>
                    </div>
                </div>

                {/* Real-time Parameter Adjustment */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-main/30">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-text-dim">
                            <div className="flex items-center gap-2">
                                <Sparkles size={14} className="text-accent" />
                                <span className="tech-text text-[10px] uppercase">Neural Complexity</span>
                            </div>
                            <span className="tech-text text-[10px] text-primary">{complexity}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" max="100"
                            value={complexity}
                            onChange={(e) => setComplexity(parseInt(e.target.value))}
                            className="w-full h-1 bg-main accent-primary rounded-full cursor-pointer appearance-none" 
                        />
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-text-dim">
                            <div className="flex items-center gap-2">
                                <Waves size={14} className="text-secondary" />
                                <span className="tech-text text-[10px] uppercase">Synthesis Gain</span>
                            </div>
                            <span className="tech-text text-[10px] text-secondary">{gain}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" max="100"
                            value={gain}
                            onChange={(e) => setGain(parseInt(e.target.value))}
                            className="w-full h-1 bg-main accent-secondary rounded-full cursor-pointer appearance-none" 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
