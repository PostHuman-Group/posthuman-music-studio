import { useState, useEffect } from 'react';
import { Share2, Youtube, Instagram, Globe, Link2, ExternalLink, Calendar, Loader2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  status: string;
  contentRef: string;
}

export const Scheduler = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const platforms: Platform[] = [
    { name: 'YouTube', icon: Youtube, connected: true, status: 'Ready' },
    { name: 'Instagram', icon: Instagram, connected: false, status: 'Connect account' },
    { name: 'TikTok', icon: Globe, connected: true, status: 'Scheduled (9pm)' },
  ];

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch('/.netlify/functions/get-schedules');
        if (response.ok) {
          const json = await response.json();
          setEvents(json.data || []);
        } else {
          setEvents([
            { id: '1', title: 'NEURAL_DREAMS_24H', startTime: new Date().toISOString(), status: 'scheduled', contentRef: 'RTMP: YT-01' }
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
    <div className="glass-panel h-full flex flex-col overflow-hidden font-sans">
      <header className="p-4 border-b border-main flex items-center justify-between bg-panel-solid/50">
        <div className="flex items-center gap-3">
          <Share2 size={18} className="text-accent" />
          <h2 className="font-header text-sm tracking-widest text-header uppercase">
            Bridge <span className="text-accent opacity-70 italic">Scheduler</span>
          </h2>
        </div>
        <button className="flex items-center gap-2 text-[10px] tech-text text-primary hover:text-white transition-colors">
          <Link2 size={12} /> SYNC_NODES
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="tech-text text-[10px] text-text-dim uppercase tracking-wider">Neural Links</span>
            <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 border border-primary/20 rounded-sm">
              3 NODES ACTIVE
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {platforms.map((p) => (
              <div key={p.name} className="flex items-center gap-3 p-3 bg-deep/40 border border-main/50 hover:border-primary/30 transition-colors group">
                <div className={`p-2 rounded-sm ${p.connected ? 'bg-primary/10 text-primary' : 'bg-white/5 text-text-dim opacity-40'}`}>
                   <p.icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-header text-header uppercase tracking-tighter">{p.name}</div>
                  <div className={`text-[9px] tech-text leading-none mt-1 ${p.connected ? 'text-primary' : 'text-text-dim'}`}>
                    {p.status}
                  </div>
                </div>
                {p.connected && (
                  <ExternalLink size={12} className="text-text-dim group-hover:text-primary transition-colors cursor-pointer" />
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Calendar size={12} className="text-secondary" />
            <span className="tech-text text-[10px] text-text-dim uppercase tracking-wider">OBS_TRANSMISSION_LOG</span>
          </div>
          
          <div className="space-y-2">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="animate-spin text-primary" size={24} />
                <span className="tech-text text-[10px] text-primary animate-pulse">SYNCING_WITH_NEON...</span>
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
                      className="p-3 bg-deep/20 border-l-2 border-secondary/50 flex items-center justify-between group hover:bg-secondary/5"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="text-[12px] font-header text-white truncate group-hover:text-secondary transition-colors uppercase tracking-tight">
                          {event.title}
                        </div>
                        <div className="text-[9px] tech-text text-text-dim mt-1">
                          {new Date(event.startTime).toLocaleDateString('en-GB')} • {new Date(event.startTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} • {event.contentRef}
                        </div>
                      </div>
                      <div className={`text-[8px] font-header px-2 py-0.5 border skew-x-[-10deg] ${
                        event.status === 'scheduled' 
                          ? 'border-secondary text-secondary bg-secondary/10' 
                          : 'border-main text-text-dim'
                      }`}>
                        {event.status.toUpperCase()}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 tech-text text-[10px] text-text-dim italic opacity-50">
                    NO_ACTIVE_TRANSMISSIONS
                  </div>
                )}
              </AnimatePresence>
            )}
          </div>
        </section>
      </div>

      <footer className="p-4 bg-panel-solid/50 border-t border-main">
        <button className="btn-cyber w-full py-2.5 text-[10px] flex items-center justify-center gap-2">
           <Zap size={14} className="fill-current" />
           INITIALIZE NEW TRANSCEIVER
        </button>
      </footer>
    </div>
  );
};

export default Scheduler;
