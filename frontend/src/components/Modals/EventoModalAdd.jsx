import React, { useState } from "react";
import "./style/Modals.scss";

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
    <div className="modal_event" onClick={(e) => e.stopPropagation()}>
      <div className="modal_event_container">
        <div className="modal_event_header">
          <h2>Adicionar novo Evento</h2>
          <button onClick={onClose} className="modal_event_close">
            X
          </button>
        </div>

        <div className="modal_event_body">
          <p>Nome do Evento:</p>
          <input value={nome} onChange={(e) => setNome(e.target.value)} required />

          <p>Quantidade de Equipe:</p>
          <input
            type="number"
            value={equipe}
            onChange={(e) => setEquipe(e.target.value)}
            required
          />

          <p>Status:</p>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pendente">Pendente</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </select>

          <p>Data Inicial:</p>
          <input
            type="datetime-local"
            value={dataInicial}
            onChange={(e) => setDataInicial(e.target.value)}
            required
            min={today}
          />

          <p>Data Final:</p>
          <input
            type="datetime-local"
            value={dataFinal}
            onChange={(e) => setDataFinal(e.target.value)}
            required
            min={dataInicial || today}
          />

          <p>Cor:</p>
          <input type="color" value={cor} onChange={(e) => setCor(e.target.value)} />

          <p>Descrição:</p>
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />

          <div className="modal_event_buttons">
            <button onClick={handleSave} className="modal_event_save">
              Salvar
            </button>
            <button onClick={onClose} className="modal_event_cancel">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventoModalAdd;