import React, { useState, useEffect, useMemo } from 'react';
import { useDashboardData } from './hooks/useDashboardData';
import KpiCard from './components/KpiCard';
import ProductionTable from './components/ProductionTable';
import * as Icons from 'lucide-react';
import './styles/main.css';

const App = () => {
  const JSON_URL = 'https://raw.githubusercontent.com/bombaxbr-max/dashboard-producao/main/public/data.json';
  const { data, loading, error, lastFetch, isStale } = useDashboardData(JSON_URL);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Process data to extract KPIs and list
  const processed = useMemo(() => {
    if (!data || !Array.isArray(data)) return null;

    const summaryRow = data.find(r => r["PORTO ALEGRE"] === "RS CAPITAL") ||
      data.reverse().find(r => r["PORTO ALEGRE"] === "TOTAL");

    // Restore array order if reversed
    if (data.reverse) data.reverse();

    const kpis = summaryRow ? [
      { label: "HC Total", value: summaryRow["col_2"], trend: "Global", direction: "up", status: "success", icon: "Users" },
      { label: "Altas Concl.", value: summaryRow["ALTAS"], trend: "Real", direction: "up", status: "success", icon: "CheckCircle" },
      { label: "Proj. LIS", value: (summaryRow["col_26"] || 0).toFixed(1), trend: "Proj", direction: "up", status: "warning", icon: "TrendingUp" },
      { label: "Produção P.U", value: (summaryRow["col_3"] || 0).toFixed(2), trend: "Média", direction: "up", status: "success", icon: "Activity" },
      { label: "GAP", value: (summaryRow["col_24"] || 0).toFixed(0), trend: "Meta vs Real", direction: summaryRow["col_24"] < 0 ? "down" : "up", status: summaryRow["col_24"] < 0 ? "danger" : "success", icon: "Target" },
      { label: "Eficácia (%)", value: ((summaryRow["col_28"] || 0) * 100).toFixed(1) + "%", trend: "Geral", direction: "up", status: summaryRow["col_28"] < 0.6 ? "danger" : "success", icon: "Zap" },
      { label: "Meta Total", value: summaryRow["col_25"], trend: "Dia", direction: "up", status: "warning", icon: "ShieldCheck" },
      { label: "Backlog", value: summaryRow["col_6"], trend: "N. Inic.", direction: "up", status: "danger", icon: "Clock" }
    ] : [];

    const production = data.filter(r => r["PORTO ALEGRE"] !== "EMPRESA" && r["col_2"] !== null);

    return { kpis, production };
  }, [data]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const exportCSV = () => {
    if (!data) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
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
        <button onClick={() => window.location.reload()} style={{ marginTop: '2rem', padding: '1rem 2rem' }}>Recarregar</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {isStale && (
        <div className="stale-overlay">
          <Icons.AlertOctagon size={20} /> DADOS DESATUALIZADOS (EXCEL NÃO SINCRONIZOU)
        </div>
      )}

      <header className="dashboard-header">
        <div className="logo-section">
          <div className="logo-placeholder">NOC</div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>DASHBOARD OPERACIONAL</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>MISSION CONTROL | v1.2 (Excel Mode)</p>
          </div>
        </div>

        <div className="header-info">
          <div className="sync-status">
            <div className={`status-dot ${isStale ? 'stale' : ''}`}></div>
            <span>Sincro: {lastFetch?.toLocaleTimeString()}</span>
          </div>

          <div className="clock">
            {currentTime.toLocaleTimeString('pt-BR')}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={exportCSV} className="btn-icon">
              <Icons.Download size={18} />
            </button>
            <button onClick={toggleFullscreen} className="btn-icon primary">
              <Icons.Maximize size={18} />
            </button>
          </div>
        </div>
      </header>

      <section className="kpi-grid">
        {processed?.kpis.map((kpi, idx) => (
          <KpiCard key={idx} {...kpi} />
        ))}
      </section>

      <main className="main-content">
        <ProductionTable data={data || []} />

        <aside className="sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-title"><Icons.Trophy size={16} /> Top P.U (Region)</h3>
            <div className="sidebar-list">
              {(processed?.production || [])
                .filter(p => typeof p.col_3 === 'number')
                .sort((a, b) => b.col_3 - a.col_3)
                .slice(0, 5)
                .map((emp, idx) => (
                  <div key={idx} className="ranking-item">
                    <span style={{ fontSize: '0.8rem' }}>{emp["PORTO ALEGRE"]}</span>
                    <span style={{ color: 'var(--accent-color)', fontWeight: 700 }}>{(emp.col_3 || 0).toFixed(2)}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="sidebar-card">
            <h3 className="sidebar-title"><Icons.Bell size={16} /> Alertas de Eficácia</h3>
            <div className="sidebar-list">
              {(processed?.production || [])
                .filter(p => typeof p.col_28 === 'number' && p.col_28 < 0.60 && p["PORTO ALEGRE"] !== "TOTAL")
                .map((p, idx) => (
                  <div key={idx} className="alert-item alert-critical">
                    Eficácia crítica: {p["PORTO ALEGRE"]} ({((p.col_28 || 0) * 100).toFixed(1)}%)
                  </div>
                ))}
            </div>
          </div>
        </aside>
      </main>

      <footer style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-secondary)', padding: '0.2rem' }}>
        Dashboard em tempo real • Conectado ao Repositório GitHub
      </footer>
    </div>
  );
};

export default App;
