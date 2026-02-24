import React, { useState, useEffect } from 'react';
import { useDashboardData } from './hooks/useDashboardData';
import KpiCard from './components/KpiCard';
import ProductionTable from './components/ProductionTable';
import * as Icons from 'lucide-react';
import './styles/main.css';

const App = () => {
  // Replace with your GitHub Raw URL in production
  const JSON_URL = '/data.json';
  const { data, loading, error, lastFetch, isStale } = useDashboardData(JSON_URL);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const exportCSV = () => {
    if (!data?.production) return;
    const headers = Object.keys(data.production[0]).join(',');
    const rows = data.production.map(row => Object.values(row).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "producao_dashboard.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !data) {
    return (
      <div className="dashboard-container">
        <div className="skeleton" style={{ height: '60px', marginBottom: '1rem' }}></div>
        <div className="kpi-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '120px' }}></div>
          ))}
        </div>
        <div className="skeleton" style={{ flex: 1, marginTop: '1rem' }}></div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="dashboard-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Icons.AlertTriangle size={64} color="var(--danger)" />
        <h2 style={{ marginTop: '1rem' }}>Erro ao carregar dados</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: '2rem', padding: '1rem 2rem' }}>Tentar Novamente</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {isStale && (
        <div className="stale-overlay">
          <Icons.AlertOctagon size={20} inline /> DADOS DESATUALIZADOS (SINCRO FALHOU)
        </div>
      )}

      {/* HEADER */}
      <header className="dashboard-header">
        <div className="logo-section">
          <div className="logo-placeholder">NOC</div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>DASHBOARD OPERACIONAL</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>MISSION CONTROL | v1.0</p>
          </div>
        </div>

        <div className="header-info">
          <div className="sync-status">
            <div className={`status-dot ${isStale ? 'stale' : ''}`}></div>
            <span>Última Sincro: {lastFetch?.toLocaleTimeString()}</span>
          </div>

          <div className="clock">
            {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={exportCSV} title="Exportar CSV" style={{ background: 'none', border: '1px solid var(--card-border)', color: 'white', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer' }}>
              <Icons.Download size={18} />
            </button>
            <button onClick={toggleFullscreen} title="Modo TV / Fullscreen" style={{ background: 'var(--accent-color)', border: 'none', color: 'white', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer' }}>
              <Icons.Maximize size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* KPI GRID */}
      <section className="kpi-grid">
        {data?.kpis.map((kpi, idx) => (
          <KpiCard key={idx} {...kpi} />
        ))}
      </section>

      {/* MAIN SECTION */}
      <main className="main-content">
        <ProductionTable data={data?.production || []} />

        <aside className="sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-title"><Icons.Trophy size={16} /> Top Performance (PU)</h3>
            <div className="sidebar-list">
              {(data?.production || [])
                .sort((a, b) => b.pu - a.pu)
                .slice(0, 5)
                .map((emp, idx) => (
                  <div key={idx} className="ranking-item">
                    <span>{idx + 1}. {emp.empresa}</span>
                    <span style={{ color: 'var(--accent-color)', fontWeight: 700 }}>{emp.pu}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="sidebar-card">
            <h3 className="sidebar-title"><Icons.Bell size={16} /> Alertas Críticos</h3>
            <div className="sidebar-list">
              {data?.alerts.map(alert => (
                <div key={alert.id} className={`alert-item alert-${alert.type}`}>
                  <strong>[{alert.time}]</strong> {alert.message}
                </div>
              ))}
              {data?.production.filter(p => p.eficiencia < 80).map((p, idx) => (
                <div key={`auto-${idx}`} className="alert-item alert-warning">
                  Eficiência baixa em {p.empresa} ({p.eficiencia}%)
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      <footer style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-secondary)', padding: '0.2rem' }}>
        Sincronizado automaticamente via GitHub JSON API • Power BI Wallboard Mode Active
      </footer>
    </div>
  );
};

export default App;
