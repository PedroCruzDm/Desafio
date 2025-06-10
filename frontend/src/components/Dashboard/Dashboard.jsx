import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.scss"; // Corrigindo a extensão de .css para .scss
import EquipeModalAdd from "../Modals/EquipeModalAdd";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEventos: 0,
    eventosAtivos: 0,
    totalInscritos: 0,
    totalEquipes: 0,
    proximosEventos: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Para forçar atualização
  const [showAddEquipeModal, setShowAddEquipeModal] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Buscar dados de eventos
        const eventosRes = await axios.get("http://localhost:5000/api/eventos");
        
        // Buscar dados de equipes - com tratamento de erro caso a rota não exista
        let equipesCount = 0;
        try {
          const equipesRes = await axios.get("http://localhost:5000/api/equipes");
          equipesCount = equipesRes.data.length;
        } catch (equipesErr) {
          console.warn("Não foi possível buscar equipes:", equipesErr);
        }
        
        // Buscar total de inscrições - com tratamento de erro caso a rota não exista
        let inscritosCount = 0;
        try {
          const inscricoesRes = await axios.get("http://localhost:5000/api/inscricoes/count");
          inscritosCount = inscricoesRes.data.total || 0;
        } catch (inscricoesErr) {
          console.warn("Não foi possível buscar contagem de inscrições:", inscricoesErr);
        }
        
        // Filtrar eventos ativos
        const ativos = eventosRes.data.filter(evento => 
          evento.status === 'ativo' || evento.ativo === true
        );
        
        // Obter próximos eventos com base em data_inicial ou data
        const hoje = new Date();
        const proximos = eventosRes.data
          .filter(evento => {
            // Usar data_inicial se existir, caso contrário usar data
            const eventoData = evento.data_inicial ? new Date(evento.data_inicial) : 
                              evento.data ? new Date(evento.data) : null;
            return eventoData && eventoData > hoje;
          })
          .sort((a, b) => {
            const dataA = a.data_inicial ? new Date(a.data_inicial) : 
                         (a.data ? new Date(a.data) : new Date());
            const dataB = b.data_inicial ? new Date(b.data_inicial) : 
                         (b.data ? new Date(b.data) : new Date());
            return dataA - dataB;
          })
          .slice(0, 5);

        setStats({
          totalEventos: eventosRes.data.length,
          eventosAtivos: ativos.length,
          totalInscritos: inscritosCount,
          totalEquipes: equipesCount,
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
    if (!dataString) return "Data não definida";
    
    try {
      // Lidar com diferentes formatos de data
      let data;
      
      // Verificar se a data é no formato ISO (YYYY-MM-DD)
      if (typeof dataString === 'string' && dataString.match(/^\d{4}-\d{2}-\d{2}/)) {
        data = new Date(dataString);
      } 
      // Verificar se é uma data timestamp
      else if (!isNaN(dataString) && dataString.toString().length === 10) {
        data = new Date(parseInt(dataString) * 1000);
      }
      // Tentar converter outros formatos
      else {
        data = new Date(dataString);
      }
      
      // Verificar se a data é válida
      if (isNaN(data.getTime())) {
        console.warn("Data inválida recebida:", dataString);
        return "Data inválida";
      }
      
      // Formatar para o padrão brasileiro
      return data.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    } catch (e) {
      console.error("Erro ao formatar data:", e, "Data recebida:", dataString);
      return "Data inválida";
    }
  };
  
  const atualizarDados = () => {
    setRefreshKey(oldKey => oldKey + 1); // Força o useEffect a executar novamente
  };

  const handleSaveNewEquipe = async (equipeData) => {
    try {
      await axios.post("http://localhost:5000/api/equipes", equipeData);
      atualizarDados(); // Atualiza os dados após criar uma nova equipe
      setShowAddEquipeModal(false);
    } catch (error) {
      console.error("Erro ao adicionar equipe:", error);
      alert("Erro ao adicionar equipe. Por favor, tente novamente.");
    }  };

  if (loading) return (
    <div className="dashboard-loading">
      <div className="loading-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke-width="4" stroke="#ffc107" fill="none" opacity="0.2" />
          <circle cx="12" cy="12" r="10" stroke-width="4" stroke="#ff7f27" fill="none" strokeDasharray="30 200" />
        </svg>
      </div>
      <h3>Carregando dados do dashboard</h3>
      <p>Por favor, aguarde um momento...</p>
    </div>
  );
  if (error) return (
    <div className="dashboard-error">
      <div className="error-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="11" fill="#fff3cd" />
          <path d="M12 5a1 1 0 0 1 1 1v7a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1zm0 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="#ff7f27" />
        </svg>
      </div>
      <h3>Não foi possível carregar os dados</h3>
      <p>{error}</p>
      <button className="retry-button" onClick={atualizarDados}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.65 6.35a7.95 7.95 0 0 0-11.3 0 8 8 0 0 0 0 11.3 7.95 7.95 0 0 0 11.3 0 8 8 0 0 0 0-11.3zm-1.4 9.9a6 6 0 0 1-8.5-8.5 6 6 0 0 1 8.5 8.5z" fill="currentColor" />
          <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8A5.9 5.9 0 0 1 6 12c0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.8.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z" fill="currentColor" />
        </svg>
        Tentar novamente
      </button>
    </div>
  );
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

        <div className="stat-card" onClick={() => setShowAddEquipeModal(true)}>
          <div className="stat-icon equipes-icon">🏆</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalEquipes}</h3>
            <p className="stat-label">Equipes</p>
          </div>
          <div className="add-icon">+</div>
        </div>
      </div><div className="dashboard-section">
        <h3 className="section-title">Próximos Eventos</h3>
        {stats.proximosEventos && stats.proximosEventos.length > 0 ? (
          <div className="eventos-list">
            {stats.proximosEventos.map((evento) => (
              <div className="evento-card" key={evento.id || evento._id}>
                <div className="evento-data">
                  {formatarData(evento.data_inicial || evento.data)}
                </div>
                <div className="evento-info">
                  <h4 className="evento-titulo">{evento.nome || evento.titulo}</h4>
                  <p className="evento-local">{evento.local || "Local não informado"}</p>
                  {evento.descricao && (
                    <p className="evento-descricao">
                      {evento.descricao.length > 100 
                        ? `${evento.descricao.substring(0, 100)}...` 
                        : evento.descricao}
                    </p>
                  )}
                </div>
                <div className="evento-status">
                  <span className={`status-badge ${evento.status || (evento.ativo ? 'ativo' : 'inativo')}`}>
                    {evento.status || (evento.ativo ? 'Ativo' : 'Inativo')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <div className="no-data-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="16" rx="2" fill="#fff3cd" />
                <path d="M5 8h14M5 12h14M5 16h8" stroke="#ff7f27" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p>Não há próximos eventos programados.</p>
          </div>
        )}
      </div><div className="dashboard-section">
        <h3 className="section-title">Atividades Recentes</h3>
        <div className="no-data">
          <div className="no-data-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#fff3cd" />
              <path d="M12 7v5l3 3" stroke="#ff7f27" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p>Nenhuma atividade recente para exibir.</p>
        </div>
        {/* Aqui você pode adicionar um histórico de atividades quando tiver esses dados */}
      </div>

      {/* Modal para adicionar equipe */}
      {showAddEquipeModal && (
        <EquipeModalAdd
          onClose={() => setShowAddEquipeModal(false)}
          onSave={handleSaveNewEquipe}
        />
      )}
    </div>
  );
};

export default Dashboard;