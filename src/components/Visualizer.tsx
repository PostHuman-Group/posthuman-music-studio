import { motion } from 'framer-motion';
import { Zap, Monitor } from 'lucide-react';

interface VisualizerProps {
  isActive?: boolean;
  backgroundAsset?: {
    url: string;
    type: 'image' | 'video';
  };
}

export const Visualizer = ({ isActive = false, backgroundAsset }: VisualizerProps) => {
  const isVideo = backgroundAsset?.type === 'video';

  return (
    <div className="glass-panel h-[400px] flex flex-col overflow-hidden font-sans group">
      <header className="p-4 border-b border-main flex items-center justify-between bg-panel-solid/50">
        <div className="flex items-center gap-3">
          <Monitor size={16} className="text-secondary" />
          <span className="tech-text text-[10px] tracking-[0.2em] text-header">
            {backgroundAsset ? `FEED: ${backgroundAsset.type.toUpperCase()}_SYNC` : 'NEURAL_VISUAL_FEED'}
          </span>
        </div>
        <div className="flex items-center gap-2">
            <span className={`w-1 h-4 ${isActive ? 'bg-primary animate-pulse' : 'bg-text-dim/20'}`} />
            <Zap size={14} className={isActive ? 'text-primary' : 'text-text-dim/30'} />
        </div>
      </header>

      <div className="flex-1 relative bg-deep">
        {/* Dynamic Background Asset with Glitch Overlay */}
        {backgroundAsset && (
          <div className="absolute inset-0 z-0">
            {isVideo ? (
              <video
                src={backgroundAsset.url}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            ) : (
              <img
                src={backgroundAsset.url}
                alt="Feed"
                className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-deep/20 to-bg-deep" />
          </div>
        )}

        {/* CSS-only Plasma Effect if no asset */}
        {!backgroundAsset && (
          <div className={`absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-1000 ${isActive ? 'opacity-40' : 'opacity-10'}`}>
             <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent animate-pulse blur-[100px]" />
          </div>
        )}

        {/* Frequency Visualization */}
        <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center gap-[2px] px-8 z-10">
          {[...Array(64)].map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-primary/40 border-t border-primary/60"
              animate={isActive ? {
                height: [4, Math.random() * 80 + 20, 4],
                backgroundColor: [
                    'rgba(0, 240, 255, 0.4)',
                    i % 8 === 0 ? 'rgba(255, 0, 255, 0.6)' : 'rgba(0, 240, 255, 0.4)',
                    'rgba(0, 240, 255, 0.4)'
                ]
              } : { height: 2 }}
              transition={{
                duration: 0.3 + Math.random() * 0.7,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Abstract Overlays */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="absolute top-4 left-4 tech-text text-[8px] opacity-30 select-none">
            SYNC_LAYER: 0x4F2A<br />
            RESOLUTION: 1920x1080<br />
            ENCODING: NEURAL_RAW
          </div>
          
          <div className="absolute bottom-4 right-4 flex gap-1">
             {[...Array(4)].map((_, i) => (
                 <div key={i} className={`w-8 h-1 ${isActive ? 'bg-primary' : 'bg-text-dim/20'} animate-pulse`} style={{ animationDelay: `${i * 0.2}s` }} />
             ))}
          </div>
        </div>

        {/* CRT Artifacts */}
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            <div className="absolute inset-0 scanline-effect opacity-50" />
            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.5)_100%)]" />
        </div>
      </div>
    </div>
  );
};
