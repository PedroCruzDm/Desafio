import React from "react";

const EventoModalView = ({ isOpen, onClose, evento }) => {
  if (!isOpen || !evento) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>{evento.titulo || evento.nome || "Sem título"}</h2>
        <p><strong>Data:</strong> {evento.data ? new Date(evento.data).toLocaleDateString() : "Não informado"}</p>
        <p><strong>Local:</strong> {evento.local || "Não informado"}</p>
        <p><strong>Descrição:</strong> {evento.descricao || "Não informado"}</p>
        <button onClick={onClose} style={styles.button}>Fechar</button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    minWidth: "300px",
    maxWidth: "90%",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
  button: {
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    border: "none",
    background: "#1976d2",
    color: "#fff",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default EventoModalView;