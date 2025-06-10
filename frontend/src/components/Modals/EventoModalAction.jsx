import React, { useEffect, useRef } from "react";
import "./style/EventoModals.scss";

export const EventoModalAction = ({ open, onClose, onView, onEdit, onDelete, position }) => {
  const modalRef = useRef(null);
  
  // Fechar o modal ao clicar fora dele
  useEffect(() => {
    if (!open) return;
    
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);
  
  // Posicionar o modal acima do botão
  useEffect(() => {
    if (!open || !modalRef.current || !position) return;
    
    const modalEl = modalRef.current;
    const rect = modalEl.getBoundingClientRect();
    
    // Ajusta a posição para ficar acima do botão
    modalEl.style.left = `${position.left - (rect.width / 2)}px`;
    modalEl.style.top = `${position.top - rect.height - 15}px`;
    
  }, [open, position]);
  if (!open) return null;
  return (
    <div className="action-popup" ref={modalRef} onClick={(e) => e.stopPropagation()}>
      <div className="action-popup-item view" onClick={onView}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
        </svg>
        <span>Visualizar</span>
      </div>
      <div className="action-popup-item edit" onClick={onEdit}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor"/>
        </svg>
        <span>Editar</span>
      </div>
      <div className="action-popup-item delete" onClick={onDelete}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/>
        </svg>
        <span>Excluir</span>
      </div>
    </div>
  );
};
