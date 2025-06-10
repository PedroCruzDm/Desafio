import React, { useState } from "react";
import "./style/Modals.scss";
import "./style/FormModals.scss";

const EventoModalAdd = ({ isOpen, onClose, onAdicionar }) => {
  const [nome, setNome] = useState("");
  const [equipe, setEquipe] = useState("");
  const [status, setStatus] = useState("pendente");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [cor, setCor] = useState("#00aaff");
  const [descricao, setDescricao] = useState("");
  
  if (!isOpen) return null;  const handleSave = async () => {
    if (!nome.trim()) return alert("Nome do evento é obrigatório.");
    if (!dataInicial || !dataFinal) return alert("Datas são obrigatórias.");
    
    // Validar que a data final é posterior à data inicial
    if (new Date(dataFinal) < new Date(dataInicial)) {
      return alert("A data final deve ser posterior à data inicial.");
    }

    try {
      const evento = {
        usuario_id: 1, // Ajuste para o usuário logado real, se tiver
        nome,
        equipe: parseInt(equipe) || 0,
        status,
        data_inicial: dataInicial.split("T")[0], // só a data (YYYY-MM-DD)
        data_final: dataFinal.split("T")[0], // só a data (YYYY-MM-DD)
        cor,
        descricao,
      };

      if (onAdicionar) {
        onAdicionar(evento);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar o evento.");
    }
  };

  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Adicionar Evento</h2>
          <button onClick={onClose} className="close-button">
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Nome do Evento</label>
            <input 
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
              placeholder="Digite o nome do evento"
              className={!nome.trim() ? "input-error" : ""}
              required 
            />
            {!nome.trim() && <div className="error-message">Nome é obrigatório</div>}
          </div>

          <div className="form-group">
            <label>Quantidade de Equipe</label>
            <input
              type="number"
              value={equipe}
              onChange={(e) => setEquipe(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pendente">Pendente</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
              <option value="adiado">Adiado</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Data Inicial</label>
              <input
                type="datetime-local"
                value={dataInicial}
                onChange={(e) => setDataInicial(e.target.value)}
                className={!dataInicial ? "input-error" : ""}
                required
                min={today}
              />
              {!dataInicial && <div className="error-message">Data inicial obrigatória</div>}
            </div>

            <div className="form-group">
              <label>Data Final</label>
              <input
                type="datetime-local"
                value={dataFinal}
                onChange={(e) => setDataFinal(e.target.value)}
                className={!dataFinal ? "input-error" : ""}
                required
                min={dataInicial || today}
              />
              {!dataFinal && <div className="error-message">Data final obrigatória</div>}
            </div>
          </div>

          <div className="form-group color-input-group">
            <label>Cor do Evento</label>
            <div className="color-preview" style={{ backgroundColor: cor }}></div>
            <input 
              type="color" 
              value={cor} 
              onChange={(e) => setCor(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea 
              value={descricao} 
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva os detalhes do evento"
              rows="4"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="cancel-button">
            Cancelar
          </button>
          <button onClick={handleSave} className="save-button">
            Salvar Evento
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventoModalAdd;