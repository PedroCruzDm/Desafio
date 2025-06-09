import React from "react";
import "../Modals/style/Modals.scss";

const EquipeModalView = ({ equipe, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Detalhes da Equipe</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="view-group">
            <h3 className="view-label">Nome da Equipe</h3>
            <p className="view-value">{equipe.nome}</p>
          </div>

          <div className="view-group">
            <h3 className="view-label">Descrição</h3>
            <p className="view-value">
              {equipe.descricao || "Nenhuma descrição disponível"}
            </p>
          </div>

          <div className="view-group">
            <h3 className="view-label">Status</h3>
            <p className="view-value">
              <span className={`status-badge ${equipe.ativo ? "ativo" : "inativo"}`}>
                {equipe.ativo ? "Ativa" : "Inativa"}
              </span>
            </p>
          </div>

          <div className="view-group">
            <h3 className="view-label">Líder da Equipe</h3>
            <p className="view-value">{equipe.lider || "Não definido"}</p>
          </div>

          <div className="view-group">
            <h3 className="view-label">Membros da Equipe</h3>
            {equipe.membros && equipe.membros.length > 0 ? (
              <ul className="members-view-list">
                {equipe.membros.map((membro, index) => (
                  <li key={index} className="member-view-item">
                    {membro}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="view-value">Nenhum membro cadastrado</p>
            )}
          </div>

          <div className="view-group">
            <h3 className="view-label">ID da Equipe</h3>
            <p className="view-value">{equipe._id || equipe.id}</p>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="close-view-button" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipeModalView;
