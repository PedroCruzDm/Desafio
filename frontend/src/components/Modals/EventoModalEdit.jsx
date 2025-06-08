import React, { useState, useEffect } from "react";
import "./style/Modals.scss";

const EventoModalEdit = ({ isOpen, onClose, onEditar, evento }) => {
  const [nome, setNome] = useState("");
  const [equipe, setEquipe] = useState("");
  const [status, setStatus] = useState("pendente");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [cor, setCor] = useState("#00aaff");
  const [descricao, setDescricao] = useState("");

  // Preencher o formulário quando o evento for selecionado
  useEffect(() => {
    if (evento) {
      setNome(evento.nome || "");
      setEquipe(evento.equipe?.toString() || "");
      setStatus(evento.status || "pendente");
      
      // Formatar data inicial para o formato do input datetime-local
      if (evento.data_inicial) {
        const dataInicialEvento = new Date(evento.data_inicial);
        const dataInicialFormatada = dataInicialEvento.toISOString().split('T')[0] + "T00:00";
        setDataInicial(dataInicialFormatada);
      } else if (evento.data) {
        // Para compatibilidade com dados antigos
        const dataEvento = new Date(evento.data);
        const dataFormatada = dataEvento.toISOString().split('T')[0] + "T00:00";
        setDataInicial(dataFormatada);
      }
      
      // Formatar data final para o formato do input datetime-local
      if (evento.data_final) {
        const dataFinalEvento = new Date(evento.data_final);
        const dataFinalFormatada = dataFinalEvento.toISOString().split('T')[0] + "T00:00";
        setDataFinal(dataFinalFormatada);
      } else if (evento.data) {
        // Para compatibilidade com dados antigos, usar a mesma data
        const dataEvento = new Date(evento.data);
        const dataFormatada = dataEvento.toISOString().split('T')[0] + "T00:00";
        setDataFinal(dataFormatada);
      }
      
      setCor(evento.cor || "#00aaff");
      setDescricao(evento.descricao || "");
    }
  }, [evento]);

  const handleSave = async () => {
    if (!nome.trim()) return alert("Nome do evento é obrigatório.");
    if (!dataInicial) return alert("Data inicial é obrigatória.");
    if (!dataFinal) return alert("Data final é obrigatória.");
    
    // Validar que a data final é posterior à data inicial
    if (new Date(dataFinal) < new Date(dataInicial)) {
      return alert("A data final deve ser posterior à data inicial.");
    }

    try {      const eventoAtualizado = {
        id: evento.id,
        usuario_id: evento.usuario_id || 1, // Mantido como usuario_id para compatibilidade
        nome,
        equipe: parseInt(equipe) || 0,
        status,
        data_inicial: dataInicial.split("T")[0], // só a data (YYYY-MM-DD)
        data_final: dataFinal.split("T")[0], // só a data (YYYY-MM-DD)
        cor,
        descricao,
      };

      if (onEditar) {
        onEditar(eventoAtualizado);
        onClose();
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar o evento.");
    }
  };

  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

  if (!isOpen || !evento) return null;

  return (
    <div className="modal_event" onClick={(e) => e.stopPropagation()}>
      <div className="modal_event_container">
        <div className="modal_event_header">
          <h2>Editar Evento</h2>
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
          <textarea 
            value={descricao} 
            onChange={(e) => setDescricao(e.target.value)}
            style={{ width: "100%", minHeight: "100px", resize: "vertical" }}
          />

          <div className="modal_event_buttons">
            <button onClick={handleSave} className="modal_event_save">
              Atualizar
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

export default EventoModalEdit;
