import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './styles/login.scss';

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, senha: password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("usuario", JSON.stringify(data.usuario));
                navigate("/menu"); // Alterado de "/eventos" para "/menu"
            } else {
                alert(data.erro || "Erro no login");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao conectar com o servidor");
        }
    };

    return (
        <div className="login-container">
            {/* Botão de voltar */}
            <button 
                className="back-button" 
                onClick={() => navigate('/')}
                aria-label="Voltar para página inicial"
            >
                <i className="fas fa-arrow-left"></i>
                <span>Voltar</span>
            </button>
            
            <div className="login-card">
                <div className="login-header">
                    <h2>Login</h2>
                    <p>Entre para acessar sua conta</p>
                </div>
                
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Senha:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            className="form-control"
                        />
                    </div>
                    <button type="submit" className="login-button">Entrar</button>
                </form>
                
                <div className="login-footer">
                    <p>Ainda não tem uma conta?</p>
                    <Link to="/cadastro" className="register-link">
                        Cadastre-se agora
                    </Link>
                </div>
            </div>
        </div>
    );
};
