import { useState, useEffect } from 'react';
import { Share2, Youtube, Instagram, Link2, ExternalLink, Calendar, Loader2, Zap, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * BridgeScheduler Sub-module
 * Handles visual calendar-based scheduling and automated go-live triggers.
 */

interface Platform {
  name: string;
  icon: any;
  connected: boolean;
  status: string;
}

interface ScheduleEvent {
  id: string;
  title: string;
  startTime: string;
  status: 'armed' | 'live' | 'complete' | 'failed' | 'scheduled';
  contentRef: string;
}

export const BridgeScheduler = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const platforms: Platform[] = [
    { name: 'YouTube', icon: Youtube, connected: true, status: 'RESTREAMP_UPLINK_READY' },
    { name: 'Twitch', icon: Share2, connected: false, status: 'PHASE_2_STAGING' },
    { name: 'Instagram', icon: Instagram, connected: false, status: 'PHASE_2_STAGING' },
  ];

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch('/.netlify/functions/get-schedules');
        if (response.ok) {
          const json = await response.json();
          setEvents(json.data || []);
        } else {
          // Mock data for MVP if netlify func not available
          setEvents([
            { id: '1', title: 'DARK_AMBIENT_DRONE_v01', startTime: new Date().toISOString(), status: 'live', contentRef: 'PH_CORE_01' },
            { id: '2', title: 'SYNTH_WAVE_TRANSMISSION', startTime: new Date(Date.now() + 86400000).toISOString(), status: 'armed', contentRef: 'PH_CORE_02' }
          ]);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <div className="glass-panel h-full flex flex-col overflow-hidden font-sans border border-main rounded-lg">
      <header className="p-4 border-b border-main flex items-center justify-between bg-panel-solid/50">
        <div className="flex items-center gap-3">
          <Calendar size={18} className="text-secondary" />
          <h2 className="font-header text-sm tracking-widest text-header uppercase">
            Bridge <span className="text-secondary opacity-70 italic">Scheduler</span>
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[10px] tech-text text-text-dim">
          <Clock size={12} /> {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} UTC
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {/* Node Status */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="tech-text text-[10px] text-text-dim uppercase tracking-wider">Target Nodes</span>
            <span className="text-[9px] bg-secondary/10 text-secondary px-2 py-0.5 border border-secondary/20 rounded-sm">
              ACTIVE_ESTABLISHMENT
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {platforms.map((p) => (
              <div key={p.name} className="flex items-center gap-3 p-3 bg-deep/40 border border-main/50 hover:border-secondary/30 transition-colors group rounded">
                <div className={`p-2 rounded-sm ${p.connected ? 'bg-secondary/10 text-secondary' : 'bg-white/5 text-text-dim opacity-40'}`}>
                   <p.icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-header text-header uppercase tracking-tighter">{p.name}</div>
                  <div className={`text-[9px] tech-text leading-none mt-1 ${p.connected ? 'text-secondary' : 'text-text-dim'}`}>
                    {p.status}
                  </div>
                </div>
                {p.connected && (
                  <ExternalLink size={12} className="text-text-dim group-hover:text-secondary transition-colors cursor-pointer" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Transmission Log / Grid */}
        <section className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <Link2 size={12} className="text-primary" />
              <span className="tech-text text-[10px] text-text-dim uppercase tracking-wider">Transmission Log</span>
            </div>
            <button className="text-[9px] tech-text text-primary hover:underline">VIEW_CALENDAR</button>
          </div>
          
          <div className="space-y-2">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="animate-spin text-primary" size={24} />
                <span className="tech-text text-[10px] text-primary animate-pulse">CONNECTING_BACKBONE...</span>
              </div>
            ) : (
              <AnimatePresence>
                {events.length > 0 ? (
                  events.map((event, i) => (
                    <motion.div 
                      key={event.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`p-3 bg-deep/20 border-l-2 flex items-center justify-between group hover:bg-main/5 rounded-r ${
                        event.status === 'live' ? 'border-success' : 
                        event.status === 'armed' ? 'border-primary' : 
                        event.status === 'failed' ? 'border-error' : 'border-secondary'
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="text-[12px] font-header text-white truncate group-hover:text-primary transition-colors uppercase tracking-tight">
                          {event.title}
                        </div>
                        <div className="text-[9px] tech-text text-text-dim mt-1">
                          {new Date(event.startTime).toLocaleDateString('en-GB')} • {new Date(event.startTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} • {event.contentRef}
                        </div>
                      </div>
                      <div className={`text-[8px] font-header px-2 py-1 border skew-x-[-10deg] ${
                        event.status === 'live' ? 'border-success text-success bg-success/10 animate-pulse' : 
                        event.status === 'armed' ? 'border-primary text-primary bg-primary/10' : 
                        'border-main text-text-dim'
                      }`}>
                        {event.status.toUpperCase()}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 tech-text text-[10px] text-text-dim italic opacity-50 border border-dashed border-main rounded">
                    NO_PENDING_TRANSMISSIONS
                  </div>
                )}
              </AnimatePresence>
            )}
          </div>
        </section>
      </div>

      <footer className="p-4 bg-panel-solid/50 border-t border-main">
        <button className="bg-primary hover:bg-primary-glow text-bg-deep font-header text-xs w-full py-3 rounded skew-x-[-12deg] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
           <Zap size={14} className="fill-current" />
           INITIALIZE_NEW_STREAM_PLAN
        </button>
      </footer>
    </div>
  );
};
