import React, { useState } from "react";

const EquipeDetalhes = ({ equipe, onEdit, onClose, onRefresh }) => {
  const [membros, setMembros] = useState(equipe.membros || []);
  const [showAddMembro, setShowAddMembro] = useState(false);
  const [novoMembro, setNovoMembro] = useState({ nome: "", cargo: "" });
  const [loading, setLoading] = useState(false);

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  const handleAdicionarMembro = async () => {
    if (!novoMembro.nome || !novoMembro.cargo) {
      alert("Preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/equipes/${equipe.id}/membros`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(novoMembro),
      });

      if (!response.ok) {
        throw new Error("Falha ao adicionar membro");
      }

      // Para desenvolvimento, adiciona localmente
      const membroSimulado = {
        id: Date.now(), // ID temporário
        ...novoMembro
      };
      
      setMembros([...membros, membroSimulado]);
      setNovoMembro({ nome: "", cargo: "" });
      setShowAddMembro(false);
      onRefresh(); // Atualiza os dados da equipe
    } catch (err) {
      console.error("Erro ao adicionar membro:", err);
      
      // Para desenvolvimento, adiciona localmente mesmo com erro
      const membroSimulado = {
        id: Date.now(),
        ...novoMembro
      };
      
      setMembros([...membros, membroSimulado]);
      setNovoMembro({ nome: "", cargo: "" });
      setShowAddMembro(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoverMembro = async (membroId) => {
    // Using window.confirm instead of global confirm
    if (!window.confirm("Tem certeza que deseja remover este membro da equipe?")) {
      return;
    }
    
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/equipes/${equipe.id}/membros/${membroId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao remover membro");
      }

      // Atualiza a lista localmente
      setMembros(membros.filter(m => m.id !== membroId));
      onRefresh(); // Atualiza os dados da equipe
    } catch (err) {
      console.error("Erro ao remover membro:", err);
      
      // Para desenvolvimento, remove localmente mesmo com erro
      setMembros(membros.filter(m => m.id !== membroId));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="equipe-detalhes">
      <div className="equipe-detalhes-header">
        <h3>{equipe.nome}</h3>
        <button className="btn-editar" onClick={onEdit}>
          <i className="fas fa-edit"></i> Editar Equipe
        </button>
      </div>
      
      <div className="equipe-info-detalhada">
        <div className="info-section">
          <h4>Informações Gerais</h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Data de Criação:</span>
              <span className="value">{formatarData(equipe.dataCriacao)}</span>
            </div>
            <div className="info-item">
              <span className="label">Capacidade:</span>
              <span className="value">{equipe.capacidadeMaxima || "Não definida"}</span>
            </div>
          </div>
          
          <div className="descricao-box">
            <span className="label">Descrição:</span>
            <p>{equipe.descricao || "Sem descrição disponível."}</p>
          </div>
        </div>
        
        <div className="membros-section">
          <div className="membros-header">
            <h4>Membros da Equipe</h4>
            <button 
              className="btn-adicionar" 
              onClick={() => setShowAddMembro(!showAddMembro)}
              disabled={loading}
            >
              {showAddMembro ? "Cancelar" : "Adicionar Membro"}
            </button>
          </div>
          
          {/* Formulário para adicionar membro */}
          {showAddMembro && (
            <div className="add-membro-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nome">Nome</label>
                  <input
                    type="text"
                    id="nome"
                    value={novoMembro.nome}
                    onChange={(e) => setNovoMembro({...novoMembro, nome: e.target.value})}
                    placeholder="Nome do membro"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cargo">Cargo</label>
                  <input
                    type="text"
                    id="cargo"
                    value={novoMembro.cargo}
                    onChange={(e) => setNovoMembro({...novoMembro, cargo: e.target.value})}
                    placeholder="Cargo ou função"
                    disabled={loading}
                  />
                </div>
              </div>
              <button 
                className="btn-confirmar" 
                onClick={handleAdicionarMembro}
                disabled={loading}
              >
                {loading ? "Adicionando..." : "Confirmar"}
              </button>
            </div>
          )}
          
          {/* Lista de membros */}
          {membros.length === 0 ? (
            <div className="no-membros">
              <p>Esta equipe ainda não possui membros.</p>
            </div>
          ) : (
            <div className="membros-list">
              {membros.map(membro => (
                <div key={membro.id} className="membro-item">
                  <div className="membro-info">
                    <div className="membro-avatar">
                      {membro.nome.charAt(0)}
                    </div>
                    <div className="membro-details">
                      <h5>{membro.nome}</h5>
                      <p>{membro.cargo}</p>
                    </div>
                  </div>
                  <button 
                    className="btn-remover" 
                    onClick={() => handleRemoverMembro(membro.id)}
                    disabled={loading}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipeDetalhes;
