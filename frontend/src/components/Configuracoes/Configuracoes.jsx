import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Configuracoes.scss";

const Configuracoes = () => {
  const [usuario, setUsuario] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmSenha: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Carregar dados do usuário do localStorage
    const usuarioData = localStorage.getItem("usuario");
    if (usuarioData) {
      const usuarioObj = JSON.parse(usuarioData);
      setUsuario(usuarioObj);
      setFormData({
        nome: usuarioObj.nome || "",
        email: usuarioObj.email || "",
        senha: "",
        confirmSenha: "",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      setError("O nome é obrigatório");
      return false;
    }
    if (!formData.email.trim()) {
      setError("O email é obrigatório");
      return false;
    }
    if (formData.senha && formData.senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return false;
    }
    if (formData.senha && formData.senha !== formData.confirmSenha) {
      setError("As senhas não coincidem");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Só envia a senha se ela for preenchida
      const userData = {
        nome: formData.nome,
        email: formData.email,
      };
      
      if (formData.senha) {
        userData.senha = formData.senha;
      }

      const response = await axios.put(
        `http://localhost:5000/api/usuarios/${usuario.id}`, 
        userData
      );

      setSuccessMessage("Perfil atualizado com sucesso!");
      
      // Atualizar o localStorage com os novos dados
      const updatedUser = {
        ...usuario,
        nome: formData.nome,
        email: formData.email
      };
      
      localStorage.setItem("usuario", JSON.stringify(updatedUser));
      setUsuario(updatedUser);
      
      // Limpar a senha após a atualização
      setFormData(prev => ({
        ...prev,
        senha: "",
        confirmSenha: ""
      }));
      
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      setError(err.response?.data?.erro || "Erro ao atualizar perfil. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      
      await axios.delete(`http://localhost:5000/api/usuarios/${usuario.id}`);
      
      // Remover dados do localStorage
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      
      // Redirecionar para a página inicial
      window.location.href = "/";
      
    } catch (err) {
      console.error("Erro ao excluir conta:", err);
      setError(err.response?.data?.erro || "Erro ao excluir conta. Tente novamente.");
      setShowDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) {
    return <div className="configuracoes-loading">Carregando dados do usuário...</div>;
  }

  return (
    <div className="configuracoes-container">
      <div className="configuracoes-header">
        <h2>Configurações da Conta</h2>
        <p className="configuracoes-subtitle">Gerencie seus dados pessoais e preferências</p>
      </div>

      <div className="configuracoes-content">
        <div className="configuracoes-card perfil-card">
          <div className="card-header">
            <h3>Informações Pessoais</h3>
            <p>Atualize seus dados pessoais</p>
          </div>

          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome">Nome</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Seu nome completo"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Seu email"
              />
            </div>
            
            <div className="form-divider">
              <span>Alterar Senha</span>
            </div>
            
            <div className="form-group">
              <label htmlFor="senha">Nova Senha</label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="Deixe em branco para manter a senha atual"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmSenha">Confirmar Nova Senha</label>
              <input
                type="password"
                id="confirmSenha"
                name="confirmSenha"
                value={formData.confirmSenha}
                onChange={handleChange}
                placeholder="Confirme sua nova senha"
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="save-btn"
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </div>
        
        <div className="configuracoes-card danger-zone-card">
          <div className="card-header">
            <h3>Zona de Perigo</h3>
            <p>Ações irreversíveis para sua conta</p>
          </div>
          
          {!showDeleteConfirm ? (
            <div className="delete-account-section">
              <p>Excluir sua conta removerá permanentemente todos os seus dados e não poderá ser desfeito.</p>
              <button 
                className="delete-account-btn" 
                onClick={() => setShowDeleteConfirm(true)}
              >
                Excluir minha conta
              </button>
            </div>
          ) : (
            <div className="delete-confirm">
              <p className="warning-text">Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.</p>
              <div className="delete-actions">
                <button 
                  className="confirm-delete-btn"
                  onClick={handleDeleteAccount}
                  disabled={loading}
                >
                  {loading ? "Excluindo..." : "Sim, excluir minha conta"}
                </button>
                <button 
                  className="cancel-delete-btn"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
