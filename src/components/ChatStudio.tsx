import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  Terminal,
  Layout,
  Radio,
  Music,
  Zap,
  Plus,
  Search,
  BarChart3
} from 'lucide-react';

import { ControlHub } from '../modules/Stream/ControlHub';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'plan' | 'question';
  metadata?: any;
}

const SUGGESTIONS = [
  "Draft an indie rock playlist",
  "Schedule a 24/7 lo-fi stream",
  "New visual identity for summer",
  "Generate phonk drum samples"
];

const PURPOSE_CARDS = [
  { id: 'playlist', title: 'New Playlist', icon: Music, color: 'var(--secondary)' },
  { id: 'stream', title: 'Schedule Stream', icon: Radio, color: 'var(--primary)' },
  { id: 'visuals', title: 'Visual Overhaul', icon: Layout, color: 'var(--accent)' },
  { id: 'samples', title: 'Bulk Samples', icon: Zap, color: 'var(--success)' }
];

const ChatStudio = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi, I'm your Production Agent. What are we building for PostHuman Music today?",
      type: 'text'
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking, isResearching]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Phase 1: Researching
    setIsResearching(true);

    // Simulate Research Logic (Sonar API)
    setTimeout(() => {
      setIsResearching(false);
      setIsThinking(true);

      setTimeout(() => {
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I've analysed the trends and built a production roadmap. Here is the proposed plan for approval:",
          type: 'plan',
          metadata: {
            budget: {
              gbp: 185,
              tokens: 650000,
              compute: "18m"
            }
          }
        };
        setMessages(prev => [...prev, assistantMsg]);
        setIsThinking(false);
      }, 2000);
    }, 5000); // Research takes 5s
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col relative min-w-0">
        <div className="chat-messages custom-scrollbar px-6 py-8" ref={scrollRef}>
          <div className="messages-inner max-w-4xl mx-auto">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`message-wrapper ${msg.role}`}
                >
                  <div className="message-bubble">
                    {msg.role === 'assistant' && (
                      <div className="agent-avatar">
                        <Sparkles size={14} />
                      </div>
                    )}
                    <div className="message-content">
                      <p>{msg.content}</p>
                      {msg.type === 'plan' && msg.metadata?.budget && (
                        <div className="plan-approval-card glass-box mt-4 p-4 border border-primary/20 bg-primary/5">
                          <div className="plan-header flex items-center gap-2 mb-4">
                            <Terminal size={12} className="text-primary" />
                            <span className="tech-text text-[10px] tracking-widest">PRODUCTION_PLAN_v1.0</span>
                          </div>
                          <div className="budget-meta grid grid-cols-2 gap-4">
                            <div className="meta-item flex flex-col gap-1">
                              <span className="text-[10px] text-text-dim uppercase">ESTIMATED_COST</span>
                              <span className="text-sm font-header text-primary">£{msg.metadata.budget.gbp}</span>
                            </div>
                            <div className="meta-item flex flex-col gap-1">
                              <span className="text-[10px] text-text-dim uppercase">COMPUTE_TIME</span>
                              <span className="text-sm font-header text-success">{msg.metadata.budget.compute}</span>
                            </div>
                          </div>
                          <div className="plan-actions flex gap-3 mt-6">
                            <button className="flex-1 py-2 px-4 bg-primary text-bg-deep font-header text-[10px] uppercase tracking-tighter hover:bg-primary-glow transition-all">
                              Approve & Execute
                            </button>
                            <button className="flex-1 py-2 px-4 border border-main text-text-dim font-header text-[10px] uppercase tracking-tighter hover:text-primary hover:border-primary transition-all">
                              Modify Plan
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isResearching && (
              <div className="thinking-indicator flex items-center gap-3 text-primary p-4 animate-pulse">
                <Search size={14} className="animate-spin" />
                <span className="tech-text text-[10px] tracking-widest uppercase">Scanning neural trends and market metadata...</span>
              </div>
            )}
            
            {isThinking && (
              <div className="thinking-indicator flex items-center gap-3 text-accent p-4 animate-pulse">
                <Sparkles size={14} />
                <span className="tech-text text-[10px] tracking-widest uppercase">Synthesizing production roadmap...</span>
              </div>
            )}
          </div>
        </div>


        {/* Input Area */}
        <div className="chat-input-section">
          {messages.length === 1 && (
            <div className="purpose-grid">
              {PURPOSE_CARDS.map((card) => (
                <motion.button
                  key={card.id}
                  whileHover={{ y: -5, borderColor: card.color }}
                  className="purpose-card glass-box transition-colors"
                  onClick={() => handleSend(card.title)}
                >
                  <card.icon size={24} style={{ color: card.color }} />
                  <span className="tech-text text-[10px] mt-2">{card.title}</span>
                </motion.button>
              ))}
            </div>
          )}

          <div className="input-orchestrator glass-box p-4 bg-deep/40 border border-main/30 rounded-xl">
            <div className="suggestion-row flex gap-2 overflow-x-auto pb-3 no-scrollbar">
              {SUGGESTIONS.map((s, i) => (
                <button 
                  key={i} 
                  className="suggestion-chip whitespace-nowrap px-3 py-1.5 rounded-full bg-main/10 border border-main/20 text-[10px] text-text-dim hover:border-primary hover:text-primary transition-all flex items-center gap-1"
                  onClick={() => handleSend(s)}
                >
                  <Plus size={10} /> {s}
                </button>
              ))}
            </div>

            <div className="command-bar flex items-center gap-4 bg-deep/60 px-4 py-2 rounded-lg border border-main/20">
              <Sparkles size={18} className="text-primary animate-pulse" />
              <input
                type="text"
                placeholder="Synchronize production intent..."
                className="flex-1 bg-transparent border-none text-text-main placeholder:text-text-dim/40 focus:ring-0 text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  input ? 'bg-primary text-bg-deep shadow-[0_0_15px_rgba(0,240,255,0.4)]' : 'bg-main/20 text-text-dim cursor-not-allowed'
                }`}
                onClick={() => handleSend()}
                disabled={!input || isThinking || isResearching}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stream Control Sidebar */}
      <div className="hidden xl:flex w-96 border-l border-main flex-col bg-panel-solid/30 overflow-y-auto custom-scrollbar p-6">
        <div className="flex items-center gap-2 mb-6 text-text-dim">
          <BarChart3 size={16} />
          <span className="tech-text text-xs uppercase tracking-widest">Live Integration</span>
        </div>
        <ControlHub />
        <div className="mt-8 p-4 border border-dashed border-main rounded bg-deep/20">
          <h4 className="font-header text-[10px] text-primary mb-3 uppercase tracking-tighter">AI_METRIC_INSIGHTS</h4>
          <p className="text-[10px] text-text-dim leading-relaxed">
            Current trend analysis suggests increasing 'Neural Gain' by 15% to maintain audience retention during low-complexity segments.
          </p>
        </div>
      </div>

      <style>{`
        .chat-studio-container {
          height: calc(100vh - var(--rhythm) * 3 - var(--space-xl) * 2);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding-right: var(--space-sm);
        }

        .messages-inner {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          padding-bottom: var(--space-lg);
        }

        .message-wrapper {
          display: flex;
          width: 100%;
        }

        .message-wrapper.user {
          justify-content: flex-end;
        }

        .message-bubble {
          max-width: 80%;
          padding: var(--space-sm) var(--space-md);
          border-radius: 12px;
          position: relative;
        }

        .message-wrapper.user .message-bubble {
          background: var(--bg-tint-2);
          border: 1px solid var(--blue-shade-1);
          color: white;
        }

        .message-wrapper.assistant .message-bubble {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          display: flex;
          gap: var(--space-sm);
        }

        .agent-avatar {
          width: 24px;
          height: 24px;
          background: var(--purple-shade-2);
          border: 1px solid var(--purple-main);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--purple-main);
          flex-shrink: 0;
          margin-top: 4px;
        }

        .message-content p {
          margin-bottom: 8px;
          line-height: 1.6;
        }

        .clarification-list {
          list-style: none;
          margin-top: var(--space-sm);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .clarification-list li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9375rem;
          color: var(--blue-desat-1);
        }

        .thinking-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: var(--space-sm);
          color: var(--blue-desat-1);
          font-style: italic;
          font-size: 0.875rem;
        }

        .chat-input-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          padding-top: var(--space-md);
        }

        .purpose-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-sm);
          margin-bottom: var(--space-sm);
        }

        .purpose-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: var(--space-md) !important;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 12px;
        }

        .purpose-card span {
          font-size: 0.8125rem;
          font-family: var(--font-heading);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .input-orchestrator {
          padding: 12px !important;
          border-radius: 16px;
          background: var(--bg-shade-2);
        }

        .suggestion-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 12px;
          scrollbar-width: none;
        }

        .suggestion-chip {
          white-space: nowrap;
          background: var(--bg-shade-1);
          border: 1px solid var(--glass-border);
          color: var(--blue-desat-1);
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .suggestion-chip:hover {
          border-color: var(--blue-main);
          color: white;
        }

        .command-bar {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: 4px 8px;
        }

        .command-bar input {
          flex: 1;
          background: transparent;
          border: none;
          color: white;
          font-family: var(--font-body);
          font-size: 1.125rem;
          outline: none;
        }

        .send-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--bg-tint-1);
          border: 1px solid var(--glass-border);
          color: var(--blue-desat-1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .send-btn.active {
          background: var(--blue-main);
          color: black;
          border-color: var(--blue-main);
          box-shadow: 0 0 15px rgba(0, 222, 255, 0.4);
        }

        .plan-approval-card {
          margin-top: var(--space-md);
          padding: var(--space-md) !important;
          border-color: var(--blue-shade-1);
          background: rgba(0, 222, 255, 0.05);
        }

        .plan-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-heading);
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          margin-bottom: var(--space-sm);
        }

        .plan-summary {
            margin-bottom: var(--space-md);
        }

        .budget-meta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-md);
            background: rgba(255, 255, 255, 0.03);
            padding: var(--space-sm);
            border-radius: 8px;
        }

        .meta-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .meta-item .label {
            font-size: 0.625rem;
            color: var(--blue-desat-2);
            font-family: var(--font-heading);
            letter-spacing: 0.05em;
        }

        .meta-item .value {
            font-size: 0.8125rem;
            color: white;
            font-weight: 600;
        }

        .plan-actions {
          display: flex;
          gap: 8px;
          margin-top: var(--space-md);
        }

        .btn-sm {
          height: 32px !important;
          padding: 0 12px !important;
          font-size: 0.75rem !important;
        }

        .pulse { animation: pulse-opacity 2s ease-in-out infinite; }
        .spinning { animation: spin 2s linear infinite; }

        @keyframes pulse-opacity {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @media (max-width: 600px) {
          .purpose-grid { grid-template-columns: repeat(2, 1fr); }
          .message-bubble { max-width: 90%; }
        }
      `}</style>
    </div>
  );
};

export default ChatStudio;
