import React from "react";

const EventoCard = ({ evento, inscricao, onView, onInscrever, onCancelar, tipo }) => {
  const formatarData = (dataString) => {
    if (!dataString) return "Data não informada";
    
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
    const capacidade = evento.capacidade || 0;
    const inscritos = evento.inscritos || 0;
    const vagas = capacidade - inscritos;
    return vagas > 0 ? vagas : 0;
  };

  const vagasDisponiveis = calcularVagas();
  const eventoLotado = vagasDisponiveis === 0;
  const eventoPassado = evento.data ? new Date(evento.data) < new Date() : 
                        (evento.data_final ? new Date(evento.data_final) < new Date() : false);

  return (
    <div className={`evento-card ${tipo}`}>
      <div className="evento-card-header">
        <div className="categoria">{evento.categoria || "Sem categoria"}</div>
        <h3 className="evento-titulo">{evento.titulo || evento.nome}</h3>
      </div>
      
      <div className="evento-card-body">
        <div className="info-item">
          <i className="fas fa-calendar"></i>
          <span>{formatarData(evento.data || evento.data_inicial)}</span>
        </div>
        
        <div className="info-item">
          <i className="fas fa-map-marker-alt"></i>
          <span>{evento.local || "Local não informado"}</span>
        </div>
        
        <div className="info-item">
          <i className="fas fa-users"></i>
          <span>
            {vagasDisponiveis} {vagasDisponiveis === 1 ? "vaga disponível" : "vagas disponíveis"}
          </span>
        </div>
        
        <p className="evento-descricao">{evento.descricao || "Sem descrição disponível"}</p>
      </div>
      
      <div className="evento-card-footer">
        <button 
          className="btn-ver" 
          onClick={onView}
        >
          Ver detalhes
        </button>
        
        {tipo === "disponivel" && !eventoPassado && (
          <button 
            className={`btn-inscrever ${eventoLotado ? "disabled" : ""}`}
            onClick={onInscrever}
            disabled={eventoLotado}
          >
            {eventoLotado ? "Evento lotado" : "Inscrever-se"}
          </button>
        )}
        
        {tipo === "inscrito" && (
          <button 
            className="btn-cancelar"
            onClick={onCancelar}
          >
            Cancelar inscrição
          </button>
        )}
      </div>
      
      {eventoPassado && (
        <div className="evento-badge passado">
          Evento encerrado
        </div>
      )}
      
      {tipo === "inscrito" && inscricao?.status === "confirmado" && !eventoPassado && (
        <div className="evento-badge inscrito">
          Inscrito
        </div>
      )}
    </div>
  );
};

export default EventoCard;
