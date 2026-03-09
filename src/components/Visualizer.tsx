import { motion } from 'framer-motion';
import { Zap, Activity } from 'lucide-react';

interface VisualizerProps {
    isActive?: boolean;
}

const Visualizer = ({ isActive = false }: VisualizerProps) => {
    return (
        <div className="visualizer-container glass-box overflow-hidden">
            <div className="viz-header">
                <Activity size={16} className="glow-purple" />
                <span className="logo-sub">REAL-TIME VISUAL FEED</span>
                <Zap size={16} className={isActive ? 'glow-blue pulse' : 'glow-blue'} />
            </div>

            <div className="viz-content">
                {/* Plasma Background */}
                <div className={`plasma-aura ${isActive ? 'active' : ''}`} />

                {/* Frequency Bars */}
                <div className="frequency-display">
                    {[...Array(32)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="freq-bar"
                            animate={isActive ? {
                                height: [20, Math.random() * 80 + 20, 20],
                                opacity: [0.3, 0.8, 0.3]
                            } : { height: 4 }}
                            transition={{
                                duration: 0.5 + Math.random(),
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>

                {/* Floating Geometric Particles */}
                {isActive && [...Array(10)].map((_, i) => (
                    <motion.div
                        key={`p-${i}`}
                        className="viz-particle"
                        initial={{ x: '50%', y: '50%', opacity: 0 }}
                        animate={{
                            x: `${Math.random() * 100}%`,
                            y: `${Math.random() * 100}%`,
                            opacity: [0, 0.5, 0],
                            scale: [0.5, 1.5, 0.5]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 4,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}

                <div className="viz-overlay">
                    <div className="scanline" />
                    <div className="vignette" />
                </div>
            </div>

            <style>{`
        .visualizer-container {
          height: 400px;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .viz-header {
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid var(--glass-border);
          z-index: 10;
        }

        .viz-content {
          flex: 1;
          position: relative;
          background: #000;
          display: flex;
          align-items: flex-end;
          padding: 20px;
        }

        .plasma-aura {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, 
            var(--purple-main) 0%, 
            var(--magenta-main) 30%, 
            var(--blue-main) 60%, 
            transparent 100%
          );
          filter: blur(80px);
          opacity: 0.1;
          transition: opacity 1s ease;
        }

        .plasma-aura.active {
          opacity: 0.4;
          animation: drift 10s infinite alternate;
        }

        .frequency-display {
          width: 100%;
          height: 120px;
          display: flex;
          align-items: flex-end;
          gap: 4px;
          z-index: 5;
        }

        .freq-bar {
          flex: 1;
          background: linear-gradient(to top, var(--blue-main), var(--purple-main));
          border-radius: 2px 2px 0 0;
          min-height: 4px;
        }

        .viz-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 10px white;
          z-index: 2;
        }

        .viz-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 20;
        }

        .scanline {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(0, 0, 0, 0.1) 51%,
            transparent 52%
          );
          background-size: 100% 4px;
        }

        .vignette {
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 100px rgba(0,0,0,0.8);
        }

        @keyframes drift {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.2) translate(10px, 10px); }
        }

        @media (max-width: 600px) {
          .visualizer-container { height: 300px; }
          .frequency-display { gap: 2px; }
        }
      `}</style>
        </div>
    );
};

export default Visualizer;
