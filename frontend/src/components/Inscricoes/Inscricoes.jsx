import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Inscricoes.css";

const Inscricoes = () => {
  const [eventos, setEventos] = useState([]);
  const [equipes, setEquipes] = useState([]);
  const [minhasInscricoes, setMinhasInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [tipoVisualizacao, setTipoVisualizacao] = useState("eventos"); // eventos ou equipes
  const [sucessoMensagem, setSucessoMensagem] = useState("");
  const [erroMensagem, setErroMensagem] = useState("");

  // Buscar usuário logado
  useEffect(() => {
    const usuarioStorage = localStorage.getItem("usuario");
    if (usuarioStorage) {
      setUsuario(JSON.parse(usuarioStorage));
    }
  }, []);

  // Função para buscar dados de eventos, equipes e inscrições
  const fetchData = async () => {
    if (!usuario) return;
    
    setLoading(true);
    setSucessoMensagem("");
    setErroMensagem("");
    
    try {
      // Buscar eventos disponíveis
      const eventosRes = await axios.get("http://localhost:5000/api/eventos");
      const eventosAtivos = eventosRes.data.filter(
        evento => evento.status === 'ativo' || evento.ativo === true
      );
      setEventos(eventosAtivos);
      
      // Buscar equipes disponíveis
      const equipesRes = await axios.get("http://localhost:5000/api/equipes");
      const equipesAtivas = equipesRes.data.filter(
        equipe => equipe.ativo === true
      );
      setEquipes(equipesAtivas);
      
      // Buscar minhas inscrições
      const inscricoesRes = await axios.get(
        `http://localhost:5000/api/inscricoes/usuario/${usuario.id}`
      );
      setMinhasInscricoes(inscricoesRes.data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError("Não foi possível carregar os dados. Por favor, tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Buscar dados de eventos, equipes e inscrições
  useEffect(() => {
    if (usuario) {
      fetchData();
    }
  }, [usuario]);

  // Função para inscrever em um evento
  const inscreverEvento = async (eventoId) => {
    if (!usuario) {
      setErroMensagem("Você precisa estar logado para se inscrever em um evento.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/inscricoes", {
        usuario_id: usuario.id,
        evento_id: eventoId,
        tipo: "evento",
        status: "pendente",
        data_inscricao: new Date().toISOString().split('T')[0]
      });
      
      // Atualizar a lista de inscrições
      const inscricoesRes = await axios.get(
        `http://localhost:5000/api/inscricoes/usuario/${usuario.id}`
      );
      setMinhasInscricoes(inscricoesRes.data);
      
      setSucessoMensagem("Inscrição realizada com sucesso!");
      setTimeout(() => setSucessoMensagem(""), 3000);
    } catch (err) {
      console.error("Erro ao realizar inscrição:", err);
      setErroMensagem("Não foi possível realizar a inscrição. Por favor, tente novamente.");
      setTimeout(() => setErroMensagem(""), 3000);
    }
  };

  // Função para inscrever em uma equipe
  const inscreverEquipe = async (equipeId) => {
    if (!usuario) {
      setErroMensagem("Você precisa estar logado para se inscrever em uma equipe.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/inscricoes", {
        usuario_id: usuario.id,
        equipe_id: equipeId,
        tipo: "equipe",
        status: "pendente",
        data_inscricao: new Date().toISOString().split('T')[0]
      });
      
      // Atualizar a lista de inscrições
      const inscricoesRes = await axios.get(
        `http://localhost:5000/api/inscricoes/usuario/${usuario.id}`
      );
      setMinhasInscricoes(inscricoesRes.data);
      
      setSucessoMensagem("Solicitação de entrada na equipe realizada com sucesso!");
      setTimeout(() => setSucessoMensagem(""), 3000);
    } catch (err) {
      console.error("Erro ao solicitar entrada na equipe:", err);
      setErroMensagem("Não foi possível solicitar entrada na equipe. Por favor, tente novamente.");
      setTimeout(() => setErroMensagem(""), 3000);
    }
  };

  // Função para cancelar uma inscrição
  const cancelarInscricao = async (inscricaoId) => {
    try {
      await axios.delete(`http://localhost:5000/api/inscricoes/${inscricaoId}`);
      
      // Atualizar a lista de inscrições
      const inscricoesRes = await axios.get(
        `http://localhost:5000/api/inscricoes/usuario/${usuario.id}`
      );
      setMinhasInscricoes(inscricoesRes.data);
      
      setSucessoMensagem("Inscrição cancelada com sucesso!");
      setTimeout(() => setSucessoMensagem(""), 3000);
    } catch (err) {
      console.error("Erro ao cancelar inscrição:", err);
      setErroMensagem("Não foi possível cancelar a inscrição. Por favor, tente novamente.");
      setTimeout(() => setErroMensagem(""), 3000);
    }
  };

  // Verificar se o usuário já está inscrito em um evento/equipe
  const verificarInscricao = (id, tipo) => {
    return minhasInscricoes.some(
      inscricao => 
        (tipo === "evento" && inscricao.evento_id === id) || 
        (tipo === "equipe" && inscricao.equipe_id === id)
    );
  };

  // Encontrar a inscrição por id de evento/equipe
  const encontrarInscricao = (id, tipo) => {
    return minhasInscricoes.find(
      inscricao => 
        (tipo === "evento" && inscricao.evento_id === id) || 
        (tipo === "equipe" && inscricao.equipe_id === id)
    );
  };

  // Formatar data
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  // Renderizar conteúdo condicional baseado em estados de loading e error
  if (loading) return (
    <div className="inscricoes-loading">
      <div className="loading-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="none" stroke="#ffe0b2" strokeWidth="2" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#ff7f27" strokeWidth="2" fill="none">
            <animateTransform 
              attributeName="transform" 
              type="rotate" 
              from="0 12 12" 
              to="360 12 12" 
              dur="1s" 
              repeatCount="indefinite" 
            />
          </path>
        </svg>
      </div>
      <h3>Carregando inscrições</h3>
      <p>Por favor, aguarde um momento...</p>
    </div>
  );

  if (error) return (
    <div className="inscricoes-error">
      <div className="error-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="11" fill="#fff3cd" />
          <path d="M12 5a1 1 0 0 1 1 1v7a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1zm0 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="#ff7f27" />
        </svg>
      </div>
      <h3>Não foi possível carregar as inscrições</h3>
      <p>{error}</p>
      <button className="retry-button" onClick={() => fetchData()}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.65 6.35a7.95 7.95 0 0 0-11.3 0 8 8 0 0 0 0 11.3 7.95 7.95 0 0 0 11.3 0 8 8 0 0 0 0-11.3zm-1.4 9.9a6 6 0 0 1-8.5-8.5 6 6 0 0 1 8.5 8.5z" fill="currentColor" />
          <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8A5.9 5.9 0 0 1 6 12c0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.8.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z" fill="currentColor" />
        </svg>
        Tentar novamente
      </button>
    </div>
  );

  return (
    <div className="inscricoes-container">
      <div className="inscricoes-header">
        <h2>Inscrições</h2>
        <p className="inscricoes-subtitle">Inscreva-se em eventos e equipes</p>

        <div className="tipo-visualizacao">
          <button 
            className={`tipo-btn ${tipoVisualizacao === "eventos" ? "ativo" : ""}`}
            onClick={() => setTipoVisualizacao("eventos")}
          >
            Eventos
          </button>
          <button 
            className={`tipo-btn ${tipoVisualizacao === "equipes" ? "ativo" : ""}`}
            onClick={() => setTipoVisualizacao("equipes")}
          >
            Equipes
          </button>
        </div>
      </div>

      {/* Mensagens de sucesso e erro */}
      {sucessoMensagem && (
        <div className="mensagem-sucesso">
          <span>✅</span> {sucessoMensagem}
        </div>
      )}
      {erroMensagem && (
        <div className="mensagem-erro">
          <span>❌</span> {erroMensagem}
        </div>
      )}

      {/* Seção de itens disponíveis para inscrição */}
      <div className="inscricoes-section">
        <h3 className="section-title">
          {tipoVisualizacao === "eventos" ? "Eventos Disponíveis" : "Equipes Disponíveis"}
        </h3>
        
        {tipoVisualizacao === "eventos" ? (
          eventos.length > 0 ? (
            <div className="itens-grid">
              {eventos.map((evento) => {
                const inscrito = verificarInscricao(evento.id || evento._id, "evento");
                const inscricao = inscrito ? encontrarInscricao(evento.id || evento._id, "evento") : null;
                
                return (
                  <div className="item-card" key={evento.id || evento._id}>
                    <div className="item-header">
                      <h4 className="item-titulo">{evento.nome || evento.titulo}</h4>
                      <div className="item-status">
                        <span className="status-badge ativo">Ativo</span>
                      </div>
                    </div>
                    
                    <div className="item-info">
                      <p className="item-data">
                        <strong>Data:</strong> {formatarData(evento.data)}
                      </p>
                      <p className="item-local">
                        <strong>Local:</strong> {evento.local || "Local não informado"}
                      </p>
                      <p className="item-descricao">
                        {evento.descricao || "Sem descrição disponível"}
                      </p>
                    </div>
                    
                    <div className="item-actions">
                      {inscrito ? (
                        <div className="inscricao-info">
                          <span className={`inscricao-status ${inscricao.status}`}>
                            {inscricao.status === "aprovado" 
                              ? "Inscrição Aprovada"
                              : inscricao.status === "pendente" 
                                ? "Inscrição Pendente" 
                                : inscricao.status === "recusado" 
                                  ? "Inscrição Recusada" 
                                  : "Inscrito"}
                          </span>
                          <button 
                            className="cancelar-btn"
                            onClick={() => cancelarInscricao(inscricao.id || inscricao._id)}
                          >
                            Cancelar Inscrição
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="inscrever-btn"
                          onClick={() => inscreverEvento(evento.id || evento._id)}
                        >
                          Inscrever-se
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-data">Não há eventos disponíveis para inscrição no momento.</p>
          )
        ) : (
          equipes.length > 0 ? (
            <div className="itens-grid">
              {equipes.map((equipe) => {
                const inscrito = verificarInscricao(equipe.id || equipe._id, "equipe");
                const inscricao = inscrito ? encontrarInscricao(equipe.id || equipe._id, "equipe") : null;
                
                return (
                  <div className="item-card" key={equipe.id || equipe._id}>
                    <div className="item-header">
                      <h4 className="item-titulo">{equipe.nome}</h4>
                      <div className="item-status">
                        <span className="status-badge ativo">Ativa</span>
                      </div>
                    </div>
                    
                    <div className="item-info">
                      <p className="item-lider">
                        <strong>Líder:</strong> {equipe.lider || "Não definido"}
                      </p>
                      <p className="item-membros">
                        <strong>Membros:</strong> {equipe.membros?.length || 0}
                      </p>
                      <p className="item-descricao">
                        {equipe.descricao || "Sem descrição disponível"}
                      </p>
                    </div>
                    
                    <div className="item-actions">
                      {inscrito ? (
                        <div className="inscricao-info">
                          <span className={`inscricao-status ${inscricao.status}`}>
                            {inscricao.status === "aprovado" 
                              ? "Participação Aprovada"
                              : inscricao.status === "pendente" 
                                ? "Solicitação Pendente" 
                                : inscricao.status === "recusado" 
                                  ? "Solicitação Recusada" 
                                  : "Solicitação Enviada"}
                          </span>
                          <button 
                            className="cancelar-btn"
                            onClick={() => cancelarInscricao(inscricao.id || inscricao._id)}
                          >
                            Cancelar Solicitação
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="inscrever-btn"
                          onClick={() => inscreverEquipe(equipe.id || equipe._id)}
                        >
                          Solicitar Participação
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-data">Não há equipes disponíveis para participação no momento.</p>
          )
        )}
      </div>

      {/* Seção de minhas inscrições */}
      <div className="inscricoes-section">
        <h3 className="section-title">Minhas Inscrições</h3>
        
        {minhasInscricoes.length > 0 ? (
          <div className="minhas-inscricoes">
            <table className="inscricoes-tabela">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Nome</th>
                  <th>Data de Inscrição</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {minhasInscricoes.map((inscricao) => (
                  <tr key={inscricao.id || inscricao._id}>
                    <td>{inscricao.tipo === "evento" ? "Evento" : "Equipe"}</td>
                    <td>
                      {inscricao.tipo === "evento" 
                        ? (inscricao.evento_nome || "Evento não encontrado") 
                        : (inscricao.equipe_nome || "Equipe não encontrada")}
                    </td>
                    <td>{formatarData(inscricao.data_inscricao)}</td>
                    <td>
                      <span className={`status-badge ${inscricao.status}`}>
                        {inscricao.status === "aprovado" 
                          ? "Aprovado" 
                          : inscricao.status === "pendente" 
                            ? "Pendente" 
                            : inscricao.status === "recusado" 
                              ? "Recusado" 
                              : inscricao.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="cancelar-btn pequeno"
                        onClick={() => cancelarInscricao(inscricao.id || inscricao._id)}
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data">Você ainda não possui inscrições.</p>
        )}
      </div>
    </div>
  );
};

export default Inscricoes;
