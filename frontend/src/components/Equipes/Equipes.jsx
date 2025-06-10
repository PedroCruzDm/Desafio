import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Equipes.css";
import EquipeModalAdd from "../Modals/EquipeModalAdd";
import EquipeModalEdit from "../Modals/EquipeModalEdit";
import EquipeModalDelete from "../Modals/EquipeModalDelete";
import EquipeModalView from "../Modals/EquipeModalView";

const Equipes = () => {
  const [equipes, setEquipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEquipe, setSelectedEquipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEquipes, setFilteredEquipes] = useState([]);

  // Função para buscar as equipes
  const fetchEquipes = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/equipes");
      setEquipes(response.data);
      setFilteredEquipes(response.data);
    } catch (err) {
      console.error("Erro ao buscar equipes:", err);
      setError("Não foi possível carregar as equipes. Por favor, tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Carregar equipes ao montar o componente
  useEffect(() => {
    fetchEquipes();
  }, []);

  // Filtrar equipes conforme o usuário digita no campo de busca
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEquipes(equipes);
    } else {
      const filtered = equipes.filter(
        (equipe) =>
          equipe.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (equipe.descricao && equipe.descricao.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (equipe.lider && equipe.lider.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredEquipes(filtered);
    }
  }, [searchTerm, equipes]);

  // Handlers para abrir/fechar modais
  const handleAddEquipe = () => {
    setShowAddModal(true);
  };

  const handleViewEquipe = (equipe) => {
    setSelectedEquipe(equipe);
    setShowViewModal(true);
  };

  const handleEditEquipe = (equipe) => {
    setSelectedEquipe(equipe);
    setShowEditModal(true);
  };

  const handleDeleteEquipe = (equipe) => {
    setSelectedEquipe(equipe);
    setShowDeleteModal(true);
  };

  // Handlers para ações nas modais
  const handleSaveNewEquipe = async (equipeData) => {
    try {
      await axios.post("http://localhost:5000/api/equipes", equipeData);
      fetchEquipes();
      setShowAddModal(false);
    } catch (error) {
      console.error("Erro ao adicionar equipe:", error);
      alert("Erro ao adicionar equipe. Por favor, tente novamente.");
    }
  };

  const handleUpdateEquipe = async (equipeData) => {
    try {
      await axios.put(
        `http://localhost:5000/api/equipes/${selectedEquipe._id || selectedEquipe.id}`,
        equipeData
      );
      fetchEquipes();
      setShowEditModal(false);
    } catch (error) {
      console.error("Erro ao atualizar equipe:", error);
      alert("Erro ao atualizar equipe. Por favor, tente novamente.");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/equipes/${selectedEquipe._id || selectedEquipe.id}`
      );
      fetchEquipes();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Erro ao excluir equipe:", error);
      alert("Erro ao excluir equipe. Por favor, tente novamente.");
    }
  };

  // Renderizar conteúdo condicional baseado em estados de loading e error
  if (loading) return (
    <div className="equipes-loading">
      <div className="loading-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="none" stroke="#ffe0b2" strokeWidth="2" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#ff7f27" strokeWidth="2" fill="none">
            <animateTransform 
              attributeName="transform" 
              type="rotate" 
              from="0 12 12" 
              to="360 12 12" 
              dur="1s" 
              repeatCount="indefinite" 
            />
          </path>
        </svg>
      </div>
      <h3>Carregando equipes</h3>
      <p>Por favor, aguarde um momento...</p>
    </div>
  );

  if (error) return (
    <div className="equipes-error">
      <div className="error-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="11" fill="#fff3cd" />
          <path d="M12 5a1 1 0 0 1 1 1v7a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1zm0 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="#ff7f27" />
        </svg>
      </div>
      <h3>Não foi possível carregar as equipes</h3>
      <p>{error}</p>
      <button className="retry-button" onClick={fetchEquipes}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.65 6.35a7.95 7.95 0 0 0-11.3 0 8 8 0 0 0 0 11.3 7.95 7.95 0 0 0 11.3 0 8 8 0 0 0 0-11.3zm-1.4 9.9a6 6 0 0 1-8.5-8.5 6 6 0 0 1 8.5 8.5z" fill="currentColor" />
          <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8A5.9 5.9 0 0 1 6 12c0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.8.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z" fill="currentColor" />
        </svg>
        Tentar novamente
      </button>
    </div>
  );

  return (
    <div className="equipes-container">
      <div className="equipes-header">
        <h2>Gerenciamento de Equipes</h2>
        <div className="equipes-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar equipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <button className="add-button" onClick={handleAddEquipe}>
            + Nova Equipe
          </button>
        </div>
      </div>

      {filteredEquipes.length === 0 ? (
        <div className="no-equipes">
          <p>Nenhuma equipe encontrada.</p>
          <button className="add-button" onClick={handleAddEquipe}>
            Criar Nova Equipe
          </button>
        </div>
      ) : (
        <div className="equipes-grid">
          {filteredEquipes.map((equipe) => (
            <div className="equipe-card" key={equipe._id || equipe.id}>
              <div className="equipe-header">
                <h3 className="equipe-title">{equipe.nome}</h3>
                <div className="equipe-status">
                  <span className={`status-badge ${equipe.ativo ? "ativo" : "inativo"}`}>
                    {equipe.ativo ? "Ativa" : "Inativa"}
                  </span>
                </div>
              </div>
              <div className="equipe-info">
                <p className="equipe-description">
                  {equipe.descricao || "Sem descrição disponível"}
                </p>
                <p className="equipe-members">
                  <strong>Membros:</strong> {equipe.membros?.length || 0}
                </p>
                <p className="equipe-leader">
                  <strong>Líder:</strong> {equipe.lider || "Não definido"}
                </p>
              </div>
              <div className="equipe-actions">
                <button
                  className="view-button"
                  onClick={() => handleViewEquipe(equipe)}
                >
                  Visualizar
                </button>
                <button
                  className="edit-button"
                  onClick={() => handleEditEquipe(equipe)}
                >
                  Editar
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteEquipe(equipe)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modais */}
      {showAddModal && (
        <EquipeModalAdd
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveNewEquipe}
        />
      )}
      {showEditModal && selectedEquipe && (
        <EquipeModalEdit
          equipe={selectedEquipe}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateEquipe}
        />
      )}
      {showDeleteModal && selectedEquipe && (
        <EquipeModalDelete
          equipe={selectedEquipe}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
      {showViewModal && selectedEquipe && (
        <EquipeModalView
          equipe={selectedEquipe}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
};

export default Equipes;
