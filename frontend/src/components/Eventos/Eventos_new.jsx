import React, { useState, useEffect } from "react";
import EventoModalView from "../Modals/EventoModalView";
import EventoModalDelete from "../Modals/EventoModalDelete";
import { EventoModalAction } from "../Modals/EventoModalAction";
import EventoModalAdd from "../Modals/EventoModalAdd";
import EventoModalEdit from "../Modals/EventoModalEdit";
import axios from "axios";

const Eventos = () => {
  const [modalActionOpen, setModalActionOpen] = useState(false);
  const [modalViewOpen, setModalViewOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    carregarEventos();
  }, []);
  
  const carregarEventos = async () => {
    try {
      console.log("Carregando eventos...");
      const res = await axios.get("http://localhost:5000/api/eventos");
      console.log("Eventos recebidos:", res.data);
      setEventos(res.data);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error.response ? error.response.data : error.message);
    }
  };

  const abrirModalAction = (evento) => {
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
      await axios.delete(`http://localhost:5000/api/eventos/${id}`);
      setEventos((prev) => prev.filter((ev) => ev.id !== id));
      setModalDeleteOpen(false);
    } catch (error) {
      console.error("Erro ao deletar evento:", error);
    }
  };
  
  // Função para adicionar evento via API e atualizar a lista local
  const adicionarEvento = async (dadosEvento) => {
    try {
      const res = await axios.post("http://localhost:5000/api/eventos/cadastrar", dadosEvento);
      // adiciona o evento novo no estado local (inclui id retornado da API)
      setEventos((prev) => [{ ...dadosEvento, id: res.data.id }, ...prev]);
      setModalAddOpen(false);
    } catch (error) {
      console.error("Erro ao adicionar evento:", error);
    }
  };
  
  // Função para editar evento via API e atualizar a lista local
  const editarEvento = async (dadosEvento) => {
    try {
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
      alert("Erro ao atualizar o evento: " + (error.response ? JSON.stringify(error.response.data) : error.message));
    }
  };

  return (
    <div>
      <h1>Lista de Eventos</h1>
      <button onClick={() => setModalAddOpen(true)} style={{ marginBottom: "15px" }}>
        Adicionar Evento
      </button>
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
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
              <td>
                {evento.data_inicial && evento.data_final ? (
                  `${new Date(evento.data_inicial).getDate()} a ${new Date(evento.data_final).getDate()} de ${new Date(evento.data_inicial).toLocaleString('pt-BR', { month: 'long' })}`
                ) : evento.data ? (
                  new Date(evento.data).toLocaleDateString()
                ) : "-"}
              </td>
              <td>{evento.equipe || "-"}</td>
              <td>{evento.status}</td>
              <td>
                <button onClick={() => abrirModalAction(evento)}>Ações</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <EventoModalAction
        open={modalActionOpen}
        onClose={() => setModalActionOpen(false)}
        onView={abrirModalView}
        onEdit={abrirModalEdit}
        onDelete={abrirModalDelete}
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
