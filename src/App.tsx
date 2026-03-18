import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Music,
  Layout as LayoutIcon,
  Radio,
  Settings,
  Image as ImageIcon,
  MessageSquare
} from 'lucide-react';

import { SampleLibrary } from './components/SampleLibrary';
import { AssetStudio } from './components/AssetStudio';
import ChatStudio from './components/ChatStudio';
import { formatLongDate } from './lib/localization';

// Stream Module Components
import { StreamModule } from './modules/Stream';
import { CleanFeed } from './modules/Stream/CleanFeed';

import './index.css';

const PostHumanStudio = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assets' | 'library' | 'streams' | 'chat'>('chat');

  const isBroadcast = window.location.pathname === '/broadcast';

  if (isBroadcast) {
    return <CleanFeed />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatStudio />;
      case 'dashboard':
        return <StreamModule />;
      case 'assets':
        return <AssetStudio onSelectAsset={() => {}} />;
      case 'library':
        return <SampleLibrary />;
      case 'streams':
        return <StreamModule />;
      default:
        return <ChatStudio />;
    }
  };

  return (
    <div className="relative min-h-screen bg-deep overflow-hidden selection:bg-primary/30 selection:text-primary">
      {/* Global Cyberpunk Effects */}
      <div className="scanline-effect" />
      <div className="crt-vignette" />
      
      {/* Layout Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="flex h-screen relative z-10">
        {/* Navigation Sidebar */}
        <nav className="w-72 bg-panel-solid border-r border-main flex flex-col p-6 gap-8">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-12 h-12 bg-primary border-2 border-primary-glow flex items-center justify-center font-header text-bg-deep text-2xl skew-x-[-12deg] group-hover:animate-pulse">
                PH
            </div>
            <div>
              <h1 className="text-xl font-header text-header tracking-tighter leading-none">POSTHUMAN</h1>
              <span className="text-[10px] tech-text text-primary tracking-[0.4em]">NEURAL_STUDIO</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { id: 'chat', label: 'Command Hub', icon: MessageSquare },
              { id: 'dashboard', label: 'System Overview', icon: LayoutIcon },
              { id: 'assets', label: 'Visual Forge', icon: ImageIcon },
              { id: 'library', label: 'Sonic Vault', icon: Music },
              { id: 'streams', label: 'Neural Feed', icon: Radio },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-4 px-6 py-4 font-header text-[11px] uppercase tracking-widest transition-all clip-path-side ${
                  activeTab === tab.id 
                    ? 'bg-primary text-bg-deep shadow-[0_0_15px_rgba(0,240,255,0.4)]' 
                    : 'text-text-dim hover:bg-primary-dim hover:text-primary'
                }`}
                style={{ clipPath: 'polygon(0 0, 95% 0, 100% 25%, 100% 100%, 5% 100%, 0 75%)' }}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-auto p-4 glass-panel border-l-4 border-accent">
              <span className="tech-text text-[9px] mb-1 block opacity-60">System Clock</span>
              <div className="text-header font-header text-sm">{formatLongDate(new Date())}</div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-deep/50 backdrop-blur-sm">
          <header className="h-16 border-b border-main flex items-center justify-between px-8 bg-panel-solid/50">
             <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-success rounded-full shadow-[0_0_5px_var(--success)]" />
                 <span className="tech-text text-[10px]">Matrix Status: Operational</span>
             </div>
             <div className="flex items-center gap-6">
                 <button className="text-text-dim hover:text-primary transition-colors">
                     <Settings size={18} />
                 </button>
                 <div className="w-10 h-10 rounded-full border border-primary-dim p-0.5">
                     <div className="w-full h-full rounded-full bg-primary-dim" />
                 </div>
             </div>
          </header>

          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PostHumanStudio;
