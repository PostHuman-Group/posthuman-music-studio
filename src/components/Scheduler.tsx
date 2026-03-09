import { useState, useEffect } from 'react';
import { Share2, Youtube, Instagram, Globe, Link2, ExternalLink, Calendar, Loader2 } from 'lucide-react';

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

const Scheduler = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const platforms: Platform[] = [
    { name: 'YouTube', icon: Youtube, connected: true, status: 'Ready' },
    { name: 'Instagram', icon: Instagram, connected: false, status: 'Connect to stream' },
    { name: 'TikTok', icon: Globe, connected: true, status: 'Scheduled (9pm)' },
  ];

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        // In local development, we call the netlify function endpoint
        // When deployed, this is /.netlify/functions/get-schedules
        const response = await fetch('/.netlify/functions/get-schedules');
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          // Fallback to mock data if function not available yet (local dev)
          setEvents([
            { id: '1', title: 'Neural Dreams 24h Loop', startTime: new Date().toISOString(), status: 'scheduled', contentRef: 'RTMP: YT-01' }
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
    <div className="scheduler-container glass-box">
      <header className="module-header">
        <div className="title-group">
          <Share2 className="glow-magenta" size={24} />
          <h2>Studio Bridge <span className="logo-sub">Scheduler</span></h2>
        </div>
        <button className="btn btn-ghost btn-sm">
          <Link2 size={16} /> Connect Account
        </button>
      </header>

      <div className="scheduler-content h-rhythm">
        <section className="platform-list">
          <div className="section-header">
            <h3>Target Platforms</h3>
            <span className="badge">3 CONNECTED</span>
          </div>
          <div className="platforms-grid">
            {platforms.map((p) => (
              <div key={p.name} className="platform-card glass-box">
                <p.icon size={20} className={p.connected ? 'glow-blue' : 'desat-text'} />
                <div className="platform-info">
                  <span className="platform-name">{p.name}</span>
                  <span className={`platform-status ${p.connected ? 'active' : ''}`}>
                    {p.status}
                  </span>
                </div>
                {p.connected ? <ExternalLink size={14} className="desat-text" /> : null}
              </div>
            ))}
          </div>
        </section>

        <section className="schedule-list">
          <h3>Upcoming Events</h3>
          {isLoading ? (
            <div className="loading-state">
              <Loader2 className="spinning" size={24} />
              <span>Syncing with Neon...</span>
            </div>
          ) : (
            <div className="events-container">
              {events.length > 0 ? (
                events.map(event => (
                  <div key={event.id} className="event-item glass-box">
                    <Calendar size={16} className="glow-purple" />
                    <div className="event-info">
                      <span className="event-title">{event.title}</span>
                      <span className="event-meta">
                        {new Date(event.startTime).toLocaleDateString()} • {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {event.contentRef}
                      </span>
                    </div>
                    <div className={`status-pill ${event.status}`}>
                      {event.status.toUpperCase()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">No events scheduled.</div>
              )}
            </div>
          )}
          <button className="btn btn-ghost w-full" style={{ marginTop: 'var(--space-md)' }}>
            NEW SCHEDULED STREAM
          </button>
        </section>
      </div>

      <style>{`
        .scheduler-container {
          padding: var(--space-lg) !important;
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .scheduler-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-sm);
        }

        .badge {
          font-size: 0.625rem;
          padding: 2px 8px;
          background: var(--bg-tint-1);
          border: 1px solid var(--blue-main);
          border-radius: 4px;
          color: var(--blue-main);
          letter-spacing: 0.05em;
        }

        .platforms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-md);
        }

        .platform-card {
          padding: var(--space-md) !important;
          display: flex;
          align-items: center;
          gap: var(--space-md);
          border-color: var(--bg-tint-1);
          transition: all 0.3s ease;
        }

        .platform-card:hover {
          border-color: var(--blue-main);
          background: var(--bg-tint-1);
        }

        .platform-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .platform-name {
          font-weight: 600;
          font-size: 0.875rem;
        }

        .platform-status {
          font-size: 0.75rem;
          color: var(--blue-desat-2);
        }

        .platform-status.active {
          color: var(--blue-main);
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-xl);
          color: var(--blue-desat-1);
        }

        .event-item {
          padding: var(--space-sm) 16px !important;
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: var(--space-sm);
        }

        .event-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .event-title {
          font-size: 0.9375rem;
          font-weight: 500;
        }

        .event-meta {
          font-size: 0.75rem;
          color: var(--blue-desat-1);
        }

        .status-pill {
          font-size: 0.625rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 3px;
          background: var(--bg-shade-1);
          color: var(--blue-desat-2);
        }

        .status-pill.scheduled {
          color: var(--purple-main);
          border: 1px solid var(--purple-main);
        }

        .w-full {
          width: 100%;
          justify-content: center;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Scheduler;
