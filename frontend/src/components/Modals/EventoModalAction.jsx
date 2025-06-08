import React from "react";

const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "#fff",
  padding: "24px 16px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  minWidth: "220px",
  zIndex: 1000,
};

const buttonStyle = {
  display: "block",
  width: "100%",
  margin: "8px 0",
  padding: "8px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "16px",
};

export const EventoModalAction = ({ open, onClose, onView, onEdit, onDelete }) => {
  if (!open) return null;

  return (
    <div style={modalStyle}>
      <button
        style={{ ...buttonStyle, background: "#e0e0e0" }}
        onClick={onView}
      >
        Visualizar
      </button>
      <button
        style={{ ...buttonStyle, background: "#90caf9", color: "#fff" }}
        onClick={onEdit}
      >
        Editar
      </button>
      <button
        style={{ ...buttonStyle, background: "#ef5350", color: "#fff" }}
        onClick={onDelete}
      >
        Deletar
      </button>
      <button
        style={{ ...buttonStyle, background: "#f5f5f5", color: "#333", marginTop: "16px" }}
        onClick={onClose}
      >
        Fechar
      </button>
    </div>
  );
};
