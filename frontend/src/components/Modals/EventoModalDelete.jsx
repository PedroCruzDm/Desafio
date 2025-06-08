// src/Modals/EventoModalDelete.jsx
import React from 'react';

const EventoModalDelete = ({ isOpen, onClose, onConfirm, evento }) => {
  if (!isOpen || !evento) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Confirmar Exclusão</h2>
        <p>Tem certeza que deseja excluir o evento <strong>{evento.nome}</strong>?</p>
        <div style={styles.buttons}>
          <button onClick={onClose} style={styles.cancel}>Cancelar</button>
          <button onClick={() => onConfirm(evento.id)} style={styles.confirm}>Excluir</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    minWidth: '300px',
    maxWidth: '90%',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    textAlign: 'center'
  },
  buttons: {
    marginTop: '1.5rem',
    display: 'flex',
    justifyContent: 'space-around'
  },
  cancel: {
    background: '#ccc', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer'
  },
  confirm: {
    background: '#e53935', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer'
  }
};

export default EventoModalDelete;