import { useState, useEffect } from 'react';
import { Play, Pause, FastForward, Radio, Sparkles, Waves } from 'lucide-react';

const StreamEngine = () => {
    const [isStreaming, setIsStreaming] = useState(false);
    const currentGenre = 'Cyberpunk Ambient';
    const [blendProgress, setBlendProgress] = useState(0);

    // Simulate genre blending
    useEffect(() => {
        if (isStreaming) {
            const interval = setInterval(() => {
                setBlendProgress((prev) => (prev + 1) % 100);
            }, 500);
            return () => clearInterval(interval);
        }
    }, [isStreaming]);

    return (
        <div className="stream-engine glass-box">
            <div className="engine-header">
                <div className="status-indicator">
                    <div className={`status-dot ${isStreaming ? 'pulse-green' : ''}`} />
                    <span>{isStreaming ? 'ENGINE ACTIVE' : 'ENGINE STANDBY'}</span>
                </div>
                <Radio className={isStreaming ? 'glow-blue spinning-slow' : 'glow-blue'} size={24} />
            </div>

            <div className="current-track-info">
                <span className="label">GENERATING NOW</span>
                <h2 className="genre-display">{currentGenre}</h2>
                <div className="blend-bar">
                    <div className="blend-progress" style={{ width: `${blendProgress}%` }} />
                </div>
            </div>

            <div className="controls-container">
                <div className="main-btns">
                    <button
                        className={`btn ${isStreaming ? 'btn-ghost' : 'btn-primary'}`}
                        onClick={() => setIsStreaming(!isStreaming)}
                    >
                        {isStreaming ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    <button className="btn btn-ghost">
                        <FastForward size={24} />
                    </button>
                </div>

                <div className="engine-parameters">
                    <div className="param">
                        <div className="param-header">
                            <Sparkles size={14} /> <span>Complexity</span>
                        </div>
                        <input type="range" className="accent-blue" />
                    </div>
                    <div className="param">
                        <div className="param-header">
                            <Waves size={14} /> <span>Mastering Gain</span>
                        </div>
                        <input type="range" className="accent-purple" />
                    </div>
                </div>
            </div>

            <style>{`
        .stream-engine {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
          padding: var(--space-lg) !important;
        }

        .engine-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-heading);
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          color: var(--blue-desat-1);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--bg-tint-2);
        }

        .pulse-green {
          background: var(--sys-green);
          box-shadow: 0 0 10px var(--sys-green);
          animation: pulse 1.5s infinite;
        }

        .genre-display {
          font-size: 2rem;
          margin: var(--space-xs) 0;
          background: linear-gradient(90deg, var(--blue-main), var(--purple-main));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .label {
          font-size: 0.75rem;
          color: var(--blue-desat-2);
          letter-spacing: 0.2em;
        }

        .blend-bar {
          height: 4px;
          background: var(--bg-shade-1);
          border-radius: 2px;
          overflow: hidden;
          margin-top: var(--space-sm);
        }

        .blend-progress {
          height: 100%;
          background: var(--blue-main);
          transition: width 0.5s linear;
        }

        .controls-container {
          display: flex;
          gap: var(--space-xl);
          align-items: center;
        }

        .main-btns {
          display: flex;
          gap: var(--space-md);
        }

        .engine-parameters {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .param-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: var(--blue-desat-1);
          margin-bottom: 4px;
        }

        .accent-blue { accent-color: var(--blue-main); }
        .accent-purple { accent-color: var(--purple-main); }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }

        .spinning-slow {
          animation: spin 8s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .controls-container { flex-direction: column; align-items: stretch; }
          .genre-display { font-size: 1.5rem; }
        }
      `}</style>
        </div>
    );
};

export default StreamEngine;
