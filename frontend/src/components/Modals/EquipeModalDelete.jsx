import React from "react";
import "../Modals/style/Modals.scss";

const EquipeModalDelete = ({ equipe, onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container delete-modal">
        <div className="modal-header">
          <h2>Excluir Equipe</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="delete-warning">
            <span className="warning-icon">⚠️</span>
            <p>
              Você está prestes a excluir a equipe <strong>{equipe.nome}</strong>.
              Esta ação não pode ser desfeita. Deseja continuar?
            </p>
          </div>
          
          <div className="delete-details">
            <p><strong>ID:</strong> {equipe._id || equipe.id}</p>
            <p><strong>Líder:</strong> {equipe.lider || "Não definido"}</p>
            <p><strong>Membros:</strong> {equipe.membros?.length || 0}</p>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="delete-confirm-button"
            onClick={onConfirm}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipeModalDelete;
