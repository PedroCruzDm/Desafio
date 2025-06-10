import React from "react";

const InscricaoDetalhes = ({ evento, inscricao, onClose, onInscrever, onCancelar }) => {
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calcularVagas = () => {
    const vagas = evento.capacidade - evento.inscritos;
    return vagas > 0 ? vagas : 0;
  };

  const vagasDisponiveis = calcularVagas();
  const eventoLotado = vagasDisponiveis === 0;
  const eventoPassado = new Date(evento.data) < new Date();
  const jaInscrito = inscricao !== undefined;

  return (
    <div className="inscricao-detalhes">
      <div className="detalhes-header">
        <div className="categoria">{evento.categoria}</div>
        <h3>{evento.titulo}</h3>
        {jaInscrito && (
          <div className={`status-badge ${inscricao.status}`}>
            {inscricao.status === "confirmado" ? "Inscrição confirmada" : "Pendente"}
          </div>
        )}
      </div>
      
      <div className="detalhes-content">
        <div className="info-section">
          <h4>Informações do Evento</h4>
          
          <div className="info-grid">
            <div className="info-item">
              <label>Data e Hora:</label>
              <span>{formatarData(evento.data)}</span>
            </div>
            
            <div className="info-item">
              <label>Local:</label>
              <span>{evento.local}</span>
            </div>
            
            <div className="info-item">
              <label>Organizador:</label>
              <span>{evento.organizador}</span>
            </div>
            
            <div className="info-item">
              <label>Capacidade:</label>
              <span>{evento.inscritos}/{evento.capacidade} participantes</span>
            </div>
          </div>
          
          <div className="descricao-box">
            <h4>Descrição</h4>
            <p>{evento.descricao}</p>
          </div>
          
          {jaInscrito && (
            <div className="inscricao-info">
              <h4>Informações da Inscrição</h4>
              <div className="info-item">
                <label>Data da Inscrição:</label>
                <span>{formatarData(inscricao.dataInscricao)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="detalhes-footer">
        {!jaInscrito && !eventoPassado && (
          <button 
            className={`btn-inscrever ${eventoLotado ? "disabled" : ""}`}
            onClick={onInscrever}
            disabled={eventoLotado}
          >
            {eventoLotado ? "Evento lotado" : "Inscrever-se"}
          </button>
        )}
        
        {jaInscrito && !eventoPassado && (
          <button 
            className="btn-cancelar"
            onClick={() => onCancelar(inscricao.id)}
          >
            Cancelar inscrição
          </button>
        )}
        
        {eventoPassado && (
          <div className="evento-encerrado">
            Este evento já foi encerrado
          </div>
        )}
      </div>
    </div>
  );
};

export default InscricaoDetalhes;
