import React, { useState, useEffect } from "react";

const EquipeForm = ({ equipe, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    capacidadeMaxima: 10
  });

  useEffect(() => {
    if (equipe) {
      setFormData({
        nome: equipe.nome || "",
        descricao: equipe.descricao || "",
        capacidadeMaxima: equipe.capacidadeMaxima || 10
      });
    }
  }, [equipe]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="equipe-form">
      <h3>{equipe ? "Editar Equipe" : "Nova Equipe"}</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome da Equipe</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            placeholder="Digite o nome da equipe"
          />
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows="4"
            placeholder="Descreva o propósito desta equipe"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="capacidadeMaxima">Capacidade Máxima</label>
          <input
            type="number"
            id="capacidadeMaxima"
            name="capacidadeMaxima"
            value={formData.capacidadeMaxima}
            onChange={handleChange}
            min="1"
            max="50"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secundario" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn-primario">
            {equipe ? "Atualizar Equipe" : "Criar Equipe"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EquipeForm;
