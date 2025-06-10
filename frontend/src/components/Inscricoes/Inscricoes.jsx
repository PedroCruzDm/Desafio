import React, { useState, useEffect } from "react";
import "./Inscricoes.scss";
import EventoCard from "./EventoCard";
import InscricaoDetalhes from "./InscricaoDetalhes";

const Inscricoes = () => {
  const [eventos, setEventos] = useState([]);
  const [minhasInscricoes, setMinhasInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventoAtual, setEventoAtual] = useState(null);
  const [activeTab, setActiveTab] = useState("disponiveis"); // "disponiveis" ou "inscritos"
  const [refreshKey, setRefreshKey] = useState(0);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Carregar dados do usuário
    const usuarioData = localStorage.getItem("usuario");
    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData));
    }
  }, []);

  // Buscar eventos e inscrições
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const token = localStorage.getItem("token");
        
        // Buscar todos os eventos
        const eventosResponse = await fetch("http://localhost:5000/api/eventos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Buscar minhas inscrições
        const inscricoesResponse = await fetch("http://localhost:5000/api/inscricoes/minhas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!eventosResponse.ok || !inscricoesResponse.ok) {
          throw new Error("Falha ao carregar dados");
        }

        const eventosData = await eventosResponse.json();
        const inscricoesData = await inscricoesResponse.json();
        
        setEventos(eventosData);
        setMinhasInscricoes(inscricoesData);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Não foi possível carregar os dados. Tente novamente mais tarde.");
        
        // Usar dados de exemplo para desenvolvimento
        const dataAtual = new Date();
        const eventosExemplo = [
          {
            id: 1,
            titulo: "Workshop de Desenvolvimento Web",
            descricao: "Aprenda as mais recentes tecnologias para desenvolvimento web",
            data: new Date(dataAtual.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias depois
            local: "Centro de Convenções",
            capacidade: 50,
            inscritos: 30,
            categoria: "Tecnologia",
            organizador: "Equipe de Desenvolvimento"
          },
          {
            id: 2,
            titulo: "Palestra sobre UX/UI Design",
            descricao: "Como criar interfaces que seus usuários vão amar",
            data: new Date(dataAtual.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 dias depois
            local: "Auditório Principal",
            capacidade: 100,
            inscritos: 45,
            categoria: "Design",
            organizador: "Equipe de Design"
          },
          {
            id: 3,
            titulo: "Meetup de Programação",
            descricao: "Encontro de programadores para networking e troca de experiências",
            data: new Date(dataAtual.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias depois
            local: "Espaço Colaborativo",
            capacidade: 30,
            inscritos: 28,
            categoria: "Networking",
            organizador: "Comunidade de Desenvolvedores"
          }
        ];
        
        const inscricoesExemplo = [
          {
            id: 1,
            eventoId: 2,
            userId: 1,
            dataInscricao: new Date(dataAtual.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias antes
            status: "confirmado",
            evento: eventosExemplo.find(e => e.id === 2)
          }
        ];
        
        setEventos(eventosExemplo);
        setMinhasInscricoes(inscricoesExemplo);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);

  const handleVerDetalhes = (evento) => {
    setEventoAtual(evento);
  };

  const handleFecharDetalhes = () => {
    setEventoAtual(null);
  };

  const handleInscrever = async (eventoId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:5000/api/inscricoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventoId }),
      });

      if (!response.ok) {
        throw new Error("Falha ao realizar inscrição");
      }

      // Atualizar dados
      setRefreshKey(old => old + 1);
      
      // Feedback de sucesso
      alert("Inscrição realizada com sucesso!");
      
    } catch (err) {
      console.error("Erro ao se inscrever:", err);
      alert("Erro ao realizar inscrição. Tente novamente.");
      
      // Para desenvolvimento, simular a inscrição localmente
      const eventoInscrito = eventos.find(e => e.id === eventoId);
      if (eventoInscrito) {
        const novaInscricao = {
          id: Date.now(),
          eventoId,
          userId: usuario?.id || 1,
          dataInscricao: new Date().toISOString(),
          status: "confirmado",
          evento: eventoInscrito
        };
        
        setMinhasInscricoes([...minhasInscricoes, novaInscricao]);
        
        // Atualizar contagem de inscritos no evento
        const eventosAtualizados = eventos.map(e => {
          if (e.id === eventoId) {
            return { ...e, inscritos: e.inscritos + 1 };
          }
          return e;
        });
        
        setEventos(eventosAtualizados);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarInscricao = async (inscricaoId) => {
    if (!window.confirm("Tem certeza que deseja cancelar esta inscrição?")) {
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:5000/api/inscricoes/${inscricaoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao cancelar inscrição");
      }

      // Atualizar dados
      setRefreshKey(old => old + 1);
      
      // Feedback de sucesso
      alert("Inscrição cancelada com sucesso!");
      
    } catch (err) {
      console.error("Erro ao cancelar inscrição:", err);
      alert("Erro ao cancelar inscrição. Tente novamente.");
      
      // Para desenvolvimento, simular o cancelamento localmente
      const inscricaoCancelada = minhasInscricoes.find(i => i.id === inscricaoId);
      
      if (inscricaoCancelada) {
        // Remover da lista de inscrições
        setMinhasInscricoes(minhasInscricoes.filter(i => i.id !== inscricaoId));
        
        // Atualizar contagem de inscritos no evento
        const eventosAtualizados = eventos.map(e => {
          if (e.id === inscricaoCancelada.eventoId) {
            return { ...e, inscritos: Math.max(0, e.inscritos - 1) };
          }
          return e;
        });
        
        setEventos(eventosAtualizados);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filtragem de eventos disponíveis (excluindo os que já estou inscrito)
  const eventosDisponiveis = eventos.filter(evento => 
    !minhasInscricoes.some(inscricao => inscricao.eventoId === evento.id)
  );

  // Renderização condicional para loading
  if (loading && !eventos.length && !minhasInscricoes.length) {
    return (
      <div className="inscricoes-container loading">
        <div className="spinner"></div>
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="inscricoes-container">
      <div className="inscricoes-header">
        <h2>Inscrições em Eventos</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Tabs de navegação */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === "disponiveis" ? "active" : ""}`}
          onClick={() => setActiveTab("disponiveis")}
        >
          Eventos Disponíveis
        </button>
        <button 
          className={`tab ${activeTab === "inscritos" ? "active" : ""}`}
          onClick={() => setActiveTab("inscritos")}
        >
          Minhas Inscrições
          {minhasInscricoes.length > 0 && (
            <span className="badge">{minhasInscricoes.length}</span>
          )}
        </button>
      </div>

      {/* Conteúdo da tab selecionada */}
      <div className="tab-content">
        {activeTab === "disponiveis" && (
          <div className="eventos-wrapper">
            {eventosDisponiveis.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-calendar-alt"></i>
                <p>Não há eventos disponíveis no momento</p>
              </div>
            ) : (
              <div className="eventos-grid">
                {eventosDisponiveis.map(evento => (
                  <EventoCard 
                    key={evento.id} 
                    evento={evento} 
                    onView={() => handleVerDetalhes(evento)}
                    onInscrever={() => handleInscrever(evento.id)}
                    tipo="disponivel"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "inscritos" && (
          <div className="eventos-wrapper">
            {minhasInscricoes.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-ticket-alt"></i>
                <p>Você ainda não está inscrito em nenhum evento</p>
                <button 
                  className="btn-secundario" 
                  onClick={() => setActiveTab("disponiveis")}
                >
                  Ver eventos disponíveis
                </button>
              </div>
            ) : (
              <div className="eventos-grid">
                {minhasInscricoes.map(inscricao => (
                  <EventoCard 
                    key={inscricao.id} 
                    evento={inscricao.evento} 
                    inscricao={inscricao}
                    onView={() => handleVerDetalhes(inscricao.evento)}
                    onCancelar={() => handleCancelarInscricao(inscricao.id)}
                    tipo="inscrito"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de detalhes do evento */}
      {eventoAtual && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleFecharDetalhes}>×</button>
            <InscricaoDetalhes 
              evento={eventoAtual}
              onClose={handleFecharDetalhes}
              onInscrever={() => handleInscrever(eventoAtual.id)}
              onCancelar={(inscricaoId) => handleCancelarInscricao(inscricaoId)}
              inscricao={minhasInscricoes.find(i => i.eventoId === eventoAtual.id)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Inscricoes;
