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

  // Helper safe number formatter
  const safeNum = (val, decimals = 0) => {
    if (val === null || val === undefined || val === "-" || isNaN(parseFloat(val))) return 0;
    return parseFloat(val);
  };

  const processed = useMemo(() => {
    if (!data || !Array.isArray(data)) return null;

    // Tenta achar a linha de resumo (RS CAPITAL ou TOTAL)
    // Usamos uma cópia para não alterar a ordem original do array
    const dataCopy = [...data];
    const summaryRow = dataCopy.find(r => r["PORTO ALEGRE"] === "RS CAPITAL") ||
      dataCopy.find(r => r["PORTO ALEGRE"] === "TOTAL") ||
      data[data.length - 1];

    if (!summaryRow) return null;

    const kpis = [
      { label: "HC Total", value: summaryRow["col_2"] || "0", trend: "Global", direction: "up", status: "success", icon: "Users" },
      { label: "Altas Concl.", value: summaryRow["ALTAS"] || "0", trend: "Real", direction: "up", status: "success", icon: "CheckCircle" },
      { label: "Proj. LIS", value: safeNum(summaryRow["col_26"]).toFixed(1), trend: "Proj", direction: "up", status: "warning", icon: "TrendingUp" },
      { label: "Média P.U", value: safeNum(summaryRow["col_3"]).toFixed(2), trend: "Global", direction: "up", status: "success", icon: "Activity" },
      { label: "GAP", value: safeNum(summaryRow["col_24"]).toFixed(0), trend: "Meta vs Real", direction: safeNum(summaryRow["col_24"]) < 0 ? "down" : "up", status: safeNum(summaryRow["col_24"]) < 0 ? "danger" : "success", icon: "Target" },
      { label: "Eficácia (%)", value: (safeNum(summaryRow["col_28"]) * 100).toFixed(1) + "%", trend: "Geral", direction: "up", status: safeNum(summaryRow["col_28"]) < 0.6 ? "danger" : "success", icon: "Zap" },
      { label: "Meta Dia", value: summaryRow["col_25"] || "0", trend: "Planejado", direction: "up", status: "warning", icon: "ShieldCheck" },
      { label: "Backlog", value: summaryRow["col_6"] || "0", trend: "Pendentes", direction: "up", status: "danger", icon: "Clock" }
    ];

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

  if (loading && !data) {
    return <div className="dashboard-container"><div className="skeleton" style={{ height: '100%' }}></div></div>;
  }

  if (error && !data) {
    return (
      <div className="dashboard-container" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <Icons.AlertTriangle size={64} color="var(--danger)" />
        <h2 style={{ marginTop: '1rem' }}>Erro na Conexão</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Verifique se o seu JSON no GitHub é público e se a URL está correta.</p>
        <code style={{ background: '#000', padding: '1rem', marginTop: '1rem', display: 'block', fontSize: '0.8rem' }}>{JSON_URL}</code>
        <button onClick={() => window.location.reload()} className="btn-icon primary" style={{ marginTop: '2rem', padding: '0.5rem 2rem' }}>Tentar Novamente</button>
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
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>MISSION CONTROL | v1.5 (Safe Mode)</p>
          </div>
        </div>

        <div className="header-info">
          <div className="sync-status">
            <div className={`status-dot ${isStale ? 'stale' : ''}`}></div>
            <span>Sync: {lastFetch?.toLocaleTimeString()}</span>
          </div>
          <div className="clock">{currentTime.toLocaleTimeString('pt-BR')}</div>
          <button onClick={toggleFullscreen} className="btn-icon primary"><Icons.Maximize size={18} /></button>
        </div>
      </header>

      {processed ? (
        <>
          <section className="kpi-grid">
            {processed.kpis.map((kpi, idx) => <KpiCard key={idx} {...kpi} />)}
          </section>

          <main className="main-content">
            <ProductionTable data={data || []} />
            <aside className="sidebar">
              <div className="sidebar-card">
                <h3 className="sidebar-title"><Icons.Trophy size={16} /> Melhores P.U</h3>
                <div className="sidebar-list">
                  {processed.production
                    .filter(p => p["PORTO ALEGRE"] !== "TOTAL" && p["PORTO ALEGRE"] !== "RS CAPITAL")
                    .sort((a, b) => safeNum(b.col_3) - safeNum(a.col_3))
                    .slice(0, 5)
                    .map((emp, idx) => (
                      <div key={idx} className="ranking-item">
                        <span>{emp["PORTO ALEGRE"]}</span>
                        <span style={{ color: 'var(--accent-color)', fontWeight: 700 }}>{safeNum(emp.col_3).toFixed(2)}</span>
                      </div>
                    ))}
                </div>
              </div>
            </aside>
          </main>
        </>
      ) : (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p>Processando dados do Excel...</p>
        </div>
      )}
    </div>
  );
};

export default App;
