import React, { useState, useEffect } from "react";
import "../Modals/style/Modals.scss";

const EquipeModalEdit_adaptar = ({ equipe, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    lider: "",
    membros: [],
    ativo: true,
  });
  
  const [novoMembroNome, setNovoMembroNome] = useState("");
  const [novoMembroEmail, setNovoMembroEmail] = useState("");
  const [novoMembroFuncao, setNovoMembroFuncao] = useState("");
  const [errors, setErrors] = useState({});

  // Carregar dados da equipe quando o componente montar
  useEffect(() => {
    if (equipe) {
      setFormData({
        nome: equipe.nome || "",
        descricao: equipe.descricao || "",
        lider: equipe.lider || "",
        membros: equipe.membros || [],
        ativo: equipe.ativo !== undefined ? equipe.ativo : true,
      });
    }
  }, [equipe]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddMembro = () => {
    if (novoMembroNome.trim() !== "") {
      // Verifica se o membro já existe pelo nome
      const membroExiste = formData.membros.some(
        membro => membro.nome.toLowerCase() === novoMembroNome.trim().toLowerCase()
      );
      
      if (!membroExiste) {
        const novoMembro = {
          nome: novoMembroNome.trim(),
          email: novoMembroEmail.trim(),
          funcao: novoMembroFuncao.trim()
        };
        
        setFormData({
          ...formData,
          membros: [...formData.membros, novoMembro],
        });
      }
      
      // Limpa os campos
      setNovoMembroNome("");
      setNovoMembroEmail("");
      setNovoMembroFuncao("");
    }
  };

  const handleRemoveMembro = (index) => {
    const novosMembros = [...formData.membros];
    novosMembros.splice(index, 1);
    setFormData({
      ...formData,
      membros: novosMembros
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = "Nome da equipe é obrigatório";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
    } else {
      setErrors(newErrors);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.target.name === "novoMembroFuncao") {
      e.preventDefault();
      handleAddMembro();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Editar Equipe</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="nome">Nome da Equipe*</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={errors.nome ? "input-error" : ""}
              />
              {errors.nome && <div className="error-message">{errors.nome}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lider">Líder da Equipe</label>
              <input
                type="text"
                id="lider"
                name="lider"
                value={formData.lider}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Membros da Equipe</label>
              <div className="add-member-container">
                <div className="member-input-group">
                  <input
                    type="text"
                    name="novoMembroNome"
                    value={novoMembroNome}
                    onChange={(e) => setNovoMembroNome(e.target.value)}
                    placeholder="Nome do membro*"
                    className="member-input"
                  />
                  <input
                    type="email"
                    name="novoMembroEmail"
                    value={novoMembroEmail}
                    onChange={(e) => setNovoMembroEmail(e.target.value)}
                    placeholder="Email do membro"
                    className="member-input"
                  />
                  <input
                    type="text"
                    name="novoMembroFuncao"
                    value={novoMembroFuncao}
                    onChange={(e) => setNovoMembroFuncao(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Função do membro"
                    className="member-input"
                  />
                </div>
                <button
                  type="button"
                  className="add-member-button"
                  onClick={handleAddMembro}
                >
                  Adicionar
                </button>
              </div>
              
              {formData.membros.length > 0 && (
                <div className="members-list">
                  {formData.membros.map((membro, index) => (
                    <div key={index} className="member-item">
                      <div className="member-info">
                        <strong>{membro.nome}</strong>
                        {membro.email && <span> - {membro.email}</span>}
                        {membro.funcao && <span> ({membro.funcao})</span>}
                      </div>
                      <button
                        type="button"
                        className="remove-member-button"
                        onClick={() => handleRemoveMembro(index)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="ativo"
                  checked={formData.ativo}
                  onChange={handleChange}
                />
                Equipe Ativa
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="save-button">
              Atualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipeModalEdit_adaptar;