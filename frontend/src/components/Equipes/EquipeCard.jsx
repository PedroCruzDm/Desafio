import React from "react";

const EquipeCard = ({ equipe, onEdit, onDelete, onView }) => {
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <div className="equipe-card">
      <div className="equipe-card-header">
        <h3>{equipe.nome}</h3>
        <div className="equipe-actions">
          <button className="btn-icon" onClick={onView} title="Ver detalhes">
            <i className="fas fa-eye"></i>
          </button>
          <button className="btn-icon" onClick={onEdit} title="Editar equipe">
            <i className="fas fa-edit"></i>
          </button>
          <button className="btn-icon delete" onClick={onDelete} title="Excluir equipe">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
      
      <div className="equipe-card-body">
        <p className="descricao">{equipe.descricao || "Sem descrição"}</p>
        
        <div className="equipe-info">
          <div className="info-item">
            <i className="fas fa-calendar-alt"></i>
            <span>Criada em: {formatarData(equipe.dataCriacao)}</span>
          </div>
          <div className="info-item">
            <i className="fas fa-users"></i>
            <span>Membros: {equipe.membros?.length || 0}</span>
          </div>
        </div>
      </div>
      
      <div className="equipe-card-footer">
        <button className="btn-ver-mais" onClick={onView}>
          Ver detalhes
        </button>
      </div>
    </div>
  );
};

export default EquipeCard;
