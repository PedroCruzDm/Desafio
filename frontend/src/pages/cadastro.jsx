import React, { useState } from "react";

export const Cadastro = () => {
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

        if (form.senha !== form.confirmacaoSenha) {//verifica senha ._.
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
            setMensagem("Erro ao conectar com o servidor.");
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "40px auto" }}>
            <h2>Cadastro</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome:</label>
                    <input type="text" name="nome" value={form.nome} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Foto de Perfil:</label>
                    <input type="file" name="fotoPerfil" accept="image/*"
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
                </div>
                <div>
                    <label>Data de Nascimento:</label>
                    <input
                        type="date"
                        name="dataNascimento"
                        value={form.dataNascimento}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Senha:</label>
                    <input
                        type="password"
                        name="senha"
                        value={form.senha}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Confirmação de Senha:</label>
                    <input
                        type="password"
                        name="confirmacaoSenha"
                        value={form.confirmacaoSenha}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Cadastrar</button>
            </form>
            {mensagem && <p>{mensagem}</p>}
        </div>
    );
};