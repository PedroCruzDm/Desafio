// filepath: c:\Users\joaop\OneDrive\Documentos\atividades\desafios\Desafio1\frontend\src\components\Dashboard\Dashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEventos: 0,
    eventosAtivos: 0,
    totalInscritos: 0,
    proximosEventos: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Para forçar atualização
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Buscar dados de eventos
        const eventosRes = await axios.get("http://localhost:5000/api/eventos");
        
        // Filtrar eventos ativos (assumindo que há um campo 'status' ou 'ativo')
        const ativos = eventosRes.data.filter(evento => evento.status === 'ativo' || evento.ativo === true);
        
        // Obter próximos eventos (assumindo que há um campo 'data')
        const hoje = new Date();
        const proximos = eventosRes.data
          .filter(evento => new Date(evento.data) > hoje)
          .sort((a, b) => new Date(a.data) - new Date(b.data))
          .slice(0, 5);

        const totalInscritos = 120; // Placeholder sem DB

        setStats({
          totalEventos: eventosRes.data.length,
          eventosAtivos: ativos.length,
          totalInscritos: totalInscritos,
          proximosEventos: proximos
        });
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
        setError("Ocorreu um erro ao carregar os dados do dashboard. Por favor, tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };
  
  const atualizarDados = () => {
    setRefreshKey(oldKey => oldKey + 1); // Força o useEffect a executar novamente
  };

  if (loading) return <div className="dashboard-loading">Carregando dados do dashboard...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p className="dashboard-subtitle">Visão geral do sistema</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon eventos-icon">📅</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalEventos}</h3>
            <p className="stat-label">Total de Eventos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon ativos-icon">🟢</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.eventosAtivos}</h3>
            <p className="stat-label">Eventos Ativos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon inscritos-icon">👥</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalInscritos}</h3>
            <p className="stat-label">Total de Inscritos</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h3 className="section-title">Próximos Eventos</h3>
        {stats.proximosEventos.length > 0 ? (
          <div className="eventos-list">
            {stats.proximosEventos.map((evento) => (
              <div className="evento-card" key={evento.id || evento._id}>
                <div className="evento-data">
                  {formatarData(evento.data)}
                </div>
                <div className="evento-info">
                  <h4 className="evento-titulo">{evento.nome || evento.titulo}</h4>
                  <p className="evento-local">{evento.local || "Local não informado"}</p>
                </div>
                <div className="evento-status">
                  {evento.status === 'ativo' || evento.ativo ? 
                    <span className="status-badge ativo">Ativo</span> : 
                    <span className="status-badge inativo">Inativo</span>
                  }
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">Não há próximos eventos programados.</p>
        )}
      </div>

      <div className="dashboard-section">
        <h3 className="section-title">Atividades Recentes</h3>
        <p className="no-data">Nenhuma atividade recente para exibir.</p>
        {/* Aqui você pode adicionar um histórico de atividades quando tiver esses dados */}
      </div>
    </div>
  );
};

export default Dashboard;