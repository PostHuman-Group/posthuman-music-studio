import { Music, Layout as LayoutIcon, Zap, Sliders, Headphones, Radio, BarChart3, Cloud, Settings } from 'lucide-react';

import SampleLibrary from './components/SampleLibrary';
import StreamEngine from './components/StreamEngine';
import Visualizer from './components/Visualizer';
import Scheduler from './components/Scheduler';

import './index.css';

const PostHumanStudio = () => {
  return (
    <div className="studio-container">
      <div className="aurora-bg" />

      {/* Navigation */}
      <nav className="glass-nav">
        <div className="nav-content">
          <div className="logo">
            <Music className="glow-blue" size={24} />
            <span className="logo-text">PostHuman Music: <span className="logo-sub">Studio</span></span>
          </div>
          <div className="nav-links">
            <button className="nav-btn active"><LayoutIcon size={20} /> Dashboard</button>
            <button className="nav-btn"><Radio size={20} /> Streams</button>
            <button className="nav-btn"><Headphones size={20} /> Library</button>
            <button className="nav-btn"><Sliders size={20} /> Mixer</button>
            <button className="nav-btn"><Zap size={20} /> Generator</button>
            <button className="nav-btn"><BarChart3 size={20} /> Analytics</button>
            <button className="nav-btn"><Cloud size={20} /> Deploy</button>
            <button className="nav-btn"><Settings size={20} /> Settings</button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="grid-container">

          <main className="studio-content container">
            <div className="studio-grid">
              {/* Left Column: Generator & Library */}
              <div className="grid-column">
                <SampleLibrary />
                <Scheduler />
              </div>

              {/* Right Column: Engine & Visuals */}
              <div className="grid-column">
                <Visualizer isActive={true} />
                <StreamEngine />
              </div>
            </div>
          </main>

        </div>
      </main>

      <style>{`
        .studio-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .glass-nav {
          height: calc(var(--rhythm) * 3);
          background: rgba(9, 9, 26, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--glass-border);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-content {
          max-width: 1200px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-md);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 300;
          letter-spacing: 0.05em;
        }

        .logo-sub {
          color: var(--blue-main);
          font-weight: 400;
        }

        .nav-links {
          display: flex;
          gap: var(--space-md);
        }

        .nav-btn {
          background: transparent;
          border: none;
          color: var(--blue-desat-1);
          font-family: var(--font-heading);
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          cursor: pointer;
          transition: all 0.3s ease;
          padding: var(--space-xs) var(--space-sm);
          border-radius: 4px;
        }

        .nav-btn:hover, .nav-btn.active {
          color: white;
          background: var(--bg-tint-1);
        }

        .studio-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: var(--space-xl);
          margin-bottom: var(--space-xl);
        }

        .grid-column {
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
        }

        @media (max-width: 1024px) {
          .studio-grid {
            grid-template-columns: 1fr;
          }
        }

        .main-content {
          flex: 1;
          padding: var(--space-xl) var(--space-md);
        }

        .grid-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .glass-box {
          background: var(--glass-bg);
          backdrop-filter: blur(15px);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          padding: var(--space-lg);
        }

        @media (max-width: 768px) {
          .nav-links { display: none; }
        }
      `}</style>
    </div>
  );
};

export default PostHumanStudio;
