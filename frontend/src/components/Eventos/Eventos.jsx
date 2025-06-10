import React, { useState, useEffect } from "react";
import EventoModalView from "../Modals/EventoModalView";
import EventoModalDelete from "../Modals/EventoModalDelete";
import { EventoModalAction } from "../Modals/EventoModalAction";
import EventoModalAdd from "../Modals/EventoModalAdd";
import EventoModalEdit from "../Modals/EventoModalEdit";
import axios from "axios";
import "./Eventos.scss";

const Eventos = () => {  const [modalActionOpen, setModalActionOpen] = useState(false);
  const [modalViewOpen, setModalViewOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buttonPosition, setButtonPosition] = useState(null);

  useEffect(() => {
    carregarEventos();
  }, []);  const carregarEventos = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Carregando eventos...");
      const res = await axios.get("http://localhost:5000/api/eventos");
      console.log("Eventos recebidos:", res.data);
      setEventos(res.data);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error.response ? error.response.data : error.message);
      setError("Ocorreu um erro ao carregar os eventos. Por favor, tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };
  const abrirModalAction = (evento, e) => {
    // Capturar a posição do botão que foi clicado
    const buttonRect = e.currentTarget.getBoundingClientRect();
    setButtonPosition({
      top: buttonRect.top,
      left: buttonRect.left + (buttonRect.width / 2)
    });
    
    setEventoSelecionado(evento);
    setModalActionOpen(true);
  };
  
  const abrirModalAdd = () => {
    setModalActionOpen(false);
    setModalAddOpen(true);
  };
  const abrirModalView = () => {
    setModalActionOpen(false);
    setModalViewOpen(true);
  };

  const abrirModalEdit = () => {
    setModalActionOpen(false);
    setModalEditOpen(true);
  };

  const abrirModalDelete = () => {
    setModalActionOpen(false);
    setModalDeleteOpen(true);
  };
  const confirmarDelete = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`http://localhost:5000/api/eventos/${id}`);
      setEventos((prev) => prev.filter((ev) => ev.id !== id));
      setModalDeleteOpen(false);
    } catch (error) {
      console.error("Erro ao deletar evento:", error);
      setError("Erro ao deletar evento. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };  
  
  // Função para adicionar evento via API e atualizar a lista local
  const adicionarEvento = async (dadosEvento) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post("http://localhost:5000/api/eventos/cadastrar", dadosEvento);
      // adiciona o evento novo no estado local (inclui id retornado da API)
      setEventos((prev) => [{ ...dadosEvento, id: res.data.id }, ...prev]);
      setModalAddOpen(false);
    } catch (error) {
      console.error("Erro ao adicionar evento:", error);
      setError("Erro ao adicionar evento. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };  // Função para editar evento via API e atualizar a lista local
  const editarEvento = async (dadosEvento) => {
    try {
      setLoading(true);
      setError(null);
      console.log("Enviando dados para atualização:", dadosEvento);
      const response = await axios.put(`http://localhost:5000/api/eventos/${dadosEvento.id}`, dadosEvento);
      console.log("Resposta da API:", response.data);
      // Atualiza o evento na lista local
      setEventos((prev) => 
        prev.map((ev) => (ev.id === dadosEvento.id ? dadosEvento : ev))
      );
      setModalEditOpen(false);
    } catch (error) {
      console.error("Erro ao editar evento:", error.response ? error.response.data : error.message);
      setError("Erro ao atualizar o evento: " + (error.response ? JSON.stringify(error.response.data) : error.message));
    } finally {
      setLoading(false);
    }
  };

  // Função para retornar o ícone correspondente ao status
  const getStatusIcon = (status) => {
    if (!status) return "⏳ ";
    
    const statusLower = status.toLowerCase().replace(/í/g, 'i').replace(/ú/g, 'u');
    
    switch (statusLower) {
      case 'ativo':
        return "✅ ";
      case 'inativo':
        return "❌ ";
      case 'pendente':
        return "⏳ ";
      case 'concluido':
      case 'finalizado':
        return "🏆 ";
      case 'cancelado':
        return "🚫 ";
      case 'adiado':
        return "🕒 ";
      default:
        return "📝 ";
    }
  };
  return (
    <div className="eventos-container">
      <div className="eventos-header">
        <h1>Lista de Eventos</h1>
        <button 
          className="eventos-add-button" 
          onClick={() => setModalAddOpen(true)}
        >
          <span className="icon">+</span>
          Adicionar Evento
        </button>
      </div>
      
      {loading && <div className="eventos-loading">Carregando eventos...</div>}
      
      {error && <div className="eventos-error">{error}</div>}
      
      {!loading && !error && eventos.length === 0 ? (
        <div className="eventos-empty">
          <p>Nenhum evento encontrado.</p>
          <button 
            className="eventos-add-button" 
            onClick={() => setModalAddOpen(true)}
          >
            Criar Novo Evento
          </button>
        </div>
      ) : (
        !loading && !error && (
          <table className="eventos-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Período</th>
                <th>Equipe</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((evento) => (
                <tr key={evento.id}>
                  <td>{evento.nome}</td>
                  <td className="eventos-periodo">
                    {evento.data_inicial && evento.data_final ? (
                      `${new Date(evento.data_inicial).getDate()} a ${new Date(evento.data_final).getDate()} de ${new Date(evento.data_inicial).toLocaleString('pt-BR', { month: 'long' })}`
                    ) : evento.data ? (
                      new Date(evento.data).toLocaleDateString()
                    ) : "-"}
                  </td>                  <td>{evento.equipe || "-"}</td>
                  <td>
                    <span className={`eventos-status ${evento.status ? evento.status.toLowerCase().replace(/í/g, 'i').replace(/ú/g, 'u') : 'pendente'}`}>
                      {getStatusIcon(evento.status)}
                      {evento.status || "Pendente"}
                    </span>
                  </td>
                  <td>                    <div className="eventos-acoes">
                      <button 
                        className="eventos-acao-button" 
                        onClick={(e) => abrirModalAction(evento, e)}
                      >
                        Ações
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
        <EventoModalAction
        open={modalActionOpen}
        onClose={() => setModalActionOpen(false)}
        onView={abrirModalView}
        onEdit={abrirModalEdit}
        onDelete={abrirModalDelete}
        position={buttonPosition}
      />

      <EventoModalView
        isOpen={modalViewOpen}
        onClose={() => setModalViewOpen(false)}
        evento={eventoSelecionado}
      />
      
      <EventoModalDelete
        isOpen={modalDeleteOpen}
        onClose={() => setModalDeleteOpen(false)}
        onConfirm={() => confirmarDelete(eventoSelecionado?.id)}
        evento={eventoSelecionado}
      />
      
      <EventoModalAdd
        isOpen={modalAddOpen}
        onClose={() => setModalAddOpen(false)}
        onAdicionar={adicionarEvento}
      />
      
      <EventoModalEdit
        isOpen={modalEditOpen}
        onClose={() => setModalEditOpen(false)}
        onEditar={editarEvento}
        evento={eventoSelecionado}
      />
    </div>
  );
};

export default Eventos;