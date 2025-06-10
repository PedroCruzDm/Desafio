import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./styles/cadastro.scss";

export const Cadastro = () => {
    const navigate = useNavigate(); // Adicionando useNavigate
    const [form, setForm] = useState({
        nome: "",
        email: "",
        fotoPerfil: "",
        dataNascimento: "",
        senha: "",
        confirmacaoSenha: ""
    });

    const [mensagem, setMensagem] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.senha !== form.confirmacaoSenha) {
            setMensagem("As senhas não conferem!");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/usuarios/cadastrar', { //
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: form.nome,
                    email: form.email,
                    senha: form.senha,
                    fotoPerfil: form.fotoPerfil,
                    dataNascimento: form.dataNascimento,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setMensagem(`Erro: ${errorData.erro || "Erro no cadastro"}`);
                return;
            }

            setMensagem("Cadastro realizado com sucesso!");
            setForm({
                nome: "",
                email: "",
                fotoPerfil: "",
                dataNascimento: "",
                senha: "",
                confirmacaoSenha: "",
            });
        } catch (error) {
            console.error("Erro de conexão:", error);
            setMensagem("Erro ao conectar com o servidor. Verifique sua conexão e tente novamente.");
        }
    };

    return (
        <div className="cadastro-container">
            {/* Botão de voltar */}
            <button 
                className="back-button" 
                onClick={() => navigate('/')}
                aria-label="Voltar para página inicial"
            >
                <i className="fas fa-arrow-left"></i>
                <span>Voltar</span>
            </button>
            
            <div className="cadastro-card">
                <div className="cadastro-header">
                    <h2>Cadastro</h2>
                </div>
                <form onSubmit={handleSubmit} className="cadastro-form">
                    <div className="form-group">
                        <label htmlFor="nome">Nome:</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={form.nome}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fotoPerfil">Foto de Perfil:</label>
                        <div className="file-input-wrapper">
                            <input
                                type="file"
                                id="fotoPerfil"
                                name="fotoPerfil"
                                accept="image/*"
                                className="file-input"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setForm((prev) => ({ ...prev, fotoPerfil: reader.result }));
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                            <label htmlFor="fotoPerfil" className="file-label">
                                <span className="file-button">Escolher arquivo</span>
                                <span className="file-name">
                                    {form.fotoPerfil ? "Foto selecionada" : "Nenhum arquivo selecionado"}
                                </span>
                            </label>
                        </div>
                        {form.fotoPerfil && (
                            <div className="image-preview">
                                <img src={form.fotoPerfil} alt="Preview" />
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="dataNascimento">Data de Nascimento:</label>
                        <input
                            type="date"
                            id="dataNascimento"
                            name="dataNascimento"
                            value={form.dataNascimento}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="senha">Senha:</label>
                            <input
                                type="password"
                                id="senha"
                                name="senha"
                                value={form.senha}
                                onChange={handleChange}
                                required
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmacaoSenha">Confirmação de Senha:</label>
                            <input
                                type="password"
                                id="confirmacaoSenha"
                                name="confirmacaoSenha"
                                value={form.confirmacaoSenha}
                                onChange={handleChange}
                                required
                                className="form-control"
                            />
                        </div>
                    </div>
                    <button type="submit" className="cadastro-button">Cadastrar</button>
                </form>
                {mensagem && (
                    <div className={`mensagem ${mensagem.includes("sucesso") ? "sucesso" : "erro"}`}>
                        {mensagem}
                        {mensagem.includes("Erro ao conectar") && (
                            <button 
                                onClick={handleSubmit} 
                                className="retry-button"
                            >
                                Tentar novamente
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};